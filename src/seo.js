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
  disambiguatingDescription: 'Licensed California REALTOR® (DRE #02059393) specializing in Kern County real estate',
  description: 'California REALTOR® and real estate agent, serving buyers, sellers, and investors across Kern County, California.',
  slogan: "It's not what you do. It's how you do it.",
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
  knowsAbout: [
    'Real estate',
    'Housing market',
    'Real estate investing',
    'Kern County real estate',
    'Land acquisition',
    'Property valuation',
    'Buyer representation',
    'Seller marketing',
  ],
  expertise: [
    'Residential real estate sales',
    'Investment property analysis',
    'Land purchases and owner financing',
    'Estate and probate sales',
    'Kern County market analysis',
  ],
  sameAs: socials,
  worksFoR: {'@id': siteUrl + '/#org'},
  brand: {'@type': 'Brand', '@id': siteUrl + '/#brand', name: 'Harbison Standard'},
});

const org = () => ({
  '@context': 'https://schema.org',
  '@type': ['Organization','ProfessionalService'],
  '@id': siteUrl + '/#org',
  name: 'Harbison Standard',
  disambiguatingDescription: 'Real estate brokerage specializing in Kern County properties and investment opportunities',
  url: siteUrl + '/',
  logo: siteUrl + '/assets/logo.webp',
  slogan: "It's not what you do. It's how you do it.",
  telephone: agent.phone,
  email: agent.email,
  priceRange: '$$',
  areaServed: counties,
  sameAs: socials,
  founder: {'@id': siteUrl + '/#agent'},
  brand: {'@type': 'Brand', '@id': siteUrl + '/#brand', name: 'Harbison Standard'},
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: agent.phone,
    contactType: 'Customer Service',
    email: agent.email,
  },
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
  itemListElement: properties.filter(p=>!p.status||/^sold$/i.test(p.status)).map((p, i) => ({
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
 '/guides':{title:'Real Estate Guides | Harbison Standard',description:'Practical guides to buying and selling property in Kern County.'},
 '/blog':{title:'Real Estate Articles | Harbison Standard',description:'Property research and real estate considerations for Kern County.'},
  '/': {
    title: 'Buy, Sell & Invest in Kern County | Harbison Standard',
    description: 'Buy, sell, or invest in Kern County with Nathanael Harbison. Explore current listings and get practical guidance in Bakersfield, Tehachapi, and nearby communities.',
  },
  '/about': {
    title: 'About Nathanael Harbison | Harbison Standard',
    description: 'Meet Nathanael Harbison, a Kern County REALTOR® helping buyers, sellers, and investors with property preparation, home searches, and clear next steps.',
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
  '/home-value': {
    title: 'What Is Your Home Worth? | Home Valuation | Harbison Standard',
    description: "Get an estimate of your home's value in Kern County. Nathanael Harbison provides quick valuations for sellers across Tehachapi, Bakersfield, and the surrounding communities.",
  },
  '/tehachapi': {
    title: 'Homes for Sale in Tehachapi, CA | Harbison Standard',
    description: 'Find homes, land, and investment properties for sale in Tehachapi. Mountain community living with affordable prices and outdoor lifestyle. Work with Nathanael Harbison.',
  },
  '/bakersfield': {
    title: 'Homes for Sale in Bakersfield, CA | Harbison Standard',
    description: 'Explore affordable homes, investment properties, and real estate in Bakersfield. California\'s 9th largest city with thriving job market and growing economy.',
  },
  '/california-city': {
    title: 'Cheap Land for Sale in California City, CA | Harbison Standard',
    description: 'Affordable land for investment in California City, CA. Buy land starting at $2K-$8K per acre. Master-planned community with 200K population target.',
  },
  '/stallion-springs': {
    title: 'Homes in Stallion Springs Gated Community | Harbison Standard',
    description: 'Master-planned homes in Stallion Springs, CA. Golf course, equestrian facilities, resort amenities. Exclusive gated community in Kern County.',
  },
  '/private-sale': {
    title: 'Sell Your House Privately in Kern County — No MLS, No Zillow | Harbison Standard',
    description: 'Sell your Bakersfield or Tehachapi house privately — no MLS, no open houses, no sign in yard. As-is, confidential, fast close. Private Sale Program by Nathanael Harbison, REALTOR® DRE #02059393. Call (661) 472-7499 confidential.',
  },
  '/off-market-deals': {
    title: 'Off-Market Deals in Kern County — Private Listings Not on Zillow | Harbison Standard',
    description: 'Off-market deals in Bakersfield, Tehachapi, California City — private listings not on MLS or Zillow. Tax-defaulted, pre-foreclosure, probate, FSBO, vacant. Get alerts 21 days before Zillow. Harbison Standard Private Lead System.',
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

export const privateSaleFaq = [
  {q: 'Is it legal to sell my house without listing it on MLS in California?', a: 'Yes. California allows private sales if the seller requests it. You sign C.A.R. Form SELM — Seller Instruction to Exclude Listing from MLS — stating you want it private. Nathanael Harbison, DRE #02059393, handles disclosures, paperwork, and escrow legally.'},
  {q: 'Will I get less money selling privately?', a: 'Sometimes 5-10% less than full MLS exposure, but many private sellers net similar or more after saving repairs, cleanout, months of mortgage, and hassle. Cash investors pay 70-80% of market, private retail buyers pay 90-95% for off-market access. We discuss trade-offs honestly.'},
  {q: 'Who will know my house is for sale?', a: 'Only you, Nathanael, and the vetted buyer. No MLS feed, no Zillow, no public open houses, no sign in your yard. Nothing is public until you accept an offer.'},
  {q: 'How fast can a private sale close?', a: 'Cash: 7-14 days. Private retail buyer with financing: 21-30 days. Nathanael can move at your pace — faster or slower.'},
  {q: 'What condition does my house need to be in?', a: 'Any condition. As-is sales are the norm for private sales — no repairs, no cleanout required. Investors buy houses that need work every week in Kern County.'},
  {q: 'What situations is a private sale best for?', a: 'Divorce, inheritance/probate, financial pressure, bad tenants, foreclosure risk, job relocation, health issues, or simply wanting privacy. Any reason you want a quiet sale.'},
  {q: 'Does a private sale cost me anything upfront?', a: 'No. Nathanael is paid at close of escrow like any real estate transaction. No upfront fees, no obligation to accept any offer.'},
  {q: 'What areas does the Private Sale Program cover?', a: 'All of Kern County — Bakersfield, Tehachapi, California City, Stallion Springs, Bear Valley Springs, Golden Hills, and surrounding communities.'},
];

export const offMarketFaq = [
  {q: 'What are off-market deals?', a: 'Off-market deals are properties for sale that are not listed on MLS, Zillow, or Realtor.com. They include private sales, FSBO, tax-defaulted, pre-foreclosure, probate, and vacant houses. Harbison Standard finds them through county records, direct mail, driving for dollars, and a private seller network.'},
  {q: 'How do you find off-market deals in Kern County?', a: 'We monitor Craigslist by-owner posts, Zillow FSBO, Kern County tax-defaulted auction lists, Notice of Default filings, probate cases, code violations, Facebook Marketplace, wholesaler lists, and driving for dollars in Golden Hills, Bear Valley Springs, Stallion Springs, and California City. All scored 1-10 for deal quality.'},
  {q: 'Can I get alerts for off-market deals?', a: 'Yes. Create a buyer profile with your budget, area (Tehachapi, Bakersfield, California City), and type (land under $50k, flip under $250k, etc). We text you when a private lead matches — before it hits Zillow.'},
  {q: 'Are off-market deals cheaper?', a: 'Often 10-30% below market. Tax-defaulted properties can go for back-taxes, pre-foreclosure sellers often accept 15% below market, probate properties sell as-is, and vacant/distressed properties trade at discounts. We comp every deal: price per sqft vs 90-day comps, DOM, motivation keywords.'},
  {q: 'Do you work with investors?', a: 'Yes. Most off-market buyers are investors. We have a private buyer network of cash buyers who want off-market inventory not on the MLS. Join by telling us your buy box — area, budget, property type.'},
];

function faq(pairs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(({q, a}) => {
      const item = {
        '@type': 'Question',
        name: q,
        acceptedAnswer: {'@type': 'Answer', text: a},
      };
      if (a.length > 0) {
        item.acceptedAnswer.speakable = {
          '@type': 'SpeakableSpecification',
          cssSelector: ['.faq-item dd'],
        };
      }
      return item;
    }),
  };
}

// Speakable schema for voice search optimization
const speakableSchema = (content) => ({
  '@context': 'https://schema.org',
  '@type': 'SpeakableSpecification',
  cssSelector: [
    'h1', // Article headline
    '.content-body p:first-of-type', // First paragraph (summary)
    '.table-of-contents', // Main headings
  ],
});

export const homeFaq = [
  {q: 'Who is Nathanael Harbison?', a: 'Nathanael Harbison is a California-licensed REALTOR® (DRE #02059393) at Harbison Standard. He helps buyers, sellers, and investors across Kern County.'},
  {q: 'Where does Harbison Standard serve?', a: 'Harbison Standard serves Kern County, including Tehachapi, Bakersfield, California City, and Stallion Springs, California — for buying, selling, and investing.'},
  {q: 'Can Nathanael help me sell my home?', a: 'Yes. Nathanael guides sellers through planned moves, inherited properties, homes needing repairs, and time-sensitive situations, including selling as-is when that makes sense.'},
  {q: 'Do you work with real estate investors?', a: 'Yes. Nathanael works with investors on investment properties, flips, and value-add homes, and talks plainly about what makes sense for their goals.'},
  {q: 'How do I get in touch with Nathanael?', a: 'Call or text (661) 472-7499 or email nate85.realtor@gmail.com. Messages typically get a response within 24 hours.'},
];

const serviceFaqFor = path => (servicePages[path] && servicePages[path].faq) ? servicePages[path].faq.items.map(({q, a}) => ({q, a})) : null;

export const contactFaq = [
  {q: "Can I reach out if I'm not ready yet?", a: "Of course. Many conversations start before a decision is made. There's no pressure to commit."},
  {q: "Which Kern County communities do you serve?", a: "Yes. Nathanael serves clients across Kern County (including Tehachapi, Bakersfield, California City, and Stallion Springs)."},
  {q: "Should I call if my timeline is urgent?", a: "For time-sensitive situations, calling (661) 472-7499 typically gets the fastest response. Text works too."},
  {q: "Can I ask about a specific property?", a: "Absolutely. Share the property or the question you have, and Nathanael will help you understand the details."},
  {q: "Can I talk through multiple options before deciding?", a: "Yes. Many clients explore a few directions — buying, selling, or investing — before landing on the right one."},
];

// AggregateRating schema for testimonials (6 verified reviews)
const aggregateRating = () => ({
  "@context": "https://schema.org",
  "@type": "AggregateRating",
  "@id": siteUrl + "/#rating",
  ratingValue: "5.0",
  bestRating: "5",
  worstRating: "1",
  ratingCount: 6,
  reviewCount: 6,
});

// LocalBusiness schema — complements RealEstateAgent for local SEO
const brand = () => ({
  "@context": "https://schema.org",
  "@type": "Brand",
  "@id": siteUrl + "/#brand",
  name: "Harbison Standard",
  url: siteUrl + "/",
  logo: siteUrl + "/assets/logo.webp",
  description: "Harbison Standard is a real estate brokerage specializing in Kern County, California. Founded by Nathanael Harbison (DRE #02059393), serving buyers, sellers, and investors.",
  owns: {"@id": siteUrl + "/#org"},
});

const localBusiness = () => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": siteUrl + "/#local-business",
  name: "Harbison Standard",
  description: "Real estate services in Kern County, California",
  telephone: agent.phone,
  email: agent.email,
  url: siteUrl + "/",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tehachapi",
    addressRegion: "CA",
    addressCountry: "US",
  },
  areaServed: [...counties.map(name => ({"@type": "AdministrativeArea", name})), ...cities.map(name => ({"@type": "City", name}))],
  sameAs: socials,
  founder: {"@id": siteUrl + "/#agent"},
  image: siteUrl + "/assets/logo.webp",
  aggregateRating: {"@id": siteUrl + "/#rating"},
  brand: {"@id": siteUrl + "/#brand"},
});

// VideoObject schema — for property videos
const videoSchema = (property, videoUrl) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: `Virtual tour: ${property.address}`,
  description: `Video walkthrough of ${property.address} in ${property.city}, CA`,
  thumbnailUrl: siteUrl + "/assets/sold/" + property.id + ".webp",
  uploadDate: new Date().toISOString().split("T")[0],
  url: videoUrl,
});

// Form Action schema — for lead forms
const formActionSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  potentialAction: {
    "@type": "FormAction",
    target: "https://formspree.io/f/xqpkdwrp",
    method: "POST",
  },
});

export function jsonLdFor(path) {
  if (path === '/') {
    return [base(), org(), brand(), localBusiness(), website(), page(routes['/'].title, routes['/'].description, '/'), faq(homeFaq)];
  }
  if (path === '/about') {
    return [base(), org(), localBusiness(), website(), {
      '@context': 'https://schema.org',
      '@type': ['ProfilePage','WebPage'],
      name: routes['/about'].title,
      url: siteUrl + '/about',
      mainEntity: {'@id': siteUrl + '/#agent'},
      about: {'@id': siteUrl + '/#agent'},
      isPartOf: {'@id': siteUrl + '/#website'},
    }, breadcrumb([{name: 'Home', path: '/'}, {name: 'About', path: '/about'}])];
  }
  if (path === '/open-houses') return [page(routes[path].title,routes[path].description,path), breadcrumb([{name:'Home',path:'/'},{name:'Open Houses',path}])];
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
  if (path === '/home-value') {
    return [base(), org(), website(), page(routes[path].title, routes[path].description, path), breadcrumb([{name: 'Home', path: '/'}, {name: 'Home Value', path}])];
  }
  if (['/tehachapi', '/bakersfield', '/california-city', '/stallion-springs'].includes(path)) {
    const names = {'/tehachapi': 'Tehachapi', '/bakersfield': 'Bakersfield', '/california-city': 'California City', '/stallion-springs': 'Stallion Springs'};
    return [base(), org(), website(), page(routes[path].title, routes[path].description, path), breadcrumb([{name: 'Home', path: '/'}, {name: names[path], path}])];
  }
  const svc = {
    '/real-estate': {name: 'Selling a Home', type: 'Residential Real Estate Sales', desc: 'Support selling a home with a clear plan — planned moves, inherited homes, repairs, and time-sensitive situations.', path: '/real-estate'},
    '/investing': {name: 'Real Estate Investing', type: 'Real Estate Investment Advisory', desc: 'Real estate investment properties, flips, and discussions about possible opportunities with Harbison Standard.', path: '/investing'},
    '/why-tehachapi': {name: 'Why Tehachapi', desc: 'Why people are choosing Tehachapi — affordable land, four seasons, and a growing local economy.', path: '/why-tehachapi'},
    '/cheap-land-kern-county': {name: 'Cheap Land in Kern County', desc: 'Affordable land for sale in Kern County — current listings and what your budget buys.', path: '/cheap-land-kern-county'},
    '/bakersfield-home-prices': {name: 'Bakersfield Home Prices', desc: 'What homes actually cost in Bakersfield — by neighborhood, by budget, and what your money buys.', path: '/bakersfield-home-prices'},
    '/tehachapi-home-prices': {name: 'Tehachapi Home Prices', desc: 'What homes and land cost in Tehachapi — from condos to acreage.', path: '/tehachapi-home-prices'},
    '/private-sale': {name: 'Private Home Sale Program', type: 'Real Estate Sales Without MLS', desc: 'Sell your house privately in Kern County — no MLS, no Zillow, no open houses, no sign in yard. As-is, confidential, fast close. Private Sale Program by Nathanael Harbison.', path: '/private-sale'},
    '/off-market-deals': {name: 'Off-Market Deals', type: 'Off-Market Real Estate', desc: 'Off-market deals in Kern County — private listings not on MLS or Zillow. Tax-defaulted, pre-foreclosure, probate, FSBO, vacant. Get alerts before Zillow.', path: '/off-market-deals'},
  };
  const s = svc[path];
  if (!s) return [];
  const faqPairs = {'/why-tehachapi': whyTehachapiFaq, '/cheap-land-kern-county': cheapLandKernFaq, '/bakersfield-home-prices': bakersfieldFaq, '/tehachapi-home-prices': tehachapiFaq, '/private-sale': privateSaleFaq, '/off-market-deals': offMarketFaq}[path];
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
/**
 * Create Article/BlogPosting schema for content pages
 */
export function articleSchema(title, description, path, datePublished, dateModified = null, faqs = []) {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: siteUrl + path,
    author: {
      '@type': 'Person',
      name: agent.name,
      url: siteUrl + '/about',
      jobTitle: 'California REALTOR® (DRE #02059393)',
      sameAs: socials,
      image: siteUrl + '/assets/headshot.webp',
      knowsAbout: ['Real Estate', 'Kern County', 'Investment Properties', 'Land Sales', 'Home Selling'],
    },
    publisher: {
      '@type': 'Organization',
      '@id': siteUrl + '/#org',
      name: 'Harbison Standard',
      logo: {
        '@type': 'ImageObject',
        url: siteUrl + '/assets/logo.webp',
      },
    },
    image: siteUrl + '/assets/hero.webp',
    datePublished,
    dateModified: dateModified || datePublished,
    articleBody: 'Real estate guidance for buyers, sellers, and investors in Kern County',
  };

  const schemas = [article, breadcrumb([{name:'Home',path:'/'},{name:path.startsWith('/blog/')?'Blog':'Guides',path:path.startsWith('/blog/')?'/blog':'/guides'},{name:title,path}])];
  if (faqs && faqs.length > 0) {
    schemas.push(faq(faqs));
  }
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
