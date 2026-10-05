import { supabaseRest, supabaseConfigured } from './lib/supabase.mjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
  'Cache-Control': 'no-store',
};

async function sendFormspreeFallback(body) {
  try {
    const res = await fetch('https://formspree.io/f/xqpkdwrp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ...body, _subject: 'Open House Registration', _replyto: body.email }),
      signal: AbortSignal.timeout(15000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const requiredStringFields = ['name', 'email', 'phone', 'property', 'location', 'source', 'date_time', 'submission_date'];
  for (const field of requiredStringFields) {
    if (typeof body[field] !== 'string' || !body[field].trim()) {
      return new Response(JSON.stringify({ success: false, error: `Missing or invalid ${field}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid email' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  if (isNaN(Date.parse(body.submission_date))) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid submission date' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const lead = {
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    phone: body.phone.trim(),
    location: body.location.trim(),
    interest: body.property.trim(),
    source: body.source.trim(),
    goal: 'Open house',
    brand: 'harbison_standard',
    status: 'new',
    message: JSON.stringify(body),
  };

  let savedToSupabase = false;
  if (supabaseConfigured()) {
    try {
      const response = await supabaseRest('leads', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(lead),
      });
      if (response.ok || response.status === 201) {
        savedToSupabase = true;
      }
    } catch {
      savedToSupabase = false;
    }
  }

  if (savedToSupabase) {
    return new Response(JSON.stringify({ success: true, message: 'Registration recorded' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Fallback to Formspree
  const backupSuccess = await sendFormspreeFallback(body);
  if (backupSuccess) {
    return new Response(JSON.stringify({ success: true, message: 'Registration recorded', delivery: 'formspree' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: false, error: 'Service temporarily unavailable' }), {
    status: 503,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export default { fetch: handler };
