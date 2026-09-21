export const generateImageAlt = (address, propertyType, city, visualDescription = '') => {
  const parts = [address, propertyType, 'in', city, 'CA'];
  if (visualDescription) parts.push('—', visualDescription);
  return parts.join(' ');
};

export const generatePropertyImageAlt = (property, index = 0) => {
  const visual = index === 0 ? 'front view' : index === 1 ? 'side view' : 'detail';
  return generateImageAlt(property.address, property.type || 'property', property.city, visual);
};

export const getImageResponsive = (imagePath, alt, width, height) => ({
  src: imagePath,
  alt,
  width,
  height,
  loading: 'lazy',
  decoding: 'async',
});
