export const agent = {
  name: 'Nathanael Harbison',
  email: 'nate85.realtor@gmail.com',
  phone: '(661) 472-7499',
  phoneHref: 'tel:+166****7499',
  smsHref: 'sms:+166****7499',
  license: '02059393',
  responseTime: 'within 24 hours',
  youtube: 'https://www.youtube.com/@Nathanaelharbison',
};
export const socials = [
  {name: 'Facebook', url: 'https://www.facebook.com/nate85.realtor'},
  {name: 'Instagram', url: 'https://www.instagram.com/nathanaelharbison'},
  {name: 'YouTube', url: 'https://www.youtube.com/@Nathanaelharbison'},
  {name: 'LinkedIn', url: 'https://www.linkedin.com/in/nathanael-harbison'},
];
// Verified past transactions and property records, 2026-09-06.
// Past transactions can include either side of a sale; do not label all as seller representation.
export const properties = [
  {id:'wendy',address:'585 N Wendy Dr',city:'Newbury Park',zip:'91320',region:'Ventura County',price:880000,beds:3,baths:2,sqft:1633,date:'2026-07-16',lot:'7,840 sq ft',status:'Active',context:'A fully reimagined Newbury Park residence with Boney Mountain views, chef\'s kitchen, 400+ sq ft bonus room, and top-rated schools.',description:'Welcome to a fully reimagined Newbury Park residence where designer finishes meet everyday livability, all framed by sweeping views of Boney Mountain. Step inside to find luxury vinyl plank flooring flowing throughout, setting the stage for a home that has been remodeled top to bottom with genuine attention to detail. The showpiece kitchen features dramatic gold-and-black marbled quartz countertops, a professional KitchenAid gas range and oven, and a chef\'s pot filler — a space equally suited to weeknight dinners and holiday gatherings. The living room fireplace, wrapped in imported Italian veneer, anchors the main living space with warmth and sophistication, and the same Italian craftsmanship carries into both remodeled bathrooms, where fully tiled showers elevate the everyday routine. Outside, the covered rear patio is an entertainer\'s dream — finished in custom hexagon Italian tile and positioned to take in the peacefully robust landscaped yard. And then there\'s the surprise: a versatile bonus room off the garage spanning over 400 square feet — ideal as a home office, gym, studio, or media retreat. All of this sits minutes from the area\'s coveted International Baccalaureate middle and high school programs, plus trails, parks, shopping, and easy 101 access. Turnkey, timeless, and truly move-in ready — A rare remodel that feels like new construction.'},
  {id:'pellisier',address:'18024 Pellisier Road',city:'Tehachapi',zip:'93561',region:'Kern County',price:980000,beds:4,baths:3,sqft:2805,date:'2025-07-01',lot:'20.08 acres',context:'A unique mountain property with acreage, views, and a specific buyer profile.',description:'A mountain ranch with room to breathe. Set on more than 20 acres in Cummings Valley, this home brings together expansive views, a wraparound deck, and a barn with horse stalls.'},
  {id:'sheridan',address:'10618 Sheridan Street',city:'California City',zip:'93505',region:'Kern County',price:345000,beds:4,baths:2,sqft:1705,date:'2025-06-06',context:'A spacious single-story home in California City'},
  {id:'mendiburu',address:'9664 Mendiburu Road',city:'California City',zip:'93505',region:'Kern County',price:359000,beds:4,baths:2,sqft:2246,date:'2024-01-12',context:'Renovation potential on an open lot in California City'},
  {id:'alsab',address:'17400 Alsab Place',city:'Stallion Springs',zip:'93561',region:'Kern County',price:390000,beds:3,baths:2,sqft:1507,date:'2023-10-30',context:'A home in Stallion Springs with room to grow'},
  {id:'windsong',address:'21213 Windsong Street',city:'California City',zip:'93505',region:'Kern County',price:305000,beds:3,baths:2.5,sqft:1591,date:'2023-09-08',context:'A starter-friendly home in California City'},
];
export const testimonials = [
  {quote:'Nathanael was honest, responsive, and easy to work with from start to finish.',label:'Buyer · Tehachapi'},
];
export const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:Number.isInteger(Number(value))?0:2,maximumFractionDigits:2}).format(value);
export const soldDate = value => new Date(value+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
