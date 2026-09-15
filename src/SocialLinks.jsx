import {FacebookLogo,InstagramLogo,YoutubeLogo,LinkedinLogo,ArrowUpRight} from '@phosphor-icons/react';
import {socials} from './data';
const icons={Facebook:FacebookLogo,Instagram:InstagramLogo,YouTube:YoutubeLogo,LinkedIn:LinkedinLogo};
export function SocialLinks({showLabels=false}){return <div className={showLabels?'social-links':'socials'}>{socials.map(({name,url})=>{const Icon=icons[name];return <a key={name} href={url} aria-label={name+' (opens in new tab)'} target="_blank" rel="noreferrer"><Icon weight={name==='Instagram'?'regular':'fill'}/>{showLabels&&<><span>{name}</span><ArrowUpRight/></>}</a>})}</div>}
