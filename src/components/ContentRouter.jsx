import { useContent } from '../hooks/useContent';
import { ContentPage } from './ContentPage';

/**
 * Router component for /guide/:slug and /blog/:slug routes
 */
export function ContentRouter({ path }) {
  const guideMatch = path.match(/^\/guide\/([^/]+)$/);
  const blogMatch = path.match(/^\/blog\/([^/]+)$/);

  if (guideMatch) {
    const slug = decodeURIComponent(guideMatch[1]);
    return <ContentPageLoader type="guides" slug={slug} />;
  }

  if (blogMatch) {
    const slug = decodeURIComponent(blogMatch[1]);
    return <ContentPageLoader type="blog" slug={slug} />;
  }

  // Not a content route
  return null;
}

/**
 * Load content and render page
 */
function ContentPageLoader({ type, slug }) {
  const { content, error, loading } = useContent(type, slug);

  if (loading) {
    return (
      <section className="page-wrap" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <p>Loading...</p>
      </section>
    );
  }

  if (error || !content) {
    return (
      <section className="page-wrap" style={{ padding: '4rem 2rem' }}>
        <h1>Page not found</h1>
        <p>Sorry, we couldn't load that {type === 'guides' ? 'guide' : 'article'}.</p>
        <a href="/">Go home</a>
      </section>
    );
  }

  return <ContentPage frontmatter={content.frontmatter} content={content.content} type={type === 'guides' ? 'guide' : 'blog'} />;
}
