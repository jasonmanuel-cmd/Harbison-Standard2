import {properties as fallbackProperties} from './data.js';

export function normalizeFallback(p) {
  return {
    ...p,
    databaseId: null,
    slug: p.slug || p.id,
    state: p.state || 'CA',
    status: p.status || 'Sold',
    imageUrl: p.imageUrl || `/assets/sold/${p.id}.webp`,
    images: p.images || [`/assets/sold/${p.id}.webp`],
    propertyType: p.propertyType || '',
  };
}

export const isAvailableProperty = p => /^(available|active|for sale|coming soon)$/i.test(p.status || '');

export const staticProperties = fallbackProperties.map(normalizeFallback);

function isKernCounty(p){
  if(!p.city && !p.region && !p.zip) return true;
  if(p.region && /kern/i.test(p.region)) return true;
  if(p.city){
    const kernCities = ['bakersfield','tehachapi','california city','stallion springs','mojave','ridgecrest','rosedale','taft','delano','mcFarland','shafter','wasco'];
    if(kernCities.some(c=>p.city.toLowerCase().includes(c))) return true;
  }
  if(p.zip && /^93[0-9]{3}$/.test(p.zip)) return true;
  return false;
}

export async function getProperties() {
  try {
    const res = await fetch('/api/properties');
    if (!res.ok) throw new Error('api');
    const data = await res.json();
    if(Array.isArray(data.properties) && data.properties.length){
      return data.properties.filter(p=>isKernCounty(p)||/^(available|active|for sale|coming soon)$/i.test(p.status||''));
    }
    return staticProperties;
  } catch {
    return staticProperties;
  }
}

export async function getProperty(slug) {
  try {
    const res = await fetch(`/api/properties?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('api');
    const data = await res.json();
    return data.property || staticProperties.find(p => p.slug === slug) || null;
  } catch {
    return staticProperties.find(p => p.slug === slug) || null;
  }
}
