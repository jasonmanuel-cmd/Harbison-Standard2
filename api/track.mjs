import {json,readJson} from './lib/auth.mjs';
import {supabaseConfigured,supabaseRest,supabaseNotConfigured} from './lib/supabase.mjs';
const text=(v,n)=>String(v??'').slice(0,n);
async function handler(request){
 if(request.method!=='POST')return json({error:'Method not allowed'},{status:405});
 if(!supabaseConfigured())return supabaseNotConfigured();
 const body=await readJson(request);const sid=text(body?.sessionId,100),path=text(body?.path,255);
 if(!/^[a-zA-Z0-9-]{1,100}$/.test(sid)||!path.startsWith('/')||path.startsWith('//'))return json({error:'Valid sessionId and path are required'},{status:400});
 if(/^\/hq(?:\/|\?|$)/i.test(path))return json({ok:true,skipped:true});
 try{
  const response=await supabaseRest('rpc/record_hs_visit',{method:'POST',body:JSON.stringify({p_session_id:sid,p_path:path,p_referrer:text(body.referrer,500),p_utm_source:text(body.utmSource,200),p_utm_medium:text(body.utmMedium,200),p_utm_campaign:text(body.utmCampaign,200),p_utm_term:text(body.utmTerm,200),p_utm_content:text(body.utmContent,200)})});
  if(!response.ok)return json({error:'Visit could not be saved'},{status:502});
  return json({ok:true},{status:201});
 }catch{return json({error:'Visit could not be saved'},{status:502});}
}
export default {fetch:handler};
