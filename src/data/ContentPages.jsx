import {useEffect} from 'react';
import {Phone, ArrowRight, Check} from '@phosphor-icons/react';
import {agent} from '../data';
import {BuyerIntentForm} from '../BuyerIntentForm';
import {whyTehachapiFaq, cheapLandKernFaq} from '../seo';

export function WhyTehachapi(){
 useEffect(()=>{
  document.title='Why Move to Tehachapi, CA | Harbison Standard';
  const setMeta=(sel,attr,val)=>document.querySelector(sel)?.setAttribute(attr,val);
  setMeta('meta[name="description"]','content','Thinking about moving to Tehachapi? Discover why people are choosing this mountain community — affordable land, four seasons, and a growing local economy.');
  setMeta('link[rel="canonical"]','href','https://www.harbisonstandard.com/why-tehachapi');
  setMeta('meta[property="og:title"]','content','Why Move to Tehachapi, CA | Harbison Standard');
  setMeta('meta[property="og:description"]','content','Thinking about moving to Tehachapi? Discover why people are choosing this mountain community.');
  setMeta('meta[property="og:url"]','content','https://www.harbisonstandard.com/why-tehachapi');
 },[]);
 return <>
  <section className="page-heading page-wrap"><p className="eyebrow">Why Tehachapi</p><h1>Why people are choosing <em>Tehachapi.</em></h1><p className="page-lede">Four distinct seasons, affordable land, and a growing community — Tehachapi offers something different from the California cities many are leaving behind.</p></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">What makes it different</p><h2>A mountain community <em>that actually makes sense.</em></h2></div></div><div className="cards4">{[
   ['Four distinct seasons','Green spring hillsides, warm summers, colorful falls, and occasional light snow — a rhythm missing from much of California.'],
   ['Land you can actually afford','Whether it is a home site, acreage for a shop or barn, or a full ranch, the numbers look very different here.'],
   ['Growing local economy','Wind energy, aerospace, healthcare, wine, and outdoor recreation are all part of the mix.'],
   ['Room to breathe','Less density, cleaner air, dark night skies, and a pace that feels intentional.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc svc--tint"><div className="svc-split"><div><p className="eyebrow">Things to consider</p><h2>The trade-offs are <em>real too.</em></h2><p className="svc-body">Tehachapi is not for everyone. Here is what to weigh honestly.</p></div><ul className="check-grid">{[
   'Winter means occasional snow and ice — plan for it.',
   'Commute to Bakersfield or Lancaster is feasible but real.',
   'Some services and retail options are limited compared to larger cities.',
   'Rural living means more self-reliance — wells, septic, propane, and generator readiness.'
  ].map(item=><li key={item}><Check weight="bold"/><span>{item}</span></li>)}</ul></div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Who is moving here?</p><h2>The Tehachapi <em>profile.</em></h2></div></div><div className="cards4">{[
   ['Remote workers','People who can work from anywhere and want more land, lower costs, and better air quality.'],
   ['Retirees','Those looking for a quieter pace, four seasons, and a community that is easy to navigate.'],
   ['Outdoor enthusiasts','Hiking, hunting, horseback riding, cycling, and a short drive to more mountain terrain.'],
   ['Investors','Land buyers and flippers looking at price-per-acre and long-term appreciation potential.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc svc--tint"><div className="svc-head"><div><p className="eyebrow">Explore your options</p><h2>Related <em>resources.</em></h2></div></div><div className="cards3">
   <article className="card-t"><h3>View land for sale</h3><p>See current land listings in Tehachapi and Kern County.</p><a className="inline-link" href="/cheap-land-kern-county">Browse land <ArrowRight/></a></article>
   <article className="card-t"><h3>Moving from LA?</h3><p>Compare what your budget buys in Bakersfield vs Los Angeles.</p><a className="inline-link" href="/moving-from-los-angeles-to-bakersfield">LA to Bakersfield <ArrowRight/></a></article>
   <article className="card-t"><h3>Current listings</h3><h3>Talk to Nathanael</h3><p>Get guidance on whether Tehachapi is the right fit for your goals.</p><a className="inline-link" href="/contact">Contact <ArrowRight/></a></article>
  </div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Common questions</p><h2>Tehachapi, <em>answered.</em></h2></div></div><div className="faq">{whyTehachapiFaq.map(({q,a})=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
  <section className="final-cta"><div><p className="eyebrow">Thinking about it?</p><h2>If Tehachapi is on your radar,<br/><em>start the conversation.</em></h2><p>Share your situation and what you are considering. Nathanael can help you think through the practical realities before you commit.</p></div><div className="actions"><a className="gold" href={agent.phoneHref}><Phone/> Call Nathanael</a><a className="inline-link" href="/contact">Get in touch <ArrowRight/></a></div></section>
  <section className="inquiry-section"><div><p className="eyebrow">Have questions?</p><h2>Ask Nathanael about <em>Tehachapi.</em></h2><p>Whether you are just curious or seriously considering a move, a conversation is the fastest way to get clarity.</p></div><BuyerIntentForm source="why-tehachapi"/></section>
 </>
}

export function CheapLandKernCounty(){
 useEffect(()=>{
  document.title='Cheap Land for Sale in Kern County | Harbison Standard';
  const setMeta=(sel,attr,val)=>document.querySelector(sel)?.setAttribute(attr,val);
  setMeta('meta[name="description"]','content','Looking for affordable land in Kern County? View current listings and learn what your budget buys in Bakersfield, Tehachapi, and the surrounding areas.');
  setMeta('link[rel="canonical"]','href','https://www.harbisonstandard.com/cheap-land-kern-county');
  setMeta('meta[property="og:title"]','content','Cheap Land for Sale in Kern County | Harbison Standard');
  setMeta('meta[property="og:description"]','content','Looking for affordable land in Kern County? View current listings and learn what your budget buys.');
  setMeta('meta[property="og:url"]','content','https://www.harbisonstandard.com/cheap-land-kern-county');
 },[]);
 return <>
  <section className="page-heading page-wrap"><p className="eyebrow">Land opportunities</p><h1>Affordable land in <em>Kern County.</em></h1><p className="page-lede">Kern County offers some of the most accessible land prices in California. Whether you are planning a build, holding for the future, or looking for an investment opportunity, here is what to know.</p></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Current land listings</p><h2>Land opportunities <em>right now.</em></h2></div></div><div className="cards3">{[
   ['22208 Mariposa Rd, Tehachapi','0.3 acre (13,068 sq ft) · $40,000','A prime Tehachapi lot ready for your future build.'],
   ['0 Chalet Dr, Tehachapi','20.25 acres · $199,000','Build your dream home on this remarkable acreage with mountain views.']
  ].map(([title,copy,desc])=><article className="card-t" key={title}><h3>{title}</h3><p><strong>{copy}</strong></p><p>{desc}</p><a className="inline-link" href="/properties">View all properties <ArrowRight/></a></article>)}</div></section>
  <section className="svc svc--tint"><div className="svc-split"><div><p className="eyebrow">What to know before buying land</p><h2>Land purchases have <em>more moving parts.</em></h2><p className="svc-body">A raw lot looks simple on paper. In reality, a lot of the value depends on things that take work to verify.</p></div><ul className="check-grid">{[
   'Zoning and permitted uses — what can you actually build?',
   'Utility access — water, sewer, electric, internet. Costs add up fast if they are not at the road.',
   'Access and road maintenance — legal vs physical access are not the same thing.',
   'Soils, drainage, and grading — these determine where and how you can build.',
   'HOA and CC&Rs — some areas have restrictions on size, style, or use.',
   'Buyer due diligence — verify everything with Kern County before committing.'
  ].map(item=><li key={item}><Check weight="bold"/><span>{item}</span></li>)}</ul></div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">What your budget buys</p><h2>The budget <em>breakdown.</em></h2></div></div><div className="cards3">{[
   ['Under $50K','A smaller residential lot in Tehachapi or California City. Enough for a custom home in many cases.'],
   ['$50K–$150K','Larger residential or small acreage parcels. Options open up for shops and outbuildings.'],
   ['$150K+','Genuine acreage with views, privacy, and the potential for agricultural or ranch use.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc svc--tint"><div className="svc-head"><div><p className="eyebrow">Explore more</p><h2>Related <em>resources.</em></h2></div></div><div className="cards3">
   <article className="card-t"><h3>Why Tehachapi?</h3><p>Learn what makes this mountain community different from the rest of California.</p><a className="inline-link" href="/why-tehachapi">Discover Tehachapi <ArrowRight/></a></article>
   <article className="card-t"><h3>Investing in Kern County</h3><p>Talk through investment properties, flips, and opportunities with a practical eye.</p><a className="inline-link" href="/investing">Explore investing <ArrowRight/></a></article>
   <article className="card-t"><h3>Talk to Nathanael</h3><p>Get guidance on land purchases, zoning, and what to look for.</p><a className="inline-link" href="/contact">Contact <ArrowRight/></a></article>
  </div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Land buyer questions</p><h2>Land in Kern County, <em>answered.</em></h2></div></div><div className="faq">{cheapLandKernFaq.map(({q,a})=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
  <section className="final-cta"><div><p className="eyebrow">Looking for land?</p><h2>Tell Nathanael <em>what you need.</em></h2><p>Share your budget, what you want to build, and where you want to be. It is the fastest way to narrow the search.</p></div><div className="actions"><a className="gold" href={agent.phoneHref}><Phone/> Call Nathanael</a><a className="inline-link" href="/properties">View listings <ArrowRight/></a></div></section>
  <section className="inquiry-section"><div><p className="eyebrow">Land buyer profile</p><h2>Tell us what you are <em>looking for.</em></h2><p>Share your criteria and Nathanael can match you with relevant opportunities.</p></div><BuyerIntentForm source="cheap-land-kern-county"/></section>
 </>
}
