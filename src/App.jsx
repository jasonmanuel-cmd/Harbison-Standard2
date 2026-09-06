import {useEffect,useState} from 'react';
import {ArrowRight,List,X} from '@phosphor-icons/react';
import {Home} from './Home';
import {ServicePage} from './ServicePage';
import {servicePages} from './serviceData';
import {About,Properties,Contact} from './Pages';
import {SocialLinks} from './SocialLinks';
import {agent} from './data';
const pages={'/':{name:'Home',Component:Home},'/about':{name:'About',Component:About},'/properties':{name:'Properties',Component:Properties},'/contact':{name:'Contact',Component:Contact}};
export function App(){
 const path=window.location.pathname.replace(/\/+$/,'')||'/';
 const page=pages[path]||(servicePages[path]?{name:servicePages[path].name,Component:ServicePage}:undefined);
 const [menu,setMenu]=useState(false);
 useEffect(()=>{document.title=(page?.name||'Page not found')+' | Harbison Standard';},[page?.name]);
 useEffect(()=>{const close=e=>{if(e.key==='Escape')setMenu(false)};window.addEventListener('keydown',close);return()=>window.removeEventListener('keydown',close)},[]);
 const Component=page?.Component;
 return <><a className="skip" href="#main">Skip to content</a><header><a className="brand" href="/" aria-label="Harbison Standard home"><img src="/assets/logo.webp" alt="Harbison Standard — Real Estate · Development · Investing"/></a><button className="menu-toggle" onClick={()=>setMenu(!menu)} aria-label={menu?'Close navigation':'Open navigation'} aria-expanded={menu} aria-controls="main-nav">{menu?<X/>:<List/>}</button><nav id="main-nav" className={menu?'open':''} aria-label="Main navigation">{[['/','Home'],['/#approach','Our Approach'],['/properties','Properties'],['/about','About'],['/contact','Contact']].map(([href,label])=><a key={href} className={href===path?'active':''} aria-current={href===path?'page':undefined} href={href} onClick={()=>setMenu(false)}>{label}</a>)}</nav><a className="gold header-cta" href="/contact">Let’s talk</a></header>
 <main id="main">{Component?<Component/>:<section className="page-heading page-wrap"><p className="eyebrow">404 · Page not found</p><h1>Let’s get you <em>home.</em></h1><a href="/" className="gold">Back to home <ArrowRight/></a></section>}
 <section className="closing"><a href="/" aria-label="Harbison Standard home"><img className="footer-logo" src="/assets/logo.webp" alt="Harbison Standard"/></a><div><p className="motto">It’s not what you do,<br/><em>it’s how you do it.</em></p><a className="gold" href="/contact">Let’s talk <ArrowRight/></a></div></section></main>
 <footer className="site-footer"><div><p>Bakersfield · Tehachapi · Kern County · San Diego</p><p className="footer-credentials">{agent.name} · REALTOR® · Compass · DRE #{agent.license}</p><p className="footer-credentials">Equal Housing Opportunity</p></div><SocialLinks/></footer></>;
}
