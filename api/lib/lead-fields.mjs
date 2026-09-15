export const statuses=new Set(['new','contacted','qualified','closed']);
const limits={name:100,email:200,phone:40,current_city:120,desired_area:200,budget:100,acreage_requirement:100,property_type:100,timeline:100,financing_status:120,notes:5000,goal:100,interest:200,location:200,timing:100,message:3000};
export function leadFields(body,{required=false}={}){
 if(!body||typeof body!=='object'||Array.isArray(body))throw new Error('Invalid inquiry');
 const fields={};
 for(const [key,max] of Object.entries(limits)){
  if(body[key]===undefined)continue;
  if(body[key]!==null&&typeof body[key]!=='string')throw new Error('Invalid '+key);
  fields[key]=String(body[key]??'').trim().slice(0,max);
 }
 if(required||fields.name!==undefined)if(!fields.name)throw new Error('Name is required');
 if(required||fields.email!==undefined){
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email||''))throw new Error('A valid email is required');
  fields.email=fields.email.toLowerCase();
 }
 if(body.bedrooms!==undefined){
  const v=body.bedrooms;
  if(v===''||v===null)fields.bedrooms=null;
  else if(/^(?:0|[1-9][0-9]?)$/.test(String(v)))fields.bedrooms=Number(v);
  else throw new Error('Bedrooms must be a whole number from 0 to 99');
 }
 if(body.status!==undefined){if(!statuses.has(body.status))throw new Error('Invalid status');fields.status=body.status;}
 return fields;
}
