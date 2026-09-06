import { query, crmConfigured } from "./lib/db.mjs";
import { json, isAdmin, notConfigured } from "./lib/auth.mjs";

export default async function handler(request) {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405 });
  if (!isAdmin(request)) return json({ error: "Unauthorized" }, { status: 401 });
  if (!crmConfigured()) return notConfigured();

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const q = (url.searchParams.get("q") || "").toString().slice(0, 100);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 200);

  try {
    const rows = await query`
      SELECT id, session_id, source, goal, interest, name, email, phone, location, timing, message, status, notes, created_at
      FROM leads
      WHERE (${status === null ? null : status} IS NULL OR status = ${status === null ? null : status})
        AND (${q || null} IS NULL OR name ILIKE ${"%" + q + "%"} OR email ILIKE ${"%" + q + "%"})
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return json({ leads: rows });
  } catch (err) {
    console.error("[leads list]", err);
    return json({ error: "Failed to load inquiries" }, { status: 500 });
  }
}