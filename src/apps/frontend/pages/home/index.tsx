import React, { useState, useEffect } from 'react';

// ─── Header (ported from bettrsw Header.tsx) ───────────────────────────────

const BetterHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: '#fff',
        borderBottom: scrolled ? '1px solid #e2e8f0' : '1px solid transparent',
        transition: 'border-color 0.3s',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Logo */}
          <a href="https://bettrsw.com" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/assets/img/better-logo-blue.png" alt="Better Software" style={{ height: '28px', width: 'auto' }} />
          </a>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }} className="better-nav-desktop">
            <a
              href="https://bettrsw.com/#services"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Build <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>for founders</span>
            </a>
            <a
              href="https://bettrsw.com/operate"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '14px', color: '#64748b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Operate <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 400 }}>for enterprises</span>
            </a>
          </div>

          {/* CTA */}
          <div className="better-nav-desktop">
            <a
              href="https://calendly.com/jjalan/1-1"
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                height: '36px',
                padding: '0 16px',
                borderRadius: '8px',
                background: '#01417f',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
            >
              Get in Touch
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="better-nav-mobile"
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              height: '44px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: '20px',
              color: '#0f172a',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="better-nav-mobile"
          style={{
            display: 'block',
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#fff',
            zIndex: 40,
            padding: '32px',
          }}
        >
          <a
            href="https://bettrsw.com/#services"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: '#0f172a', textDecoration: 'none', padding: '16px 0', borderBottom: '1px solid #e2e8f0' }}
          >
            Build <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>for founders</span>
          </a>
          <a
            href="https://bettrsw.com/operate"
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: '#0f172a', textDecoration: 'none', padding: '16px 0', borderBottom: '1px solid #e2e8f0' }}
          >
            Operate <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 400 }}>for enterprises</span>
          </a>
          <a
            href="https://calendly.com/jjalan/1-1"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '32px', height: '48px', borderRadius: '8px', background: '#01417f', color: '#fff', fontSize: '16px', fontWeight: 500, textDecoration: 'none' }}
          >
            Get in Touch
          </a>
        </div>
      )}
    </header>
  );
};

// ─── Footer (ported from bettrsw Footer.tsx) ───────────────────────────────

const BetterFooter: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: 'hsl(220 14% 96% / 0.3)', paddingTop: '64px', paddingBottom: '32px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}>
        {/* Main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: '64px', marginBottom: '64px' }} className="footer-grid">
          {/* Left */}
          <div>
            <a href="https://bettrsw.com" target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginBottom: '24px' }}>
              <img src="/assets/img/better-logo-blue.png" alt="Better Software" style={{ height: '36px', width: 'auto' }} />
            </a>
            <p style={{ color: '#64748b', maxWidth: '360px', lineHeight: 1.65, fontSize: '15px', marginBottom: '32px' }}>
              Better Software is a product engineering company — part of{' '}
              <a href="https://bettrhq.com" target="_blank" rel="noreferrer" style={{ color: '#0f172a', textDecoration: 'none' }}>Better</a>.
              {' '}We help founders ship MVPs, scale products, and build engineering teams.
            </p>
            {/* Ratings strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
              {[
                { name: 'GoodFirms', score: '5.0', url: 'https://www.goodfirms.co/company/better-software', logo: '/assets/img/goodfirms.svg', h: '20px' },
                { name: 'Clutch', score: '4.9', url: 'https://clutch.co/profile/better-software', logo: '/assets/img/clutch.svg', h: '18px' },
              ].map((p, i) => (
                <React.Fragment key={p.name}>
                  {i > 0 && <div style={{ width: '1px', height: '48px', background: '#e2e8f0' }} />}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <a href={p.url} target="_blank" rel="noreferrer">
                      <img src={p.logo} alt={p.name} style={{ height: p.h, width: 'auto' }} />
                    </a>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px', fontWeight: 600, color: '#0f172a' }}>{p.score}</span>
                      <span style={{ fontSize: '13px', color: '#f59e0b', letterSpacing: '2px' }}>★★★★★</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right: link columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }} className="footer-links-grid">
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Solutions</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li>
                  <a href="https://bettrsw.com/#services" target="_blank" rel="noreferrer" style={{ fontSize: '15px', color: '#64748b', textDecoration: 'none' }}>Build</a>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>for founders</span>
                </li>
                <li>
                  <a href="https://bettrsw.com/operate" target="_blank" rel="noreferrer" style={{ fontSize: '15px', color: '#64748b', textDecoration: 'none' }}>Operate</a>
                  <span style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>for enterprises</span>
                </li>
              </ul>
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Company</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: 'Portfolio', href: 'https://bettrsw.com/#portfolio' },
                  { label: 'Testimonials', href: 'https://bettrsw.com/#testimonials' },
                  { label: 'Blog', href: 'https://bettrsw.com/blog' },
                  { label: 'Life at Better', href: 'https://bettrhq.com/life' },
                  { label: 'Careers', href: 'https://piplhq.com/organizations/bettrhq/careers' },
                ].map(l => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: '15px', color: '#64748b', textDecoration: 'none' }}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', marginBottom: '20px' }}>Free Resources</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { label: "Founder's Playbook", href: 'https://bettrsw.com/ebook/the-founders-playbook' },
                  { label: 'Engineering Principles', href: 'https://bettrsw.com/ebook/engineering-principles' },
                  { label: 'Build Systems Guide', href: 'https://bettrsw.com/ebook/build-systems-developers-recommend' },
                ].map(l => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: '15px', color: '#64748b', textDecoration: 'none' }}>{l.label}</a>
                  </li>
                ))}
              </ul>
              <p style={{ fontSize: '15px', fontWeight: 600, color: '#0f172a', margin: '40px 0 20px' }}>
                Also by{' '}
                <a href="https://bettrhq.com" target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Better</a>
              </p>
              <ul style={{ listStyle: 'none' }}>
                <li>
                  <a href="https://bettrmktg.com" target="_blank" rel="noreferrer" style={{ fontSize: '15px', color: '#64748b', textDecoration: 'none' }}>Better Marketing</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: '32px', borderTop: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '14px', color: '#94a3b8' }}>© {year} Jalan Technology Consulting Pvt. Ltd.</p>
        </div>
      </div>
    </footer>
  );
};

// ─── Scenarios ─────────────────────────────────────────────────────────────

const scenarios = [
  {
    id: 'support-ticket',
    category: 'User-reported',
    title: '"Something is broken"',
    description:
      'A recruiter files a ticket. Operate reconstructs the full request path, surfaces the root cause, and hands your engineer a ready-to-review finding.',
  },
  {
    id: 'silent-failure',
    category: 'Silent failure',
    title: 'Nobody noticed — until it was too late',
    description:
      'Sends return 200s but candidates never receive emails. No alert fires. Operate traces the silent failure before a churned candidate is the only signal.',
  },
  {
    id: 'performance',
    category: 'Performance degradation',
    title: 'It works. Just not well enough.',
    description:
      'Recruiter search slows intermittently, unlinked to any deploy. Operate identifies the slow query path and proposes a targeted fix in under 15 minutes.',
  },
];

// ─── Main page ──────────────────────────────────────────────────────────────

const HomePage: React.FC = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body, #app {
        font-family: 'Inter', sans-serif;
        background: #fff;
        color: #0f172a;
      }

      /* Desktop-only nav elements */
      @media (min-width: 1024px) {
        .better-nav-desktop { display: flex !important; }
        .better-nav-mobile { display: none !important; }
      }
      @media (max-width: 1023px) {
        .better-nav-desktop { display: none !important; }
        .better-nav-mobile { display: flex !important; }
      }

      /* Stage — desktop: full viewport between header/footer, no scroll */
      @media (min-width: 900px) {
        .stage-wrap {
          min-height: calc(100dvh - 64px - 340px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
        }
      }
      @media (max-width: 899px) {
        .stage-wrap {
          padding: 40px 20px 56px;
        }
      }

      .stage-inner {
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        gap: 0;
      }

      /* Header block */
      .page-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 24px;
        margin-bottom: 20px;
      }
      @media (max-width: 699px) {
        .page-header { flex-direction: column; align-items: flex-start; gap: 16px; }
      }

      /* Cards */
      .cards {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
        margin-bottom: 12px;
      }
      @media (max-width: 699px) {
        .cards { grid-template-columns: 1fr; }
      }

      .card {
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        padding: 18px 18px 14px;
        display: flex;
        flex-direction: column;
        background: #fff;
        transition: box-shadow 0.15s;
      }
      .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

      /* Steps strip */
      .steps-row {
        display: flex;
        align-items: flex-start;
        padding: 11px 16px;
        background: #fafbfc;
        border: 1px solid #f1f5f9;
        border-radius: 8px;
        gap: 0;
      }
      .step-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        flex: 1;
        padding: 0 12px;
      }
      .step-item:first-child { padding-left: 4px; }
      .step-item:last-child { padding-right: 4px; }
      .step-sep { width: 1px; background: #e2e8f0; align-self: stretch; flex-shrink: 0; }
      @media (max-width: 699px) {
        .steps-row { flex-direction: column; gap: 10px; padding: 14px 16px; }
        .step-item { padding: 0; }
        .step-sep { width: 100%; height: 1px; }
      }

      /* Footer responsive */
      @media (max-width: 767px) {
        .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .footer-links-grid { grid-template-columns: 1fr 1fr !important; }
      }
    `}</style>

    <BetterHeader />

    <div style={{ paddingTop: '64px' }}>
      <main className="stage-wrap">
        <div className="stage-inner">

          {/* Page header */}
          <div className="page-header">
            <div>
              <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#01417f', marginBottom: '6px' }}>
                Interactive Demo
              </p>
              <h1 style={{ fontSize: '22px', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.25, color: '#0f172a', marginBottom: '8px' }}>
                See Operate investigate a live production incident.
              </h1>
              <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, maxWidth: '480px' }}>
                Reclr is a fictional recruitment platform — think job postings, candidate pipelines, interview scheduling, and offer management. It's built here as a realistic demo app so you can see Operate handle the same production failures your engineering team faces today.
              </p>
            </div>
            <div style={{ flexShrink: 0, textAlign: 'right' }}>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', whiteSpace: 'nowrap' }}>Already triggered a scenario?</p>
              <a
                href="/operate"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#01417f', color: '#fff', padding: '9px 18px', borderRadius: '7px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}
              >
                Open Operate Dashboard →
              </a>
            </div>
          </div>

          {/* Scenario cards */}
          <div className="cards">
            {scenarios.map((s) => (
              <div className="card" key={s.id}>
                <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '7px' }}>
                  {s.category}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.3, color: '#0f172a', marginBottom: '7px' }}>
                  {s.title}
                </p>
                <p style={{ fontSize: '12px', lineHeight: 1.65, color: '#64748b', flex: 1, marginBottom: '14px' }}>
                  {s.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 500 }}>Coming soon</span>
                  <button disabled style={{ padding: '5px 12px', borderRadius: '5px', border: '1px solid #e2e8f0', background: '#f8fafc', color: '#94a3b8', fontSize: '11px', fontWeight: 500, cursor: 'not-allowed', fontFamily: 'inherit' }}>
                    Trigger
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Steps strip */}
          <div className="steps-row">
            {[
              'Trigger a scenario to inject the incident into the demo app',
              'Open the Operate dashboard — watch context, root cause & verification run live',
              'Review the finding & approve — nothing ships without sign-off',
            ].map((text, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="step-sep" />}
                <div className="step-item">
                  <span style={{ width: '17px', height: '17px', borderRadius: '50%', background: '#e2e8f0', color: '#475569', fontSize: '9px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.45 }}>{text}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </main>

      <BetterFooter />
    </div>
  </>
);

export default HomePage;
