import {supabaseConfigured, supabaseRest, supabaseNotConfigured} from './lib/supabase.mjs';
import {buyerDetail} from './lib/buyer-crm.mjs';
import {json, isAdmin, readJson} from './lib/auth.mjs';

async function handler(request) {
  if (request.method === "POST") return create(request);
  if (!isAdmin(request)) return json({ error: "Unauthorized" }, { status: 401 });
  try {
    if (!supabaseConfigured()) return supabaseNotConfigured();
    return await buyerDetail(request);
  } catch (err) {
    console.error("[lead detail error]", err);
    return json({ error: "Failed to load inquiry" }, { status: 500 });
  }
}

async function create(request) {
  if (!supabaseConfigured()) return supabaseNotConfigured();
  const body = (await readJson(request)) || {};
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 200).toLowerCase();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "name and a valid email are required" }, { status: 400 });
  }
  const sid = String(body.sessionId || "").slice(0, 100);

  try {
    const lead = {
      name,
      email,
      session_id: sid || null,
      source: (body.source || "manual").slice(0, 100),
      goal: (body.goal || "").slice(0, 100),
      interest: (body.interest || "").slice(0, 200),
      phone: (body.phone || "").slice(0, 30),
      location: (body.location || "").slice(0, 120),
      timing: (body.timing || "").slice(0, 40),
      message: (body.message || "").slice(0, 3000),
      brand: 'harbison_standard',
    };
    const response = await supabaseRest('leads', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(lead),
    });
    const resultText = await response.text();
    if (!response.ok) {
      console.error('[lead create]', response.status, resultText);
      return json({ error: "Failed to save inquiry" }, { status: 502 });
    }
    const rows = resultText ? JSON.parse(resultText) : [];
    return json({ ok: true, id: rows?.[0]?.id ?? null }, { status: 201 });
  } catch (err) {
    console.error("[lead create]", err);
    return json({ error: "Failed to save inquiry" }, { status: 500 });
  }
}

// Vercel Web Standard handler; local development uses the same fetch function.
export default {fetch:handler};
