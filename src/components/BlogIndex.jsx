import { useEffect } from 'react';

export function BlogIndex() {
  const posts = [
    {
      slug: 'kern-county-market-update-september-2026',
      title: 'Kern County Real Estate Market Update — September 2026',
      description: 'September 2026 market trends in Kern County: land prices, inventory levels, and what\'s coming next.',
      date: '2026-09-14'
    },
    {
      slug: 'what-40k-buys-tehachapi-september-2026',
      title: 'What $40K Buys in Tehachapi Right Now (September 2026)',
      description: 'Real property analysis: what your $40K budget actually gets you in Tehachapi today.',
      date: '2026-09-14'
    },
  ];

  useEffect(() => {
    document.title = 'Real Estate Blog | Harbison Standard';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Real estate market updates, insights, and analysis for Kern County.');
  }, []);

  return (
    <section className="page-wrap">
      <header className="page-heading" style={{ marginBottom: '3rem' }}>
        <h1>Real Estate Blog</h1>
        <p>Market updates, insights, and analysis for Kern County</p>
      </header>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {posts.map((post, i) => (
          <article key={post.slug} style={{
            padding: '2rem 0',
            borderBottom: i < posts.length - 1 ? '1px solid #e5e7eb' : 'none',
            marginBottom: '2rem'
          }}>
            <p style={{ margin: '0 0 0.5rem', color: '#999', fontSize: '0.875rem' }}>
              {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h2 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.5rem', color: '#1a1a1a' }}>
              <a href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {post.title}
              </a>
            </h2>
            <p style={{ margin: '0 0 1rem', color: '#666', lineHeight: '1.6' }}>
              {post.description}
            </p>
            <a href={`/blog/${post.slug}`} style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}>
              Read full post →
            </a>
          </article>
        ))}
      </div>

      <section style={{ textAlign: 'center', padding: '3rem 2rem', marginTop: '4rem', background: '#f0f7ff', borderRadius: '8px' }}>
        <h2>Stay updated</h2>
        <p>New market updates posted regularly</p>
        <a href="/contact" className="gold">Subscribe for updates</a>
      </section>
    </section>
  );
}
