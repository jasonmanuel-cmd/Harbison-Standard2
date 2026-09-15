import {json, readJson} from './lib/auth.mjs';
import {supabaseRest, supabaseConfigured} from './lib/supabase.mjs';

// Public write-only intake; HQ reads still require authentication.
const headers = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','X-Robots-Tag':'noindex, nofollow'};
const reply = (body, status = 200) => json(body, {status, headers});
async function handler(request) {
  if (request.method === 'OPTIONS') return new Response(null, {status:204, headers});
  if (request.method !== 'POST') return reply({success:false,error:'Method not allowed'},405);
  const body = await readJson(request);
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply({success:false,error:'Invalid JSON object'},400);
  const limits = {name:100,email:200,phone:40,property:200,location:200,source:200,date_time:100,submission_date:100};
  const data = {};
  for (const [key,max] of Object.entries(limits)) {
    if (typeof body[key] !== 'string' || !body[key].trim() || body[key].length > max) return reply({success:false,error:'Invalid or missing '+key},400);
    data[key] = body[key].trim();
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || !Number.isFinite(Date.parse(data.submission_date))) return reply({success:false,error:'Invalid email or submission_date'},400);
  const lead = {name:data.name,email:data.email.toLowerCase(),phone:data.phone,location:data.location,interest:data.property,source:data.source,goal:'Open house',status:'new',brand:'harbison_standard',message:JSON.stringify(data,null,2)};
  try {
    if (!supabaseConfigured()) throw new Error('CRM unavailable');
    const saved = await supabaseRest('leads', {method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(lead),signal:AbortSignal.timeout(8000)});
    if (!saved.ok) throw new Error('CRM rejected registration');
    return reply({success:true,message:'Registration recorded'});
  } catch {
    // Forms also fall back directly when this entire endpoint is unreachable.
    try {
      const backup = await fetch('https://formspree.io/f/xqpkdwrp', {method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:AbortSignal.timeout(8000),body:JSON.stringify({...data,_subject:'Harbison Standard - open house registration',_replyto:data.email})});
      if (backup.ok) return reply({success:true,message:'Registration received through backup',delivery:'formspree'});
    } catch { /* Return failure so forms retain inputs for retry. */ }
    return reply({success:false,error:'Unable to save registration. Please retry.'},503);
  }
}
export default {fetch:handler};
