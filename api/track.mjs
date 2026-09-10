import { json, readJson } from "./lib/auth.mjs";
import { supabaseConfigured, supabaseRest, supabaseNotConfigured } from "./lib/supabase.mjs";

async function handler(request) {
  if (request.method !== "POST") return json({ error: "Method not allowed" }, { status: 405 });
  if (!supabaseConfigured()) return supabaseNotConfigured();

  const body = (await readJson(request)) || {};
  const sid = String(body.sessionId || "").slice(0, 100);
  const path = String(body.path || "/").slice(0, 255);
  if (!sid || !path) return json({ error: "sessionId and path are required" }, { status: 400 });

  try {
    // Upsert session: try insert first, on conflict update
    const sessionRes = await supabaseRest('sessions', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify({ id: sid, last_seen: new Date().toISOString(), visits: 1 }),
    });
    if (!sessionRes.ok && sessionRes.status !== 409) {
      const errText = await sessionRes.text();
      console.error('[track session]', sessionRes.status, errText);
    }

    // Insert visit
    await supabaseRest('visits', {
      method: 'POST',
      body: JSON.stringify({
        session_id: sid,
        path,
        referrer: (body.referrer || "").slice(0, 500),
        utm_source: (body.utmSource || "").slice(0, 200),
        utm_medium: (body.utmMedium || "").slice(0, 200),
        utm_campaign: (body.utmCampaign || "").slice(0, 200),
      }),
    });

    return json({ ok: true }, { status: 201 });
  } catch (err) {
    console.error("[track]", err);
    return json({ error: "Failed to record visit" }, { status: 500 });
  }
}
// Vercel Web Standard handler; local development uses the same fetch function.
export default {fetch:handler};
