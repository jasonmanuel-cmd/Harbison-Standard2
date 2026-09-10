import {useRef,useState} from 'react';
import {ArrowRight,CheckCircle,Copy,Envelope,Check} from '@phosphor-icons/react';
import {agent} from './data';
import {getSessionId} from './track';
const FORMSPREE='https://formspree.io/f/xqpkdwrp';
const goals=['Buying','Selling','Investing','Something else'];
export function QuickForm(){
 const [data,setData]=useState({name:'',contact:'',goal:goals[0],message:''});
 const [status,setStatus]=useState('idle');
 const [notice,setNotice]=useState('');
 const title=useRef(null);
 const update=e=>{setData({...data,[e.target.name]:e.target.value});setNotice('')};
 const isEmail=/.+@.+\..+/.test(data.contact.trim());
 const hasGoal=goals.some(g=>g===data.goal);
 const interest=(hasGoal?data.goal:'Something else').charAt(0).toLowerCase()+(hasGoal?data.goal:'Something else').slice(1);
 const body=`Hi Nathanael,\n\nI’m interested in ${interest}.\n\nName: ${data.name}\nContact: ${data.contact}\n\n${data.message||'I’d like to talk about my next steps.'}\n\nSent from the Harbison Standard contact page (quick form).`;
 const mailto=`mailto:${agent.email}?subject=${encodeURIComponent('Harbison Standard — '+data.goal+' inquiry')}&body=${encodeURIComponent(body)}`;
 async function copy(){try{await navigator.clipboard.writeText(body);setNotice('Message copied. Paste it into an email to '+agent.email+'.')}catch{setNotice('Copy is unavailable in this browser. You can select the message below and copy it manually.')}}
 function recordLead(){
  fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:getSessionId(),source:'Contact page (quick form)',goal:data.goal,interest,name:data.name,email:isEmail?data.contact:'',phone:isEmail?'':data.contact,location:'',timing:'Just exploring',message:data.message||'I’d like to talk about my next steps.'})}).catch(()=>{});
 }
 async function submit(e){
  e.preventDefault();
  if(status==='sending')return;
  setStatus('sending');setNotice('');
  recordLead();
  try{
   const res=await fetch(FORMSPREE,{method:'POST',headers:{'Accept':'application/json'},body:JSON.stringify({_subject:'Harbison Standard — '+data.goal+' inquiry (from Contact page)',_replyto:isEmail?data.contact:'',_cc:agent.email,name:data.name,email:isEmail?data.contact:'',phone:isEmail?'':data.contact,location:'',timing:'Just exploring',goal:data.goal,interest,message:data.message||'I’d like to talk about my next steps.'})});
   if(!res.ok)throw new Error('network');
   setStatus('success');
  }catch{setStatus('error');setNotice('We couldn’t send your message. Please try again, or use the email draft below.')}
 }
 return <div className="lead-card quick-card">
  {status==='success'?<>
   <h3 ref={title} tabIndex={-1} className="success-heading"><CheckCircle className="success-icon"/>Thanks, {data.name.split(' ')[0]} — your message is on its way.</h3>
   <p className="form-intro">Nathanael will be in touch using the details you shared.</p>
   <div className="form-actions"><a className="gold" href="/">Back to home <ArrowRight/></a></div>
  </>:<form onSubmit={submit}><h3 ref={title} tabIndex={-1}>Send a quick message.</h3><p className="form-intro">Name and a phone number or email are all you need.</p><div className="form-fields"><label htmlFor="qf-name">Full name <span>*</span><input id="qf-name" name="name" autoComplete="name" required maxLength={100} value={data.name} onChange={update} placeholder="Your name"/></label><label htmlFor="qf-contact">Phone or email <span>*</span><input id="qf-contact" name="contact" required maxLength={200} value={data.contact} onChange={update} placeholder="you@example.com or (555) 123-4567"/></label><label className="full-field" htmlFor="qf-goal">What are you looking for?<select id="qf-goal" name="goal" value={data.goal} onChange={update}>{goals.map(g=><option key={g}>{g}</option>)}</select></label><label className="full-field" htmlFor="qf-message">Message <small>(optional)</small><textarea id="qf-message" name="message" rows={4} maxLength={1500} value={data.message} onChange={update} placeholder="Your question, property, or situation…"/></label></div><div className="form-actions"><button className="gold" type="submit" disabled={status==='sending'}>{status==='sending'?'Sending…':'Send Message'}{status==='sending'?<></>:<ArrowRight/>}</button><button type="button" className="copy-message" onClick={copy}><Copy/> Copy instead</button><a className="email-draft" href={mailto} onClick={()=>setNotice('Your email app should open with your message. Send it there to complete your inquiry.')}><Envelope/> Email app</a></div></form>}
  {notice&&<p className="form-notice" role={status==='error'?'alert':undefined}>{notice}</p>}
  {status!=='success'&&<p className="form-privacy">No pressure. No mailing list. Just a direct response.</p>}
  {status==='success'&&<p className="form-privacy"><Check/> Response time: {agent.responseTime}.</p>}
 </div>;
}