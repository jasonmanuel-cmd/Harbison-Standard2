import {ArrowRight,Phone} from '@phosphor-icons/react';
import {LeadForm} from './LeadForm';
import {agent} from './data';
import {servicePages} from './serviceData';
export function ServicePage(){
 const path=window.location.pathname.replace(/\/+$/,'');
 const page=servicePages[path];
 return <>
  <div className="service-navigation page-wrap" role="navigation" aria-label="Explore our services">{Object.entries(servicePages).map(([href,service])=><a key={href} href={href} aria-current={path===href?'page':undefined}>{service.name}<ArrowRight/></a>)}</div>
  <section className="service-hero page-wrap"><div><p className="eyebrow">Harbison Standard · {page.category}</p><h1>{page.heading}<br/><em>{page.accent}</em></h1><p className="page-lede">{page.intro}</p><a className="gold" href="#service-inquiry">{page.cta}<ArrowRight/></a></div><figure><img src={'/assets/'+page.image+'.webp'} alt={page.alt}/><figcaption>{page.caption}</figcaption></figure></section>
  <section className="service-paths page-wrap"><div className="section-heading"><div><p className="eyebrow">{page.sectionLabel}</p><h2>{page.sectionTitle}<br/><em>{page.sectionAccent}</em></h2></div><p>{page.sectionIntro}</p></div><div className="service-path-grid">{page.cards.map((card,i)=><article key={card.title}><span className="number">0{i+1}</span><h3>{card.title}</h3><p>{card.copy}</p></article>)}</div></section>
  <section className="service-approach page-wrap"><div><p className="eyebrow">A conversation with Nate</p><h2>{page.approachTitle}</h2><p>{page.approachCopy}</p><a className="inline-link" href="/about">Meet Nathanael<ArrowRight/></a></div><ol>{page.steps.map((step,i)=><li key={step}><span>0{i+1}</span>{step}</li>)}</ol></section>
  <section id="service-inquiry" className="inquiry-section"><div><p className="eyebrow">Your next step</p><h2>{page.formTitle}<br/><em>{page.formAccent}</em></h2><p>{page.formCopy}</p><a className="inline-link" href={agent.phoneHref}><Phone/>Prefer to call? {agent.phone}</a></div><LeadForm source={page.name+' page'} goalOptions={page.goals} messagePlaceholder={page.messagePlaceholder}/></section>
 </>;
}
