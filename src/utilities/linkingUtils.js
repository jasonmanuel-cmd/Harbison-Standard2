import { properties } from '../data.js';

/**
 * Get properties by city with keyword-rich anchors
 */
export function getPropertiesByCity(city) {
  return properties.filter(p => p.city && p.city.toLowerCase() === city.toLowerCase());
}

/**
 * Generate related property links for a given property
 * Returns array of {address, slug, keyword} objects
 */
export function relatedPropertiesLinks(currentProperty, limit = 3) {
  if (!currentProperty || !currentProperty.city) return [];

  const similar = getPropertiesByCity(currentProperty.city)
    .filter(p => p.id !== currentProperty.id)
    .slice(0, limit);

  return similar.map(p => ({
    address: p.address,
    slug: p.slug || p.id,
    city: p.city,
    price: p.price,
    keyword: generatePropertyKeyword(p),
    href: `/property/${p.slug || p.id}`,
  }));
}

/**
 * Generate keyword anchor text for a property
 */
function generatePropertyKeyword(property) {
  const { address, city, beds, baths, sqft, price } = property;
  const parts = [address, city];

  if (beds || baths) {
    if (beds && baths) {
      parts.push(`${beds}bd/${baths}ba`);
    }
  }

  return parts.join(' ');
}

/**
 * Get related content pages based on current page slug
 * Map slug patterns to related guide pages
 */
export function relatedContentLinks(currentSlug, limit = 3) {
  const contentMap = {
    'tehachapi-land-under-50k': [
      { title: 'Tehachapi Homes with Acreage', slug: 'tehachapi-homes-with-acreage' },
      { title: 'Why Move to Tehachapi', slug: 'why-tehachapi' },
      { title: 'Cheap Land in Kern County', slug: 'cheap-land-kern-county' },
    ],
    'cheap-land-kern-county': [
      { title: 'Tehachapi Land Under $50K', slug: 'tehachapi-land-under-50k' },
      { title: 'California City Cheap Land', slug: 'california-city-cheap-land' },
      { title: 'Kern County Investment Properties', slug: 'kern-county-investment-properties' },
    ],
    'bakersfield-homes-under-400k': [
      { title: 'Moving from LA to Bakersfield', slug: 'moving-from-la-to-bakersfield' },
      { title: 'Bakersfield Home Prices & Market', slug: 'bakersfield-home-prices' },
      { title: 'Bakersfield Homes with Shop', slug: 'bakersfield-homes-with-shop' },
    ],
    'moving-from-la-to-bakersfield': [
      { title: 'Bakersfield Home Prices', slug: 'bakersfield-home-prices' },
      { title: 'Bakersfield Homes Under $400K', slug: 'bakersfield-homes-under-400k' },
      { title: 'Tehachapi vs Bakersfield', slug: 'tehachapi-vs-bakersfield' },
    ],
  };

  const related = contentMap[currentSlug] || [];
  return related.slice(0, limit).map(item => ({
    ...item,
    href: `/guide/${item.slug}`,
  }));
}

/**
 * Generate contextual internal link HTML
 */
export function createInternalLinkHtml(href, text, keyword = null) {
  return `<a href="${href}" title="${keyword || text}">${keyword || text}</a>`;
}

/**
 * Create "Similar Properties" section HTML
 */
export function createSimilarPropertiesHtml(currentProperty, limit = 3) {
  const similar = relatedPropertiesLinks(currentProperty, limit);

  if (similar.length === 0) {
    return '';
  }

  const links = similar
    .map(p => `<a href="${p.href}" title="${p.keyword}">${p.address}</a>`)
    .join(', ');

  return `
    <div class="related-properties">
      <h3>Similar ${currentProperty.beds ? 'homes' : 'properties'} in ${currentProperty.city}</h3>
      <p>${links}</p>
    </div>
  `;
}

/**
 * Create "Related Guides" section HTML
 */
export function createRelatedGuidesHtml(currentSlug, limit = 3) {
  const related = relatedContentLinks(currentSlug, limit);

  if (related.length === 0) {
    return '';
  }

  const links = related
    .map(item => `<a href="${item.href}" title="${item.title}">${item.title}</a>`)
    .join(' • ');

  return `
    <div class="related-content">
      <h3>Related Guides</h3>
      <p>${links}</p>
    </div>
  `;
}

/**
 * Extract keyword phrases from property data for anchor text
 */
export function generatePropertyFilterLink(city, type = null, priceRange = null) {
  const parts = [city];
  if (type) parts.push(type);
  if (priceRange) parts.push(priceRange);

  return {
    text: `${type ? type + 's' : 'properties'} in ${city}${priceRange ? ` under ${priceRange}` : ''}`,
    href: `/properties?city=${encodeURIComponent(city)}${type ? '&type=' + encodeURIComponent(type) : ''}`,
  };
}
