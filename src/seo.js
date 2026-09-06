import {agent} from './data';

// Change siteUrl here once your domain is live. It is used for canonical URLs,
// Open Graph, JSON-LD structured data, and the sitemap.
export const siteUrl = 'https://www.harbisonstandard.com';

export const ogImage = siteUrl + '/assets/hero.webp';

const base = name => ({
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  name: name || agent.name,
  image: [ogImage, siteUrl + '/assets/headshot.webp'],
  url: siteUrl + '/',
  telephone: agent.phone,
  email: agent.email,
  priceRange: '$$',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Tehachapi',
    addressRegion: 'CA',
    addressCountry: 'US',
  },
  areaServed: [
    {name: 'Kern County, CA', '@type': 'AdministrativeArea'},
    {name: 'San Diego County, CA', '@type': 'AdministrativeArea'},
  ],
  sameAs: [
    'https://www.facebook.com/nate85.realtor',
    'https://www.instagram.com/nathanaelharbison',
    'https://www.youtube.com/@Nathanaelharbison',
    'https://www.linkedin.com/in/nathanael-harbison',
  ],
  brand: {name: 'Harbison Standard', '@type': 'Brand'},
});

const page = (title, description, path = '/') => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: siteUrl + path,
  inLanguage: 'en',
  isPartOf: {name: 'Harbison Standard', url: siteUrl + '/'},
});

const breadcrumb = items => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map(({name, path}, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: siteUrl + path,
  })),
});

export const routes = {
  '/': {
    title: 'Harbison Standard | Real Estate, Development & Investing',
    description: 'Real estate, development, and investing in Kern County and San Diego County, California. Nathanael Harbison brings a builder’s perspective to your next move. Call (661) 472-7499.',
  },
  '/about': {
    title: 'About | Nathanael Harbison | Harbison Standard',
    description: 'Meet Nathanael Harbison, a California REALTOR® with Harbison Standard serving Kern County and San Diego. Construction background, investment experience, and a commitment to community.',
  },
  '/properties': {
    title: 'Properties & Past Sales | Harbison Standard',
    description: 'A selection of Nathanael Harbison’s verified past transactions across Kern County and San Diego County, from mountain retreats to city homes.',
  },
  '/contact': {
    title: 'Contact | Harbison Standard',
    description: 'Contact Nathanael Harbison, REALTOR® with Harbison Standard. Call (661) 472-7499 or email nate85.realtor@gmail.com for real estate, development, and investing in Kern County and San Diego.',
  },
  '/real-estate': {
    title: 'Sell Your Home | Harbison Standard',
    description: 'Selling a home during divorce, bankruptcy, foreclosure, repairs, inheritance, or other life changes? Talk with Nathanael Harbison about your property and timing.',
  },
  '/development': {
    title: 'Development & New Construction | Harbison Standard',
    description: 'Building a home, buying a spec home, or exploring land in Kern County or San Diego County. Discuss your vision with Nathanael Harbison.',
  },
  '/investing': {
    title: 'Real Estate Investing | Harbison Standard',
    description: 'Explore real estate investing, ask about investing in Harbison Standard, or discuss buying, restoring, and flipping a home with Nathanael Harbison.',
  },
  '/hq': {
    title: 'HQ | Harbison Standard',
    description: '',
    robots: 'noindex, nofollow',
  },
};

export function jsonLdFor(path) {
  if (path === '/') {
    return [
      base(),
      page(routes['/'].title, routes['/'].description, '/'),
      faq([
        {q: 'What areas does Harbison Standard serve?', a: 'Kern County (including Tehachapi, Bakersfield, Stallion Springs, and California City) and San Diego County, California.'},
        {q: 'Is Nathanael Harbison a licensed real estate agent?', a: 'Yes. Nathanael Harbison is a California-licensed REALTOR® (DRE #02059393).'},
        {q: 'How can I contact Nathanael Harbison?', a: 'Call (661) 472-7499 or email nate85.realtor@gmail.com. You can also send an inquiry through the contact form on this site.'},
      ]),
    ];
  }
  if (path === '/about') return [base(), page(routes['/about'].title, routes['/about'].description, '/about'), breadcrumb([{name: 'Home', path: '/'}, {name: 'About', path: '/about'}])];
  if (path === '/properties') return [base(), page(routes['/properties'].title, routes['/properties'].description, '/properties'), breadcrumb([{name: 'Home', path: '/'}, {name: 'Properties', path: '/properties'}])];
  if (path === '/contact') return [base(), page(routes['/contact'].title, routes['/contact'].description, '/contact'), breadcrumb([{name: 'Home', path: '/'}, {name: 'Contact', path: '/contact'}])];
  const svc = {service: {
    '/real-estate': {name: 'Selling a Home', desc: 'Support selling a home during life changes, including divorce, bankruptcy, foreclosure, repairs, and inheritance.', path: '/real-estate'},
    '/development': {name: 'Home Development', desc: 'Building a home, buying a spec home, and exploring land for new construction.', path: '/development'},
    '/investing': {name: 'Real Estate Investing', desc: 'Real estate investing, company investing, and buying, restoring, and flipping homes.', path: '/investing'},
  }};
  const s = svc.service[path];
  if (!s) return [];
  return [base(), page(routes[path].title, routes[path].description, path), breadcrumb([{name: 'Home', path: '/'}, {name: s.name, path: path}]), {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.desc,
    provider: {name: agent.name, url: siteUrl + '/'},
    areaServed: ['Kern County, CA', 'San Diego County, CA'],
    url: siteUrl + path,
  }];
}

function faq(pairs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(({q, a}) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {'@type': 'Answer', text: a},
    })),
  };
}
