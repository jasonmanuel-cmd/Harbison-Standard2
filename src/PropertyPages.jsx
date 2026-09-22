import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,HouseLine,MapPin,PlayCircle,CalendarCheck,X,CaretLeft,CaretRight} from '@phosphor-icons/react';
import {getProperties,getProperty,isAvailableProperty,staticProperties} from './propertyApi';
import {money} from './data';
import {responsiveImage} from './utilities/imageUtils';
import {BuyerIntentForm} from './BuyerIntentForm';
import {applyPropertySeo} from './seo';
import {trackEvent} from './analytics';

function Lightbox({images,initialIndex,onClose}){
 const [idx,setIdx]=useState(initialIndex);
 const closeRef=useRef(null);
 useEffect(()=>{
  const handler=e=>{if(e.key==='Escape')onClose();if(e.key==='ArrowLeft')setIdx(i=>(i-1+images.length)%images.length);if(e.key==='ArrowRight')setIdx(i=>(i+1)%images.length);};
  document.addEventListener('keydown',handler);
  closeRef.current?.focus();
  return()=>document.removeEventListener('keydown',handler);
 },[images.length,onClose]);
 if(!images.length)return null;
 return <div className="lightbox-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
  <button className="lightbox-close" ref={closeRef} onClick={onClose}><X weight="bold"/></button>
  <button className="lightbox-nav lightbox-prev" onClick={()=>setIdx(i=>(i-1+images.length)%images.length)}><CaretLeft weight="bold"/></button>
  <div className="lightbox-content"><img src={images[idx]} alt={`Photo ${idx+1}`} className="lightbox-img"/></div>
  <button className="lightbox-nav lightbox-next" onClick={()=>setIdx(i=>(i+1)%images.length)}><CaretRight weight="bold"/></button>
  <div className="lightbox-counter">{idx+1} / {images.length}</div>
 </div>;
}

export function Photo({p,featured=false,onOpen}){const [failed,setFailed]=useState(false);const src=p.imageUrl||p.images?.[0];return <div className="property-image" onClick={()=>onOpen?.(0)} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')onOpen?.(0)}}>{!src||failed?<div className="photo-unavailable"><HouseLine/><span>Property photo coming soon</span></div>:<img src={src} style={src.includes('/apollo/streetview')?{objectFit:'contain'}:undefined} alt={`${p.address}, ${p.city}`} decoding="async" loading={featured?'eager':'lazy'} onError={()=>setFailed(true)}/>}<span className="sold-badge">{p.status||'Available'}</span></div>}
function Facts({p}){return <div className="property-facts">{p.beds>0&&<span>{p.beds} beds</span>}{p.baths>0&&<span>{p.baths} baths</span>}{p.sqft>0&&<span>{Number(p.sqft).toLocaleString()} sq ft</span>}{p.lot&&<span>{p.lot} lot</span>}</div>}

function Attribution({p,inline=false}){
 if(!p.attribution)return null;
 const match=p.attribution.match(/Listing courtesy of\s+(.+?)(?:\.\s*)?$/);
 const parts=match?match[1].split(',').map(s=>s.trim()):[p.attribution];
 const name=parts[0]||'';
 const brokerage=parts.slice(1).join(', ')||'';
 return <div className={inline?"property-attribution-inline":"property-attribution"}>
  <span className="attribution-label">Listing courtesy of</span>
  {name&&<strong className="attribution-name">{name}</strong>}
  {brokerage&&<span className="attribution-broker">{brokerage}</span>}
 </div>;
}

function PropertyGallery({property,images,onOpenImage}){
 const ref=useRef(null),sent=useRef(false);
 useEffect(()=>{
  if(!ref.current||sent.current)return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)&&!sent.current){sent.current=true;trackEvent('gallery_view',{property_id:property.id,property_slug:property.slug,image_count:images.length});observer.disconnect()}},{threshold:.25});
  observer.observe(ref.current);return()=>observer.disconnect();
 },[property,images.length]);
 return <div className="property-detail-gallery" ref={ref}>{images.map((src,i)=><div className="property-gallery-item" key={src+i} role="button" tabIndex={0} onClick={()=>onOpenImage(i)} onKeyDown={e=>{if(e.key==='Enter')onOpenImage(i)}}><img src={src} alt={`${property.address} property photo ${i+1}`} loading="lazy"/></div>)}</div>;
}

export function PropertyCard({p,onOpen,headingLevel=2}){const Heading=headingLevel===3?'h3':'h2';return <article className="property-card"><a href={`/property/${p.slug||p.id}`} onClick={()=>onOpen?.(p)}><Photo p={p}/><div className="property-card-body"><div className="price-line"><strong>{p.price?money(p.price):'Contact for price'}</strong><span>{p.status||'Available'}</span></div><Heading>{p.address||'Property opportunity'}</Heading><p className="property-location">{[p.city,p.state,p.zip].filter(Boolean).join(', ').replace(', CA,',', CA ')}</p><Facts p={p}/>{p.description&&<p className="context-line">{p.description.slice(0,170)}{p.description.length>170?'…':''}</p>}{p.attribution&&<Attribution p={p} inline={true}/>}</div></a></article>}

export function PropertiesPage({initialProperties=null}){const [items,setItems]=useState(initialProperties?.filter(isAvailableProperty)||[]),[loading,setLoading]=useState(initialProperties===null);useEffect(()=>{getProperties(initialProperties).then(list=>{setItems(list.filter(isAvailableProperty));setLoading(false)}).finally(()=>setLoading(false))},[]);return <>
<section className="page-heading page-wrap"><p className="eyebrow">Properties</p><h1>Current listings.<br/><em>Your next opportunity.</em></h1><p className="page-lede">Explore current listings across Bakersfield, Tehachapi, and the markets Nathanael serves, with the newest additions first.</p><div className="hero-actions"><a className="gold" href="#available-properties">Browse available properties <ArrowRight/></a><a className="text-link" href="/moving-from-los-angeles-to-bakersfield"><span>Moving from Los Angeles?</span><ArrowRight/></a></div></section>
<section id="available-properties" className="portfolio-section page-wrap"><div className="portfolio-controls"><div><p className="eyebrow">Current listings · Newest first</p><p role="status">{loading?'Loading properties…':`${items.length} properties`}</p></div></div><p><a className="inline-link" href="/past-sales">View past sales <ArrowRight/></a> | <a className="inline-link" href="/open-houses">Open houses <ArrowRight/></a></p>{!loading&&!items.length&&<p role="status">New listings will appear here as they become available. Tell Nathanael what you are looking for below.</p>}<div className="property-grid">{items.map(p=><PropertyCard key={p.slug||p.id} p={p} onOpen={x=>trackEvent('property_select',{property_id:x.id,property_slug:x.slug,source:'properties_grid'})}/>)}</div></section>
<section id="buyer-intent" className="inquiry-section"><div><p className="eyebrow">Your property search</p><h2>Looking for something else?<br/><em>Let's narrow it down.</em></h2><p>Tell Nathanael what you need, where you want to be, your timeline, lot requirements, and how you plan to finance it.</p></div><BuyerIntentForm source="properties-page"/></section>
</>}

export function PropertyDetailPage({slug,initialProperty=null}){
 const [p,setP]=useState(initialProperty),[loading,setLoading]=useState(!initialProperty),[all,setAll]=useState([]);
 const [lightbox,setLightbox]=useState(null);
 useEffect(()=>{Promise.all([getProperty(slug),getProperties()]).then(([x,list])=>{setP(x||initialProperty);setAll(list||[]);if(x){applyPropertySeo(x);trackEvent('property_view',{property_id:x.id,property_slug:x.slug,source:'property_page'})}}).finally(()=>setLoading(false))},[slug]);
 const similar=useMemo(()=>all.filter(isAvailableProperty).filter(x=>String(x.id)!==String(p?.id)),[all,p]);
 if(loading)return <section className="page-heading page-wrap" style={{minHeight:'100vh'}}><p className="eyebrow">Property</p><h1>Loading <em>property details.</em></h1></section>;
 if(!p)return <section className="page-heading page-wrap"><p className="eyebrow">Property not found</p><h1>This property is <em>not available here.</em></h1><a className="gold" href="/properties">View properties <ArrowRight/></a></section>;
 const gallery=(p.images||[]).filter(Boolean);
 return <>
 {lightbox!==null&&<Lightbox images={gallery} initialIndex={lightbox} onClose={()=>setLightbox(null)}/>}
 <section className="property-detail page-wrap"><div><p className="eyebrow">{p.status||'Property'}</p><h1>{p.address||'Property opportunity'}</h1><p className="page-lede"><MapPin/> {[p.city,p.state,p.zip].filter(Boolean).join(' ')}</p><p className="featured-price">{p.price?money(p.price):'Contact for price'}</p><Facts p={p}/>{/^sold$/i.test(p.status)&&<p className="context-line">Past sale shown for reference. This property is not currently offered for sale.</p>}{p.headline&&<h2 className="property-headline">{p.headline}</h2>}<p className="property-description">{p.description||'Contact Nathanael for current details, availability, and property-specific guidance.'}</p><div className="property-detail-meta">{p.attribution&&<Attribution p={p}/>}{p.sourceMls&&<span className="property-mls">MLS# {p.sourceMls}</span>}</div><div className="property-action-row"><a className="gold" href="#property-inquiry" onClick={()=>trackEvent(/^coming soon$/i.test(p.status)?'early_interest_click':'showing_click',{property_id:p.id,property_slug:p.slug})}>{/^sold$/i.test(p.status)?'Find a similar property':/^coming soon$/i.test(p.status)?'Request early information':'Schedule / ask about this property'} <CalendarCheck/></a>{p.videoUrl&&<a className="text-link" href={p.videoUrl} target="_blank" rel="noreferrer" onClick={()=>trackEvent('video_start',{property_id:p.id,property_slug:p.slug})}><span>Watch video</span><PlayCircle/></a>}</div></div><Photo p={p} featured onOpen={()=>setLightbox(0)}/></section>
 {gallery.length>1&&<section className="property-section page-wrap"><div className="section-heading"><div><p className="eyebrow">Gallery</p><h2>See the property <em>in context.</em></h2></div><p className="gallery-hint">Click any photo to enlarge</p></div><PropertyGallery property={p} images={gallery} onOpenImage={setLightbox}/></section>}
 {(p.latitude&&p.longitude)&&<section className="property-section page-wrap"><div className="section-heading"><div><p className="eyebrow">Location</p><h2>Find {[p.address.split(' ')[0]].filter(Boolean).join(' ')} <em>on the map.</em></h2></div><a className="inline-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address+', '+p.city+', '+p.state+' '+p.zip)}`} target="_blank" rel="noreferrer">Open directions <ArrowRight/></a></div><figure><img src={`https://maps.googleapis.com/maps/api/staticmap?center=${p.latitude},${p.longitude}&zoom=15&size=1200&maptype=roadmap&markers=color:red%7C${p.latitude},${p.longitude}`} alt={`Map showing location of ${p.address}, ${p.city}, ${p.state} ${p.zip}`} width="1200" height="400" loading="lazy" style={{display:'block',width:'100%',height:'auto'}}/><figcaption className="source-note">Map reference image. Google imagery; capture date unknown.</figcaption></figure></section>}
 {(p.features?.length>0||p.locationContext)&&<section className="svc svc--tint property-context"><div className="svc-split"><div><p className="eyebrow">Property context</p><h2>Look past the photos.<br/><em>Understand the asset.</em></h2>{p.locationContext&&<p>{p.locationContext}</p>}</div>{p.features?.length>0&&<ul className="property-feature-list">{p.features.map((f,i)=><li key={`${f}-${i}`}>{f}</li>)}</ul>}</div></section>}
 <section id="property-inquiry" className="inquiry-section"><div><p className="eyebrow">Property inquiry</p><h2>Interested in this one?<br/><em>See the full picture.</em></h2><p>Share your buyer profile so Nathanael can respond with this property in context—not in isolation.</p></div><BuyerIntentForm earlyInterest={/^coming soon$/i.test(p.status)} propertyId={p.databaseId === null ? null : p.id} source={`property:${p.slug}`}/></section>
 {similar.length>0&&<section className="portfolio-section page-wrap similar-properties"><div className="section-heading"><div><p className="eyebrow">More current listings</p><h2>Not quite right?<br/><em>Keep the search moving.</em></h2></div><a className="inline-link" href="/properties">View all properties <ArrowRight/></a></div><div className="property-grid">{similar.map(x=><PropertyCard key={x.slug||x.id} p={x} onOpen={item=>trackEvent('similar_property_click',{property_id:item.id,property_slug:item.slug,from_property_id:p.id})}/>)}</div></section>}
 </>}

export function PastSalesPage(){
 const soldProperties=staticProperties.filter(p=>/^sold$/i.test(p.status)).sort((a,b)=>new Date(b.date)-new Date(a.date));
 const featured=soldProperties[0];
 const others=soldProperties.slice(1);
 const stats={
  total:soldProperties.length,
  avgPrice:Math.round(soldProperties.reduce((s,p)=>s+p.price,0)/soldProperties.length),
  priceRange:{min:Math.min(...soldProperties.map(p=>p.price)),max:Math.max(...soldProperties.map(p=>p.price))},
  regions:new Set(soldProperties.map(p=>p.region)).size,
 };
 const featuredDate=featured?new Date(featured.date+'T12:00:00').toLocaleDateString('en-US',{year:'numeric',month:'short'}):'';
 return <>
 <section className="page-heading page-wrap"><p className="eyebrow">Past sales</p><h1>A record of <em>real results.</em></h1><p className="page-lede">Verified past transactions across Kern County and regional markets. These properties are shown as examples of Nathanael's transaction experience and are not currently offered for sale.</p><div className="hero-actions"><a className="gold" href="/properties">View current listings <ArrowRight/></a><a className="text-link" href="/contact"><span>Looking for something specific?</span><ArrowRight/></a></div></section>
 <section className="portfolio-section page-wrap"><div className="section-heading"><div><p className="eyebrow">Transaction Summary</p><h2>Market experience <em>across regions.</em></h2></div></div><div className="stats-grid"><article className="stat-card"><h3>{stats.total}</h3><p>Verified transactions</p></article><article className="stat-card"><h3>${(stats.avgPrice/1000).toFixed(0)}K</h3><p>Average transaction price</p></article><article className="stat-card"><h3>${(stats.priceRange.min/1000).toFixed(0)}K - ${(stats.priceRange.max/1000).toFixed(0)}K</h3><p>Price range</p></article><article className="stat-card"><h3>{stats.regions} regions</h3><p>Geographic coverage</p></article></div></section>
 {featured&&featured.images?.length>0&&<section className="portfolio-section page-wrap"><div className="section-heading"><div><p className="eyebrow">Featured Transaction</p><h2>The detail that <em>speaks.</em></h2></div></div><div className="featured-transaction"><article className="featured-property-compact"><Photo p={featured} featured/><div className="featured-property-info"><div><p className="eyebrow">Sold {featuredDate}</p><h3>{featured.address}</h3><p className="property-location">{featured.city}, {featured.zip}</p><Facts p={featured}/>{featured.lot&&<p className="property-fact">Lot: {featured.lot}</p>}</div><div><strong className="transaction-price">{money(featured.price)}</strong>{featured.context&&<p>{featured.context}</p>}</div></div></article></div>{featured.images?.length>1&&<div className="featured-gallery-preview"><p className="eyebrow">{featured.images.length} photos</p><div className="gallery-grid">{featured.images.slice(0,6).map((src,i)=><div key={src+i} className="gallery-thumb"><img src={src} alt={`${featured.address} photo ${i+1}`} loading="lazy"/></div>)}</div>}</div>}</section>}
 {others.length>0&&<section className="portfolio-section page-wrap"><div className="section-heading"><div><p className="eyebrow">Other Verified Sales</p><h2>A portfolio of <em>closed transactions.</em></h2></div><a className="inline-link" href="/properties">View current opportunities <ArrowRight/></a></div><div className="property-grid">{others.map(p=><PropertyCard key={p.slug||p.id} p={p}/>)}</div></section>}
 <section className="property-cta"><div><p className="eyebrow">Looking for your next home?</p><h2>Let's find your fit.<br/><em>Based on real market insight.</em></h2><p>Whether you're buying, selling, or investing, Nathanael brings verified transaction experience and practical market knowledge to every conversation.</p></div><div className="actions"><a className="gold" href="/properties">See current listings <ArrowRight/></a><a className="inline-link" href="/contact"><span>Start a conversation</span><ArrowRight/></a></div></section>
 </>}

export function OpenHousesPage(){return <>
<section className="page-heading page-wrap"><p className="eyebrow">Open houses</p><h1>See your next home <em>in person.</em></h1><p className="page-lede">Confirmed open-house dates will be posted here. Contact Nathanael to confirm upcoming dates or arrange a private showing.</p><div className="hero-actions"><a className="gold" href="/contact">Ask about a private showing <ArrowRight/></a><a className="inline-link" href="/properties">View current listings <ArrowRight/></a></div></section>
</>}
