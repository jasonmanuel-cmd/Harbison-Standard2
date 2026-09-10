import {ArrowRight,ArrowUpRight,Check,Phone} from '@phosphor-icons/react';
import {LeadForm} from './LeadForm';
import {agent} from './data';
import {servicePages} from './serviceData';

const ctaHref = href => href === ':phone' ? agent.phoneHref : href;

function Head({eyebrow,title,accent,intro}) {
 return <div className="svc-head"><div><p className="eyebrow">{eyebrow}</p><h2>{title}<br/><em>{accent}</em></h2></div>{intro&&<p>{intro}</p>}</div>;
}
function Wrap({tint,children}) {
 return <section className={'svc'+(tint?' svc--tint':'')}>{children}</section>;
}
function Cards({cards,numbered=false}) {
 return <div className={numbered?'cards3':'cards2'}>{cards.map((card,i)=><article className="card-t" key={card.title}>{numbered&&<span className="number">0{i+1}</span>}{card.title&&<h3>{card.title}</h3>}{card.copy&&<p>{card.copy}</p>}{card.cta&&<a className="inline-link" href="#service-inquiry">{card.cta} <ArrowRight/></a>}{card.quote&&<blockquote>{card.quote}</blockquote>}</article>)}</div>;
}
function Checklist({items}) {
 return <ul className="check-grid">{items.map(item=><li key={item}><Check weight="bold"/><span>{item}</span></li>)}</ul>;
}
function Compare({data}) {
 return <div className="split-grid"><div className="split-card"><h3>{data.a.title}</h3><p>{data.a.lede||''}</p><ul>{data.a.points.map(p=><li key={p}>{p}</li>)}</ul></div><div className="split-card"><h3>{data.b.title}</h3><p>{data.b.lede||''}</p><ul>{data.b.points.map(p=><li key={p}>{p}</li>)}</ul></div></div>;
}

const renderers = {
 who:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><Checklist items={s.items}/></Wrap>,
 helps:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><div className="cards2">{s.items.map((item,i)=><article className="card-t" key={item}><span className="number">0{i+1}</span><h3>{item}</h3></article>)}</div></Wrap>,
 compare:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro}/><Compare data={s}/></Wrap>,
 special:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><Cards cards={s.cards}/></Wrap>,
 role:s=><Wrap tint={s.tint}><div className="svc-split"><div><p className="eyebrow">{s.eyebrow}</p><h2>{s.title} <em>{s.accent}</em></h2><p className="svc-body">{s.body}</p></div><Checklist items={s.bullets}/></div></Wrap>,
 paths:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.intro}/><Cards cards={s.cards} numbered/></Wrap>,
 considerations:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><Checklist items={s.items}/></Wrap>,
 mistakes:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><Checklist items={s.items}/></Wrap>,
 scenarios:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><Cards cards={s.cards}/></Wrap>,
 self:s=><Wrap tint={s.tint}><div className="svc-narrow"><p className="eyebrow">{s.eyebrow}</p><h2>{s.title} <em>{s.accent}</em></h2><p>{s.body}</p></div></Wrap>,
 process:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><ol className="svc-steps">{s.steps.map((step,i)=><li key={step.name}><span>0{i+1}</span><div><h3>{step.name}</h3><p>{step.copy}</p></div></li>)}</ol></Wrap>,
 faq:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><div className="faq">{s.items.map(item=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}</div></Wrap>,
 testimonial:s=><Wrap tint><div className="testimonial-band"><blockquote>{s.quote}</blockquote><p className="t-label">{s.label}</p></div></Wrap>,
 credibility:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent}/><Checklist items={s.items}/></Wrap>,
 proof:s=><Wrap tint={s.tint}><Head eyebrow={s.eyebrow} title={s.title} accent={s.accent} intro={s.body}/><div className="build-grid">{s.images.map(img=><figure key={img.src}><img src={img.src} alt={img.alt} loading="lazy"/><figcaption>{img.caption}</figcaption></figure>)}</div></Wrap>,
};

const finalCtas = {
 '/real-estate':{title:'Start with a conversation',accent:'about your home.',lede:'You don’t need to have everything figured out. A location, rough timing, and a few details are enough to get started.',btn:'Discuss Your Home'},
 '/investing':{title:'Have a deal',accent:'or an idea worth a conversation?',lede:'Bring a property, a project, or a general direction. Nathanael can help you review the practical details.',btn:'Review a Deal'},
};

export function ServicePage(){
 const path=window.location.pathname.replace(/\/+$/,'');
 const page=servicePages[path];
 const final=finalCtas[path];
 return <>
  <div className="service-navigation page-wrap" role="navigation" aria-label="Explore our services">{Object.entries(servicePages).map(([href,service])=><a key={href} href={href} aria-current={path===href?'page':undefined}>{service.name}<ArrowRight/></a>)}</div>
  <section className="service-hero page-wrap"><div><p className="eyebrow">Harbison Standard · {page.category}</p><h1>{page.hero.heading}<br/><em>{page.hero.accent}</em></h1><p className="page-lede">{page.hero.intro}</p><div className="hero-actions">{page.hero.ctas.map((cta,i)=>{const href=ctaHref(cta.href);return cta.kind==='gold'?<a key={cta.label} className="gold" href={href}>{cta.label} <ArrowRight/></a>:<a key={cta.label} className="text-link" href={href}>{href.indexOf('tel:')===0||href.indexOf('sms:')===0?<><Phone/>{cta.label}<ArrowRight/></>:<><span>{cta.label}</span><ArrowRight/></>}</a>})}</div></div><figure><img src={'/assets/'+page.image+'.webp'} alt={page.alt}/><figcaption>{page.hero.caption}</figcaption></figure></section>
  {page.sections.map(type=>renderers[type](page[type]))}
  <section className="final-cta"><div><p className="eyebrow">Your next step</p><h2>{final.title}<br/>{final.accent&&<em>{final.accent}</em>}</h2>{final.lede&&<p>{final.lede}</p>}</div><div className="actions"><a className="gold" href="#service-inquiry">{final.btn} <ArrowRight/></a><a className="inline-link" href={agent.phoneHref}><Phone/> Call or text {agent.phone} <ArrowUpRight/></a></div></section>
  <section id="service-inquiry" className="inquiry-section"><div><p className="eyebrow">Your next step</p><h2>{page.formTitle}<br/><em>{page.formAccent}</em></h2><p>{page.formCopy}</p><a className="inline-link" href={agent.phoneHref}><Phone/>Prefer to call? {agent.phone}</a></div><LeadForm source={page.name+' page'} goalOptions={page.goals} messagePlaceholder={page.messagePlaceholder}/></section>
 </>;
}