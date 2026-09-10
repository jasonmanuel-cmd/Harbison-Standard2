import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowRight,HouseLine,MapPin,PlayCircle,CalendarCheck} from '@phosphor-icons/react';
import {getProperties,getProperty,isAvailableProperty,staticProperties} from './propertyApi';
import {money} from './data';
import {BuyerIntentForm} from './BuyerIntentForm';
import {applyPropertySeo} from './seo';
import {trackEvent} from './analytics';

export function Photo({p,featured=false}){const [failed,setFailed]=useState(false);const src=p.imageUrl||p.images?.[0];return <div className="property-image">{!src||failed?<div className="photo-unavailable"><HouseLine/><span>Property photo coming soon</span></div>:<img src={src} style={src.includes('/apollo/streetview')?{objectFit:'contain'}:undefined} alt={`${p.address}, ${p.city}`} loading={featured?'eager':'lazy'} onError={()=>setFailed(true)}/>}<span className="sold-badge">{p.status||'Available'}</span></div>}
function Facts({p}){return <div className="property-facts">{p.beds>0&&<span>{p.beds} beds</span>}{p.baths>0&&<span>{p.baths} baths</span>}{p.sqft>0&&<span>{Number(p.sqft).toLocaleString()} sq ft</span>}{p.lot&&<span>{p.lot} lot</span>}</div>}

function PropertyGallery({property,images}){
 const ref=useRef(null),sent=useRef(false);
 useEffect(()=>{
  if(!ref.current||sent.current)return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(x=>x.isIntersecting)&&!sent.current){sent.current=true;trackEvent('gallery_view',{property_id:property.id,property_slug:property.slug,image_count:images.length});observer.disconnect()}},{threshold:.25});
  observer.observe(ref.current);return()=>observer.disconnect();
 },[property,images.length]);
 return <div className="property-detail-gallery" ref={ref}>{images.map((src,i)=><div className="property-gallery-item" key={src+i}><img src={src} alt={`${property.address} property photo ${i+1}`} loading="lazy"/></div>)}</div>;
}

function PropertyCard({p,onOpen}){return <article className="property-card"><a href={`/property/${p.slug||p.id}`} onClick={()=>onOpen?.(p)}><Photo p={p}/><div className="property-card-body"><div className="price-line"><strong>{p.price?money(p.price):'Contact for price'}</strong><span>{p.status||'Available'}</span></div><h2>{p.address||'Property opportunity'}</h2><p className="property-location">{[p.city,p.state,p.zip].filter(Boolean).join(', ').replace(', CA,',', CA ')}</p><Facts p={p}/>{p.description&&<p className="context-line">{p.description.slice(0,170)}{p.description.length>170?'…':''}</p>}</div></a></article>}

export function PropertiesPage(){const [items,setItems]=useState([]),[loading,setLoading]=useState(true);useEffect(()=>{getProperties().then(list=>setItems(list.filter(isAvailableProperty))).finally(()=>setLoading(false))},[]);return <>
<section className="page-heading page-wrap"><p className="eyebrow">Properties</p><h1>Find the right property with <em>a local perspective.</em></h1><p className="page-lede">Explore current listings across Bakersfield, Tehachapi, and the markets Nathanael serves, with the newest additions first.</p><div className="hero-actions"><a className="gold" href="#buyer-intent">Tell us what you need <ArrowRight/></a><a className="text-link" href="/moving-from-los-angeles-to-bakersfield"><span>Moving from Los Angeles?</span><ArrowRight/></a></div></section>
<section className="portfolio-section page-wrap"><div className="portfolio-controls"><div><p className="eyebrow">Current listings - Newest first</p><p role="status">{loading?'Loading properties…':`${items.length} properties`}</p></div></div><p><a className="inline-link" href="/past-sales">View past sales <ArrowRight/></a> | <a className="inline-link" href="/open-houses">Open houses <ArrowRight/></a></p>{!loading&&!items.length&&<p role="status">New listings will appear here as they become available. Tell Nathanael what you are looking for below.</p>}<div className="property-grid">{items.map(p=><PropertyCard key={p.slug||p.id} p={p} onOpen={x=>trackEvent('property_select',{property_id:x.id,property_slug:x.slug,source:'properties_grid'})}/>)}</div></section>
<section id="buyer-intent" className="inquiry-section"><div><p className="eyebrow">Buyer acquisition</p><h2>Don’t search blindly.<br/><em>Define the target.</em></h2><p>Tell Nathanael what you need, where you want to be, your timeline, lot requirements, and how you plan to finance it.</p></div><BuyerIntentForm source="properties-page"/></section>
</>}

export function PropertyDetailPage({slug,initialProperty=null}){
 const [p,setP]=useState(initialProperty),[loading,setLoading]=useState(!initialProperty),[all,setAll]=useState([]);
 useEffect(()=>{Promise.all([getProperty(slug),getProperties()]).then(([x,list])=>{setP(x||initialProperty);setAll(list||[]);if(x){applyPropertySeo(x);trackEvent('property_view',{property_id:x.id,property_slug:x.slug,source:'property_page'})}}).finally(()=>setLoading(false))},[slug]);
 const similar=useMemo(()=>all.filter(isAvailableProperty).filter(x=>String(x.id)!==String(p?.id)).filter(x=>!p?.city||x.city===p.city).slice(0,3),[all,p]);
 if(loading)return <section className="page-heading page-wrap" style={{minHeight:'100vh'}}><p className="eyebrow">Property</p><h1>Loading <em>property details.</em></h1></section>;
 if(!p)return <section className="page-heading page-wrap"><p className="eyebrow">Property not found</p><h1>This property is <em>not available here.</em></h1><a className="gold" href="/properties">View properties <ArrowRight/></a></section>;
 const gallery=(p.images||[]).filter(Boolean).slice(0,8);
 return <>
<section className="property-detail page-wrap"><div><p className="eyebrow">{p.status||'Property'}</p><h1>{p.address||'Property opportunity'}</h1><p className="page-lede"><MapPin/> {[p.city,p.state,p.zip].filter(Boolean).join(' ')}</p><p className="featured-price">{p.price?money(p.price):'Contact for price'}</p><Facts p={p}/>{/^sold$/i.test(p.status)&&<p className="context-line">Past sale shown for reference. This property is not currently offered for sale.</p>}{p.headline&&<h2 className="property-headline">{p.headline}</h2>}<p className="property-description">{p.description||'Contact Nathanael for current details, availability, and property-specific guidance.'}</p><div className="property-action-row"><a className="gold" href="#property-inquiry" onClick={()=>trackEvent(/^coming soon$/i.test(p.status)?'early_interest_click':'showing_click',{property_id:p.id,property_slug:p.slug})}>{/^sold$/i.test(p.status)?'Find a similar property':/^coming soon$/i.test(p.status)?'Request early information':'Schedule / ask about this property'} <CalendarCheck/></a>{p.videoUrl&&<a className="text-link" href={p.videoUrl} target="_blank" rel="noreferrer" onClick={()=>trackEvent('video_start',{property_id:p.id,property_slug:p.slug})}><span>Watch video</span><PlayCircle/></a>}</div></div><Photo p={p} featured/></section>
{gallery.length>1&&<section className="property-section page-wrap"><div className="section-heading"><div><p className="eyebrow">Gallery</p><h2>See the property <em>in context.</em></h2></div></div><PropertyGallery property={p} images={gallery}/></section>}
{p.slug==='3304-apollo-st-bakersfield-ca'&&<section className="property-section page-wrap"><div className="section-heading"><div><p className="eyebrow">Location</p><h2>Find Apollo <em>on the map.</em></h2></div><a className="inline-link" href="https://www.google.com/maps/search/?api=1&query=3304+Apollo+St+Bakersfield+CA+93306" target="_blank" rel="noreferrer">Open directions <ArrowRight/></a></div><figure><img src="/assets/apollo/mapview.png" alt="Map locating 3304 Apollo Street near Columbus Street and University Avenue in Bakersfield" width="1901" height="710" loading="lazy" style={{display:'block',width:'100%',height:'auto'}}/><figcaption className="source-note">Map and street-view reference images supplied for this property. Google imagery; capture date unknown. The street view may not show current property condition.</figcaption></figure></section>}
{(p.features?.length>0||p.locationContext)&&<section className="svc svc--tint property-context"><div className="svc-split"><div><p className="eyebrow">Property context</p><h2>Look past the photos.<br/><em>Understand the asset.</em></h2>{p.locationContext&&<p>{p.locationContext}</p>}</div>{p.features?.length>0&&<ul className="property-feature-list">{p.features.map((f,i)=><li key={`${f}-${i}`}>{f}</li>)}</ul>}</div></section>}
<section id="property-inquiry" className="inquiry-section"><div><p className="eyebrow">Property inquiry</p><h2>Interested in this one?<br/><em>See the full picture.</em></h2><p>Share your buyer profile so Nathanael can respond with this property in context—not in isolation.</p></div><BuyerIntentForm earlyInterest={/^coming soon$/i.test(p.status)} propertyId={p.databaseId === null ? null : p.id} source={`property:${p.slug}`}/></section>
{similar.length>0&&<section className="portfolio-section page-wrap similar-properties"><div className="section-heading"><div><p className="eyebrow">Similar opportunities</p><h2>Not quite right?<br/><em>Keep the search moving.</em></h2></div><a className="inline-link" href="/properties">View all properties <ArrowRight/></a></div><div className="property-grid">{similar.map(x=><PropertyCard key={x.slug||x.id} p={x} onOpen={item=>trackEvent('similar_property_click',{property_id:item.id,property_slug:item.slug,from_property_id:p.id})}/>)}</div></section>}
</>}

export function PastSalesPage(){return <>
<section className="page-heading page-wrap"><p className="eyebrow">Past sales</p><h1>A record of <em>real results.</em></h1><p className="page-lede">Selected verified past transactions. These properties are shown for reference and are not currently offered for sale.</p><a className="inline-link" href="/properties">View current listings <ArrowRight/></a></section>
<section className="portfolio-section page-wrap"><div className="property-grid">{staticProperties.map(p=><PropertyCard key={p.slug} p={p}/>)}</div></section>
</>}

export function OpenHousesPage(){return <>
<section className="page-heading page-wrap"><p className="eyebrow">Open houses</p><h1>See your next home <em>in person.</em></h1><p className="page-lede">Confirmed open-house dates will be posted here. No open houses are currently scheduled.</p><div className="hero-actions"><a className="gold" href="/contact">Ask about a private showing <ArrowRight/></a><a className="inline-link" href="/properties">View current listings <ArrowRight/></a></div></section>
</>}
