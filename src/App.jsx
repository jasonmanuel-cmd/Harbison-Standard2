import {useEffect,useState} from 'react';
import {ArrowRight,List,X,Phone,ChatCircleText,Envelope} from '@phosphor-icons/react';
import {Home} from './Home';
import {ServicePage} from './ServicePage';
import {servicePages} from './serviceData';
import {About,Contact} from './Pages';
import {PropertiesPage,PropertyDetailPage,PastSalesPage,OpenHousesPage} from './PropertyPages';
import {MovingFromLosAngeles} from './MovingFromLA';
import {SocialLinks} from './SocialLinks';
import {Hq} from './Hq';
import {agent} from './data';
import {trackPageView} from './track';
import {siteUrl,routes,jsonLdFor} from './seo';
import {trackEvent} from './analytics';
import {captureAttribution} from './attribution';
const pages={'/':{name:'Home',Component:Home},'/about':{name:'About',Component:About},'/properties':{name:'Properties',Component:PropertiesPage},'/past-sales':{name:'Past Sales',Component:PastSalesPage},'/open-houses':{name:'Open Houses',Component:OpenHousesPage},'/moving-from-los-angeles-to-bakersfield':{name:'LA to Bakersfield',Component:MovingFromLosAngeles},'/contact':{name:'Contact',Component:Contact},'/hq':{name:'HQ',Component:Hq}};
export function App(){
 const path=window.location.pathname.replace(/\/+$/,'')||'/';
 const propertyMatch=path.match(/^\/property\/([^/]+)$/);
 const page=pages[path]||(propertyMatch?{name:'Property',Component:()=> <PropertyDetailPage slug={decodeURIComponent(propertyMatch[1])}/>}:(servicePages[path]?{name:servicePages[path].name,Component:ServicePage}:undefined));
 const [menu,setMenu]=useState(false);
 useEffect(()=>{if(path==='/hq')return;captureAttribution();trackPageView(path)},[path]);
 useEffect(()=>{
  const route=routes[path]||{title:'Page not found | Harbison Standard',description:'',robots:''};
  const title=route.title||'Harbison Standard';
  document.title=title;
  const setMeta=(sel,attr,val)=>{document.querySelector(sel)?.setAttribute(attr,val)};
  setMeta('meta[name="description"]','content',route.description||'');
  setMeta('link[rel="canonical"]','href',siteUrl+path);
  setMeta('meta[property="og:url"]','content',siteUrl+path);
  setMeta('meta[property="og:title"]','content',title);
  setMeta('meta[property="og:description"]','content',route.description||'');
  setMeta('meta[name="twitter:title"]','content',title);
  setMeta('meta[name="twitter:description"]','content',route.description||'');
  setMeta('meta[name="robots"]','content',route.robots||'index, follow');
  document.querySelectorAll('script[data-seo-jsonld]').forEach(s=>s.remove());
  const data=jsonLdFor(path);
  data.forEach(schema=>{const el=document.createElement('script');el.type='application/ld+json';el.setAttribute('data-seo-jsonld','true');el.text=JSON.stringify(schema);document.head.appendChild(el)});
 },[path]);
 useEffect(()=>{const close=e=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
 const Component=page?.Component;
 if(path==='/hq')return <Hq/>;
 return <><a className="skip" href="#main">Skip to content</a><header><a className="brand" href="/" aria-label="Harbison Standard home"><img src="/assets/logo.webp" alt="Harbison Standard — Real Estate and Investing"/></a><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} aria-controls="main-nav">{menu?<X/>:<List/>}</button><nav id="main-nav" className={menu?'open':''} aria-label="Main navigation">{[['/','Home'],['/#approach','Our Approach'],['/properties','Properties'],['/moving-from-los-angeles-to-bakersfield','Relocate'],['/about','About'],['/contact','Contact']].map(([href,label])=><a key={href} className={href===path?'active':''} aria-current={href===path?'page':undefined} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav><a className="gold header-cta" href="/contact">Let’s talk</a></header>
 <main id="main">{Component?<Component/>:<section className="page-heading page-wrap"><p className="eyebrow">404 · Page not found</p><h1>Let’s get you <em>home.</em></h1><a href="/" className="gold">Back to home <ArrowRight/></a></section>}
 <section className="closing"><a href="/" aria-label="Harbison Standard home"><img className="footer-logo" src="/assets/logo.webp" alt="Harbison Standard"/></a><div><p className="motto">It’s not what you do,<br/><em>it’s how you do it.</em></p><a className="gold" href="/contact">Let’s talk <ArrowRight/></a></div></section></main>
 <footer className="site-footer"><div><p>Bakersfield · Tehachapi · Kern County</p><p className="footer-credentials"><a href={agent.phoneHref} onClick={()=>trackEvent('phone_click',{placement:'footer'})}>{agent.phone}</a> · <a href={'mailto:'+agent.email}>{agent.email}</a></p><p className="footer-credentials">{agent.name} · REALTOR® · Harbison Standard · DRE #{agent.license}</p><p className="footer-credentials">Equal Housing Opportunity</p></div><SocialLinks/></footer>
 <div className="mobile-contact" role="navigation" aria-label="Quick contact"><a href={agent.phoneHref} onClick={()=>trackEvent('phone_click',{placement:'mobile_bar'})}><Phone/>Call</a><a href={agent.smsHref} onClick={()=>trackEvent('sms_click',{placement:'mobile_bar'})}><ChatCircleText/>Text</a><a href="/contact"><Envelope/>Contact</a></div></>;
}
