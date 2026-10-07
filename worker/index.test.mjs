// Run: node worker/index.test.mjs
import assert from "node:assert/strict";
import { handleCommission, resendSender } from "./index.js";

const post = (fields, json = true) => {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  return new Request("https://yorufoundry.com/api/commission", { method: "POST", body, headers: json ? { accept: "application/json" } : {} });
};
const good = { name: "Ada Lovelace", email: "ada@example.com", layout: "75%", budget: "$250–$400", details: "Thocky — please." };
let sent;
const send = async (email) => { sent = email; };

let res = await handleCommission(post(good), {}, send);
assert.equal(res.status, 200);
assert.deepEqual(sent.to, ["hello@yorufoundry.com"]);
assert.equal(sent.reply_to, "ada@example.com");
assert.equal(sent.subject, "Commission request — Ada Lovelace");
assert.match(sent.text, /Budget range: \$250–\$400/);
assert.match(sent.text, /Thocky — please\./);
assert.equal(resendSender(undefined), null, "no key means fallback");

sent = null;
res = await handleCommission(post({ ...good, website: "spam" }), {}, send);
assert.equal(res.status, 200); assert.equal(sent, null, "honeypot drops silently");

res = await handleCommission(post({ ...good, email: "x@y.com\r\nBcc: a@b.c" }), {}, send);
assert.equal(res.status, 400, "header injection rejected");
res = await handleCommission(post({ ...good, name: "" }), {}, send);
assert.equal(res.status, 400);
res = await handleCommission(post(good), { TURNSTILE_SECRET: "s" }, send);
assert.equal(res.status, 403, "missing turnstile token rejected");
res = await handleCommission(post(good), {}, null);
assert.equal(res.status, 503, "no email binding means fallback");
res = await handleCommission(post(good), {}, async () => { throw new Error("x"); });
assert.equal(res.status, 502);

res = await handleCommission(post(good, false), {}, send);
assert.equal(res.status, 303); assert.equal(res.headers.get("location"), "https://yorufoundry.com/request-a-build.html#sent");
res = await handleCommission(post(good, false), {}, null);
assert.equal(res.headers.get("location"), "https://yorufoundry.com/request-a-build.html#send-failed");
res = await handleCommission(new Request("https://yorufoundry.com/api/commission"), {}, send);
assert.match(await res.text(), /email is set up/);
res = await handleCommission(new Request("https://yorufoundry.com/api/commission"), {}, null);
assert.match(await res.text(), /not set/);
res = await handleCommission(new Request("https://yorufoundry.com/api/commission", { method: "PUT" }), {}, send);
assert.equal(res.status, 405);
let call;
globalThis.fetch = async (url, init) => { call = { url, init }; return new Response("{}", { status: 200 }); };
res = await handleCommission(post(good), {}, resendSender("re_test"));
assert.equal(res.status, 200);
assert.equal(call.url, "https://api.resend.com/emails");
assert.equal(call.init.headers.authorization, "Bearer re_test");
assert.equal(JSON.parse(call.init.body).reply_to, "ada@example.com");
globalThis.fetch = async () => new Response("domain not verified", { status: 403 });
res = await handleCommission(post(good), {}, resendSender("re_test"));
assert.equal(res.status, 502, "Resend error reaches the page as a failed send");
console.log("commission handler: all checks pass");
