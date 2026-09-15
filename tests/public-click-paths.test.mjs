import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {transformWithEsbuild} from 'vite';

async function loadComponent(file, name, dependencies={}) {
 const source=readFileSync(file,'utf8').replace(/^import .*;\s*$/gm,'').replaceAll('export function','function');
 const {code}=await transformWithEsbuild(source,file,{loader:'jsx',jsxFactory:'element',jsxFragment:'Fragment'});
 const values=[];let index=0;
 const context={element:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)}),Fragment:'fragment',useState:initial=>{const i=index++;if(!(i in values))values[i]=initial;return [values[i],value=>{values[i]=typeof value==='function'?value(values[i]):value}]},useRef:()=>({current:null}),useEffect:()=>{},useId:()=> 'test',window:{location:{search:'',pathname:'/contact'}},URLSearchParams,encodeURIComponent,...dependencies};
 runInNewContext(code+`;globalThis.Component=${name}`,context);
 return {render:(props)=>{index=0;return context.Component(props)},values};
}
const nodes=node=> !node||typeof node!=='object'?[]:[node,...(node.children||[]).flatMap(nodes)];
const button=(tree,label)=>nodes(tree).find(n=>n.type==='button'&&n.children.includes(label));
const icons=Object.fromEntries(['ArrowRight','ArrowLeft','HouseLine','Key','Hammer','ChartLineUp','ChatCircle','Envelope','Check','Copy','CheckCircle','List','X','Phone','ChatCircleText'].map(x=>[x,x]));

test('general inquiry success records one conversion and removes send controls; failure remains retryable',async()=>{
 for(const succeeds of [true,false]){
  const requests=[],events=[];let release;
  const component=await loadComponent('src/LeadForm.jsx','LeadForm',{...icons,agent:{email:'test@example.test'},getSessionId:()=> 'session',trackEvent:(...args)=>events.push(args),fetch:(url,options)=>{requests.push({url,options});if(url==='/api/lead')return Promise.resolve({ok:true});return new Promise(resolve=>{release=()=>resolve({ok:succeeds})})}});
  const render=()=>component.render({source:'contact'});
  button(render(),'Continue ').props.onClick();
  let tree=render();
  for(const [name,value] of [['name','Test User'],['email','test@example.test']])nodes(tree).find(n=>n.type==='input'&&n.props.name===name).props.onChange({target:{name,value,setCustomValidity:()=>{}}}),tree=render();
  nodes(tree).find(n=>n.type==='form').props.onSubmit({preventDefault:()=>{}});
  const pending=button(render(),'Send inquiry').props.onClick();
  assert.equal(button(render(),'Sending…').props.disabled,true);
  assert.equal(button(render(),' Edit').props.disabled,true);
  assert.equal(requests[1].options.headers['Content-Type'],'application/json');
  release();await pending;
  const conversions=events.filter(([name])=>name==='generate_lead');
  assert.equal(conversions.length,succeeds?1:0);
  assert.equal(Boolean(button(render(),'Send inquiry')),!succeeds);
  if(succeeds){assert.equal(nodes(render()).some(n=>n.props.className==='inquiry-review'),false);assert.equal(JSON.stringify(conversions).includes('test@example.test'),false);}
 }
});

test('mobile menu rerender preserves property component identity and route key',async()=>{
 const PropertyDetailPage=()=>{};
 const component=await loadComponent('src/App.jsx','App',{...icons,Home:()=>{},About:()=>{},Contact:()=>{},PropertiesPage:()=>{},PastSalesPage:()=>{},OpenHousesPage:()=>{},MovingFromLosAngeles:()=>{},Hq:()=>{},WhyTehachapi:()=>{},CheapLandKernCounty:()=>{},BakersfieldHomePrices:()=>{},TehachapiHomePrices:()=>{},ServicePage:()=>{},SocialLinks:()=>{},servicePages:{},PropertyDetailPage,agent:{},siteUrl:'https://example.test',routes:{},jsonLdFor:()=>[],trackEvent:()=>{},captureAttribution:()=>{},trackPageView:()=>{}});
 const render=()=>component.render({initialPath:'/property/example'});
 const before=nodes(render()).find(n=>n.type===PropertyDetailPage);
 assert.ok(before);
 nodes(render()).find(n=>n.props.className==='menu-toggle').props.onClick();
 const after=nodes(render()).find(n=>n.type===PropertyDetailPage);
 assert.equal(after.type,before.type);assert.equal(after.props.key,before.props.key);assert.equal(after.props.slug,'example');
});

test('buyer inquiry counts a saved inquiry even if notification fails, but not a rejected save',async()=>{
 for(const saved of [true,false]){
  const events=[];
  const component=await loadComponent('src/BuyerIntentForm.jsx','BuyerIntentForm',{...icons,captureAttribution:()=>({utmSource:'test'}),getSessionId:()=> 'session',trackEvent:(...args)=>events.push(args),fetch:async()=>({ok:saved,json:async()=>({notificationSent:false})})});
  const render=()=>component.render({propertyId:'example',source:'property:example'});
  await nodes(render()).find(n=>n.type==='form').props.onSubmit({preventDefault:()=>{}});
  const tree=render();
  assert.equal(events.filter(([name])=>name==='generate_lead').length,saved?1:0);
  assert.equal(nodes(tree).some(n=>n.type==='form'),!saved);
  assert.ok(nodes(tree).some(n=>n.children.some(x=>typeof x==='string'&&x.includes(saved?'inquiry is saved':'couldn’t save'))));
 }
});
