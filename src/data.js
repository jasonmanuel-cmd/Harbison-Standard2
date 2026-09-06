export const agent = {
  name: 'Nathanael Harbison',
  email: 'nate85.realtor@gmail.com',
  phone: '(661) 472-7499',
  phoneHref: 'tel:+16614727499',
  license: '02059393',
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
  {id:'pellisier',address:'18024 Pellisier Road',city:'Tehachapi',zip:'93561',region:'Kern County',price:980000,beds:4,baths:3,sqft:2805,date:'2025-07-01',lot:'20.08 acres',description:'A mountain ranch with room to breathe. Set on more than 20 acres in Cummings Valley, this home brings together expansive views, a wraparound deck, and a barn with horse stalls.'},
  {id:'crestline',address:'2574 Crestline Drive',city:'Lemon Grove',zip:'91945',region:'San Diego County',price:720000,beds:3,baths:2,sqft:1310,date:'2026-01-26'},
  {id:'woodshawn',address:'7318 Woodshawn Drive',city:'San Diego',zip:'92114',region:'San Diego County',price:785000,beds:3,baths:2,sqft:1320,date:'2025-09-15'},
  {id:'sheridan',address:'10618 Sheridan Street',city:'California City',zip:'93505',region:'Kern County',price:345000,beds:4,baths:2,sqft:1705,date:'2025-06-06'},
  {id:'mendiburu',address:'9664 Mendiburu Road',city:'California City',zip:'93505',region:'Kern County',price:359000,beds:4,baths:2,sqft:2246,date:'2024-01-12'},
  {id:'alsab',address:'17400 Alsab Place',city:'Stallion Springs',zip:'93561',region:'Kern County',price:390000,beds:3,baths:2,sqft:1507,date:'2023-10-30'},
  {id:'windsong',address:'21213 Windsong Street',city:'California City',zip:'93505',region:'Kern County',price:305000,beds:3,baths:2.5,sqft:1591,date:'2023-09-08'},
];
export const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
export const soldDate = value => new Date(value+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
