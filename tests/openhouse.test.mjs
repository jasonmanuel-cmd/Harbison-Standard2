import test from 'node:test';
import assert from 'node:assert/strict';
import endpoint from '../api/openhouse.mjs';
import {submitOpenHouse} from '../public/openhouse-submit.js';
const data={name:'Test User',email:'test@example.com',phone:'5551234567',property:'585 N Wendy Dr, Newbury Park, CA 91320',location:'585 N Wendy Dr, Newbury Park, CA 91320',source:'Open House QR Code',date_time:'09/12/2026 2:45:30 PM',submission_date:'2026-09-12T14:45:30.000Z'};
const request = body => new Request('https://www.harbisonstandard.com/hq/api/openhouse',{method:'POST',body:JSON.stringify(body)});
test('registration preserves every guide field and returns the expected contract',async t=>{
  process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_SERVICE_ROLE_KEY='test';
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    assert.match(url,/\/rest\/v1\/leads$/);
    const lead=JSON.parse(options.body);
    assert.deepEqual(JSON.parse(lead.message),data);
    assert.equal(lead.goal,'Open house');assert.equal(lead.brand,'harbison_standard');
    return new Response(null,{status:201});
  });
  assert.deepEqual(await (await endpoint.fetch(request(data))).json(),{success:true,message:'Registration recorded'});
});
test('database outage uses Formspree; dual outage returns a failure',async t=>{
  process.env.SUPABASE_URL='https://example.test';process.env.SUPABASE_SERVICE_ROLE_KEY='test';
  let backupWorks=true;
  t.mock.method(globalThis,'fetch',async url=>new Response(null,{status:String(url).includes('formspree')&&backupWorks?200:503}));
  assert.equal((await (await endpoint.fetch(request(data))).json()).delivery,'formspree');
  backupWorks=false;assert.equal((await endpoint.fetch(request(data))).status,503);
});
test('invalid requests never write; browser preflight succeeds and reads are unavailable',async t=>{
  t.mock.method(globalThis,'fetch',()=>{throw new Error('Unexpected write');});
  for(const body of [null,[],{}, {...data,email:'bad'}, {...data,property:4}])assert.equal((await endpoint.fetch(request(body))).status,400);
  assert.equal((await endpoint.fetch(new Request('https://example.test'))).status,405);
  assert.equal((await endpoint.fetch(new Request('https://example.test',{method:'OPTIONS'}))).status,204);
});
test('forms fall back on HTTP, network and non-JSON failures, and reject dual failure',async t=>{
  for(const failure of ['http','network','html']){
    let calls=0;
    t.mock.method(globalThis,'fetch',async()=>{
      if(++calls===2)return new Response(null,{status:200});
      if(failure==='network')throw new Error('offline');
      return failure==='html'?new Response('<html>'):Response.json({success:false},{status:503});
    });
    assert.equal((await submitOpenHouse(data)).delivery,'formspree');assert.equal(calls,2);
    t.mock.restoreAll();
  }
  t.mock.method(globalThis,'fetch',async()=>new Response(null,{status:503}));
  await assert.rejects(submitOpenHouse(data));
});
