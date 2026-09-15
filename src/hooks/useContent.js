import { useState, useEffect } from 'react';
import { parseFrontmatter } from '../utils/contentLoader.js';

/**
 * Custom hook to load markdown content by slug
 * Dynamically imports .md files from /src/content/{type}/
 */
export function useContent(type, slug) {
  const [content, setContent] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type || !slug) {
      setLoading(false);
      return;
    }

    const loadContent = async () => {
      try {
        // Dynamically import markdown file
        const module = await import(
          `../content/${type}/${slug}.md?raw`
        );

        // Extract raw markdown string
        const rawMarkdown = module.default;

        // Parse frontmatter and content
        const { frontmatter, content } = parseFrontmatter(rawMarkdown);

        setContent({ frontmatter, content, type });
        setError(null);
      } catch (err) {
        setError(`Could not load ${type}: ${slug}`);
        setContent(null);
        console.error('Content loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [type, slug]);

  return { content, error, loading };
}

/**
 * Get list of all available guides
 */
export async function getGuidesList() {
  // In a real implementation, you'd read from the filesystem or API
  // For now, return a static list that should be kept in sync with actual files
  return [
    { slug: 'tehachapi-land-under-50k', title: 'Tehachapi Land Under $50K' },
    { slug: 'tehachapi-homes-with-acreage', title: 'Tehachapi Homes with Acreage' },
    { slug: 'cheap-land-california-city-vs-tehachapi', title: 'California City vs Tehachapi' },
    { slug: 'cheap-land-kern-county', title: 'Cheap Land in Kern County' },
    { slug: 'bakersfield-homes-under-400k', title: 'Bakersfield Homes Under $400K' },
    { slug: 'owner-financing-land-tehachapi', title: 'Owner Financing Guide' },
    { slug: 'kern-county-investment-properties', title: 'Investment Properties' },
    { slug: 'preforeclosure-properties-kern-county', title: 'Preforeclosure Properties' },
    { slug: 'inherited-house-bakersfield', title: 'Inherited House Guide' },
    { slug: 'tax-defaulted-properties-kern-county', title: 'Tax-Defaulted Properties' },
    // Additional guides to be created later
    { slug: 'tehachapi-vs-bakersfield', title: 'Tehachapi vs Bakersfield' },
  ];
}

/**
 * Get list of all available blog posts
 */
export async function getBlogList() {
  return [
    { slug: 'kern-county-market-update-september-2026', title: 'Kern County Market Update — September 2026' },
    { slug: 'what-40k-buys-tehachapi-september-2026', title: 'What $40K Buys in Tehachapi' },
    // Additional posts to be created
  ];
}
