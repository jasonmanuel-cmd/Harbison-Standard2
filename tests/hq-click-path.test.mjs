import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {transform} from 'esbuild';

const {code}=await transform(await readFile(new URL('../src/Hq.jsx',import.meta.url),'utf8'),{loader:'jsx',format:'cjs',jsx:'automatic'});
const lead=id=>({id,name:`Lead ${id}`,email:`${id}@example.com`,status:'new',notes:'Saved note',created_at:'2026-09-10'});
function harness(){
 const slots=[],effects=[],requests=[];let cursor=0,tree;
 const react={useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],v=>slots[i]=typeof v==='function'?v(slots[i]):v];},useRef(value){const i=cursor++;return slots[i]??=( {current:value});},useEffect(fn,deps){const i=cursor++;if(!slots[i]||deps.some((v,n)=>v!==slots[i][n])){slots[i]=deps;effects.push(fn);}}};
 const jsx=(type,props)=>({type,props:props||{}});
 const module={exports:{}};
 vm.runInNewContext(code,{module,exports:module.exports,require:name=>name==='react'?react:name==='react/jsx-runtime'?{jsx,jsxs:jsx}:new Proxy({},{get:(_,key)=>key}),sessionStorage:{getItem:()=> 'test-token',setItem(){},removeItem(){}},URLSearchParams,fetch:(path,options)=>new Promise(resolve=>requests.push({path,options,resolve:body=>resolve({status:200,ok:true,json:async()=>body})})),location:{},console});
 function render(){cursor=0;tree=module.exports.Hq();return tree;}
 function nodes(node){if(node==null||typeof node!=='object')return [];if(Array.isArray(node))return node.flatMap(nodes);return [node,...nodes(node.props?.children)];}
 function text(node){if(node==null||typeof node==='boolean')return '';if(typeof node!=='object')return String(node);if(Array.isArray(node))return node.map(text).join('');return text(node.props?.children);}
 function find(type,label){const result=nodes(tree).find(n=>n.type===type&&(typeof label==='function'?label(n.props):text(n).includes(label)));assert.ok(result,`Missing ${type}: ${label}`);return result.props;}
 async function settle(){for(let i=0;i<8;i++)await Promise.resolve();render();}
 function runEffects(){while(effects.length)effects.shift()();}
 async function answerList(){requests.filter(r=>!r.done&&(r.path.startsWith('/api/stats')||r.path.startsWith('/api/leads'))).forEach(r=>{r.done=true;r.resolve(r.path.startsWith('/api/stats')?{totalLeads:2}: {leads:[lead('a'),lead('b')]});});await settle();}
 return {render,find,requests,settle,runEffects,answerList,text:()=>text(tree)};
}
async function ready(){const h=harness();h.render();h.runEffects();await h.answerList();return h;}
async function open(h,id){h.find('button',`Lead ${id}`).onClick();h.requests.at(-1).resolve({lead:lead(id),visits:[]});await h.settle();}

test('HQ search and status controls request matching filters',async()=>{
 const h=await ready();h.find('input',p=>p.placeholder==='Search name or email').onChange({target:{value:'buyer'}});h.render();h.runEffects();assert.match(h.requests.at(-1).path,/q=buyer/);await h.answerList();
 h.find('button',p=>p.className!==undefined&&p.children==='Qualified').onClick();h.render();h.runEffects();assert.match(h.requests.at(-1).path,/status=qualified/);
});
test('HQ latest selected lead wins when earlier detail response finishes late',async()=>{
 const h=await ready();h.find('button','Lead a').onClick();const a=h.requests.at(-1);h.render();h.find('button','Lead b').onClick();const b=h.requests.at(-1);b.resolve({lead:lead('b'),visits:[]});await h.settle();a.resolve({lead:lead('a'),visits:[]});await h.settle();assert.equal(h.find('h2','Lead b').children,'Lead b');
});
test('HQ refresh and status save preserve unsaved notes',async()=>{
 const h=await ready();await open(h,'a');h.find('textarea',p=>p.placeholder?.startsWith('Add a note')).onChange({target:{value:'Draft note'}});h.render();h.find('button','Refresh').onClick();await h.answerList();assert.equal(h.find('textarea',p=>p.placeholder?.startsWith('Add a note')).value,'Draft note');
 h.find('button',p=>p.className===''&&Array.isArray(p.children)&&p.children.includes('Contacted')).onClick();h.requests.at(-1).resolve({ok:true});await h.settle();await h.answerList();assert.equal(h.find('textarea',p=>p.placeholder?.startsWith('Add a note')).value,'Draft note');
});
test('HQ Add lead closes edit state and invalidates pending detail',async()=>{
 const h=await ready();await open(h,'a');h.find('button','Edit').onClick();h.render();h.find('button','Add lead').onClick();h.render();assert.ok(!h.text().includes('Edit lead'));assert.ok(h.text().includes('Manual entry'));
 h.find('button','Lead b').onClick();const request=h.requests.at(-1);h.render();h.find('button','Add lead').onClick();request.resolve({lead:lead('b'),visits:[]});await h.settle();assert.ok(!h.text().includes('Inquiry detail'));
});
test('HQ pending detail cannot restore data after sign out',async()=>{
 const h=await ready();h.find('button','Lead a').onClick();const request=h.requests.at(-1);h.render();h.find('button','Sign out').onClick();request.resolve({lead:lead('a'),visits:[]});await h.settle();assert.ok(h.text().includes('Sign in to your leads'));assert.ok(!h.text().includes('Lead a'));
});

test('HQ duplicate manual submission sends only one write',async()=>{
 const h=await ready();h.find('button','Add lead').onClick();h.render();const submit=h.find('form',p=>p.className==='hq-edit-grid').onSubmit;
 submit({preventDefault(){}});submit({preventDefault(){}});assert.equal(h.requests.filter(r=>r.options.method==='POST').length,1);
 h.requests.at(-1).resolve({ok:true});await h.settle();await h.answerList();assert.ok(!h.text().includes('Manual entry'));
});
test('HQ older search response cannot overwrite newer filter results',async()=>{
 const h=await ready();h.find('input',p=>p.placeholder==='Search name or email').onChange({target:{value:'old'}});h.render();h.runEffects();const old=h.requests.slice(-2);
 h.find('input',p=>p.placeholder==='Search name or email').onChange({target:{value:'new'}});h.render();h.runEffects();const newer=h.requests.slice(-2);
 newer[0].resolve({totalLeads:2});newer[1].resolve({leads:[lead('new')]});await h.settle();old[0].resolve({totalLeads:2});old[1].resolve({leads:[lead('old')]});await h.settle();assert.ok(h.text().includes('Lead new'));assert.ok(!h.text().includes('Lead old'));
});
