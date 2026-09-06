import { query, crmConfigured } from "./lib/db.mjs";
import { json, isAdmin, notConfigured } from "./lib/auth.mjs";

export default async function handler(request) {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405 });
  if (!isAdmin(request)) return json({ error: "Unauthorized" }, { status: 401 });
  if (!crmConfigured()) return notConfigured();

  const url = new URL(request.url);
  const status = (url.searchParams.get("status") || "").trim() || null;
  const q = (url.searchParams.get("q") || "").slice(0, 100) || null;
  const like = q ? "%" + q + "%" : null;
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 50, 1), 200);

  try {
    const rows = await query`
      SELECT id, session_id, source, goal, interest, name, email, phone, location, timing, message, status, notes, created_at
      FROM leads
      WHERE (${status}::text IS NULL OR status = ${status}::text)
        AND (${like}::text IS NULL OR name ILIKE ${like} OR email ILIKE ${like})
      ORDER BY created_at DESC
      LIMIT ${limit}
    `;
    return json({ leads: rows });
  } catch (err) {
    console.error("[leads list]", err);
    return json({ error: "Failed to load inquiries" }, { status: 500 });
  }
}