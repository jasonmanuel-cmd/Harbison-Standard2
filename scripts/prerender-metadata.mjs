import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {loadEnvFile} from 'node:process';
import {routes,jsonLdFor,siteUrl,ogImage} from '../src/seo.js';
import propertiesHandler from '../api/properties.mjs';
import {staticProperties} from '../src/propertyApi.js';

if(existsSync('.env'))loadEnvFile('.env');
const template=readFileSync('dist/client/index.html','utf8');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
function page(path,meta,schemas=[],photo=ogImage){
 let html=template.replace(/<title>.*?<\/title>/,'<title>'+escape(meta.title)+'</title>');
 const fields={'name="description"':meta.description,'property="og:title"':meta.title,'property="og:description"':meta.description,'property="og:url"':siteUrl+path,'property="og:image"':photo,'name="twitter:title"':meta.title,'name="twitter:description"':meta.description,'name="twitter:image"':photo,'name="robots"':meta.robots||'index, follow'};
 for(const [field,value] of Object.entries(fields))html=html.replace(new RegExp('(<meta '+field+' content=")[^"]*("[^>]*>)'),(_,a,b)=>a+escape(value||'')+b);
 html=html.replace(/(<link rel="canonical" href=")[^"]*/,(_,a)=>a+escape(siteUrl+path));
 html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 html=html.replace('</head>',schemas.map(x=>'<script type="application/ld+json" data-seo-jsonld="true">'+json(x)+'</script>').join('\n')+'\n</head>');
 const directory='dist/client'+(path==='/'?'':path);
 mkdirSync(directory,{recursive:true});writeFileSync(directory+'/index.html',html);
}
for(const [path,meta] of Object.entries(routes))page(path,meta,jsonLdFor(path));
const response=await propertiesHandler.fetch(new Request('https://localhost/api/properties'));
if(!response.ok)throw new Error('Cannot create property previews: property database unavailable');
const {properties}=await response.json();
const propertyPaths=[];
const publishedProperties=[...properties,...staticProperties.filter(p=>!properties.some(row=>row.slug===p.slug))];
for(const p of publishedProperties){
 if(!/^[a-z0-9-]+$/i.test(p.slug))throw new Error('Invalid property slug for output');
 const path='/property/'+p.slug;propertyPaths.push(path);
 const photo=p.imageUrl?new URL(p.imageUrl,siteUrl).href:ogImage;
 page(path,{title:p.address+' | '+p.status+' | Harbison Standard',description:p.description},[{'@context':'https://schema.org','@type':'RealEstateListing',name:p.address,url:siteUrl+path,description:p.description,image:photo,offers:{'@type':'Offer',price:p.price,priceCurrency:'USD'},about:{'@type':'SingleFamilyResidence',numberOfBedrooms:p.beds,numberOfBathroomsTotal:p.baths,floorSize:{'@type':'QuantitativeValue',value:p.sqft,unitCode:'FTK'},address:{'@type':'PostalAddress',streetAddress:p.address,addressLocality:p.city,addressRegion:p.state,postalCode:p.zip,addressCountry:'US'}}}],photo);
}
const paths=[...Object.keys(routes).filter(p=>p!=='/hq'),...propertyPaths];
writeFileSync('dist/client/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+escape(siteUrl+path)+'</loc></url>').join('')+'</urlset>');
console.log('Prepared metadata for '+paths.length+' public routes and private HQ.');
