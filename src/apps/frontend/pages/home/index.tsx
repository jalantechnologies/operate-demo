import React, { useState } from 'react';

import SilentFailureModal from 'frontend/pages/home/silent-failure-modal';

// ─── Header ──────────────────────────────────────────────────────────────────

const BetterHeader: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <a href="https://bettrsw.com" target="_blank" rel="noreferrer">
              <img
                src="/assets/img/better-logo-blue.png"
                alt="Better Software"
                style={{ height: '26px', width: 'auto', display: 'block' }}
              />
            </a>
            <div style={{ width: '1px', height: '20px', background: '#e2e8f0' }} />
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              Reclr · Operate Demo
            </span>
          </div>

          <a
            href="https://bettrsw.com/operate"
            target="_blank"
            rel="noreferrer"
            className="header-about-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#01417f',
              textDecoration: 'none',
            }}
          >
            About Operate <span style={{ opacity: 0.6 }}>→</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

// ─── Footer ──────────────────────────────────────────────────────────────────

const BetterFooter: React.FC = () => (
  <footer style={{ borderTop: '1px solid #f1f5f9', padding: '24px 32px' }}>
    <div
      style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <a href="https://bettrsw.com" target="_blank" rel="noreferrer">
          <img
            src="/assets/img/better-logo-blue.png"
            alt="Better Software"
            style={{ height: '20px', width: 'auto', display: 'block' }}
          />
        </a>
        <span style={{ color: '#cbd5e1', fontSize: '13px' }}>·</span>
        <span style={{ fontSize: '13px', color: '#94a3b8' }}>
          Reclr is a demo app built on{' '}
          <a
            href="https://bettrsw.com/operate"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#64748b', textDecoration: 'none', fontWeight: 500 }}
          >
            Operate
          </a>
        </span>
      </div>
      <p style={{ fontSize: '13px', color: '#94a3b8' }}>
        © {new Date().getFullYear()} Jalan Technology Consulting Pvt. Ltd.
      </p>
    </div>
  </footer>
);

// ─── Scenarios ───────────────────────────────────────────────────────────────

type ScenarioDef = {
  category: string;
  description: string;
  enabled: boolean;
  id: string;
  title: string;
};

const scenarios: ScenarioDef[] = [
  {
    id: 'support-ticket',
    category: 'User-reported bug',
    title: 'App is broken — user filed a ticket',
    description:
      'A user can\'t complete checkout. The PM escalates. Operate reads the ticket, traces the request, identifies the failing service, and raises a fix PR — before your engineer has finished reading the Slack thread.',
    enabled: false,
  },
  {
    id: 'silent-failure',
    category: 'Silent failure',
    title: 'System is failing. Nobody knows.',
    description:
      'Candidate emails are being dropped. The API returns 200 so no alert fires. No one is watching. Operate detects the failure in your logs, traces the cause, and raises a fix PR before it becomes a customer complaint.',
    enabled: true,
  },
  {
    id: 'performance',
    category: 'Performance regression',
    title: 'Users are frustrated. App feels slow.',
    description:
      'Search response times spike under load. Users notice. Engineers don\'t. Operate correlates the slowdown to a specific query, identifies the bottleneck, and proposes a targeted fix.',
    enabled: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body, #app {
          font-family: 'Inter', sans-serif;
          background: #fff;
          color: #0f172a;
        }

        @media (max-width: 767px) {
          .header-about-link { display: none !important; }
        }

        .stage {
          display: flex;
          justify-content: center;
          padding: 56px 32px 72px;
        }
        @media (max-width: 767px) {
          .stage { padding: 32px 20px 48px; }
        }

        .stage-inner {
          width: 100%;
          max-width: 900px;
        }

        .hero {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 36px;
          padding-bottom: 32px;
          border-bottom: 1px solid #f1f5f9;
        }
        @media (max-width: 699px) {
          .hero { flex-direction: column; gap: 20px; }
        }

        .cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-bottom: 12px;
        }
        @media (max-width: 699px) { .cards { grid-template-columns: 1fr; } }

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

        .steps-row {
          display: flex;
          align-items: flex-start;
          padding: 11px 16px;
          background: #fafbfc;
          border: 1px solid #f1f5f9;
          border-radius: 8px;
        }
        .step-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          flex: 1;
          padding: 0 12px;
        }
        .step-item:first-child { padding-left: 4px; }
        .step-item:last-child  { padding-right: 4px; }
        .step-sep { width: 1px; background: #e2e8f0; align-self: stretch; flex-shrink: 0; }
        @media (max-width: 699px) {
          .steps-row  { flex-direction: column; gap: 10px; padding: 14px 16px; }
          .step-item  { padding: 0; }
          .step-sep   { width: 100%; height: 1px; }
        }
      `}</style>

      <BetterHeader />

      {activeModal === 'silent-failure' && (
        <SilentFailureModal onClose={() => setActiveModal(null)} />
      )}

      <div
        style={{
          paddingTop: '64px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100dvh',
        }}
      >
        <main className="stage" style={{ flex: 1 }}>
          <div className="stage-inner">

            {/* Hero */}
            <div className="hero">
              <div>
                <h1
                  style={{
                    fontSize: '32px',
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    lineHeight: 1.1,
                    color: '#0f172a',
                    marginBottom: '10px',
                  }}
                >
                  Operate Demo
                </h1>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#64748b',
                    lineHeight: 1.6,
                    maxWidth: '420px',
                  }}
                >
                  Trigger a production incident below. Operate detects it,
                  investigates, and raises a fix PR — autonomously.
                </p>
              </div>

              <div style={{ flexShrink: 0, paddingTop: '4px' }}>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', textAlign: 'right' }}>
                  Already triggered a scenario?
                </p>
                <a
                  href="/operate"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#01417f',
                    color: '#fff',
                    padding: '9px 18px',
                    borderRadius: '7px',
                    fontSize: '13px',
                    fontWeight: 500,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Open Operate Dashboard →
                </a>
              </div>
            </div>

            {/* Scenario cards */}
            <div className="cards">
              {scenarios.map((s) => (
                <div className="card" key={s.id}>
                  <p
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: '#94a3b8',
                      marginBottom: '7px',
                    }}
                  >
                    {s.category}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      letterSpacing: '-0.015em',
                      lineHeight: 1.3,
                      color: '#0f172a',
                      marginBottom: '8px',
                    }}
                  >
                    {s.title}
                  </p>
                  <p
                    style={{
                      fontSize: '12px',
                      lineHeight: 1.65,
                      color: '#64748b',
                      flex: 1,
                      marginBottom: '14px',
                    }}
                  >
                    {s.description}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '10px',
                      borderTop: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 500 }}>
                      {s.enabled ? '' : 'Coming soon'}
                    </span>
                    <button
                      disabled={!s.enabled}
                      onClick={() => s.enabled && setActiveModal(s.id)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '5px',
                        border: '1px solid #e2e8f0',
                        background: s.enabled ? '#fff' : '#f8fafc',
                        color: s.enabled ? '#0f172a' : '#94a3b8',
                        fontSize: '11px',
                        fontWeight: 500,
                        cursor: s.enabled ? 'pointer' : 'not-allowed',
                        fontFamily: 'inherit',
                        transition: 'background 0.15s, border-color 0.15s',
                      }}
                    >
                      Trigger
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Steps strip */}
            <div className="steps-row">
              {[
                'Trigger a scenario to inject the incident into the app',
                'Operate detects it, investigates, and raises a fix PR',
                'Review the PR and approve — nothing merges without sign-off',
              ].map((text, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="step-sep" />}
                  <div className="step-item">
                    <span
                      style={{
                        width: '17px',
                        height: '17px',
                        borderRadius: '50%',
                        background: '#e2e8f0',
                        color: '#475569',
                        fontSize: '9px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '1px',
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.45 }}>
                      {text}
                    </span>
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
};

export default HomePage;
