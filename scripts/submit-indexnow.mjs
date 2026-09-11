import {readFileSync} from 'node:fs';
import {siteUrl} from '../src/siteConfig.js';
const deadline=setTimeout(()=>{console.error('IndexNow submission timed out; receipt is unconfirmed.');process.exit(1);},60000);
const key=readFileSync('public/indexnow-key.txt','utf8').trim();
const keyLocation=siteUrl+'/indexnow-key.txt';
console.log('Verifying the deployed IndexNow key.');
const response=await fetch(keyLocation,{signal:AbortSignal.timeout(15000)});
if(!response.ok||(await response.text()).trim()!==key)throw new Error('Deploy the IndexNow key before submitting');
console.log('Reading the live sitemap.');
const map=await fetch(siteUrl+'/sitemap.xml',{signal:AbortSignal.timeout(15000)});
if(!map.ok)throw new Error('Cannot read production sitemap');
const urls=[...new Set([...(await map.text()).matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&')))];
if(!urls.length||urls.length>10000||urls.some(u=>new URL(u).origin!==siteUrl||/^\/(hq|api)(\/|$)/.test(new URL(u).pathname)))throw new Error('Invalid public sitemap');
console.log('Submitting public sitemap URLs.');
const result=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({host:new URL(siteUrl).host,key,keyLocation,urlList:urls}),signal:AbortSignal.timeout(20000)});
if(![200,202].includes(result.status))throw new Error('IndexNow returned '+result.status);
console.log('IndexNow received '+urls.length+' public URLs (HTTP '+result.status+'). Search indexing is not guaranteed.');

clearTimeout(deadline);
