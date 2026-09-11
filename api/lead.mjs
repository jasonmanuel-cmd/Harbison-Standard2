import {supabaseConfigured,supabaseRest,supabaseNotConfigured} from './lib/supabase.mjs';
import {buyerDetail} from './lib/buyer-crm.mjs';
import {json,isAdmin,readJson} from './lib/auth.mjs';
import {leadFields} from './lib/lead-fields.mjs';
async function handler(request){
 if(!['GET','POST','PATCH'].includes(request.method))return json({error:'Method not allowed'},{status:405});
 if(request.method!=='POST'){
  if(!isAdmin(request))return json({error:'Unauthorized'},{status:401});
  if(!supabaseConfigured())return supabaseNotConfigured();
  return buyerDetail(request);
 }
 if(!supabaseConfigured())return supabaseNotConfigured();
 const body=await readJson(request);
 const manual=body?.source==='manual';
 if(manual&&!isAdmin(request))return json({error:'Unauthorized'},{status:401});
 let fields;
 try{fields=leadFields(body,{required:true});}catch(error){return json({error:error.message},{status:400});}
 if(!manual){delete fields.notes;fields.status='new';}
 const lead={...fields,session_id:String(body.sessionId||'').slice(0,100)||null,source:String(body.source||'website').slice(0,100),goal:fields.goal||(manual?'Buying':'Something else'),brand:'harbison_standard'};
 try{
  const response=await supabaseRest('leads',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(lead)});
  if(!response.ok)return json({error:'Failed to save inquiry'},{status:502});
  const rows=await response.json();return json({ok:true,id:rows[0]?.id??null},{status:201});
 }catch{return json({error:'Failed to save inquiry'},{status:502});}
}
export default {fetch:handler};
