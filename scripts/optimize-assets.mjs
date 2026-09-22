import sharp from 'sharp';
import {mkdirSync,writeFileSync,readdirSync,existsSync,statSync} from 'node:fs';
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

// Every property photo also gets a phone (400) and desktop (800) WebP variant.
// The path is the contract, so nothing has to carry a 1,000-entry manifest:
//   public/assets/property/foo-1.jpg -> /assets/optimized/property/foo-1-400.webp
// Re-run after adding photos:  npm run images        (add --force to redo all)
const propertyDir='public/assets/property';
const propertyOutput=output+'/property';
const variantWidths=[400,800];
const force=process.argv.includes('--force');
let written=0,current=0;
if(existsSync(propertyDir)){
 mkdirSync(propertyOutput,{recursive:true});
 for(const file of readdirSync(propertyDir).filter(f=>/\.(jpe?g|png)$/i.test(f))){
  const stem=file.replace(/\.[^.]+$/,'');
  const source=propertyDir+'/'+file;
  for(const width of variantWidths){
   const dest=propertyOutput+'/'+stem+'-'+width+'.webp';
   if(!force&&existsSync(dest)&&statSync(dest).mtimeMs>=statSync(source).mtimeMs){current++;continue;}
   await sharp(source).rotate().resize({width,withoutEnlargement:true}).webp({quality:76}).toFile(dest);
   written++;
  }
 }
}
console.log('property variants: '+written+' written, '+current+' already current ('+(written+current)+' total)');

console.log(manifest);
