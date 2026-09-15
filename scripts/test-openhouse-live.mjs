import {execFileSync} from 'node:child_process';
import assert from 'node:assert/strict';
import {supabaseRest} from '../api/lib/supabase.mjs';
const url=process.argv[2]||'http://localhost:5173/hq/api/openhouse';
assert.equal(new URL(process.env.SUPABASE_URL).hostname,'pebqmuumwygrpjofdwfy.supabase.co');
const schema=await supabaseRest('leads?select=id,name,email,phone,location,interest,source,goal,status,brand,message&limit=0');
assert.equal(schema.status,200,'Confirm the existing Harbison columns before testing');
const email='openhouse-test-'+Date.now()+'@example.com';
const data={name:'Disposable Open House Test',email,phone:'2025550100',property:'585 N Wendy Dr, Newbury Park, CA 91320',location:'585 N Wendy Dr, Newbury Park, CA 91320',source:'Open House Integration Test',date_time:'09/12/2026 2:45:30 PM',submission_date:new Date().toISOString()};
const path='leads?email=eq.'+encodeURIComponent(email)+'&brand=eq.harbison_standard';
try {
  const output=execFileSync('curl.exe',['--silent','--show-error','--max-time','45','-X','POST',url,'-H','Content-Type: application/json','--data-binary','@-'],{input:JSON.stringify(data),encoding:'utf8'});
  console.log('cURL response:',output);
  assert.deepEqual(JSON.parse(output),{success:true,message:'Registration recorded'});
  const response=await supabaseRest(path+'&select=id,message');
  assert.equal(response.status,200);
  const rows=await response.json();assert.equal(rows.length,1);
  assert.deepEqual(JSON.parse(rows[0].message),data);
  console.log('Verified all eight fields in Harbison Supabase.');
} finally {
  const removed=await supabaseRest(path,{method:'DELETE'});
  assert.ok(removed.ok,'Test-record cleanup failed');
  console.log('Disposable test record removed.');
}
