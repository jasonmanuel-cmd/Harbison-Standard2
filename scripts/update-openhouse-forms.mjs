import {readFileSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
const directory = process.argv[2];
if (!directory) throw new Error('Supply the directory containing the standalone forms');
const helper = readFileSync(new URL('../public/openhouse-submit.js',import.meta.url),'utf8').replace('export async function','async function');
for (const name of ['index.html','openhouse.html']) {
  const path = join(directory,name);
  const original = readFileSync(path,'utf8');
  const pattern = /                \/\/ Try (?:CRM first|to submit to CRM first)[\s\S]*?\n                \}\);/;
  if (!pattern.test(original)) throw new Error('Expected original form handler in '+path);
  const updated = original.replace(pattern,helper+'\n                await submitOpenHouse(formData);');
  writeFileSync(path,updated);
  console.log('Updated '+path);
}
