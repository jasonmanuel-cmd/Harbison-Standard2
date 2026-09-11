import { json } from './lib/auth.mjs';
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
  // If we have no identifying info, include it (don't filter out data we can't classify)
  if(!p.city && !p.region && !p.zip) return true;
  if(p.region && /kern/i.test(p.region)) return true;
  if(p.city){
    const kernCities = ['bakersfield','tehachapi','california city','stallion springs','mojave','ridgecrest','rosedale','taft','delano','mcFarland','shafter','wasco'];
    if(kernCities.some(c=>p.city.toLowerCase().includes(c))) return true;
  }
  if(p.zip && /^93[0-9]{3}$/.test(p.zip)) return true;
  return false;
};

async function handler(request) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, { status: 405 });
  if (!supabaseConfigured()) return supabaseNotConfigured();
  const url = new URL(request.url);
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

// Vercel Web Standard handler; local development uses the same fetch function.
export default {fetch:handler};
