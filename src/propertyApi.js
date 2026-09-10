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

export async function getProperties() {
  try {
    const res = await fetch('/api/properties');
    if (!res.ok) throw new Error('api');
    const data = await res.json();
    return Array.isArray(data.properties) && data.properties.length ? data.properties : staticProperties;
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
