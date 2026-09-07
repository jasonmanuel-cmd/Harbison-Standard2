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
    description: 'Real estate guidance with a builder’s eye. Helping buyers, sellers, and investors across Kern County and San Diego with practical experience in construction, renovation, development, and property value. Nathanael Harbison, REALTOR®. Call (661) 472-7499.',
  },
  '/about': {
    title: 'About | Nathanael Harbison | Harbison Standard',
    description: 'Meet Nathanael Harbison, a California REALTOR® with Harbison Standard serving Kern County and San Diego. Construction background since 2017, real estate experience, and a people-first approach.',
  },
  '/properties': {
    title: 'Properties & Past Sales | Harbison Standard',
    description: 'Past sales that reflect real experience. A selection of Nathanael Harbison’s verified transactions across Kern County and San Diego County, from mountain retreats to city homes.',
  },
  '/contact': {
    title: 'Contact | Harbison Standard',
    description: 'Contact Nathanael Harbison, REALTOR® with Harbison Standard. Call or text (661) 472-7499 or email nate85.realtor@gmail.com for real estate, development, and investing in Kern County and San Diego.',
  },
  '/real-estate': {
    title: 'Sell Your Home | Harbison Standard',
    description: 'Sell your home with a clear plan and the right perspective. Support for planned moves, inherited homes, repairs, and time-sensitive situations. Talk with Nathanael Harbison about your home.',
  },
  '/development': {
    title: 'Development & New Construction | Harbison Standard',
    description: 'Guidance for building a home, buying a spec home, or evaluating land in Kern County or San Diego County. Talk with Nathanael Harbison for a practical, construction-aware perspective.',
  },
  '/investing': {
    title: 'Real Estate Investing | Harbison Standard',
    description: 'A practical perspective on real estate opportunities. Learn about investment properties, flips, and discussing possible opportunities with Harbison Standard. Talk with Nathanael Harbison.',
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
        {q: 'Is Nathanael Harbison a licensed real estate agent?', a: 'Yes. Nathanael Harbison is a California-licensed REALTOR® (DRE #02059393) with a construction background since 2017.'},
        {q: 'How can I contact Nathanael Harbison?', a: 'Call or text (661) 472-7499 or email nate85.realtor@gmail.com. You can also send an inquiry through the contact form on this site.'},
      ]),
    ];
  }
  if (path === '/about') return [base(), page(routes['/about'].title, routes['/about'].description, '/about'), breadcrumb([{name: 'Home', path: '/'}, {name: 'About', path: '/about'}])];
  if (path === '/properties') return [base(), page(routes['/properties'].title, routes['/properties'].description, '/properties'), breadcrumb([{name: 'Home', path: '/'}, {name: 'Properties', path: '/properties'}])];
  if (path === '/contact') return [base(), page(routes['/contact'].title, routes['/contact'].description, '/contact'), breadcrumb([{name: 'Home', path: '/'}, {name: 'Contact', path: '/contact'}]), faq([
    {q: 'Can I reach out if I’m not ready yet?', a: 'Of course. Many conversations start before a decision is made. There’s no pressure to commit.'},
    {q: 'Do you work with both Kern County and San Diego clients?', a: 'Yes. Nathanael Harbison serves clients across Kern County (including Tehachapi, Bakersfield, California City, and Stallion Springs) and San Diego County.'},
    {q: 'Should I call if my timeline is urgent?', a: 'For time-sensitive situations, calling (661) 472-7499 typically gets the fastest response. Text works too.'},
    {q: 'Can I ask about a specific property?', a: 'Absolutely. Share the property or the question you have, and Nathanael will help you understand the details.'},
    {q: 'Can I talk through multiple options before deciding?', a: 'Yes. Many clients explore a few directions — buying, selling, building, or investing — before landing on the right one.'},
  ])];
  const svc = {service: {
    '/real-estate': {name: 'Selling a Home', desc: 'Support selling a home with a clear plan — planned moves, inherited homes, repairs, and time-sensitive situations.', path: '/real-estate'},
    '/development': {name: 'Home Development', desc: 'Building a home, buying a spec home, and exploring land for new construction.', path: '/development'},
    '/investing': {name: 'Real Estate Investing', desc: 'Real estate investment properties, flips, and discussions about possible opportunities with Harbison Standard.', path: '/investing'},
  }};
  const s = svc.service[path];
  if (!s) return [];
  const extra = path === '/real-estate' ? [faq([
    {q: 'Should I repair my home before selling?', a: 'It depends on the home, the timeline, and the likely buyer pool. A few targeted repairs can help in some cases; in others, selling as-is is the better move. Nathanael Harbison can help you weigh the tradeoffs.'},
    {q: 'Can I sell as-is?', a: 'Yes. As-is sales happen often. Nathanael helps sellers understand pricing and positioning when a home is sold without repairs.'},
    {q: 'What if my timeline is urgent?', a: 'Urgent timelines benefit from clarity even more. Sharing your dates early is the best first step.'},
    {q: 'What if I’m not ready yet?', a: 'That’s fine. Many conversations start before a decision is made, with no pressure to move forward.'},
    {q: 'Can I reach out before making a final decision?', a: 'Absolutely. You can ask questions first and decide later.'},
  ])] : [];
  return [base(), page(routes[path].title, routes[path].description, path), breadcrumb([{name: 'Home', path: '/'}, {name: s.name, path: path}]), {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    description: s.desc,
    provider: {name: agent.name, url: siteUrl + '/'},
    areaServed: ['Kern County, CA', 'San Diego County, CA'],
    url: siteUrl + path,
  }, ...extra];
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
