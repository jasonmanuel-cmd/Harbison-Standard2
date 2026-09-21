import { useEffect } from 'react';
import { markdownToHtml, generateTableOfContents } from '../utils/contentLoader.js';
import { articleSchema } from '../seo.js';
import { createRelatedGuidesHtml } from '../utilities/linkingUtils.js';
import { LeadForm } from '../LeadForm.jsx';

export function ContentPage({ frontmatter, content, type = 'guide' }) {
  const { title, slug, description, published, updated, faqItems = [], keywords = '' } = frontmatter;

  useEffect(() => {
    // Set page meta tags
    document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);

    const canonical = `https://www.harbisonstandard.com${type === 'blog' ? '/blog/' : '/guide/'}${slug}`;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', canonical);

    // Inject schema
    document.querySelectorAll('script[data-content-jsonld]').forEach(s => s.remove());

    const schemas = articleSchema(title, description, `${type === 'blog' ? '/blog/' : '/guide/'}${slug}`, published, updated, faqItems);
    schemas.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-content-jsonld', 'true');
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    });
  }, [title, slug, description, published, updated, faqItems]);

  const toc = generateTableOfContents(content);
  const html = markdownToHtml(content.replace(/^\s*# .*\r?\n/, ""));
  const relatedHtml = createRelatedGuidesHtml(slug);

  return (
    <div className="content-page">
      <article className="content-article">
        <header className="content-header">
          <nav className="breadcrumb">
            <a href="/">Home</a>
            {' > '}
            <a href={type === 'blog' ? '/blog' : '/guides'}>{type === 'blog' ? 'Blog' : 'Guides'}</a>
            {' > '}
            <span>{title}</span>
          </nav>

          <h1>{title}</h1>
          <p className="lead">{description}</p>

          {published && (
            <p className="meta">
              Published {new Date(published).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              {updated && updated !== published && (
                <>
                  {' • '}
                  Updated {new Date(updated).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </>
              )}
            </p>
          )}
        </header>

        {toc && toc.length > 0 && (
          <nav className="table-of-contents">
            <h2>Contents</h2>
            <ul>
              {toc.map(item => (
                <li key={item.anchor}>
                  <a href={`#${item.anchor}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="content-body" dangerouslySetInnerHTML={{ __html: html }} />

        {faqItems && faqItems.length > 0 && (
          <section className="content-faq">
            <h2>Frequently Asked Questions</h2>
            <dl>
              {faqItems.map((item, i) => (
                <div key={i} className="faq-item">
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {relatedHtml && (
          <aside
            className="related-content-section"
            dangerouslySetInnerHTML={{ __html: relatedHtml }}
          />
        )}
      </article>

      <aside className="content-sidebar">
        <section className="sidebar-cta">
          <h3>Looking to buy or sell in Kern County?</h3>
          <p>Get personalized guidance from Nathanael Harbison, REALTOR®</p>
          <LeadForm minimal={true} />
        </section>

        <section className="sidebar-contact">
          <h4>Contact Nathanael</h4>
          <p>
            <a href="tel:+16614727499" className="btn btn-secondary">
              Call (661) 472-7499
            </a>
          </p>
          <p>
            <a href="sms:+16614727499" className="btn btn-secondary">
              Text Message
            </a>
          </p>
        </section>
      </aside>

      <style>{`
        .content-body img { 
                  max-width: 100%; 
                  height: auto; 
                  display: block;
                }
        
                .content-body img[width],
                .content-body img[height] {
                  object-fit: contain;
                }
        
                .content-body img:not([width]):not([height]) {
                  background: #f0f0f0;
                  border-radius: 8px;
                  padding: 1rem;
                  text-align: center;
                }

                .content-page {
                  display: grid;
                  grid-template-columns: 1fr 300px;
                  gap: 2rem;
                  max-width: 1000px;
                  margin: 0 auto;
                  padding: 2rem;
                }

                @media (max-width: 768px) {
                  .content-page {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                  }
                }

                .content-header {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .breadcrumb {
          font-size: 0.875rem;
          margin-bottom: 1rem;
          color: #666;
        }

        .breadcrumb a {
          color: #0066cc;
          text-decoration: none;
        }

        .breadcrumb a:hover {
          text-decoration: underline;
        }

        .content-article h1 {
          font-size: 2.5rem;
          margin: 0.5rem 0 1rem;
          color: #1a1a1a;
        }

        .lead {
          font-size: 1.125rem;
          color: #666;
          margin: 0 0 1rem;
        }

        .meta {
          font-size: 0.875rem;
          color: #999;
          margin: 0;
        }

        .table-of-contents {
          background: #f9f9f9;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 2rem 0;
        }

        .table-of-contents h2 {
          font-size: 1.125rem;
          margin: 0 0 1rem;
        }

        .table-of-contents ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .table-of-contents li {
          margin: 0.5rem 0;
        }

        .table-of-contents a {
          color: #0066cc;
          text-decoration: none;
        }

        .table-of-contents a:hover {
          text-decoration: underline;
        }

        .content-body {
          line-height: 1.8;
          color: #333;
        }

        .content-body h2 {
          font-size: 1.75rem;
          margin: 2rem 0 1rem;
          padding-top: 1rem;
          scroll-margin-top: 80px;
        }

        .content-body h3 {
          font-size: 1.25rem;
          margin: 1.5rem 0 0.75rem;
        }

        .content-body p {
          margin: 1rem 0;
        }

        .content-body ul,
        .content-body ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }

        .content-body li {
          margin: 0.5rem 0;
        }

        .content-body code {
          background: #f4f4f4;
          padding: 0.2em 0.4em;
          border-radius: 3px;
          font-family: monospace;
        }

        .content-body pre {
          background: #f4f4f4;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .content-body a {
          color: #0066cc;
          text-decoration: none;
        }

        .content-body a:hover {
          text-decoration: underline;
        }

        .content-faq {
          margin: 3rem 0 2rem;
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .content-faq h2 {
          margin-top: 0;
        }

        .faq-item {
          margin-bottom: 1.5rem;
        }

        .faq-item dt {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .faq-item dd {
          margin: 0 0 1rem;
          color: #555;
        }

        .related-content-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f0f7ff;
          border-left: 4px solid #0066cc;
          border-radius: 4px;
        }

        .related-content-section h3 {
          margin-top: 0;
        }

        .related-content-section a {
          color: #0066cc;
          text-decoration: none;
        }

        .related-content-section a:hover {
          text-decoration: underline;
        }

        .content-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar-cta,
        .sidebar-contact {
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .sidebar-cta h3,
        .sidebar-contact h4 {
          margin-top: 0;
          color: #1a1a1a;
        }

        .sidebar-cta p {
          font-size: 0.9rem;
          margin: 0.5rem 0 1rem;
        }

        .btn {
          display: block;
          padding: 0.75rem 1rem;
          margin: 0.5rem 0;
          text-align: center;
          border-radius: 4px;
          text-decoration: none;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary {
          background: #0066cc;
          color: white;
        }

        .btn-secondary:hover {
          background: #0052a3;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}
