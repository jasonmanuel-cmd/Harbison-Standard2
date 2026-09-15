import { useEffect } from 'react';
import { siteUrl } from '../seo';

export function GuidesIndex() {
  const guides = [
    { slug: 'tehachapi-land-under-50k', title: 'Tehachapi Land Under $50K', description: 'Buy affordable land in Tehachapi for $50K or less.' },
    { slug: 'tehachapi-homes-with-acreage', title: 'Tehachapi Homes with Acreage', description: 'Buy a home with land in Tehachapi. Explore 1–5 acre properties.' },
    { slug: 'cheap-land-california-city-vs-tehachapi', title: 'California City vs Tehachapi', description: 'Compare land prices and investment potential in both markets.' },
    { slug: 'bakersfield-homes-under-400k', title: 'Bakersfield Homes Under $400K', description: 'Explore neighborhoods and investment potential in Bakersfield.' },
    { slug: 'bakersfield-homes-with-shop', title: 'Bakersfield Homes with Shop', description: 'Find homes with workshop spaces, garages, and commercial potential.' },
    { slug: 'owner-financing-land-tehachapi', title: 'Owner Financing Guide', description: 'Get approved for owner financing without bank denial.' },
    { slug: 'kern-county-investment-properties', title: 'Investment Properties', description: 'Analyze cash flow and strategies for land flips and rentals.' },
    { slug: 'preforeclosure-properties-kern-county', title: 'Preforeclosure Properties', description: 'Find and buy preforeclosure properties at discount.' },
    { slug: 'inherited-house-bakersfield', title: 'Inherited House Guide', description: 'Navigate probate, sell, refinance, or rent an inherited property.' },
    { slug: 'tax-defaulted-properties-kern-county', title: 'Tax-Defaulted Properties', description: 'Buy tax auctions at big discounts in Kern County.' },
    { slug: 'sell-home-as-is-kern-county', title: 'Sell Home As-Is', description: 'Sell distressed properties fast without repairs or inspections.' },
    { slug: 'tehachapi-vs-bakersfield', title: 'Tehachapi vs Bakersfield', description: 'Compare both markets for lifestyle, investment, and appreciation potential.' },
    { slug: 'first-time-homebuyer-kern-county', title: 'First-Time Homebuyer Guide', description: 'Step-by-step guide from pre-approval to closing on your first home.' },
    { slug: 'vacation-rental-investment-kern-county', title: 'Vacation Rental Investment', description: 'Buy and operate Airbnb/VRBO properties in Kern County for higher ROI.' },
  ];

  useEffect(() => {
    document.title = 'Real Estate Guides | Harbison Standard';
    document.querySelector('meta[name="description"]')?.setAttribute('content', 'Real estate guides for buying, selling, and investing in Kern County.');
  }, []);

  return (
    <section className="page-wrap">
      <header className="page-heading" style={{ marginBottom: '3rem' }}>
        <h1>Real Estate Guides</h1>
        <p>Practical guidance for buying, selling, and investing in Kern County</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem'
      }}>
        {guides.map(guide => (
          <article key={guide.slug} style={{
            padding: '1.5rem',
            background: '#f9f9f9',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            textDecoration: 'none'
          }}>
            <a href={`/guide/${guide.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <h3 style={{ margin: '0 0 0.75rem', fontSize: '1.125rem', color: '#1a1a1a' }}>
                {guide.title}
              </h3>
              <p style={{ margin: '0', color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {guide.description}
              </p>
              <span style={{ color: '#0066cc', fontSize: '0.9rem', marginTop: '1rem', display: 'inline-block', fontWeight: 'bold' }}>
                Read guide →
              </span>
            </a>
          </article>
        ))}
      </div>

      <section style={{ textAlign: 'center', padding: '2rem', background: '#f0f7ff', borderRadius: '8px' }}>
        <h2>Have a question?</h2>
        <p>Contact Nathanael Harbison for personalized guidance</p>
        <a href="/contact" className="gold">Get in touch</a>
      </section>
    </section>
  );
}
