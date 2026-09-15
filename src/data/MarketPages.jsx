import {useEffect} from 'react';
import {Phone, ArrowRight} from '@phosphor-icons/react';
import {agent} from '../data';
import {BuyerIntentForm} from '../BuyerIntentForm';
import {bakersfieldFaq, tehachapiFaq} from '../seo';

export function BakersfieldHomePrices(){
 useEffect(()=>{
  document.title='Bakersfield Home Prices & Market Trends | Harbison Standard';
  const setMeta=(sel,attr,val)=>document.querySelector(sel)?.setAttribute(attr,val);
  setMeta('meta[name="description"]','content','What are homes selling for in Bakersfield? Explore price ranges, neighborhood comparisons, and what your budget can target in Kern County.');
  setMeta('link[rel="canonical"]','href','https://www.harbisonstandard.com/bakersfield-home-prices');
  setMeta('meta[property="og:title"]','content','Bakersfield Home Prices & Market Trends | Harbison Standard');
  setMeta('meta[property="og:description"]','content','What are homes selling for in Bakersfield? Explore price ranges, neighborhood comparisons.');
  setMeta('meta[property="og:url"]','content','https://www.harbisonstandard.com/bakersfield-home-prices');
 },[]);
 return <>
  <section className="page-heading page-wrap"><p className="eyebrow">Market insights</p><h1>What homes actually cost <em>in Bakersfield.</em></h1><p className="page-lede">Real talk about Bakersfield home prices — by neighborhood, by budget, and what you actually get for your money.</p></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Price ranges</p><h2>What <em>$X buys.</em></h2></div></div><div className="cards3">{[
   ['$200K–$350K','Entry-level homes and smaller condos. Common for first-time buyers or investors.'],
   ['$350K–$500K','The sweet spot for most families. 3-4 bedrooms, decent yards, established neighborhoods.'],
   ['$500K+','Larger homes, newer construction, more land, and premium locations.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc svc--tint"><div className="svc-head"><div><p className="eyebrow">Neighborhood snapshot</p><h2>Where people are <em>actually looking.</em></h2></div></div><div className="cards4">{[
   ['Seven Oaks','Master-planned, golf course, family-friendly. Mid-range to higher.'],
   ['Stockdale','Established, central, walkable. Mix of older and updated homes.'],
   ['Southwest','Growing area with new construction and more space per dollar.'],
   ['Rio Bravo','Rural feel with larger lots, shop potential, and more privacy.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Compared to LA</p><h2>Why Bakersfield <em>keeps coming up.</em></h2></div><p>It is not just lower prices — it is what those prices include. More square footage. More land. Shorter commutes within the city. And for remote workers, the same California lifestyle at half the mortgage.</p></div></section>
  <section className="svc svc--tint"><div className="svc-head"><div><p className="eyebrow">Explore more</p><h2>Related <em>resources.</em></h2></div></div><div className="cards3">
   <article className="card-t"><h3>Current listings</h3><p>See what is available right now in Bakersfield and Kern County.</p><a className="inline-link" href="/properties">View properties <ArrowRight/></a></article>
   <article className="card-t"><h3>Moving from LA?</h3><p>Compare what your budget buys in Bakersfield vs Los Angeles.</p><a className="inline-link" href="/moving-from-los-angeles-to-bakersfield">LA to Bakersfield <ArrowRight/></a></article>
   <article className="card-t"><h3>Talk to Nathanael</h3><p>Get guidance on neighborhoods, pricing, and next steps.</p><a className="inline-link" href="/contact">Contact <ArrowRight/></a></article>
  </div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Common questions</p><h2>Bakersfield, <em>answered.</em></h2></div></div><div className="faq">{bakersfieldFaq.map(({q,a})=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
  <section className="final-cta"><div><p className="eyebrow">Curious what fits your budget?</p><h2>Tell us what you want.<br/><em>We will show you the options.</em></h2></div><div className="actions"><a className="gold" href={agent.phoneHref}><Phone/> Call Nathanael</a><a className="inline-link" href="/properties">View listings <ArrowRight/></a></div></section>
  <section className="inquiry-section"><div><p className="eyebrow">House hunter</p><h2>Build your <em>buyer profile.</em></h2><p>Share your budget, preferred areas, and must-haves. Nathanael will follow up with relevant properties.</p></div><BuyerIntentForm source="bakersfield-home-prices"/></section>
 </>
}

export function TehachapiHomePrices(){
 useEffect(()=>{
  document.title='Tehachapi Home Prices & Market Trends | Harbison Standard';
  const setMeta=(sel,attr,val)=>document.querySelector(sel)?.setAttribute(attr,val);
  setMeta('meta[name="description"]','content','Thinking about buying in Tehachapi? Explore home prices, land values, and what makes this mountain community different.');
  setMeta('link[rel="canonical"]','href','https://www.harbisonstandard.com/tehachapi-home-prices');
  setMeta('meta[property="og:title"]','content','Tehachapi Home Prices & Market Trends | Harbison Standard');
  setMeta('meta[property="og:description"]','content','Thinking about buying in Tehachapi? Explore home prices, land values, and what makes this mountain community different.');
  setMeta('meta[property="og:url"]','content','https://www.harbisonstandard.com/tehachapi-home-prices');
 },[]);
 return <>
  <section className="page-heading page-wrap"><p className="eyebrow">Market insights</p><h1>What homes actually cost <em>in Tehachapi.</em></h1><p className="page-lede">Tehachapi is not just cheaper than Southern California — it is a completely different kind of market. Here is what to expect.</p></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Home prices</p><h2>The Tehachapi <em>price range.</em></h2></div></div><div className="cards3">{[
   ['$250K–$400K','Smaller homes, condos, and townhomes. Often 2-3 bedrooms.'],
   ['$400K–$600K','Mid-range single-family homes with more space and views.'],
   ['$600K+','Larger homes, premium locations, and properties with acreage.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc svc--tint"><div className="svc-head"><div><p className="eyebrow">Land prices</p><h2>Acreage, lots, <em>and builds.</em></h2></div></div><div className="cards3">{[
   ['Standard lots (5K-10K sq ft)','$40K–$80K. Enough for a custom home with a yard.'],
   ['Large lots (0.25-1 acre)','$80K–$150K. Room for shops, ADUs, or gardens.'],
   ['Acreage (5+ acres)','$150K+. Full ranch potential, views, and privacy.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Why Tehachapi</p><h2>Four seasons, <em>affordable living.</em></h2></div></div><div className="cards4">{[
   ['Four distinct seasons','Unlike most of SoCal — actual spring blooms, colorful falls, occasional snow.'],
   ['Outdoor lifestyle','Hiking, horseback riding, cycling, hunting, and wine country nearby.'],
   ['Remote-work friendly','High-speed internet is expanding. Many agents now serve relocating professionals.'],
   ['Less density','More space, cleaner air, dark night skies, and a slower pace.']
  ].map(([title,copy])=><article className="card-t" key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  <section className="svc svc--tint"><div className="svc-head"><div><p className="eyebrow">Explore more</p><h2>Related <em>resources.</em></h2></div></div><div className="cards3">
   <article className="card-t"><h3>Why Tehachapi?</h3><p>Learn what makes this mountain community different from the rest of California.</p><a className="inline-link" href="/why-tehachapi">Discover Tehachapi <ArrowRight/></a></article>
   <article className="card-t"><h3>Cheap land in Kern County</h3><p>View current land listings and learn what your budget buys.</p><a className="inline-link" href="/cheap-land-kern-county">Explore land <ArrowRight/></a></article>
   <article className="card-t"><h3>Talk to Nathanael</h3><p>Get guidance on Tehachapi neighborhoods, pricing, and next steps.</p><a className="inline-link" href="/contact">Contact <ArrowRight/></a></article>
  </div></section>
  <section className="svc"><div className="svc-head"><div><p className="eyebrow">Common questions</p><h2>Tehachapi, <em>answered.</em></h2></div></div><div className="faq">{tehachapiFaq.map(({q,a})=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</div></section>
  <section className="final-cta"><div><p className="eyebrow">Considering Tehachapi?</p><h2>Talk through <em>the details.</em></h2><p>Share your goals, budget, and what you are considering. Nathanael can help you figure out if Tehachapi makes sense.</p></div><div className="actions"><a className="gold" href={agent.phoneHref}><Phone/> Call Nathanael</a><a className="inline-link" href="/why-tehachapi">Why Tehachapi <ArrowRight/></a></div></section>
  <section className="inquiry-section"><div><p className="eyebrow">Buyer profile</p><h2>Tell us what you are <em>looking for.</em></h2><p>Share your criteria and Nathanael can send relevant listings and opportunities.</p></div><BuyerIntentForm source="tehachapi-home-prices"/></section>
 </>
}
