import { neon } from "@neondatabase/serverless";

let sql = null;
let ready = null;

function connectionString() {
  return process.env.DATABASE_URL || "";
}

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id BIGSERIAL PRIMARY KEY,
      session_id TEXT,
      source TEXT,
      goal TEXT,
      interest TEXT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      location TEXT,
      timing TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      lead_id BIGINT,
      first_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
      last_seen TIMESTAMPTZ NOT NULL DEFAULT now(),
      visits INT NOT NULL DEFAULT 0
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS visits (
      id BIGSERIAL PRIMARY KEY,
      session_id TEXT,
      path TEXT NOT NULL,
      referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export function crmConfigured() {
  return Boolean(connectionString());
}

export async function query(strings, ...values) {
  if (!crmConfigured()) throw Object.assign(new Error("CRM not configured"), { code: "CRM_UNCONFIGURED" });
  if (!sql) sql = neon(connectionString(), { fetchOptions: { cache: "no-store" } });
  if (!ready) {
    ready = migrate().then(() => true).catch((err) => {
      ready = null;
      throw err;
    });
    await ready;
  }
  return sql(strings, ...values);
}