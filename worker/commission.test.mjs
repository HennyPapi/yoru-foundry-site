// Run: node worker/commission.test.mjs
import assert from "node:assert/strict";
import { handleCommission } from "./commission.js";

const post = (fields, json = true) => {
  const body = new FormData();
  for (const [k, v] of Object.entries(fields)) body.set(k, v);
  return new Request("https://yorufoundry.com/api/commission", { method: "POST", body, headers: json ? { accept: "application/json" } : {} });
};
const good = { name: "Ada Lovelace", email: "ada@example.com", layout: "75%", budget: "$250–$400", details: "Thocky — please." };
let sent;
const send = async (from, to, raw) => { sent = { from, to, raw }; };

let res = await handleCommission(post(good), {}, send);
assert.equal(res.status, 200);
assert.equal(sent.to, "hello@yorufoundry.com");
assert.match(sent.raw, /^Reply-To: ada@example.com\r$/m);
const body = Buffer.from(sent.raw.split("\r\n\r\n")[1].replace(/\s/g, ""), "base64").toString("utf8");
assert.match(body, /Budget range: \$250–\$400/);
assert.match(body, /Thocky — please\./);

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
assert.equal(res.status, 405);
console.log("commission handler: all checks pass");
