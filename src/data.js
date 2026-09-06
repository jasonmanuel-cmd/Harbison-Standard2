export const agent = {
  name: 'Nathanael Harbison',
  email: 'nate85.realtor@gmail.com',
  phone: '(661) 472-7499',
  phoneHref: 'tel:+16614727499',
  license: '02059393',
  compass: 'https://www.compass.com/agents/nathanael-harbison/',
};
export const socials = [
  {name: 'Facebook', url: 'https://www.facebook.com/nate85.realtor'},
  {name: 'Instagram', url: 'https://www.instagram.com/nathanaelharbison'},
  {name: 'YouTube', url: 'https://www.youtube.com/@Nathanaelharbison'},
  {name: 'LinkedIn', url: 'https://www.linkedin.com/in/nathanael-harbison'},
];
// Verified against Compass agent transaction history and linked property records, 2026-09-06.
// Past transactions can include either side of a sale; do not label all as seller representation.
export const properties = [
  {id:'pellisier',address:'18024 Pellisier Road',city:'Tehachapi',zip:'93561',region:'Kern County',price:980000,beds:4,baths:3,sqft:2805,date:'2025-07-01',lot:'20.08 acres',url:'https://www.compass.com/homedetails/18024-Pellisier-Rd-Tehachapi-CA-93561/7CH4D_pid/',description:'A mountain ranch with room to breathe. Set on more than 20 acres in Cummings Valley, this home brings together expansive views, a wraparound deck, and a barn with horse stalls.'},
  {id:'crestline',address:'2574 Crestline Drive',city:'Lemon Grove',zip:'91945',region:'San Diego County',price:720000,beds:3,baths:2,sqft:1310,date:'2026-01-26',url:'https://www.compass.com/homedetails/2574-Crestline-Dr-Lemon-Grove-CA-91945/1BRAEM_pid/'},
  {id:'woodshawn',address:'7318 Woodshawn Drive',city:'San Diego',zip:'92114',region:'San Diego County',price:785000,beds:3,baths:2,sqft:1320,date:'2025-09-15',url:'https://www.compass.com/homedetails/7318-Woodshawn-Dr-San-Diego-CA-92114/1BQLKW_pid/'},
  {id:'sheridan',address:'10618 Sheridan Street',city:'California City',zip:'93505',region:'Kern County',price:345000,beds:4,baths:2,sqft:1705,date:'2025-06-06',url:'https://www.compass.com/homedetails/10618-Sheridan-St-California-City-CA-93505/3AGPC_pid/'},
  {id:'mendiburu',address:'9664 Mendiburu Road',city:'California City',zip:'93505',region:'Kern County',price:359000,beds:4,baths:2,sqft:2246,date:'2024-01-12',url:'https://www.compass.com/homedetails/9664-Mendiburu-Rd-California-City-CA-93505/3A34E_pid/'},
  {id:'alsab',address:'17400 Alsab Place',city:'Stallion Springs',zip:'93561',region:'Kern County',price:390000,beds:3,baths:2,sqft:1507,date:'2023-10-30',url:'https://www.compass.com/homedetails/17400-Alsab-Pl-Stallion-Springs-CA-93561/79KNH_pid/'},
  {id:'windsong',address:'21213 Windsong Street',city:'California City',zip:'93505',region:'Kern County',price:305000,beds:3,baths:2.5,sqft:1591,date:'2023-09-08',url:'https://www.compass.com/homedetails/21213-Windsong-St-California-City-CA-93505/33YSW_pid/'},
];
export const money = value => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(value);
export const soldDate = value => new Date(value+'T12:00:00').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
