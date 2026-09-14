import { json, readJson } from './lib/auth.mjs';
import { supabaseConfigured, supabaseRest, supabaseNotConfigured } from './lib/supabase.mjs';

function normalize(row) {
  const slug = row.slug || row.id || row.property_slug || '';
  const image = row.image_url || row.image || row.primary_image_url || row.hero_image || null;
  return {
    id: row.id ?? slug,
    slug: String(slug),
    address: row.address || row.street_address || row.title || '',
    city: row.city || '',
    state: row.state || 'CA',
    zip: row.zip || row.zip_code || row.postal_code || '',
    region: row.region || row.county || '',
    price: Number(row.price || row.list_price || 0),
    beds: Number(row.beds ?? row.bedrooms ?? 0),
    baths: Number(row.baths ?? row.bathrooms ?? 0),
    sqft: Number(row.sqft ?? row.square_feet ?? row.living_area ?? 0),
    lot: row.lot || row.lot_size || '',
    headline: row.headline || row.title || '',
    description: row.description || row.summary || '',
    status: row.status || row.listing_status || 'Available',
    propertyType: row.property_type || row.type || '',
    videoUrl: row.video_url || row.video || '',
    latitude: row.latitude ?? row.lat ?? null,
    longitude: row.longitude ?? row.lng ?? row.lon ?? null,
    features: Array.isArray(row.features) ? row.features : [],
    locationContext: row.location_context || row.area_context || '',
    imageUrl: image,
    images: [row.images, row.gallery, row.image_urls].find(value => Array.isArray(value) && value.length) || (image ? [image] : []),
    featured: Boolean(row.featured || row.is_featured),
  };
}

const isKernCounty = p => {
  if(!p.city && !p.region && !p.zip) return true;
  if(p.region && /kern/i.test(p.region)) return true;
  if(p.city){
    const kernCities = ['bakersfield','tehachapi','california city','stallion springs','mojave','ridgecrest','rosedale','taft','delano','mcFarland','shafter','wasco'];
    if(kernCities.some(c=>p.city.toLowerCase().includes(c))) return true;
  }
  if(p.zip && /^93[0-9]{3}$/.test(p.zip)) return true;
  return false;
};

const text = (value, max = 500) => String(value || '').trim().slice(0, max);

async function handler(request) {
  const url = new URL(request.url);
  const method = request.method;
  const openhouse = url.searchParams.get('openhouse');

  // GET /api/properties or /api/properties?slug=xxx - fetch property data (public)
  if (method === 'GET') {
    if (!supabaseConfigured()) return supabaseNotConfigured();
    const slug = url.searchParams.get('slug');
    const query = slug
      ? `properties?select=*&status=in.(available,active,for%20sale,sold,Available,Active,For%20Sale,Sold,Coming%20Soon,coming%20soon)&slug=eq.${encodeURIComponent(slug)}&limit=1`
      : 'properties?select=*&order=created_at.desc&status=in.(available,active,for%20sale,sold,Available,Active,For%20Sale,Sold,Coming%20Soon,coming%20soon)';
    try {
      const response = await supabaseRest(query, { method: 'GET' });
      const text = await response.text();
      if (!response.ok) {
        console.error('[supabase properties] Request rejected:', response.status);
        return json({ error: 'Failed to load properties' }, { status: 502 });
      }
      const rows = JSON.parse(text || '[]').map(normalize).filter(p=>slug ? true : isKernCounty(p));
      if (slug && !rows.length) return json({ error: 'Property not found' }, { status: 404 });
      return json(slug ? { property: rows[0] } : { properties: rows });
    } catch (error) {
      console.error('[properties]', error);
      return json({ error: 'Failed to load properties' }, { status: 500 });
    }
  }

  // POST /api/properties?openhouse=true - open house registration (public)
  if (method === 'POST' && openhouse === 'true') {
    if (!supabaseConfigured()) return supabaseNotConfigured();
    const headers = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','X-Robots-Tag':'noindex, nofollow'};
    const reply = (body, status = 200) => json(body, {status, headers});

    const body = await readJson(request);
    if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({success:false,error:'Invalid JSON object'},400);

    const limits = {name:100,email:200,phone:40,property:200,location:200,source:200,date_time:100,submission_date:100};
    const data = {};
    for (const [key,max] of Object.entries(limits)) {
      if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > max) return reply({success:false,error:'Invalid or missing '+key},400);
      data[key] = body[key].trim();
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !Number.isFinite(Date.parse(data.submission_date))) return reply({success:false,error:'Invalid email or submission_date'},400);

    const lead = {name:data.name,email:data.email.toLowerCase(),phone:data.phone,location:data.location,interest:data.property,source:data.source,goal:'Open house',status:'new',brand:'harbison_standard',message:JSON.stringify(data,null,2)};
    try {
      const saved = await supabaseRest('leads', {method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(lead),signal:AbortSignal.timeout(8000)});
      if (!saved.ok) throw new Error('CRM rejected registration');
      return reply({success:true,message:'Registration recorded'});
    } catch {
      try {
        const backup = await fetch('https://formspree.io/f/xqpkdwrp', {method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:AbortSignal.timeout(8000),body:JSON.stringify({...data,_subject:'Harbison Standard - open house registration',_replyto:data.email})});
        if (backup.ok) return reply({success:true,message:'Registration received through backup',delivery:'formspree'});
      } catch { }
      return reply({success:false,error:'Unable to save registration. Please retry.'},503);
    }
  }

  // OPTIONS for CORS preflight (openhouse endpoint)
  if (method === 'OPTIONS' && openhouse === 'true') {
    return new Response(null, {status:204, headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type'}});
  }

  return json({ error: 'Method not allowed' }, { status: 405 });
}

export default { fetch: handler };
