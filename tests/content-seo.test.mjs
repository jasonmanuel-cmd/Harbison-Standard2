import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import {parseFrontmatter,markdownToHtml,generateTableOfContents} from '../src/utils/contentLoader.js';
test('FAQ YAML preserves questions, colon values and Windows line endings',()=>{
 const raw='---\r\ntitle: Example\r\nfaqItems:\r\n  - q: "Question?"\r\n    a: "Answer: with a colon"\r\n---\r\n## Useful heading\r\n';
 const {frontmatter,content}=parseFrontmatter(raw);
 assert.deepEqual(frontmatter.faqItems,[{q:'Question?',a:'Answer: with a colon'}]);
 assert.ok(markdownToHtml(content).includes('id="'+generateTableOfContents(content)[0].anchor+'"'));
});
test('every article has visible prerendered content and unique canonical',()=>{
 const sitemap=readFileSync('dist/client/sitemap.xml','utf8');
 for(const type of ['guides','blog'])for(const file of readdirSync('src/content/'+type)){
  if(!file.endsWith('.md'))continue;
  const {frontmatter}=parseFrontmatter(readFileSync('src/content/'+type+'/'+file,'utf8'));
  assert.ok(Array.isArray(frontmatter.faqItems));
  const path=(type==='guides'?'/guide/':'/blog/')+frontmatter.slug;
  const html=readFileSync('dist/client'+path+'/index.html','utf8');
  assert.ok(html.includes('href="https://www.harbisonstandard.com'+path+'"'));
  assert.ok(html.includes('hs-content-data'));
  assert.ok(html.includes('FAQPage'));
  assert.ok(html.includes('BreadcrumbList'));
  assert.equal((html.match(/<h1\b/g)||[]).length,1);
  assert.ok(sitemap.includes(path));
 }
});
