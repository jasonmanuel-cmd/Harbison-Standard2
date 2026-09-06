import { query, crmConfigured } from "./lib/db.mjs";
import { json, isAdmin, notConfigured } from "./lib/auth.mjs";

export default async function handler(request) {
  if (request.method !== "GET") return json({ error: "Method not allowed" }, { status: 405 });
  if (!isAdmin(request)) return json({ error: "Unauthorized" }, { status: 401 });
  if (!crmConfigured()) return notConfigured();

  try {
    const [leads, newLeads, sessions, visits, bySource, byStatus, dayRows, topPaths] = await Promise.all([
      query`SELECT count(*)::int AS n FROM leads`,
      query`SELECT count(*)::int AS n FROM leads WHERE status = 'new'`,
      query`SELECT count(*)::int AS n FROM sessions`,
      query`SELECT count(*)::int AS n, COALESCE(sum(visits), 0)::int AS pageviews FROM sessions`,
      query`SELECT COALESCE(source, 'unknown') AS key, count(*)::int AS n FROM leads GROUP BY source ORDER BY n DESC`,
      query`SELECT status, count(*)::int AS n FROM leads GROUP BY status ORDER BY n DESC`,
      query`SELECT to_char(created_at, 'YYYY-MM-DD') AS day, count(*)::int AS n FROM leads WHERE created_at > now() - interval '14 days' GROUP BY day ORDER BY day`,
      query`SELECT path, count(*)::int AS n FROM visits GROUP BY path ORDER BY n DESC LIMIT 10`,
    ]);
    return json({
      totalLeads: leads[0].n,
      newLeads: newLeads[0].n,
      totalSessions: sessions[0].n,
      totalPageviews: visits[0].pageviews,
      bySource,
      byStatus,
      dailyLeads: dayRows,
      topPaths,
    });
  } catch (err) {
    console.error("[stats]", err);
    return json({ error: "Failed to load stats" }, { status: 500 });
  }
}