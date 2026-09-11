export function propertySchema(p,siteUrl){
 const land=/land|lot|acreage/i.test(p.propertyType||'');
 const address={'@type':'PostalAddress',streetAddress:p.address||'',addressLocality:p.city||'',addressRegion:p.state||'CA',postalCode:p.zip||'',addressCountry:'US'};
 const about=land?{'@type':'Place',name:p.address,address}:{'@type':/single/i.test(p.propertyType||'')?'SingleFamilyResidence':'Residence',address,...(p.beds?{numberOfBedrooms:p.beds}:{}),...(p.baths?{numberOfBathroomsTotal:p.baths}:{}),...(p.sqft?{floorSize:{'@type':'QuantitativeValue',value:p.sqft,unitCode:'FTK'}}:{})};
 return {'@context':'https://schema.org','@type':'RealEstateListing',name:p.address,url:siteUrl+'/property/'+p.slug,description:p.description||p.context||'Property information from Harbison Standard.',image:[...new Set([p.imageUrl,...(p.images||[])].filter(Boolean))].map(x=>new URL(x,siteUrl).href),offers:p.price&&!/^sold$/i.test(p.status)?{'@type':'Offer',price:p.price,priceCurrency:'USD'}:undefined,about};
}
