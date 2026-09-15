import { supabaseRest, supabaseConfigured } from './lib/supabase.mjs';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'X-Robots-Tag': 'noindex, nofollow',
  'Cache-Control': 'no-store',
};

async function handler(request) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method !== 'GET') return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), { status: 405, headers });

  if (!supabaseConfigured()) {
    return new Response(JSON.stringify({ success: false, error: 'CRM not configured' }), { status: 503, headers });
  }

  try {
    const response = await supabaseRest('leads?select=name,email,phone,source,created_at&brand=eq.harbison_standard&order=created_at.desc&limit=100', {
      method: 'GET',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ success: false, error: 'Failed to fetch registrations' }), { status: 502, headers });
    }

    const data = await response.json();
    const registrations = data.map((row) => ({
      name: row.name,
      email: row.email,
      phone: row.phone,
      source: row.source,
      created_at: row.created_at,
    }));

    return new Response(JSON.stringify({ success: true, registrations }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 503, headers });
  }
}

export default { fetch: handler };
