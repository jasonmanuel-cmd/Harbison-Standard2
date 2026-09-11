import {propertySchema} from '../src/propertySchema.js';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {loadEnvFile} from 'node:process';
import {routes,jsonLdFor,siteUrl,ogImage} from '../src/seo.js';
import propertiesHandler from '../api/properties.mjs';
import {staticProperties} from '../src/propertyApi.js';
import {createServer} from 'vite';
import {createElement} from 'react';
import {renderToString} from 'react-dom/server';

if(existsSync('.env'))loadEnvFile('.env');
const template=readFileSync('dist/client/index.html','utf8');
const escape=value=>String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const json=value=>JSON.stringify(value).replaceAll('<','\\u003c');
function page(path,meta,schemas=[],photo=ogImage,property=null){
 let html=template.replace(/<title>.*?<\/title>/,'<title>'+escape(meta.title)+'</title>');
 const fields={'name="description"':meta.description,'property="og:title"':meta.title,'property="og:description"':meta.description,'property="og:url"':siteUrl+path,'property="og:image"':photo,'name="twitter:title"':meta.title,'name="twitter:description"':meta.description,'name="twitter:image"':photo,'name="robots"':meta.robots||'index, follow'};
 for(const [field,value] of Object.entries(fields))html=html.replace(new RegExp('(<meta '+field+' content=")[^"]*("[^>]*>)'),(_,a,b)=>a+escape(value||'')+b);
 html=html.replace(/(<link rel="canonical" href=")[^"]*/,(_,a)=>a+escape(siteUrl+path));
 html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 html=html.replace('</head>',schemas.map(x=>'<script type="application/ld+json" data-seo-jsonld="true">'+json(x)+'</script>').join('\n')+'\n</head>');
 if(property){
  const content=renderToString(createElement(App,{initialPath:path,initialProperty:property}));
  html=html.replace('<div id="root"></div>',()=>'<div id="root">'+content+'</div>');
  html=html.replace('</body>',()=>'<script id="hs-property-data" type="application/json">'+json(property)+'</script></body>');
 }
 const directory='dist/client'+(path==='/'?'':path);
 mkdirSync(directory,{recursive:true});writeFileSync(directory+'/index.html',html);
}
for(const [path,meta] of Object.entries(routes))page(path,meta,jsonLdFor(path));
const response=await propertiesHandler.fetch(new Request('https://localhost/api/properties'));
if(!response.ok)throw new Error('Cannot create property previews: property database unavailable');
const {properties}=await response.json();
const propertyPaths=[];
const publishedProperties=[...properties,...staticProperties.filter(p=>!properties.some(row=>row.slug===p.slug))];
const renderer=await createServer({server:{middlewareMode:true,warmup:{clientFiles:[]}},appType:'custom'});
const {App}=await renderer.ssrLoadModule('/src/App.jsx');
try {
for(const p of publishedProperties){
 if(!/^[a-z0-9-]+$/i.test(p.slug))throw new Error('Invalid property slug for output');
 const path='/property/'+p.slug;propertyPaths.push(path);
 const photo=p.imageUrl?new URL(p.imageUrl,siteUrl).href:ogImage;
 const description=p.description||p.context||'Past sale shown for reference; not currently offered for sale.';
 page(path,{title:p.address+' | '+p.status+' | Harbison Standard',description},[propertySchema(p,siteUrl)],photo,p);
}
const notFound=template.replace(/<title>.*?<\/title>/,'<title>Page not found | Harbison Standard</title>').replace(/(<meta name="robots" content=")[^"]*/, '$1noindex, follow').replace('<div id="root"></div>',()=>'<div id="root">'+renderToString(createElement(App,{initialPath:'/not-found'}))+'</div>');
writeFileSync('dist/client/404.html',notFound);
} finally {await renderer.close();}
const paths=[...Object.keys(routes).filter(p=>p!=='/hq'),...propertyPaths];
writeFileSync('dist/client/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(path=>'<url><loc>'+escape(siteUrl+path)+'</loc></url>').join('')+'</urlset>');
console.log('Prepared metadata for '+paths.length+' public routes and private HQ.');

const imageEntries=publishedProperties.map(p=>({path:'/property/'+p.slug,images:[...new Set([p.imageUrl,...(p.images||[])].filter(Boolean))]}));
imageEntries.unshift({path:'/',images:[ogImage]});
writeFileSync('dist/client/sitemap-images.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'+imageEntries.filter(e=>e.images.length).map(e=>'<url><loc>'+escape(siteUrl+e.path)+'</loc>'+e.images.map(image=>'<image:image><image:loc>'+escape(new URL(image,siteUrl).href)+'</image:loc></image:image>').join('')+'</url>').join('')+'</urlset>');
