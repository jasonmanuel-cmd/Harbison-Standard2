import { timingSafeEqual, createHash } from "node:crypto";

export function isAdmin(request) {
  const header = request.headers.get("authorization") || "";
  if (!header.startsWith("Bearer ")) return false;
  const given = header.slice("Bearer ".length).trim();
  const expected = process.env.ADMIN_TOKEN || "";
  if (!expected || !given) return false;
  const a = createHash("sha256").update(given).digest();
  const b = createHash("sha256").update(expected).digest();
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function json(body, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function notConfigured() {
  return json({ error: "CRM not configured", code: "CRM_UNCONFIGURED" }, { status: 503 });
}