import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

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
 }
});

test('crawlers may fetch public property data while private endpoints remain disallowed',()=>{
 const robots=readFileSync('public/robots.txt','utf8');
 assert.match(robots,/Disallow: \/api\//);
 assert.match(robots,/Allow: \/api\/properties/);
 assert.match(robots,/Disallow: \/hq/);
});
