import { query, crmConfigured } from "./lib/db.mjs";
import { json, readJson, notConfigured } from "./lib/auth.mjs";

async function handler(request) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
  if (!crmConfigured()) return notConfigured();

  const body = (await readJson(request)) || {};
  const sid = String(body.sessionId || "").slice(0, 100);
  const path = String(body.path || "/").slice(0, 255);
  if (!sid || !path) return json({ error: "sessionId and path are required" }, { status: 400 });

  try {
    await query`
      INSERT INTO sessions (id, last_seen, visits)
      VALUES (${sid}, now(), 1)
      ON CONFLICT (id) DO UPDATE SET last_seen = now(), visits = sessions.visits + 1
    `;
    await query`
      INSERT INTO visits (session_id, path, referrer, utm_source, utm_medium, utm_campaign)
      VALUES (${sid}, ${path}, ${(body.referrer || "").slice(0, 500)}, ${(body.utmSource || "").slice(0, 200)}, ${(body.utmMedium || "").slice(0, 200)}, ${(body.utmCampaign || "").slice(0, 200)})
    `;
    return json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[track]", err);
    return json({ error: "Failed to record visit" }, { status: 500 });
  }
}
// Vercel Web Standard handler; local development uses the same fetch function.
export default {fetch:handler};
