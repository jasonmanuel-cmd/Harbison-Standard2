import {supabaseConfigured, supabaseRest, supabaseNotConfigured} from './lib/supabase.mjs';
import {buyerList, buyerDetail, buyerStats} from './lib/buyer-crm.mjs';
import {json, isAdmin, readJson} from './lib/auth.mjs';
import {leadFields} from './lib/lead-fields.mjs';

const text = (value, max = 500) => String(value || '').trim().slice(0, max);

async function handler(request) {
  const url = new URL(request.url);
  const method = request.method;
  const id = url.searchParams.get('id');
  const stats = url.searchParams.get('stats');
  const action = url.searchParams.get('action');

  // GET /api/leads - list all leads (admin only)
  if (method === 'GET' && !id && !stats) {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseConfigured()) return json({ error: 'Supabase not configured' }, { status: 503 });
    try {
      return await buyerList(request);
    } catch (err) {
      console.error('[leads list error]', err);
      return json({ error: 'Failed to load inquiries' }, { status: 500 });
    }
  }

  // GET /api/leads?id=xxx - get single lead detail (admin only)
  if (method === 'GET' && id) {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseConfigured()) return supabaseNotConfigured();
    try {
      return await buyerDetail(request);
    } catch (err) {
      console.error('[lead detail error]', err);
      return json({ error: 'Failed to load lead' }, { status: 500 });
    }
  }

  // GET /api/leads?stats=true - get statistics (admin only)
  if (method === 'GET' && stats === 'true') {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseConfigured()) return json({ error: 'Supabase not configured' }, { status: 503 });
    try {
      return await buyerStats();
    } catch (err) {
      console.error('[stats error]', err);
      return json({ error: 'Failed to load stats' }, { status: 500 });
    }
  }

  // POST /api/leads - create new lead (public - handles both form types)
  if (method === 'POST') {
    if (!supabaseConfigured()) return supabaseNotConfigured();
    const body = await readJson(request);

    // Check if this is a manual create from admin (legacy lead.mjs behavior)
    const manual = body?.source === 'manual';
    if (manual && !isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });

    // If manual creation, use simplified lead fields
    if (manual) {
      let fields;
      try {
        fields = leadFields(body, { required: true });
      } catch (error) {
        return json({ error: error.message }, { status: 400 });
      }
      delete fields.notes;
      fields.status = 'new';
      const lead = {
        ...fields,
        session_id: String(body.sessionId || '').slice(0, 100) || null,
        source: String(body.source || 'website').slice(0, 100),
        goal: fields.goal || 'Buying',
        brand: 'harbison_standard',
      };
      try {
        const response = await supabaseRest('leads', {
          method: 'POST',
          headers: { Prefer: 'return=representation' },
          body: JSON.stringify(lead),
        });
        if (!response.ok) return json({ error: 'Failed to save inquiry' }, { status: 502 });
        const rows = await response.json();
        return json({ ok: true, id: rows[0]?.id ?? null }, { status: 201 });
      } catch {
        return json({ error: 'Failed to save inquiry' }, { status: 502 });
      }
    }

    // Public form submission (buyer-lead.mjs behavior)
    const name = text(body.name, 100);
    const email = text(body.email, 200).toLowerCase();
    const phone = text(body.phone, 40);
    if (!name || !phone || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'name, phone and a valid email are required' }, { status: 400 });
    }

    const lead = {
      name,
      phone,
      email,
      current_city: text(body.currentCity, 120),
      desired_area: text(body.desiredArea, 200),
      budget: text(body.budget, 100),
      bedrooms: /^[1-5]\+?$/.test(text(body.bedrooms, 40)) ? Number.parseInt(body.bedrooms, 10) : null,
      acreage_requirement: text(body.acreageRequirement, 100),
      property_type: text(body.propertyType, 100),
      timeline: text(body.timeline, 100),
      financing_status: text(body.financingStatus, 120),
      has_property_to_sell: body.hasPropertyToSell === true || body.hasPropertyToSell === 'yes',
      property_id: body.propertyId || null,
      brand: 'harbison_standard',
      source: text(body.source || 'website', 200),
      session_id: text(body.sessionId, 100),
      landing_page: text(body.landingPage, 500),
      referrer: text(body.referrer, 1000),
      utm_source: text(body.utmSource, 200),
      utm_medium: text(body.utmMedium, 200),
      utm_campaign: text(body.utmCampaign, 200),
      utm_term: text(body.utmTerm, 200),
      utm_content: text(body.utmContent, 200),
      first_landing_page: text(body.firstLandingPage, 500),
      first_referrer: text(body.firstReferrer, 1000),
      first_utm_source: text(body.firstUtmSource, 200),
      first_utm_medium: text(body.firstUtmMedium, 200),
      first_utm_campaign: text(body.firstUtmCampaign, 200),
      first_utm_term: text(body.firstUtmTerm, 200),
      first_utm_content: text(body.firstUtmContent, 200),
      last_landing_page: text(body.lastLandingPage, 500),
      last_referrer: text(body.lastReferrer, 1000),
      last_utm_source: text(body.lastUtmSource, 200),
      last_utm_medium: text(body.lastUtmMedium, 200),
      last_utm_campaign: text(body.lastUtmCampaign, 200),
      last_utm_term: text(body.lastUtmTerm, 200),
      last_utm_content: text(body.lastUtmContent, 200),
    };

    try {
      const response = await supabaseRest('leads', {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(lead),
      });
      const resultText = await response.text();
      if (!response.ok) {
        console.error('[supabase lead] Request rejected:', response.status);
        return json({ error: 'Failed to save inquiry' }, { status: 502 });
      }
      const rows = resultText ? JSON.parse(resultText) : [];
      let notificationSent = false;
      try {
        const delivery = await fetch('https://formspree.io/f/xqpkdwrp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          signal: AbortSignal.timeout(8000),
          body: JSON.stringify({
            ...lead,
            _subject: 'Harbison Standard - buyer inquiry',
            _replyto: email,
            _cc: 'nate85.realtor@gmail.com',
            lead_id: rows?.[0]?.id,
          }),
        });
        notificationSent = delivery.ok;
        if (!delivery.ok) console.error('[buyer notification] Delivery rejected:', delivery.status);
      } catch {
        console.error('[buyer notification] Delivery unavailable');
      }
      return json({ ok: true, id: rows?.[0]?.id ?? null, notificationSent }, { status: 201 });
    } catch (error) {
      console.error('[buyer lead]', error);
      return json({ error: 'Failed to save inquiry' }, { status: 500 });
    }
  }

  // PATCH /api/leads?id=xxx - update lead (admin only)
  if (method === 'PATCH' && id) {
    if (!isAdmin(request)) return json({ error: 'Unauthorized' }, { status: 401 });
    if (!supabaseConfigured()) return supabaseNotConfigured();
    const body = await readJson(request);
    try {
      const response = await supabaseRest(`leads?id=eq.${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { Prefer: 'return=representation' },
        body: JSON.stringify(body),
      });
      if (!response.ok) return json({ error: 'Failed to update lead' }, { status: 502 });
      const rows = await response.json();
      return json({ ok: true, lead: rows[0] ?? null });
    } catch (error) {
      console.error('[lead update error]', error);
      return json({ error: 'Failed to update lead' }, { status: 500 });
    }
  }

  return json({ error: 'Method not allowed' }, { status: 405 });
}

export default { fetch: handler };
