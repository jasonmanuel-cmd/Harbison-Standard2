import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import lead from '../api/lead.mjs';
import track from '../api/track.mjs';
import {propertySchema} from '../src/propertySchema.js';
const id='11111111-1111-4111-8111-111111111111';
const setup=()=>{process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_SERVICE_ROLE_KEY='test';process.env.ADMIN_TOKEN='test-admin';};
const request=(method,body,admin=true)=>new Request('https://example.test/api/lead?id='+id,{method,headers:admin?{Authorization:'Bearer test-admin'}:{},...(body?{body:JSON.stringify(body)}:{})});
test('manual inquiry saves buyer fields and notes, and requires admin',async t=>{
 setup();let saved;
 t.mock.method(globalThis,'fetch',async(url,options)=>{saved=JSON.parse(options.body);return Response.json([{id}],{status:201});});
 const body={source:'manual',name:'Test',email:'TEST@example.com',desired_area:'Bakersfield',budget:'300000',bedrooms:'3',timeline:'Soon',status:'qualified',notes:'Follow up'};
 assert.equal((await lead.fetch(request('POST',body,false))).status,401);
 assert.equal(saved,undefined);
 assert.equal((await lead.fetch(request('POST',body))).status,201);
 assert.equal(saved.bedrooms,3);assert.equal(saved.notes,'Follow up');assert.equal(saved.status,'qualified');assert.equal(saved.desired_area,'Bakersfield');assert.equal(saved.email,'test@example.com');
});
test('seller inquiry retains original goal and message on readback without a session',async t=>{
 setup();let calls=0;
 t.mock.method(globalThis,'fetch',async()=>{calls++;return Response.json([{id,name:'Test',goal:'Selling',message:'Inherited home',location:'Tehachapi',timing:'Soon',session_id:null}]);});
 const r=await lead.fetch(request('GET'));const data=await r.json();
 assert.equal(data.lead.goal,'Selling');assert.equal(data.lead.message,'Inherited home');assert.equal(data.lead.location,'Tehachapi');assert.deepEqual(data.visits,[]);assert.equal(calls,1);
});
test('invalid edits fail before database access and empty bedrooms become null',async t=>{
 setup();let saved;
 t.mock.method(globalThis,'fetch',async(url,options)=>{saved=JSON.parse(options.body);return Response.json([{id}]);});
 for(const change of [{email:'bad'},{name:''},{bedrooms:'3.5'},{status:'invalid'}])assert.equal((await lead.fetch(request('PATCH',{id,...change}))).status,400);
 assert.equal(saved,undefined);
 assert.equal((await lead.fetch(request('PATCH',{id,bedrooms:''}))).status,200);assert.equal(saved.bedrooms,null);
});
test('tracking uses one atomic RPC, rejects failed writes, and excludes HQ',async t=>{
 setup();const calls=[];
 t.mock.method(globalThis,'fetch',async(url,options)=>{calls.push({url,body:JSON.parse(options.body)});return new Response(null,{status:503});});
 const req=path=>new Request('https://example.test/api/track',{method:'POST',body:JSON.stringify({sessionId:id,path,utmContent:'clip-1'})});
 assert.equal((await track.fetch(req('/hq'))).status,200);assert.equal(calls.length,0);
 assert.equal((await track.fetch(req('/properties'))).status,502);assert.equal(calls.length,1);assert.ok(calls[0].url.endsWith('/rpc/record_hs_visit'));assert.equal(calls[0].body.p_utm_content,'clip-1');
});
test('analytics loads each provider once and never on HQ',()=>{
 const source=readFileSync('src/analytics.js','utf8').replaceAll('export function','function').replaceAll('import.meta.env','({})');
 for(const path of ['/properties','/hq','/hq/']){
  const scripts=[];const window={location:{pathname:path}};
  const context={window,document:{querySelector:()=>null,createElement:()=>({}),head:{appendChild:s=>scripts.push(s)}},Date,encodeURIComponent};
  runInNewContext(source+';initAnalytics();initAnalytics();',context);
  assert.equal(scripts.length,path==='/properties'?2:0);
  if(path==='/properties')assert.equal(window.dataLayer.filter(x=>x[0]==='config').length,1);
 }
 assert.ok(!readFileSync('index.html','utf8').includes('googletagmanager.com'));
});
test('land schema omits house measurements and published image sitemap excludes Apollo',()=>{
 const schema=propertySchema({slug:'land',address:'Land',propertyType:'Vacant Land',beds:0,baths:0,sqft:0},'https://example.test');
 assert.equal(schema.about['@type'],'Place');assert.ok(!('numberOfBedrooms' in schema.about));
 const map=readFileSync('dist/client/sitemap-images.xml','utf8');assert.ok(!map.includes('apollo'));assert.ok(map.includes('mariposa'));
 const fallback=readFileSync('dist/client/404.html','utf8');assert.ok(fallback.includes('noindex, follow'));assert.ok(fallback.includes('Page not found'));
});
