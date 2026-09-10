import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

test('Apollo ships its visible content and public hydration data in the initial HTML',()=>{
 const html=readFileSync('dist/client/property/3304-apollo-st-bakersfield-ca/index.html','utf8');
 const body=html.split('<div id="root">')[1]?.split('<script id="hs-property-data"')[0];
 assert.ok(body?.includes('<h1>3304 Apollo St</h1>'));
 for(const text of ['$299,999.99','1,305','6,664','Request early information','/assets/apollo/streetview.jpg'])assert.ok(body.includes(text),text);
 assert.ok(!body.includes('Loading <em>property details'));
 const data=JSON.parse(html.match(/<script id="hs-property-data" type="application\/json">([\s\S]*?)<\/script>/)[1]);
 assert.equal(data.slug,'3304-apollo-st-bakersfield-ca');
 assert.equal(data.price,299999.99);
 assert.ok(!('notes' in data));
});

test('crawlers may fetch public property data while private endpoints remain disallowed',()=>{
 const robots=readFileSync('public/robots.txt','utf8');
 assert.match(robots,/Disallow: \/api\//);
 assert.match(robots,/Allow: \/api\/properties/);
 assert.match(robots,/Disallow: \/hq/);
});
