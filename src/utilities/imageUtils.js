/**
 * Generate descriptive alt text for property images
 */
export function generatePropertyImageAlt(property, imageIndex = null) {
  const { address, city, state = 'CA', price, beds, baths, description } = property;

  if (imageIndex === null) {
    return `${address} in ${city}, ${state} - Property photo`;
  }

  // For gallery images, be more specific about position
  const position = imageIndex === 0 ? 'exterior view' : `photo ${imageIndex + 1}`;
  return `${address} in ${city}, ${state} - ${position}`;
}

/**
 * Generate hero image alt text
 */
export function generateHeroImageAlt(property) {
  const { address, city, state = 'CA', beds, baths, sqft } = property;
  const details = [];
  if (beds) details.push(`${beds} bed${beds > 1 ? 's' : ''}`);
  if (baths) details.push(`${baths} bath${baths > 1 ? 's' : ''}`);
  if (sqft) details.push(`${sqft.toLocaleString()} sq ft`);

  const detailsStr = details.length > 0 ? ` - ${details.join(', ')}` : '';
  return `${address}, ${city}, ${state}${detailsStr} - Harbison Standard`;
}

/**
 * Generate location image alt text
 */
export function generateLocationImageAlt(city, state = 'CA', description = '') {
  return `${city}, ${state}${description ? ' - ' + description : ''}`;
}

/**
 * Apply alt text and dimensions to images in markup
 */
export function setImageDimensions(imgElement, width, height) {
  if (!imgElement) return;
  imgElement.setAttribute('width', width);
  imgElement.setAttribute('height', height);
  imgElement.style.aspectRatio = `${width} / ${height}`;
}

/**
 * Generate srcset for responsive images
 */
export function generateImageSrcset(imagePath, formats = ['webp', 'jpg']) {
  const srcset = [];

  // Generate 1x, 2x versions
  formats.forEach(fmt => {
    const base = imagePath.replace(/\.\w+$/, '');
    srcset.push(`${base}.${fmt} 1x`);
    srcset.push(`${base}@2x.${fmt} 2x`);
  });

  return srcset.join(', ');
}

/**
 * Validate alt text is present and meaningful
 */
export function validateImageAlt(imgElement) {
  const alt = imgElement.getAttribute('alt');
  if (!alt) return { valid: false, message: 'Missing alt attribute' };
  if (alt.length < 5) return { valid: false, message: 'Alt text too short' };
  if (alt === 'image' || alt === 'photo' || alt === 'picture') {
    return { valid: false, message: 'Alt text not descriptive' };
  }
  return { valid: true, message: 'Alt text valid' };
}
