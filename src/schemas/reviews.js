// Review schema for testimonials with proper ratingValue
export const reviewSchema = (testimonial, index) => ({
  '@context': 'https://schema.org',
  '@type': 'Review',
  '@id': `https://www.harbisonstandard.com/#review-${index}`,
  reviewRating: {
    '@type': 'Rating',
   ratingValue: '5',
    bestRating: '5',
    worstRating: '1'
  },
  author: {
    '@type': 'Person',
    name: testimonial.label.split(' · ')[1] || 'Client'
  },
  reviewBody: testimonial.quote,
  datePublished: '2026-09-01',
  publisher: {
    '@type': 'Organization',
    name: 'Harbison Standard'
  }
});

// Enhanced AggregateRating with all required fields
export const enhancedAggregateRating = () => ({
  '@context': 'https://schema.org',
  '@type': 'AggregateRating',
  '@id': 'https://www.harbisonstandard.com/#aggregateRating',
  name: 'Harbison Standard Agent Reviews',
  ratingValue: '5.0',
  bestRating: '5',
  worstRating: '1',
  ratingCount: 6,  // Required: number of individual reviews
  reviewCount: 6,  // Alternative: can be used instead of ratingCount
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    bestRating: '5',
    worstRating: '1',
    ratingCount: 6
  }
});

// Individual Review schema for each testimonial
export const generateReviewSchemas = (testimonials) => 
  testimonials.map((t, i) => reviewSchema(t, i + 1));