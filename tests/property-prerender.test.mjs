import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {getProperties,isAvailableProperty} from '../src/propertyApi.js';

test('homepage and current listings include every published available property in initial HTML',()=>{
 for(const path of ['', '/properties']){
  const html=readFileSync('dist/client'+path+'/index.html','utf8');
  const match=html.match(/<script id="hs-inventory-data" type="application\/json">([\s\S]*?)<\/script>/);
  assert.ok(match,'public inventory snapshot exists');
  const inventory=JSON.parse(match[1]);
  const visible=html.split('<script id="hs-inventory-data"')[0];
  for(const p of inventory.filter(isAvailableProperty))assert.ok(visible.includes('href="/property/'+p.slug+'"'),p.address+' has a visible property link');
  assert.ok(!visible.includes('Loading current listings'));
  assert.ok(!visible.includes('Loading properties'));
  assert.equal((visible.match(/<h1[ >]/g)||[]).length,1);
 }
});

test('an empty live inventory never revives stale listings; an outage retains the public snapshot',async t=>{
 const snapshot=[{slug:'published-property',status:'For Sale'}];
 t.mock.method(globalThis,'fetch',async()=>Response.json({properties:[]}));
 assert.deepEqual(await getProperties(snapshot),[]);
 t.mock.restoreAll();
 t.mock.method(globalThis,'fetch',async()=>{throw new Error('offline');});
 assert.deepEqual(await getProperties(snapshot),snapshot);
 assert.ok(!(await getProperties()).some(isAvailableProperty));
});

test('published properties ship visible content and public hydration data',()=>{
 const sitemap=readFileSync('dist/client/sitemap.xml','utf8');
 const paths=[...sitemap.matchAll(new RegExp('<loc>https://www[.]harbisonstandard[.]com(/property/[^<]+)</loc>','g'))].map(m=>m[1]);
 assert.ok(paths.length>0,'published property pages exist');
 assert.ok(!sitemap.includes('3304-apollo-st'),'Apollo remains unpublished');
 for(const path of paths){
  const html=readFileSync('dist/client'+path+'/index.html','utf8');
  const match=html.match(new RegExp('<script id="hs-property-data" type="application/json">([\\s\\S]*?)</script>'));
  assert.ok(match,path+' has hydration data');
  const data=JSON.parse(match[1]);
  const body=html.split('<div id="root">')[1]?.split('<script id="hs-property-data"')[0];
  assert.ok(body?.includes('<h1>'),path+' has visible heading');
  assert.ok(!body.includes('Loading <em>property details'),path+' is not a loading shell');
  assert.equal('/property/'+data.slug,path);
  assert.ok(!('notes' in data));
  for(const src of [data.imageUrl,...(data.images||[])].filter(src=>src?.startsWith('/assets/')))assert.ok(existsSync('dist/client'+src),path+' image exists: '+src);
 }
});

test('crawlers may fetch public property data while private endpoints remain disallowed',()=>{
 const robots=readFileSync('public/robots.txt','utf8');
 assert.match(robots,/Disallow: \/api\//);
 assert.match(robots,/Allow: \/api\/properties/);
 assert.match(robots,/Disallow: \/hq/);
});
