import {agent,properties} from './data';
import {servicePages} from './serviceData';

// Change siteUrl here once your domain is live. It is used for canonical URLs,
// Open Graph, JSON-LD structured data, and the sitemap.
export const siteUrl = 'https://www.harbisonstandard.com';

export const ogImage = siteUrl + '/assets/hero.webp';

const cities = ['Tehachapi, CA','Bakersfield, CA','California City, CA','Stallion Springs, CA','Lemon Grove, CA','San Diego, CA'];
const counties = ['Kern County, CA','San Diego County, CA'];
const socials = [
  'https://www.facebook.com/nate85.realtor',
  'https://www.instagram.com/nathanaelharbison',
  'https://www.youtube.com/@Nathanaelharbison',
  'https://www.linkedin.com/in/nathanael-harbison',
];

const base = () => ({
  '@context': 'https://schema.org',
  '@type': 'RealEstateAgent',
  '@id': siteUrl + '/#agent',
  name: agent.name,
  description: 'California REALTOR® and real estate agent with a hands-on construction background since 2017, serving buyers, sellers, builders, and investors across Kern County and San Diego County, California.',
  slogan: 'Real estate guidance with a builder’s eye.',
  jobTitle: 'Real Estate Agent',
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
  areaServed: [...counties.map(name => ({'@type': 'AdministrativeArea', name})), ...cities.map(name => ({'@type': 'City', name}))],
  hasCredential: {
    '@type': 'EducationalOccupationalCredential',
    name: 'California Real Estate License',
    credentialCategory: 'license',
    identifier: 'DRE #02059393',
  },
  memberOf: {
    '@type': 'Organization',
    name: 'National Association of REALTORS®',
  },
  knowsAbout: ['Real estate','New construction','Home development','Property renovation','Housing market','Real estate investing','Kern County real estate','San Diego real estate'],
  sameAs: socials,
  brand: {name: 'Harbison Standard', '@type': 'Brand'},
});

const org = () => ({
  '@context': 'https://schema.org',
  '@type': ['Organization','ProfessionalService'],
  '@id': siteUrl + '/#org',
  name: 'Harbison Standard',
  url: siteUrl + '/',
  logo: siteUrl + '/assets/logo.webp',
  slogan: 'Real estate guidance with a builder’s eye.',
  telephone: agent.phone,
  email: agent.email,
  priceRange: '$$',
  areaServed: counties,
  sameAs: socials,
  founder: {'@id': siteUrl + '/#agent'},
  brand: {name: 'Harbison Standard', '@type': 'Brand'},
});

const website = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': siteUrl + '/#website',
  name: 'Harbison Standard',
  url: siteUrl + '/',
  inLanguage: 'en',
  publisher: {'@id': siteUrl + '/#org'},
  isPartOf: {'@id': siteUrl + '/#org'},
});

const page = (title, description, path = '/') => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: siteUrl + path,
  inLanguage: 'en',
  isPartOf: {'@id': siteUrl + '/#website'},
  about: {'@id': siteUrl + '/#org'},
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

const listingList = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Past sales by Nathanael Harbison, REALTOR®',
  itemListElement: properties.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'RealEstateListing',
      name: p.address + ', ' + p.city + ', CA',
      url: siteUrl + '/properties',
      image: siteUrl + '/assets/sold/' + p.id + '.webp',
      address: {
        '@type': 'PostalAddress',
        streetAddress: p.address,
        addressLocality: p.city,
        addressRegion: 'CA',
        postalCode: p.zip,
        addressCountry: 'US',
      },
      offers: {
        '@type': 'Offer',
        price: p.price,
        priceCurrency: 'USD',
        availability: 'https://schema.org/SoldOut',
      },
    },
  })),
});

export const routes = {
  '/': {
    title: 'Harbison Standard | Kern County & San Diego REALTOR®',
    description: 'Real estate guidance with a builder’s eye in Kern County and San Diego. Nathanael Harbison, REALTOR® (DRE 02059393), helps buyers, sellers, and investors buy, sell, build, and invest. Call (661) 472-7499.',
  },
  '/about': {
    title: 'About Nathanael Harbison | Harbison Standard',
    description: 'Meet Nathanael Harbison, a California REALTOR® with a construction background since 2017. Real estate guidance across Kern County (Tehachapi, Bakersfield, California City) and San Diego.',
  },
  '/properties': {
    title: 'Past Sales & Results | Nathanael Harbison, REALTOR®',
    description: 'Verified past sales by Nathanael Harbison, REALTOR® — from Tehachapi and California City to San Diego. Homes, locations, and results across Kern County and San Diego County.',
  },
  '/contact': {
    title: 'Contact Nathanael Harbison | Call (661) 472-7499',
    description: 'Contact Nathanael Harbison, REALTOR®, about buying, selling, building, or investing. Call or text (661) 472-7499 or send a message — typical response within 24 hours.',
  },
  '/real-estate': {
    title: 'Selling a Home in Kern County | Harbison Standard',
    description: 'Selling your home in Kern County or San Diego? Get a clear plan for repairs, as-is sales, inherited homes, and time-sensitive moves. Talk with Nathanael Harbison, REALTOR®.',
  },
  '/development': {
    title: 'Building, Land & Spec Homes | Harbison Standard',
    description: 'Think through building a home, buying a spec home, or buying land in Kern County or San Diego. Nathanael Harbison brings a builder’s perspective to the real estate side.',
  },
  '/investing': {
    title: 'Real Estate Investing Guidance | Harbison Standard',
    description: 'Real estate investing guidance in Kern County and San Diego: investment properties, flips, and practical opportunities. Nathanael Harbison, REALTOR®, offers a long-term perspective.',
  },
  '/hq': {
    title: 'HQ | Harbison Standard',
    description: '',
    robots: 'noindex, nofollow',
  },
};

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

export const homeFaq = [
  {q: 'Who is Nathanael Harbison?', a: 'Nathanael Harbison is a California-licensed REALTOR® (DRE #02059393) at Harbison Standard with hands-on construction experience since 2017. He helps buyers, sellers, builders, and investors across Kern County and San Diego County.'},
  {q: 'Where does Harbison Standard serve?', a: 'Harbison Standard serves Kern County, including Tehachapi, Bakersfield, California City, and Stallion Springs, plus San Diego County, California — for buying, selling, building, and investing.'},
  {q: 'Can Nathanael help me sell my home?', a: 'Yes. Nathanael guides sellers through planned moves, inherited properties, homes needing repairs, and time-sensitive situations, including selling as-is when that makes sense.'},
  {q: 'Do you help with building a home or buying land?', a: 'Yes. Nathanael brings a builder’s perspective to building a home, buying a spec home, and evaluating land in Kern County and San Diego County.'},
  {q: 'Do you work with real estate investors?', a: 'Yes. Nathanael works with investors on investment properties, flips, and value-add homes, and talks plainly about what makes sense for their goals.'},
  {q: 'How do I get in touch with Nathanael?', a: 'Call or text (661) 472-7499 or email nate85.realtor@gmail.com. Messages typically get a response within 24 hours.'},
];

const serviceFaqFor = path => (servicePages[path] && servicePages[path].faq) ? servicePages[path].faq.items.map(({q, a}) => ({q, a})) : null;

export const contactFaq = [
  {q: 'Can I reach out if I’m not ready yet?', a: 'Of course. Many conversations start before a decision is made. There’s no pressure to commit.'},
  {q: 'Do you work with both Kern County and San Diego clients?', a: 'Yes. Nathanael serves clients across Kern County (including Tehachapi, Bakersfield, California City, and Stallion Springs) and San Diego County.'},
  {q: 'Should I call if my timeline is urgent?', a: 'For time-sensitive situations, calling (661) 472-7499 typically gets the fastest response. Text works too.'},
  {q: 'Can I ask about a specific property?', a: 'Absolutely. Share the property or the question you have, and Nathanael will help you understand the details.'},
  {q: 'Can I talk through multiple options before deciding?', a: 'Yes. Many clients explore a few directions — buying, selling, building, or investing — before landing on the right one.'},
];

export function jsonLdFor(path) {
  if (path === '/') {
    return [base(), org(), website(), page(routes['/'].title, routes['/'].description, '/'), faq(homeFaq)];
  }
  if (path === '/about') {
    return [base(), org(), website(), {
      '@context': 'https://schema.org',
      '@type': ['ProfilePage','WebPage'],
      name: routes['/about'].title,
      url: siteUrl + '/about',
      mainEntity: {'@id': siteUrl + '/#agent'},
      about: {'@id': siteUrl + '/#agent'},
      isPartOf: {'@id': siteUrl + '/#website'},
    }, breadcrumb([{name: 'Home', path: '/'}, {name: 'About', path: '/about'}])];
  }
  if (path === '/properties') {
    return [base(), org(), website(), page(routes['/properties'].title, routes['/properties'].description, '/properties'), listingList(), breadcrumb([{name: 'Home', path: '/'}, {name: 'Properties', path: '/properties'}])];
  }
  if (path === '/contact') {
    return [base(), org(), website(), {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: routes['/contact'].title,
      url: siteUrl + '/contact',
      description: routes['/contact'].description,
      isPartOf: {'@id': siteUrl + '/#website'},
      about: {'@id': siteUrl + '/#org'},
    }, breadcrumb([{name: 'Home', path: '/'}, {name: 'Contact', path: '/contact'}]), faq(contactFaq)];
  }
  const svc = {
    '/real-estate': {name: 'Selling a Home', type: 'Residential Real Estate Sales', desc: 'Support selling a home with a clear plan — planned moves, inherited homes, repairs, and time-sensitive situations.', path: '/real-estate'},
    '/development': {name: 'Home Development', type: 'New Construction Real Estate Services', desc: 'Building a home, buying a spec home, and exploring land for new construction.', path: '/development'},
    '/investing': {name: 'Real Estate Investing', type: 'Real Estate Investment Advisory', desc: 'Real estate investment properties, flips, and discussions about possible opportunities with Harbison Standard.', path: '/investing'},
  };
  const s = svc[path];
  if (!s) return [];
  const pageFaq = serviceFaqFor(path);
  return [base(), org(), website(), page(routes[path].title, routes[path].description, path), breadcrumb([{name: 'Home', path: '/'}, {name: s.name, path: path}]), {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.name,
    serviceType: s.type,
    description: s.desc,
    provider: {'@id': siteUrl + '/#agent'},
    areaServed: counties,
    url: siteUrl + path,
  }, ...(pageFaq ? [faq(pageFaq)] : [])];
}