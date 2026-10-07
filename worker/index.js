// Commission form handler: validates a request and emails it. Node can test it with a stand-in sender.
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

export function buildEmail(data, from, to) {
  const text = [
    "YORU FOUNDRY COMMISSION REQUEST", "",
    ...Object.entries(LABELS).map(([key, label]) => `${label}: ${data[key] || "—"}`),
    "", "Build details:", data.details || "No additional details provided.", "",
    "Reply to this email to answer the client directly.",
  ].join("\n");
  return { from: `Yoru Foundry commissions <${from}>`, to: [to], reply_to: data.email, subject: `Commission request — ${data.name}`, text };
}

// Sends through Resend (resend.com). Null without a key, so the page falls back to a mail draft.
export function resendSender(apiKey) {
  if (!apiKey) return null;
  return async (email) => {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify(email),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  };
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

// send(email) delivers the message; null when email is not set up yet (the page falls back to a mail draft).
export async function handleCommission(request, env, send) {
  const wantsJson = (request.headers.get("accept") || "").includes("application/json");
  const reply = (ok, status, error) => wantsJson
    ? Response.json(ok ? { ok } : { ok, error }, { status })
    : Response.redirect(new URL(ok ? "/request-a-commission.html#sent" : "/request-a-commission.html#send-failed", request.url), 303);

  // Opening the endpoint in a browser shows whether email is set up (no secrets revealed).
  if (request.method === "GET") return new Response(send ? "Commission form: email is set up." : "Commission form: RESEND_API_KEY is not set, so the form falls back to a mail draft.", { headers: { "content-type": "text/plain; charset=utf-8" } });
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: { allow: "GET, POST" } });
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
    await send(buildEmail(parsed.data, from, to));
  } catch (err) {
    console.error("commission send failed", err);
    return reply(false, 502, "send failed");
  }
  return reply(true, 200);
}

// Static files are served before this runs; the Worker only sees the form endpoint and missing paths.
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === "/api/commission") return handleCommission(request, env, resendSender(env.RESEND_API_KEY));
    return env.ASSETS.fetch(request);
  },
};
