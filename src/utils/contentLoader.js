/**
 * Parse markdown frontmatter and content
 * Frontmatter is YAML-like at the top of .md files
 */
export function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, content: markdown };
  }

  const [, frontmatterStr, content] = match;
  const frontmatter = parseFrontmatterYaml(frontmatterStr);

  return { frontmatter, content };
}

/**
 * Simple YAML parser for frontmatter
 * Supports: strings, numbers, booleans, arrays, nested objects
 */
function parseFrontmatterYaml(yaml) {
  const result = {};
  const lines = yaml.split('\n').filter(l => l.trim());

  let current = result;
  const stack = [{ obj: result, indent: -2 }];

  for (const line of lines) {
    const indent = line.search(/\S/);
    const content = line.trim();

    if (!content || content.startsWith('#')) continue;

    // Pop stack if indent decreased
    while (stack.length > 1 && indent < stack[stack.length - 1].indent) {
      stack.pop();
    }

    if (content.includes(':')) {
      const [key, value] = content.split(':').map(s => s.trim());

      if (!value) {
        // Nested object
        const newObj = {};
        stack[stack.length - 1].obj[key] = newObj;
        stack.push({ obj: newObj, indent });
      } else if (value.startsWith('[')) {
        // Array
        try {
          stack[stack.length - 1].obj[key] = JSON.parse(value);
        } catch {
          stack[stack.length - 1].obj[key] = [value];
        }
      } else {
        // Scalar value
        stack[stack.length - 1].obj[key] = parseValue(value);
      }
    }
  }

  return result;
}

/**
 * Parse YAML scalar values (strings, numbers, booleans)
 */
function parseValue(value) {
  if (value === 'true') return true;
  if (value === 'false') return false;
  if (value === 'null' || value === '') return null;
  if (!isNaN(value)) return Number(value);
  return value.replace(/^["']|["']$/g, '');
}

/**
 * Convert markdown to HTML (simple converter)
 * Supports: headings, paragraphs, bold, italic, links, lists, code blocks
 */
export function markdownToHtml(markdown) {
  let html = markdown;

  // Code blocks (preserve HTML inside)
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

  // Headings
  html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

  // Bold and italic
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');

  // Unordered lists
  html = html.replace(/^\- (.*?)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>)/s, match => `<ul>${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');

  // Paragraphs (wrap consecutive non-tag lines)
  html = html.split('\n\n').map(para => {
    if (para.trim().startsWith('<')) {
      return para;
    }
    if (para.trim().length === 0) {
      return '';
    }
    return `<p>${para}</p>`;
  }).join('\n');

  return html;
}

/**
 * Extract reading time from markdown (approx. 200 words per minute)
 */
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
