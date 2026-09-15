import test from 'node:test';
import assert from 'node:assert/strict';
import buyerLead from '../api/buyer-lead.mjs';
import lead from '../api/lead.mjs';
import leads from '../api/leads.mjs';
import stats from '../api/stats.mjs';
import properties from '../api/properties.mjs';

test('private buyer endpoints reject unauthenticated access before database access', async t => {
  t.mock.method(globalThis,'fetch',()=>{throw new Error('Database must not be accessed');});
  for(const [path,handler] of [['lead',lead],['leads',leads],['stats',stats]]) {
    const r=await handler.fetch(new Request('https://example.test/api/'+path+'?backend=supabase'));
    assert.equal(r.status,401);
  }
});

test('public property responses omit internal columns',async t=>{
  process.env.SUPABASE_URL='https://example.test';
  process.env.SUPABASE_SERVICE_ROLE_KEY='test-key';
  t.mock.method(globalThis,'fetch',async()=>Response.json([{id:'example',slug:'example',status:'Coming Soon',address:'Example',internal_notes:'private',owner_email:'private@example.test'}]));
  const r=await properties.fetch(new Request('https://example.test/api/properties'));
  const data=await r.json();
  assert.equal(data.properties[0].status,'Coming Soon');
  assert.equal('internal_notes' in data.properties[0],false);
  assert.equal('owner_email' in data.properties[0],false);
});

test('saved inquiry stays successful when email delivery fails',async t=>{
  process.env.SUPABASE_URL='https://example.test';
  process.env.SUPABASE_SERVICE_ROLE_KEY='test-key';
  t.mock.method(console,'error',()=>{});
  const calls=[];
  t.mock.method(globalThis,'fetch',async(url,options)=>{
    calls.push({url,body:JSON.parse(options.body)});
    return calls.length===1?Response.json([{id:'test-id'}],{status:201}):Response.json({error:'unavailable'},{status:503});
  });
  const r=await buyerLead.fetch(new Request('https://example.test/api/buyer-lead',{method:'POST',body:JSON.stringify({name:'Test',email:'test@example.test',phone:'2025550100',bedrooms:'3+'})}));
  assert.equal(r.status,201);
  assert.deepEqual(await r.json(),{ok:true,id:'test-id',notificationSent:false});
  assert.equal(calls[0].body.bedrooms,3);
  assert.equal(calls.length,2);
});
