import { query, crmConfigured } from "./lib/db.mjs";
import { json, readJson, isAdmin, notConfigured } from "./lib/auth.mjs";
import {supabaseConfigured} from './lib/supabase.mjs';
import {buyerDetail} from './lib/buyer-crm.mjs';

const STATUSES = new Set(["new", "contacted", "qualified", "closed"]);

async function handler(request) {
  if (request.method === "POST") return create(request);
  if (!isAdmin(request)) return json({ error: "Unauthorized" }, { status: 401 });
  if ((!crmConfigured() || new URL(request.url).searchParams.get('backend')==='supabase') && supabaseConfigured() && ['GET','PATCH'].includes(request.method)) return buyerDetail(request);
  if (request.method === "PATCH") return update(request);
  if (request.method === "GET") return one(request);
  return json({ error: "Method not allowed" }, { status: 405 });
}

async function create(request) {
  if (!crmConfigured()) return notConfigured();
  const body = (await readJson(request)) || {};
  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 200).toLowerCase();
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "name and a valid email are required" }, { status: 400 });
  }
  const sid = String(body.sessionId || "").slice(0, 100);

  try {
    const rows = await query`
      INSERT INTO leads (session_id, source, goal, interest, name, email, phone, location, timing, message)
      VALUES (${sid || null}, ${(body.source || "").slice(0, 100)}, ${(body.goal || "").slice(0, 100)}, ${(body.interest || "").slice(0, 200)}, ${name}, ${email}, ${(body.phone || "").slice(0, 30)}, ${(body.location || "").slice(0, 120)}, ${(body.timing || "").slice(0, 40)}, ${(body.message || "").slice(0, 3000)})
      RETURNING id
    `;
    const id = rows[0].id;
    if (sid) {
      await query`UPDATE sessions SET lead_id = ${id} WHERE id = ${sid} AND lead_id IS NULL`;
    }
    return json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error("[lead create]", err);
    return json({ error: "Failed to save inquiry" }, { status: 500 });
  }
}

async function one(request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return json({ error: "id is required" }, { status: 400 });
  try {
    const leadRows = await query`SELECT * FROM leads WHERE id = ${id}`;
    if (!leadRows.length) return json({ error: "Not found" }, { status: 404 });
    const visitRows = await query`
      SELECT path, referrer, utm_source, utm_medium, utm_campaign, created_at
      FROM visits WHERE session_id = ${leadRows[0].session_id || ""}
      ORDER BY created_at ASC
    `;
    return json({ lead: leadRows[0], visits: visitRows });
  } catch (err) {
    console.error("[lead one]", err);
    return json({ error: "Failed to load inquiry" }, { status: 500 });
  }
}

async function update(request) {
  const body = (await readJson(request)) || {};
  const id = Number(body.id);
  if (!id) return json({ error: "id is required" }, { status: 400 });
  const status = body.status;
  const notes = body.notes !== undefined ? String(body.notes).slice(0, 5000) : null;
  if (status !== undefined && !STATUSES.has(status)) {
    return json({ error: "Invalid status" }, { status: 400 });
  }
  try {
    if (status !== undefined) await query`UPDATE leads SET status = ${status} WHERE id = ${id}`;
    if (notes !== null) await query`UPDATE leads SET notes = ${notes} WHERE id = ${id}`;
    return json({ ok: true });
  } catch (err) {
    console.error("[lead update]", err);
    return json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

// Vercel Web Standard handler; local development uses the same fetch function.
export default {fetch:handler};
