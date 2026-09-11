import {propertySchema} from './propertySchema.js';
import {agent,properties} from './data.js';
import {servicePages} from './serviceData.js';

import {siteUrl} from './siteConfig.js';
export {siteUrl} from './siteConfig.js';

export const ogImage = siteUrl + '/assets/hero.webp';

const cities = ['Tehachapi, CA','Bakersfield, CA','California City, CA','Stallion Springs, CA'];
const counties = ['Kern County, CA'];
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
  description: 'California REALTOR® and real estate agent, serving buyers, sellers, and investors across Kern County, California.',
  slogan: 'Real estate guidance with a local perspective.',
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
  knowsAbout: ['Real estate','Housing market','Real estate investing','Kern County real estate'],
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
  slogan: 'Real estate guidance with a local perspective.',
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
      url: siteUrl + '/property/' + p.id,
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
    title: 'Harbison Standard | Kern County REALTOR®',
    description: 'Real estate guidance with a local perspective in Kern County. Nathanael Harbison, REALTOR® (DRE 02059393), helps buyers, sellers, and investors buy, sell, and invest. Call (661) 472-7499.',
  },
  '/about': {
    title: 'About Nathanael Harbison | Harbison Standard',
    description: 'Meet Nathanael Harbison, a California REALTOR®. Real estate guidance across Kern County (Tehachapi, Bakersfield, California City).',
  },
  '/open-houses': {title:'Open Houses | Harbison Standard', description:'View upcoming open houses or ask Nathanael Harbison about a private showing.'},
  '/past-sales': {title: 'Past Sales | Harbison Standard', description: 'Selected verified past transactions by Nathanael Harbison. These homes are not currently offered for sale.'},
  '/properties': {
    title: 'Properties in Bakersfield & Tehachapi | Harbison Standard',
    description: 'Explore current listings and available homes in Bakersfield, Tehachapi, Kern County, and other markets served by Nathanael Harbison, REALTOR®.',
  },
  '/moving-from-los-angeles-to-bakersfield': {
    title: 'Moving from Los Angeles to Bakersfield | Homes & Relocation | Harbison Standard',
    description: 'Moving from Los Angeles to Bakersfield? Compare what your budget can target, view relevant properties, and create a buyer profile for Bakersfield, Tehachapi, and Kern County.',
  },
  '/contact': {
    title: 'Contact Nathanael Harbison | Call (661) 472-7499',
    description: 'Contact Nathanael Harbison, REALTOR®, about buying, selling, or investing. Call or text (661) 472-7499 or send a message — typical response within 24 hours.',
  },
  '/real-estate': {
    title: 'Selling a Home in Kern County | Harbison Standard',
    description: 'Selling your home in Kern County? Get a clear plan for repairs, as-is sales, inherited homes, and time-sensitive moves. Talk with Nathanael Harbison, REALTOR®.',
  },
  '/investing': {
    title: 'Real Estate Investing Guidance | Harbison Standard',
    description: 'Real estate investing guidance in Kern County: investment properties, flips, and practical opportunities. Nathanael Harbison, REALTOR®, offers a long-term perspective.',
  },
  '/hq': {
    title: 'HQ | Harbison Standard',
    description: '',
    robots: 'noindex, nofollow',
  },
  '/why-tehachapi': {
    title: 'Why Move to Tehachapi, CA | Harbison Standard',
    description: 'Thinking about moving to Tehachapi? Discover why people are choosing this mountain community — affordable land, four seasons, and a growing local economy.',
  },
  '/cheap-land-kern-county': {
    title: 'Cheap Land for Sale in Kern County | Harbison Standard',
    description: 'Looking for affordable land in Kern County? View current listings and learn what your budget buys in Bakersfield, Tehachapi, and the surrounding areas.',
  },
  '/bakersfield-home-prices': {
    title: 'Bakersfield Home Prices & Market Trends | Harbison Standard',
    description: 'What are homes selling for in Bakersfield? Explore price ranges, neighborhood comparisons, and what your budget can target in Kern County.',
  },
  '/tehachapi-home-prices': {
    title: 'Tehachapi Home Prices & Market Trends | Harbison Standard',
    description: 'Thinking about buying in Tehachapi? Explore home prices, land values, and what makes this mountain community different.',
  },
};

export const whyTehachapiFaq = [
  {q: 'Why are people moving to Tehachapi?', a: 'Tehachapi offers four distinct seasons, affordable land, clean air, and a growing local economy based on wind energy, aerospace, healthcare, wine, and outdoor recreation.'},
  {q: 'Is Tehachapi expensive to live in?', a: 'Compared to many California cities, Tehachapi is more affordable. Land and home prices tend to be lower, making it attractive for remote workers, retirees, and investors.'},
  {q: 'How far is Tehachapi from Bakersfield?', a: 'Tehachapi is about 35 miles from Bakersfield, roughly a 40-45 minute drive depending on conditions.'},
  {q: 'What is there to do in Tehachapi?', a: 'Outdoor activities including hiking, hunting, horseback riding, cycling, and wine tasting. The community also hosts events like movie nights and mud runs.'},
];

export const cheapLandKernFaq = [
  {q: 'How much does land cost in Kern County?', a: 'Land prices vary widely. Residential lots can be found under $50,000, while larger acreage parcels range from $100,000 to over $200,000 depending on location and utilities.'},
  {q: 'What should I check before buying land in Kern County?', a: 'Verify zoning, utility access, legal access, soils and drainage, CC&Rs, and any HOA restrictions. Always check with Kern County before committing.'},
  {q: 'Can I buy land in Kern County as an investment?', a: 'Yes. Many buyers purchase land as a long-term hold or for future development. Talk with a local agent about what makes sense for your goals.'},
  {q: 'Is owner financing available for land in Tehachapi?', a: 'Some sellers offer owner financing. Check current listings for details or ask Nathanael about available options.'},
];

export const bakersfieldFaq = [
  {q: 'What is the average home price in Bakersfield?', a: 'Bakersfield home prices vary widely by neighborhood and condition. Entry-level homes start around $200K–$250K, with mid-range family homes in the $350K–$500K range.'},
  {q: 'Is Bakersfield a good place to buy a home?', a: 'Bakersfield offers more home for your money than many California cities. It has a growing job market, relatively affordable housing, and proximity to both mountains and farmland.'},
  {q: 'What should I know about Bakersfield neighborhoods?', a: 'Seven Oaks is popular with families for its golf course and master-planned feel. Stockdale offers central, walkable neighborhoods. Southwest has newer construction. Rio Bravo provides larger lots and rural feel.'},
  {q: 'How does Bakersfield compare to Los Angeles for home buyers?', a: 'Bakersfield typically offers significantly more square footage, larger lots, and lower prices than Los Angeles. The trade-off is distance — it is about 1.5 hours north of LA.'},
];

export const tehachapiFaq = [
  {q: 'Why are people moving to Tehachapi?', a: 'Tehachapi offers four distinct seasons, affordable land, clean air, and a growing local economy based on wind energy, aerospace, healthcare, wine, and outdoor recreation.'},
  {q: 'Is Tehachapi expensive to live in?', a: 'Compared to many California cities, Tehachapi is more affordable. Land and home prices tend to be lower, making it attractive for remote workers, retirees, and investors.'},
  {q: 'How far is Tehachapi from Bakersfield?', a: 'Tehachapi is about 35 miles from Bakersfield, roughly a 40-45 minute drive depending on conditions.'},
  {q: 'What is there to do in Tehachapi?', a: 'Outdoor activities including hiking, hunting, horseback riding, cycling, and wine tasting. The community also hosts events like movie nights and mud runs.'},
];

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
  {q: 'Who is Nathanael Harbison?', a: 'Nathanael Harbison is a California-licensed REALTOR® (DRE #02059393) at Harbison Standard. He helps buyers, sellers, and investors across Kern County.'},
  {q: 'Where does Harbison Standard serve?', a: 'Harbison Standard serves Kern County, including Tehachapi, Bakersfield, California City, and Stallion Springs, California — for buying, selling, and investing.'},
  {q: 'Can Nathanael help me sell my home?', a: 'Yes. Nathanael guides sellers through planned moves, inherited properties, homes needing repairs, and time-sensitive situations, including selling as-is when that makes sense.'},
  {q: 'Do you work with real estate investors?', a: 'Yes. Nathanael works with investors on investment properties, flips, and value-add homes, and talks plainly about what makes sense for their goals.'},
  {q: 'How do I get in touch with Nathanael?', a: 'Call or text (661) 472-7499 or email nate85.realtor@gmail.com. Messages typically get a response within 24 hours.'},
];

const serviceFaqFor = path => (servicePages[path] && servicePages[path].faq) ? servicePages[path].faq.items.map(({q, a}) => ({q, a})) : null;

export const contactFaq = [
  {q: 'Can I reach out if I’m not ready yet?', a: 'Of course. Many conversations start before a decision is made. There’s no pressure to commit.'},
  {q: 'Which Kern County communities do you serve?', a: 'Yes. Nathanael serves clients across Kern County (including Tehachapi, Bakersfield, California City, and Stallion Springs).'},
  {q: 'Should I call if my timeline is urgent?', a: 'For time-sensitive situations, calling (661) 472-7499 typically gets the fastest response. Text works too.'},
  {q: 'Can I ask about a specific property?', a: 'Absolutely. Share the property or the question you have, and Nathanael will help you understand the details.'},
  {q: 'Can I talk through multiple options before deciding?', a: 'Yes. Many clients explore a few directions — buying, selling, or investing — before landing on the right one.'},
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
  if (path === '/open-houses') return [page(routes[path].title,routes[path].description,path),breadcrumb([{name:'Home',path:'/'},{name:'Open Houses',path}])];
  if (path === '/past-sales') return [base(), org(), website(), page(routes[path].title, routes[path].description, path), listingList(), breadcrumb([{name:'Home',path:'/'},{name:'Past Sales',path}])];
  if (path === '/properties') {
    return [base(), org(), website(), page(routes['/properties'].title, routes['/properties'].description, '/properties'), breadcrumb([{name: 'Home', path: '/'}, {name: 'Properties', path: '/properties'}])];
  }
  if (path === '/moving-from-los-angeles-to-bakersfield') {
    return [base(), org(), website(), page(routes[path].title, routes[path].description, path), breadcrumb([{name: 'Home', path: '/'}, {name: 'Moving from Los Angeles to Bakersfield', path}])];
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
    '/investing': {name: 'Real Estate Investing', type: 'Real Estate Investment Advisory', desc: 'Real estate investment properties, flips, and discussions about possible opportunities with Harbison Standard.', path: '/investing'},
    '/why-tehachapi': {name: 'Why Tehachapi', desc: 'Why people are choosing Tehachapi — affordable land, four seasons, and a growing local economy.', path: '/why-tehachapi'},
    '/cheap-land-kern-county': {name: 'Cheap Land in Kern County', desc: 'Affordable land for sale in Kern County — current listings and what your budget buys.', path: '/cheap-land-kern-county'},
    '/bakersfield-home-prices': {name: 'Bakersfield Home Prices', desc: 'What homes actually cost in Bakersfield — by neighborhood, by budget, and what your money buys.', path: '/bakersfield-home-prices'},
    '/tehachapi-home-prices': {name: 'Tehachapi Home Prices', desc: 'What homes and land cost in Tehachapi — from condos to acreage.', path: '/tehachapi-home-prices'},
  };
  const s = svc[path];
  if (!s) return [];
  const faqPairs = {'/why-tehachapi': whyTehachapiFaq, '/cheap-land-kern-county': cheapLandKernFaq, '/bakersfield-home-prices': bakersfieldFaq, '/tehachapi-home-prices': tehachapiFaq}[path];
  const schemas = [base(), org(), website(), page(routes[path].title, routes[path].description, path), breadcrumb([{name: 'Home', path: '/'}, {name: s.name, path: path}])];
  if(s.type){
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: s.name,
      serviceType: s.type,
      description: s.desc,
      provider: {'@id': siteUrl + '/#agent'},
      areaServed: counties,
      url: siteUrl + path,
    });
  } else {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      name: s.name,
      description: s.desc,
      author: {'@id': siteUrl + '/#agent'},
      publisher: {'@id': siteUrl + '/#org'},
      url: siteUrl + path,
    });
  }
  if(faqPairs) schemas.push(faq(faqPairs));
  return schemas;
}
export function applyPropertySeo(property) {
  if (!property || typeof document === 'undefined') return;
  const path = `/property/${property.slug || property.id}`;
  const location = [property.city, property.state || 'CA'].filter(Boolean).join(', ');
  const title = `${property.address || 'Property'}${location ? ' | ' + location : ''} | Harbison Standard`;
  const description = property.description || `Property details and buyer guidance from Nathanael Harbison, REALTOR®.`;
  document.title = title;
  const setMeta=(sel,attr,val)=>document.querySelector(sel)?.setAttribute(attr,val);
  setMeta('meta[name="description"]','content',description);
  setMeta('link[rel="canonical"]','href',siteUrl+path);
  setMeta('meta[property="og:url"]','content',siteUrl+path);
  setMeta('meta[property="og:title"]','content',title);
  setMeta('meta[property="og:description"]','content',description);
  setMeta('meta[name="twitter:title"]','content',title);
  setMeta('meta[name="twitter:description"]','content',description);
  document.querySelectorAll('script[data-property-jsonld],script[data-seo-jsonld]').forEach(s=>s.remove());
  const schema=propertySchema(property,siteUrl);
  const el=document.createElement('script');el.type='application/ld+json';el.setAttribute('data-property-jsonld','true');el.text=JSON.stringify(schema);document.head.appendChild(el);
}
