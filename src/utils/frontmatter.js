import {parse} from 'yaml';
export function parseFrontmatter(markdown) {
 const match=markdown.replace(/\r\n/g,'\n').match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
 if(!match)return {frontmatter:{},content:markdown};
 const frontmatter=parse(match[1])||{};
 if(frontmatter.faqItems&&!Array.isArray(frontmatter.faqItems))throw new Error('faqItems must be an array');
 return {frontmatter,content:match[2]};
}
