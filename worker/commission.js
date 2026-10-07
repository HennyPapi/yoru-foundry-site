// Commission form handler: validates a request and builds the email. Pure, so Node can test it.
const FIELDS = { name: 100, email: 254, layout: 60, budget: 60, feel: 60, sound: 60, details: 5000 };
const LABELS = { name: "Name", email: "Email", layout: "Layout", budget: "Budget range", feel: "Switch feel", sound: "Sound preference" };
const EMAIL = /^[^\s@<>"(),;:\\]+@[^\s@<>"(),;:\\]+\.[^\s@<>"(),;:\\]+$/;

export function readRequest(form) {
  const data = {};
  for (const [key, max] of Object.entries(FIELDS)) {
    const value = String(form.get(key) ?? "").trim();
    if (value.length > max) return { error: `${key} is too long` };
    data[key] = value;
  }
  if (!data.name || /[\r\n]/.test(data.name)) return { error: "name is required" };
  if (!EMAIL.test(data.email)) return { error: "a valid email is required" };
  return { data, trap: String(form.get("website") ?? "") !== "", token: String(form.get("cf-turnstile-response") ?? "") };
}

const b64 = (text) => btoa(String.fromCharCode(...new TextEncoder().encode(text)));

export function buildEmail(data, from, to, domain = "yorufoundry.com") {
  const body = [
    "YORU FOUNDRY COMMISSION REQUEST", "",
    ...Object.entries(LABELS).map(([key, label]) => `${label}: ${data[key] || "—"}`),
    "", "Build details:", data.details || "No additional details provided.", "",
    "Reply to this email to answer the client directly.",
  ].join("\r\n");
  const lines = b64(body).match(/.{1,76}/g).join("\r\n");
  return [
    `From: Yoru Foundry commissions <${from}>`,
    `To: ${to}`,
    `Reply-To: ${data.email}`,
    `Subject: =?UTF-8?B?${b64(`Commission request — ${data.name}`)}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@${domain}>`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: base64",
    "", lines, "",
  ].join("\r\n");
}

async function turnstileOk(secret, token, ip) {
  if (!secret) return true;
  if (!token) return false;
  const body = new FormData();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  return (await res.json()).success === true;
}

// send(from, to, raw) delivers the message; null when email is not set up yet (the page falls back to a mail draft).
export async function handleCommission(request, env, send) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const reply = (ok, status, error) => wantsJson
    ? Response.json(ok ? { ok } : { ok, error }, { status })
    : Response.redirect(new URL(ok ? "/request-a-build.html#sent" : "/request-a-build.html#send-failed", request.url), 303);

  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { allow: "POST" } });
  let form;
  try { form = await request.formData(); } catch { return reply(false, 400, "unreadable form"); }
  const parsed = readRequest(form);
  if (parsed.error) return reply(false, 400, parsed.error);
  if (parsed.trap) return reply(true, 200);
  if (!(await turnstileOk(env.TURNSTILE_SECRET, parsed.token, request.headers.get("cf-connecting-ip")))) return reply(false, 403, "verification failed");
  if (!send) return reply(false, 503, "email is not set up");
  const from = env.COMMISSION_FROM || "commissions@yorufoundry.com";
  const to = env.COMMISSION_TO || "hello@yorufoundry.com";
  try {
    await send(from, to, buildEmail(parsed.data, from, to));
  } catch (err) {
    console.error("commission send failed", err);
    return reply(false, 502, "send failed");
  }
  return reply(true, 200);
}
