import {useId,useRef,useState,useEffect} from 'react';
import {ArrowRight,ArrowLeft,HouseLine,Key,Hammer,ChartLineUp,ChatCircle,Envelope,Check,Copy,CheckCircle} from '@phosphor-icons/react';
import {agent} from './data';
import {getSessionId} from './track';
import {trackEvent} from './analytics';
const defaultGoals=[{name:'Buying',Icon:Key,copy:'Find my next home'},{name:'Selling',Icon:HouseLine,copy:'Plan my next move'},{name:'Investing',Icon:ChartLineUp,copy:'Explore an opportunity'},{name:'Something else',Icon:ChatCircle,copy:'Let’s talk it through'}];
const FORMSPREE='https://formspree.io/f/xqpkdwrp';
export function LeadForm({source,goalOptions=defaultGoals,messagePlaceholder="Your goals, price range, or questions…"}){
 const goals=goalOptions;
 const id=useId();
 const queryGoal=new URLSearchParams(window.location.search).get('goal');
 const [step,setStep]=useState(1),[data,setData]=useState({goal:goals.some(g=>g.name===queryGoal)?queryGoal:goals[0].name,name:'',email:'',phone:'',location:'',timing:'Just exploring',message:''}),[notice,setNotice]=useState(''),[status,setStatus]=useState('idle');
 const title=useRef(null),previousStep=useRef(step);
 useEffect(()=>{if(previousStep.current!==step)title.current?.focus();previousStep.current=step},[step]);
 const update=e=>{setData({...data,[e.target.name]:e.target.value});setNotice('')};
 const interest=data.goal.charAt(0).toLowerCase()+data.goal.slice(1);
 const body=`Hi Nathanael,\n\nI’m interested in ${interest}.\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone||'Not provided'}\nLocation: ${data.location||'Open to ideas'}\nTiming: ${data.timing}\n\n${data.message||'I’d like to talk about my next steps.'}\n\nSent from the Harbison Standard ${source}.`;
 const mailto=`mailto:${agent.email}?subject=${encodeURIComponent('Harbison Standard — '+data.goal+' inquiry')}&body=${encodeURIComponent(body)}`;
 async function copy(){try{await navigator.clipboard.writeText(body);setNotice('Message copied. Paste it into an email to '+agent.email+'.')}catch{setNotice('Copy is unavailable in this browser. You can select the message below and copy it manually.')}}
function recordLead(){
 fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:getSessionId(),source,goal:data.goal,interest,name:data.name,email:data.email,phone:data.phone||'Not provided',location:data.location||'Open to ideas',timing:data.timing,message:data.message||'I’d like to talk about my next steps.'})}).catch(()=>{});
}
async function submit(){
 if(status==='sending'||status==='success')return;
 setStatus('sending');setNotice('');
 recordLead();
 try{
  const res=await fetch(FORMSPREE,{method:'POST',headers:{'Accept':'application/json','Content-Type':'application/json'},body:JSON.stringify({_subject:'Harbison Standard — '+data.goal+' inquiry (from '+source+')',_replyto:data.email,_cc:agent.email,name:data.name,email:data.email,phone:data.phone||'Not provided',location:data.location||'Open to ideas',timing:data.timing,goal:data.goal,interest,message:data.message||'I’d like to talk about my next steps.'})});
  if(!res.ok)throw new Error('network');
  setStatus('success');
  trackEvent('form_complete',{form_name:'general_inquiry',lead_source:source,goal:data.goal});
  trackEvent('generate_lead',{form_name:'general_inquiry',lead_source:source,goal:data.goal});
 }catch{setStatus('error');setNotice('We couldn’t send your inquiry. Please try again, or use the email draft below.')}
}
 return <div className="lead-card">
  <div className="form-progress" aria-label={`Step ${step===4?3:step} of 3`}><span>{String(step===4?3:step).padStart(2,'0')} / 03</span><ol>{['Your goal','Your details','Review'].map((label,i)=><li key={label} className={step>=i+1?'reached':''} aria-current={step===i+1?'step':undefined}>{label}</li>)}</ol></div>
  {status==='success'?<>
   <h3 ref={title} tabIndex={-1} className="success-heading"><CheckCircle className="success-icon"/>Thanks, {data.name.split(' ')[0]} — your inquiry is on its way.</h3>
   <p className="form-intro">Nathanael will be in touch using the details you shared.</p>
   <div className="form-actions"><a className="gold" href="/">Back to home <ArrowRight/></a></div>
  </>:step===1&&<><h3 ref={title} tabIndex={-1}>What’s your next move?</h3><p className="form-intro">Choose what brings you here. We’ll take it from there.</p><fieldset className="goal-options"><legend className="sr-only">I’m interested in</legend>{goals.map(({name,Icon,copy})=><label key={name} className={data.goal===name?'selected':''}><input type="radio" name={id+'-goal'} value={name} checked={data.goal===name} onChange={()=>setData({...data,goal:name})}/><Icon/><span><strong>{name}</strong><small>{copy}</small></span>{data.goal===name&&<Check className="goal-check"/>}</label>)}</fieldset><button className="gold form-next" onClick={()=>setStep(2)}>Continue <ArrowRight/></button></>}
  {status!=='success'&&step===2&&<form onSubmit={e=>{e.preventDefault();if(!data.name.trim()){e.currentTarget.elements.name.setCustomValidity('Please enter your name.');e.currentTarget.elements.name.reportValidity();return}setStep(3)}}><h3 ref={title} tabIndex={-1}>A little about you.</h3><p className="form-intro">Interested in {interest}. Name and email are required.</p><div className="form-fields"><label htmlFor={id+'-name'}>Full name <span>*</span><input id={id+'-name'} name="name" autoComplete="name" required maxLength={100} value={data.name} onChange={e=>{e.target.setCustomValidity('');update(e)}} placeholder="Your name"/></label><label htmlFor={id+'-email'}>Email <span>*</span><input id={id+'-email'} name="email" type="email" autoComplete="email" required maxLength={200} value={data.email} onChange={update} placeholder="you@example.com"/></label><label htmlFor={id+'-phone'}>Phone <small>(optional)</small><input id={id+'-phone'} name="phone" type="tel" autoComplete="tel" maxLength={30} value={data.phone} onChange={update} placeholder="(555) 123-4567"/></label><label htmlFor={id+'-location'}>City or area <small>(optional)</small><input id={id+'-location'} name="location" autoComplete="address-level2" maxLength={120} value={data.location} onChange={update} placeholder="Where are you considering?"/></label><label className="full-field" htmlFor={id+'-timing'}>When are you thinking?<select id={id+'-timing'} name="timing" value={data.timing} onChange={update}>{['Just exploring','As soon as possible','Within 3 months','3–6 months','6+ months'].map(t=><option key={t}>{t}</option>)}</select></label><label className="full-field" htmlFor={id+'-message'}>What should Nathanael know? <small>(optional)</small><textarea id={id+'-message'} name="message" rows={3} maxLength={1500} value={data.message} onChange={update} placeholder={messagePlaceholder}/></label></div><div className="form-actions"><button type="button" className="back-link" onClick={()=>setStep(1)}><ArrowLeft/> Back</button><button className="gold" type="submit">Review inquiry <ArrowRight/></button></div></form>}
  {status!=='success'&&step===3&&<><h3 ref={title} tabIndex={-1}>Let’s make an introduction.</h3><p className="form-intro">Review your message, then send it to Nathanael. It’s delivered securely through this site.</p><dl className="inquiry-review"><div><dt>Your goal</dt><dd>{data.goal}</dd></div><div><dt>Name</dt><dd>{data.name}</dd></div><div><dt>Email</dt><dd>{data.email}</dd></div>{data.phone&&<div><dt>Phone</dt><dd>{data.phone}</dd></div>}<div><dt>Location</dt><dd>{data.location||'Open to ideas'}</dd></div><div><dt>Timing</dt><dd>{data.timing}</dd></div>{data.message&&<div><dt>Message</dt><dd>{data.message}</dd></div>}</dl><div className="form-actions"><button className="back-link" disabled={status==='sending'} onClick={()=>setStep(2)}><ArrowLeft/> Edit</button><button className="gold" onClick={submit} disabled={status==='sending'}>{status==='sending'?'Sending…':'Send inquiry'}{status==='sending'?<></>:<ArrowRight/>}</button></div><button className="copy-message" onClick={copy}><Copy/> Copy message instead</button><a className="email-draft" href={mailto} onClick={()=>setNotice('Your email app should open with your message. Send it there to complete your inquiry.')}><Envelope/> Open in email app</a><details className="message-preview"><summary>View full email message</summary><pre>{body}</pre></details></>}
  {notice&&<p className="form-notice" role={status==='error'?'alert':undefined}>{notice}</p>}
  <p className="form-privacy">{status==='success'?'Your inquiry has been sent.':status==='error'?'Your inquiry has not been sent yet.':'Your details stay in this form until you send your inquiry. No mailing-list signup.'}</p>
 </div>;
}
