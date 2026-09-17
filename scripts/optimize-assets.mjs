import sharp from 'sharp';
import {mkdirSync,writeFileSync} from 'node:fs';
const output='public/assets/optimized';
mkdirSync(output,{recursive:true});
const jobs=[['hero.webp',[768,1600]],['logo.webp',[500]],['property-front.webp',[800]],['house.webp',[800]],['investing.webp',[800]],...['585-n-wendy-dr-newbury-park-ca.jpg','585-n-wendy-dr-newbury-park-ca-2.jpg','585-n-wendy-dr-newbury-park-ca-4.jpg','backyard.jpg','bathroom1.jpg','Diningroomfacingkitchen.jpg'].map(x=>['property/'+x,[800]])];
const manifest={};
for(const [file,widths] of jobs){
 for(const width of widths){
  const name=file.split('/').pop().replace(/\.[^.]+$/,'')+'-'+width+'.webp';
  const info=await sharp('public/assets/'+file).rotate().resize({width,withoutEnlargement:true}).webp({quality:78}).toFile(output+'/'+name);
  manifest[file+'@'+width]={src:'/assets/optimized/'+name,width:info.width,height:info.height,bytes:info.size};
 }
}
writeFileSync('src/optimizedAssets.json',JSON.stringify(manifest,null,2)+'\n');
console.log(manifest);
