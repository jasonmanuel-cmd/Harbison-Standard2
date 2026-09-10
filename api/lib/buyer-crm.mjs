import {supabaseRest} from './supabase.mjs';
import {json, readJson} from './auth.mjs';

const statuses = new Set(['new','contacted','qualified','closed']);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
async function rows(path, options) {
  const response = await supabaseRest(path, options);
  if (!response.ok) throw new Error('Buyer CRM request failed: '+response.status);
  const body = await response.text();
  return body ? JSON.parse(body) : [];
}
function normalize(row) {
  return {...row, goal:'Buying', location:row.desired_area || row.desired_city, timing:row.timeline,
    message:[['Current city',row.current_city],['Budget',row.budget],['Bedrooms',row.bedrooms],['Lot requirement',row.acreage_requirement],['Property type',row.property_type],['Financing',row.financing_status],['Property to sell',row.has_property_to_sell?'Yes':'No'],['Property ID',row.property_id],['Campaign',row.utm_campaign],['First source',row.first_utm_source],['Last source',row.last_utm_source]].filter(([,v])=>v!==null&&v!==undefined&&v!=='').map(([k,v])=>k+': '+v).join('\n')};
}
// Called only by existing routes after their isAdmin check.
export async function buyerList(request) {
  const url = new URL(request.url);
  const query = new URLSearchParams({select:'*',brand:'eq.harbison_standard',order:'created_at.desc',limit:String(Math.min(Math.max(Number(url.searchParams.get('limit'))||50,1),200))});
  const status = url.searchParams.get('status');
  if(status){if(!statuses.has(status))return json({error:'Invalid status'},{status:400});query.set('status','eq.'+status);}
  const q = (url.searchParams.get('q')||'').slice(0,100).replace(/[^a-zA-Z0-9 @._+-]/g,'');
  if(q)query.set('or',`(name.ilike.*${q}*,email.ilike.*${q}*)`);
  try{return json({leads:(await rows('leads?'+query)).map(normalize)});}catch{return json({error:'Unable to load buyer inquiries'},{status:502});}
}
export async function buyerDetail(request) {
  const body = request.method==='PATCH' ? await readJson(request) : null;
  const id = body?.id || new URL(request.url).searchParams.get('id');
  if(!uuid.test(id||''))return json({error:'Valid inquiry ID required'},{status:400});
  const path='leads?id=eq.'+id+'&brand=eq.harbison_standard';
  try {
    if(request.method==='PATCH'){
      const change={};
      const fields=['name','email','phone','current_city','desired_area','budget','bedrooms','acreage_requirement','property_type','timeline','financing_status','notes','status'];
      for(const f of fields){if(body[f]!==undefined)change[f]=body[f];}
      if(body.status!==undefined&&!statuses.has(body.status))return json({error:'Invalid status'},{status:400});
      if(!Object.keys(change).length)return json({error:'No changes supplied'},{status:400});
      const updated=await rows(path,{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(change)});
      return updated.length?json({ok:true}):json({error:'Not found'},{status:404});
    }
    const [lead]=await rows(path+'&select=*');
    if(!lead)return json({error:'Not found'},{status:404});
    // Fetch visits from Supabase
    const visits = await rows('visits?session_id=eq.'+lead.session_id+'&select=path,referrer,utm_source,utm_medium,utm_campaign,created_at&order=created_at.asc');
    return json({lead:normalize(lead),visits});
  }catch{return json({error:'Unable to access buyer inquiry'},{status:502});
}
export async function buyerStats() {
  async function count(status) {
    const r=await supabaseRest('leads?select=id&brand=eq.harbison_standard'+(status?'&status=eq.'+status:''),{method:'HEAD',headers:{Prefer:'count=exact'}});
    if(!r.ok)throw new Error('Count failed');
    return Number(r.headers.get('content-range')?.split('/')[1]||0);
  }
  async function sessionCount() {
    const r=await supabaseRest('sessions?select=id',{method:'HEAD',headers:{Prefer:'count=exact'}});
    if(!r.ok)return null;
    return Number(r.headers.get('content-range')?.split('/')[1]||0);
  }
  async function visitCount() {
    const r=await supabaseRest('visits?select=id',{method:'HEAD',headers:{Prefer:'count=exact'}});
    if(!r.ok)return null;
    return Number(r.headers.get('content-range')?.split('/')[1]||0);
  }
  try{const [totalLeads,newLeads,totalSessions,totalPageviews]=await Promise.all([count(),count('new'),sessionCount(),visitCount()]);return json({totalLeads,newLeads,totalSessions,totalPageviews,bySource:[],byStatus:[],dailyLeads:[]});}catch{return json({error:'Unable to load buyer stats'},{status:502});}
}
