import {marked} from 'marked';
export function markdownToHtml(markdown) {
 let html=marked.parse(markdown);
 return html.replace(/<h2>(.*?)<\/h2>/g,(_,title)=>'<h2 id="'+title.replace(/&amp;/g,'&').toLowerCase().replace(/\s+/g,'-').replace(/[^\w-]/g,'')+'">'+title+'</h2>');
}
export function getReadingTime(markdown) {
  const words = markdown.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

/**
 * Extract main heading from markdown
 */
export function getMainHeading(markdown) {
  const match = markdown.match(/^# (.*?)$/m);
  return match ? match[1] : null;
}

/**
 * Get all section headings from markdown
 */
export function getSectionHeadings(markdown) {
  const matches = markdown.matchAll(/^## (.*?)$/gm);
  return Array.from(matches).map(m => ({
    level: 2,
    title: m[1],
    anchor: m[1].toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
  }));
}

/**
 * Generate table of contents from headings
 */
export function generateTableOfContents(markdown) {
  const headings = getSectionHeadings(markdown);
  if (headings.length === 0) return null;

  return headings.map(h => ({
    ...h,
    link: `#${h.anchor}`,
  }));
}

/**
 * Validate frontmatter required fields
 */
export function validateFrontmatter(frontmatter) {
  const required = ['title', 'slug', 'description'];
  const missing = required.filter(field => !frontmatter[field]);

  if (missing.length > 0) {
    return { valid: false, errors: missing };
  }

  return { valid: true, errors: [] };
}

/**
 * Normalize slug (remove special chars, convert to lowercase)
 */
export function normalizeSlug(slug) {
  return slug.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
