import { EmailMessage } from "cloudflare:email";
import { handleCommission } from "./commission.js";

// Static files are served before this runs; the Worker only sees the form endpoint and missing paths.
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname === "/api/commission") {
      const send = env.COMMISSION_EMAIL
        ? (from, to, raw) => env.COMMISSION_EMAIL.send(new EmailMessage(from, to, raw))
        : null;
      return handleCommission(request, env, send);
    }
    return env.ASSETS.fetch(request);
  },
};
