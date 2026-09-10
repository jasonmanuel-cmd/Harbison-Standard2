import { json } from './auth.mjs';

export function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY));
}

function headers(extra = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

export async function supabaseRest(path, options = {}) {
  if (!supabaseConfigured()) {
    throw Object.assign(new Error('Supabase not configured'), { code: 'SUPABASE_UNCONFIGURED' });
  }
  const base = process.env.SUPABASE_URL.replace(/\/$/, '');
  return fetch(`${base}/rest/v1/${path}`, {
    ...options,
    headers: headers(options.headers || {}),
  });
}

export function supabaseNotConfigured() {
  return json({ error: 'Supabase not configured', code: 'SUPABASE_UNCONFIGURED' }, { status: 503 });
}
