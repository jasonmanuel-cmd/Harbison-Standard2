import {useState} from 'react';
import {ArrowRight,CheckCircle} from '@phosphor-icons/react';
import {captureAttribution} from './attribution';
import {trackEvent} from './analytics';
import {getSessionId} from './track';

const initial={name:'',phone:'',email:'',currentCity:'',desiredArea:'Bakersfield / Kern County',budget:'',bedrooms:'',acreageRequirement:'',propertyType:'Single-family home',timeline:'Within 3 months',financingStatus:'Not sure yet',hasPropertyToSell:'no'};

export function BuyerIntentForm({propertyId=null,source='buyer-intent',earlyInterest=false}) {
 const [data,setData]=useState(initial),[status,setStatus]=useState('idle'),[notice,setNotice]=useState(''),[started,setStarted]=useState(false);
 const update=e=>setData({...data,[e.target.name]:e.target.value});
 const markStarted=()=>{if(started)return;setStarted(true);trackEvent('form_start',{form_name:'buyer_profile',lead_source:source,property_id:propertyId||undefined})};
 async function submit(e){
  e.preventDefault(); if(status==='sending')return; setStatus('sending');setNotice('');
  const attribution=captureAttribution();
  try{
   const res=await fetch('/api/buyer-lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...data,hasPropertyToSell:data.hasPropertyToSell==='yes',propertyId,source,sessionId:getSessionId(),...attribution})});
   if(!res.ok)throw new Error('send');
   const result=await res.json();
   if(result.notificationSent===false)setNotice('Your inquiry is saved, but the email notification could not be delivered. For a prompt response, call or text (661) 472-7499.');
   setStatus('success');
   const eventData={lead_source:source,property_id:propertyId||undefined,desired_area:data.desiredArea,property_type:data.propertyType,timeline:data.timeline};
   trackEvent('form_complete',{form_name:'buyer_profile',...eventData});
   trackEvent('buyer_profile_complete',eventData);
   trackEvent('generate_lead',eventData);
  }catch{setStatus('error');setNotice('We couldn’t save your request. Please call or text Nathanael at (661) 472-7499.');}
 }
 if(status==='success')return <div className="lead-card buyer-lead-card"><h3 className="success-heading"><CheckCircle className="success-icon"/>Your request is in.</h3><p className="form-intro">Nathanael has the details you shared and can follow up about the right properties and next steps.</p>{notice&&<p className="form-notice" role="status">{notice}</p>}</div>;
 return <form className="lead-card buyer-lead-card" onSubmit={submit} onFocusCapture={markStarted}><p className="eyebrow">Buyer profile</p><h3>Tell us what you’re looking for.</h3><p className="form-intro">This gives Nathanael enough context to send relevant options instead of generic listings.</p><div className="form-fields">
 <label>Full name <span>*</span><input required name="name" autoComplete="name" value={data.name} onChange={update}/></label>
 <label>Phone <span>*</span><input required name="phone" type="tel" autoComplete="tel" value={data.phone} onChange={update}/></label>
 <label>Email <span>*</span><input required name="email" type="email" autoComplete="email" value={data.email} onChange={update}/></label>
 <label>Current city<input name="currentCity" autoComplete="address-level2" value={data.currentCity} onChange={update}/></label>
 <label>Desired area<input name="desiredArea" value={data.desiredArea} onChange={update}/></label>
 <label>Budget<input name="budget" placeholder="$400k–$550k" value={data.budget} onChange={update}/></label>
 <label>Bedrooms<select name="bedrooms" value={data.bedrooms} onChange={update}><option value="">No minimum yet</option>{['1+','2+','3+','4+','5+'].map(v=><option key={v}>{v}</option>)}</select></label>
 <label>Acreage / lot requirement<select name="acreageRequirement" value={data.acreageRequirement} onChange={update}>{['','Standard lot','Large lot','0.5+ acre','1+ acre','2+ acres','5+ acres','10+ acres','Not sure'].map(v=><option key={v} value={v}>{v||'No requirement yet'}</option>)}</select></label>
 <label>Property type<select name="propertyType" value={data.propertyType} onChange={update}>{['Single-family home','Land / acreage','Condo / townhome','Investment property','Open to options'].map(v=><option key={v}>{v}</option>)}</select></label>
 <label>Timeline<select name="timeline" value={data.timeline} onChange={update}>{['As soon as possible','Within 3 months','3–6 months','6–12 months','Just researching'].map(v=><option key={v}>{v}</option>)}</select></label>
 <label>Financing status<select name="financingStatus" value={data.financingStatus} onChange={update}>{['Pre-approved','Talking with a lender','Cash buyer','Need a lender introduction','Not sure yet'].map(v=><option key={v}>{v}</option>)}</select></label>
 <label>Another property to sell?<select name="hasPropertyToSell" value={data.hasPropertyToSell} onChange={update}><option value="no">No</option><option value="yes">Yes</option></select></label>
 </div><div className="form-actions"><button className="gold" type="submit" disabled={status==='sending'}>{status==='sending'?'Sending…':earlyInterest?'Request early information':'Get matched with properties'}{status!=='sending'&&<ArrowRight/>}</button></div>{notice&&<p className="form-notice" role="alert">{notice}</p>}<p className="form-privacy">No mailing-list signup. Your information is used to respond to this real-estate request.</p></form>;
}
