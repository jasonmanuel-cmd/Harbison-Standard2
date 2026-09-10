import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Check,Envelope,Lock,SignOut,Phone,MagnifyingGlass,Plus,Pencil} from '@phosphor-icons/react';
import {agent} from './data';

const STATUSES=['new','contacted','qualified','closed'];
const STATUS_LABEL={new:'New',contacted:'Contacted',qualified:'Qualified',closed:'Closed'};

async function api(token,path,options={}){
  const separator=path.includes('?')?'&':'?';
  const res=await fetch(path+separator+'backend='+(sessionStorage.getItem('hs_hq_backend')||'supabase'),{
    ...options,
    headers:{'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(options.headers||{})},
  });
  if(res.status===401)throw Object.assign(new Error('unauthorized'),{code:401});
  if(res.status===503)throw Object.assign(new Error('not configured'),{code:503});
  if(!res.ok)throw new Error('request failed');
  return res.json();
}

function formatDate(value){
  const d=new Date(value);
  return isNaN(d)?'—':d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'})+' · '+d.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});
}

export function Hq(){
  const [backend,setBackend]=useState(()=>sessionStorage.getItem('hs_hq_backend')||'supabase');
  const [token,setToken]=useState(()=>sessionStorage.getItem('hs_hq')||'');
  const [authed,setAuthed]=useState(Boolean(sessionStorage.getItem('hs_hq')));
  const [password,setPassword]=useState('');
  const [phase,setPhase]=useState(authed?'loading':'login');
  const [msg,setMsg]=useState('');
  const [stats,setStats]=useState(null);
  const [leads,setLeads]=useState([]);
  const [filters,setFilters]=useState({status:'',q:''});
  const [selected,setSelected]=useState(null);
  const [detail,setDetail]=useState(null);
  const [saving,setSaving]=useState(false);
  const [editing,setEditing]=useState(false);
  const [editForm,setEditForm]=useState(null);
  const [adding,setAdding]=useState(false);
  const [newLead,setNewLead]=useState({name:'',email:'',phone:'',desired_area:'',budget:'',bedrooms:'',timeline:'',status:'new',notes:''});
  const listLoaded=useRef(false);
  const inputRef=useRef(null);

  useEffect(()=>{if(authed)loadAll()},[authed,backend]);

  async function loadAll(){
    setPhase('loading');
    try{
      const [s,l]=await Promise.all([
        api(token,'/api/stats'),
        api(token,'/api/leads'+(filters.status?'?status='+encodeURIComponent(filters.status):'')),
      ]);
      setStats(s);setLeads(l.leads);setPhase('ready');listLoaded.current=true;
    }catch(err){
      if(err.code===401){setAuthed(false);setToken('');setPhase('login');}
      else if(err.code===503){setPhase('unconfigured');}
      else setPhase('error');
    }
  }

  async function refresh(){
    if(!authed)return;
    try{
      const [s,l]=await Promise.all([
        api(token,'/api/stats'),
        api(token,'/api/leads'+'?'+new URLSearchParams({...filters})),
      ]);
      setStats(s);setLeads(l.leads);
      if(selected)openLead(selected);
    }catch(err){if(err.code===401)logout();}
  }

  function login(e){
    e.preventDefault();
    setMsg('');
    api(password,'/api/leads?limit=1').then(()=>{
      sessionStorage.setItem('hs_hq',password);
      setToken(password);setAuthed(true);
    }).catch(err=>{
      if(err.code===503){sessionStorage.setItem('hs_hq',password);setToken(password);setAuthed(true);}
      else setMsg('That password didn’t work.');
    });
  }

  function logout(){
    sessionStorage.removeItem('hs_hq');
    setToken('');setAuthed(false);setLeads([]);setStats(null);setSelected(null);setDetail(null);setPhase('login');
  }

  async function openLead(id){
    setDetail(null);setSelected(id);setEditing(false);
    try{setDetail(await api(token,'/api/lead?id='+id));}catch(err){if(err.code===401)logout();}
  }

  async function saveLead(changes,leadId=selected){
    setSaving(true);
    try{
      await api(token,'/api/lead',{method:'PATCH',body:JSON.stringify({id:leadId,...changes})});
      await refresh();
      if(leadId===selected){setDetail(d=>({...d,lead:{...d.lead,...changes}}));}
    }catch(err){if(err.code===401)logout();else setMsg('Your change could not be saved. Please try again.');}
    setSaving(false);
  }

  async function createLead(e){
    e.preventDefault();
    setSaving(true);
    try{
      await api(token,'/api/lead',{method:'POST',body:JSON.stringify({...newLead,source:'manual'})});
      setAdding(false);
      setNewLead({name:'',email:'',phone:'',desired_area:'',budget:'',bedrooms:'',timeline:'',status:'new',notes:''});
      await refresh();
    }catch(err){setMsg('Could not create lead.');}
    setSaving(false);
  }

  const keyStats=[
    {label:'Total leads',value:stats?stats.totalLeads:0},
    {label:'New',value:stats?stats.newLeads:0},
    {label:'Visitors',value:stats?.totalSessions??'Not connected'},
    {label:'Page views',value:stats?.totalPageviews??'Not connected'},
  ];

  if(phase==='loading')return <main className="hq-page"><div className="hq-loader"><span/></div></main>;
  if(phase==='unconfigured')return <main className="hq-page"><section className="hq-card hq-narrow"><p className="eyebrow">Harbison Standard · HQ</p><h1>Not configured yet.</h1><p className="hq-note">Configure Supabase or the existing Neon connection, plus the <code>ADMIN_TOKEN</code> environment variables to your Vercel deployment, then reload this page.</p><a className="gold hq-cta" href="/">Back to site <ArrowRight/></a></section></main>;
  if(phase==='error')return <main className="hq-page"><section className="hq-card hq-narrow"><p className="eyebrow">Harbison Standard · HQ</p><h1>Something went wrong.</h1><p className="hq-note">We couldn’t reach the CRM API. Check the server logs and try again.</p><button className="gold hq-cta" onClick={loadAll}>Try again <ArrowRight/></button></section></main>;
  if(phase==='login')return <main className="hq-page"><section className="hq-card hq-narrow"><p className="eyebrow">Harbison Standard · HQ</p><h1>Sign in to your leads.</h1><form className="hq-login" onSubmit={login}><label htmlFor="hq-pass">Password<Lock/></label><div className="login-row"><input ref={inputRef} id="hq-pass" type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="HQ password"/><button className="gold" type="submit">Enter <ArrowRight/></button></div></form>{msg&&<p className="hq-note hq-error" role="alert">{msg}</p>}<p className="hq-meta">Set the <code>ADMIN_TOKEN</code> environment variable to protect this page.</p></section></main>;

  return <main className="hq-page">
   <div className="hq-header">
    <div><p className="eyebrow">Harbison Standard</p><h1>Leads</h1></div>
    <div className="hq-header-actions"><label>Inquiry source <select value={backend} onChange={e=>{sessionStorage.setItem('hs_hq_backend',e.target.value);setBackend(e.target.value);setSelected(null);setDetail(null)}}><option value="supabase">Buyer inquiries</option><option value="neon">Other inquiries</option></select></label><button className="hq-link" onClick={()=>location.href='/'}>View site <ArrowUpRight/></button><button className="hq-logout" onClick={logout}><SignOut/> Sign out</button></div>
   </div>
   {msg&&<p className="hq-note hq-error" role="alert">{msg}</p>}<div className="hq-stats">{keyStats.map(s=><div key={s.label} className="hq-stat"><span>{s.value}</span><p>{s.label}</p></div>)}</div>
   {stats&&stats.topPaths&&<section className="hq-card">
    <div className="hq-card-head"><p className="eyebrow">Top pages</p></div>
    <div className="hq-path-list">{stats.topPaths.map(p=><div key={p.path}><code>{p.path}</code><span>{p.n}</span></div>)}</div>
   </section>}
   <section className="hq-card">
    <div className="hq-card-head"><div><p className="eyebrow">Inquiries</p><p className="hq-note">Most recent inquiries · {leads.length} shown</p></div>
     <div className="hq-tools">
      <div className="hq-search"><MagnifyingGlass/><input placeholder="Search name or email" value={filters.q} onChange={e=>setFilters({...filters,q:e.target.value})}/></div>
      <div className="hq-filters">{['',...STATUSES].map(s=><button key={s||'all'} className={filters.status===s?'on':''} onClick={()=>setFilters({...filters,status:s})}>{s?STATUS_LABEL[s]:'All'}</button>)}</div>
      <button className="hq-link" onClick={refresh}>Refresh <ArrowRight/></button>
      <button className="hq-link" onClick={()=>{setAdding(true);setDetail(null)}}><Plus/> Add lead</button>
     </div>
    </div>
    {leads.length===0?<p className="hq-note">No inquiries yet. When someone sends a form, they’ll appear here.</p>:
    <div className="hq-list">{leads.map(l=><button key={l.id} className={'hq-row'+(selected===l.id?' selected':'')} onClick={()=>openLead(l.id)}>
     <div className="hq-row-main"><strong>{l.name}</strong><span>{l.email}</span></div>
     <div className="hq-row-meta"><span className={'hq-status s-'+l.status}>{STATUS_LABEL[l.status]||l.status}</span><span>{l.source||'Site'}</span><span>{l.goal||''}</span><span>{formatDate(l.created_at)}</span></div>
    </button>)}</div>}
   </section>

   {adding&&<section className="hq-card hq-detail">
    <div className="hq-card-head"><div><p className="eyebrow">Add new lead</p><h2>Manual entry</h2></div>
     <button className="hq-link" onClick={()=>setAdding(false)}>Close <ArrowLeft/></button>
    </div>
    <form className="hq-edit-grid" onSubmit={createLead}>
     <label>Name<input required name="name" value={newLead.name} onChange={e=>setNewLead({...newLead,name:e.target.value})}/></label>
     <label>Email<input required type="email" name="email" value={newLead.email} onChange={e=>setNewLead({...newLead,email:e.target.value})}/></label>
     <label>Phone<input name="phone" value={newLead.phone} onChange={e=>setNewLead({...newLead,phone:e.target.value})}/></label>
     <label>Desired area<input name="desired_area" value={newLead.desired_area} onChange={e=>setNewLead({...newLead,desired_area:e.target.value})}/></label>
     <label>Budget<input name="budget" value={newLead.budget} onChange={e=>setNewLead({...newLead,budget:e.target.value})}/></label>
     <label>Bedrooms<input name="bedrooms" value={newLead.bedrooms} onChange={e=>setNewLead({...newLead,bedrooms:e.target.value})}/></label>
     <label>Timeline<input name="timeline" value={newLead.timeline} onChange={e=>setNewLead({...newLead,timeline:e.target.value})}/></label>
     <label>Status<select name="status" value={newLead.status} onChange={e=>setNewLead({...newLead,status:e.target.value})}>{STATUSES.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
     <label className="full">Notes<textarea rows={3} name="notes" value={newLead.notes} onChange={e=>setNewLead({...newLead,notes:e.target.value})}/></label>
     <div className="hq-detail-actions"><button className="gold" type="submit" disabled={saving}>{saving?'Saving…':'Create lead'}</button></div>
    </form>
   </section>}

   {detail&&<section className="hq-card hq-detail">
    <div className="hq-card-head"><div><p className="eyebrow">Inquiry detail</p><h2>{detail.lead.name}</h2><p className="hq-note">{detail.lead.email} · {formatDate(detail.lead.created_at)}</p></div>
     <div className="hq-contact-actions">
      <a href={'mailto:'+detail.lead.email} className="hq-link">Reply <Envelope/></a>
      {detail.lead.phone?<a href={'tel:'+detail.lead.phone.replace(/[^+\d]/g,'')} className="hq-link">Call <Phone/></a>:null}
      <button className="hq-link" onClick={()=>{setEditForm({...detail.lead});setEditing(true);}}><Pencil/> Edit</button>
     </div>
    </div>
    <div className="hq-detail-grid">
     <dl className="hq-facts"><div><dt>Goal</dt><dd>{detail.lead.goal||'—'}</dd></div><div><dt>Source</dt><dd>{detail.lead.source||'—'}</dd></div><div><dt>Phone</dt><dd>{detail.lead.phone||'—'}</dd></div><div><dt>Location</dt><dd>{detail.lead.location||'—'}</dd></div><div><dt>Timing</dt><dd>{detail.lead.timing||'—'}</dd></div><div><dt>Status</dt><dd>{STATUS_LABEL[detail.lead.status]||detail.lead.status}</dd></div></dl>
     <div className="hq-message"><p className="eyebrow">Message</p><p>{detail.lead.message||'No message.'}</p><p className="hq-notes-label">Notes</p><textarea rows={3} value={detail.lead.notes||''} onChange={e=>saveToNotes(e.target.value)} placeholder="Add a note about this lead…"/><button className="hq-link" disabled={saving} onClick={()=>saveLead({notes:detail.lead.notes||''})}>{saving?'Saving…':'Save notes'}</button></div>
     <div className="hq-visit"><p className="eyebrow">Visit trail</p>{detail.visits.length===0?<p className="hq-note">No page-views recorded for this session.</p>:<ol>{detail.visits.map((v,i)=><li key={i}><code>{v.path}</code><span>{formatDate(v.created_at)}</span></li>)}</ol>}</div>
    </div>
    <div className="hq-detail-actions">
     <div className="hq-status-options">{STATUSES.map(s=><button key={s} className={detail.lead.status===s?'on':''} onClick={()=>saveLead({status:s})} disabled={saving}>{s===detail.lead.status?<Check/>:null}{STATUS_LABEL[s]}</button>)}</div>
     <button className="hq-link" onClick={()=>{setDetail(null);setSelected(null);setEditing(false);}}>Close <ArrowLeft/></button>
    </div>
   </section>}

   {editing&&editForm&&<section className="hq-card hq-detail">
    <div className="hq-card-head"><div><p className="eyebrow">Edit lead</p><h2>{editForm.name}</h2></div>
     <button className="hq-link" onClick={()=>setEditing(false)}>Cancel</button>
    </div>
    <div className="hq-edit-grid">
     <label>Name<input name="name" value={editForm.name||''} onChange={e=>setEditForm({...editForm,name:e.target.value})}/></label>
     <label>Email<input type="email" name="email" value={editForm.email||''} onChange={e=>setEditForm({...editForm,email:e.target.value})}/></label>
     <label>Phone<input name="phone" value={editForm.phone||''} onChange={e=>setEditForm({...editForm,phone:e.target.value})}/></label>
     <label>Desired area<input name="desired_area" value={editForm.desired_area||''} onChange={e=>setEditForm({...editForm,desired_area:e.target.value})}/></label>
     <label>Budget<input name="budget" value={editForm.budget||''} onChange={e=>setEditForm({...editForm,budget:e.target.value})}/></label>
     <label>Bedrooms<input name="bedrooms" value={editForm.bedrooms||''} onChange={e=>setEditForm({...editForm,bedrooms:e.target.value})}/></label>
     <label>Timeline<input name="timeline" value={editForm.timeline||''} onChange={e=>setEditForm({...editForm,timeline:e.target.value})}/></label>
     <label>Status<select name="status" value={editForm.status||'new'} onChange={e=>setEditForm({...editForm,status:e.target.value})}>{STATUSES.map(s=><option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
     <label className="full">Notes<textarea rows={3} name="notes" value={editForm.notes||''} onChange={e=>setEditForm({...editForm,notes:e.target.value})}/></label>
    </div>
    <div className="hq-detail-actions">
     <button className="gold" disabled={saving} onClick={()=>{const{id,created_at,updated_at,goal,location,timing,message,source,...changes}=editForm;saveLead(changes);setEditing(false);}}>{saving?'Saving…':'Save changes'}</button>
     <button className="hq-link" onClick={()=>setEditing(false)}>Cancel</button>
    </div>
   </section>}
  </main>;

  function saveToNotes(value){
    const saved=value;
    setDetail(d=>({...d,lead:{...d.lead,notes:saved}}));

  }
}
