import React from 'react';

const scenarios = [
  {
    id: 'support-ticket',
    category: 'User-reported',
    categoryColor: '#64748b',
    accentColor: '#64748b',
    title: '"Something is broken"',
    description:
      'A recruiter files a ticket. Operate reconstructs the full request path, surfaces the root cause, and hands your engineer a ready-to-review finding.',
  },
  {
    id: 'silent-failure',
    category: 'Silent failure',
    categoryColor: '#ea580c',
    accentColor: '#ea580c',
    title: 'Nobody noticed — until it was too late',
    description:
      'Sends return 200s but candidates never receive emails. No alert fires. Operate traces the silent failure before a churned candidate is the only signal.',
  },
  {
    id: 'performance',
    category: 'Performance degradation',
    categoryColor: '#d97706',
    accentColor: '#d97706',
    title: 'It works. Just not well enough.',
    description:
      'Recruiter search slows intermittently, unlinked to any deploy. Operate identifies the slow query path and proposes a targeted fix in under 15 minutes.',
  },
];

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

      /* ── Nav ── */
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        height: 52px;
        border-bottom: 1px solid #f1f5f9;
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 10;
      }
      .nav-brand { display: flex; align-items: baseline; }
      .nav-wordmark { font-size: 16px; font-weight: 700; letter-spacing: -0.03em; color: #0f172a; }
      .nav-period { color: #01417f; font-size: 18px; font-weight: 700; }
      .nav-subtitle {
        margin-left: 10px;
        font-size: 12px;
        color: #94a3b8;
        padding-left: 10px;
        border-left: 1px solid #e2e8f0;
      }
      .nav-right { font-size: 12px; display: flex; align-items: center; gap: 5px; }
      .nav-powered { color: #94a3b8; }
      .nav-link { color: #01417f; font-weight: 600; text-decoration: none; font-size: 12px; }
      .nav-link:hover { text-decoration: underline; }

      /* ── Desktop: single viewport ── */
      @media (min-width: 900px) {
        html, body, #app { height: 100%; overflow: hidden; }

        .page {
          display: flex;
          flex-direction: column;
          height: 100dvh;
          overflow: hidden;
        }
        .stage {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 0 48px;
          min-height: 0;
          gap: 0;
        }
      }

      /* ── Mobile/tablet: natural scroll ── */
      @media (max-width: 899px) {
        .page { display: block; }
        .stage {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 32px 20px 48px;
          gap: 0;
        }
        .nav { padding: 0 20px; }
        .nav-subtitle { display: none; }
      }

      /* ── Header block ── */
      .header {
        width: 100%;
        max-width: 900px;
        margin-bottom: 20px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 24px;
      }
      .header-eyebrow {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #01417f;
        margin-bottom: 6px;
      }
      .header-title {
        font-size: 22px;
        font-weight: 600;
        letter-spacing: -0.03em;
        line-height: 1.25;
        color: #0f172a;
      }
      .header-sub {
        font-size: 13px;
        color: #64748b;
        line-height: 1.55;
        margin-top: 6px;
        max-width: 460px;
      }
      .header-cta { flex-shrink: 0; text-align: right; }
      .header-hint { font-size: 11px; color: #94a3b8; margin-bottom: 8px; }

      .cta {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #01417f;
        color: #fff;
        padding: 9px 18px;
        border-radius: 7px;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        font-family: inherit;
        letter-spacing: -0.01em;
        transition: background 0.12s;
        white-space: nowrap;
      }
      .cta:hover { background: #015299; }

      @media (max-width: 899px) {
        .header { flex-direction: column; align-items: flex-start; gap: 16px; margin-bottom: 24px; }
        .header-cta { text-align: left; }
        .header-hint { margin-bottom: 6px; }
      }

      /* ── Cards ── */
      .cards {
        width: 100%;
        max-width: 900px;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 12px;
      }

      @media (max-width: 899px) {
        .cards { grid-template-columns: 1fr; gap: 10px; }
      }

      .card {
        border-radius: 10px;
        border: 1px solid #e2e8f0;
        border-top: 3px solid;
        padding: 18px 18px 14px;
        display: flex;
        flex-direction: column;
        background: #fff;
        transition: box-shadow 0.15s;
      }
      .card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.06); }

      .card-cat {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 7px;
      }
      .card-title {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.015em;
        line-height: 1.3;
        color: #0f172a;
        margin-bottom: 7px;
      }
      .card-desc {
        font-size: 12px;
        line-height: 1.65;
        color: #64748b;
        flex: 1;
        margin-bottom: 14px;
      }
      .card-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 10px;
        border-top: 1px solid #f1f5f9;
      }
      .card-status { font-size: 10px; color: #cbd5e1; font-weight: 500; }
      .trigger-btn {
        padding: 5px 12px;
        border-radius: 5px;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        color: #94a3b8;
        font-size: 11px;
        font-weight: 500;
        cursor: not-allowed;
        font-family: inherit;
      }

      /* ── Steps strip ── */
      .steps-row {
        width: 100%;
        max-width: 900px;
        display: flex;
        align-items: center;
        margin-top: 14px;
        padding: 11px 16px;
        background: #fafbfc;
        border-radius: 8px;
        border: 1px solid #f1f5f9;
        gap: 0;
      }
      .step-item {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        flex: 1;
        padding: 0 12px;
      }
      .step-item:first-child { padding-left: 0; }
      .step-item:last-child { padding-right: 0; }
      .step-n {
        width: 17px;
        height: 17px;
        border-radius: 50%;
        background: #e2e8f0;
        color: #475569;
        font-size: 9px;
        font-weight: 700;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-top: 1px;
      }
      .step-t { font-size: 11px; color: #64748b; line-height: 1.45; }
      .step-sep { width: 1px; height: 26px; background: #e2e8f0; flex-shrink: 0; }

      @media (max-width: 899px) {
        .steps-row {
          flex-direction: column;
          gap: 10px;
          padding: 14px 16px;
          margin-top: 20px;
        }
        .step-item { padding: 0; }
        .step-sep { width: 100%; height: 1px; }
      }
    `}</style>

    <div className="page">
      {/* Nav */}
      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="nav-brand">
            <span className="nav-wordmark">Reclr</span>
            <span className="nav-period">.</span>
          </div>
          <span className="nav-subtitle">Recruitment Platform · Operate Demo</span>
        </div>
        <div className="nav-right">
          <span className="nav-powered">Powered by</span>
          <a className="nav-link" href="https://bettrsw.com/operate" target="_blank" rel="noreferrer">
            Operate by Better
          </a>
        </div>
      </nav>

      <main className="stage">
        {/* Header */}
        <div className="header">
          <div>
            <p className="header-eyebrow">Interactive Demo</p>
            <h1 className="header-title">See Operate investigate a live production incident.</h1>
            <p className="header-sub">
              Reclr is a fictional recruitment SaaS built to demo Operate — it has real
              services, a real database, and real failure modes. Each scenario below injects
              a production incident into Reclr. Trigger one and watch Operate investigate it
              the same way it would in your own system.
            </p>
          </div>
          <div className="header-cta">
            <p className="header-hint">Already triggered a scenario?</p>
            <a className="cta" href="/operate">Open Operate Dashboard →</a>
          </div>
        </div>

        {/* Cards */}
        <div className="cards">
          {scenarios.map((s) => (
            <div className="card" key={s.id} style={{ borderTopColor: s.accentColor }}>
              <p className="card-cat" style={{ color: s.categoryColor }}>{s.category}</p>
              <p className="card-title">{s.title}</p>
              <p className="card-desc">{s.description}</p>
              <div className="card-footer">
                <span className="card-status">Coming soon</span>
                <button disabled className="trigger-btn">Trigger</button>
              </div>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div className="steps-row">
          <div className="step-item">
            <span className="step-n">1</span>
            <span className="step-t">Trigger a scenario to inject the incident into the demo app</span>
          </div>
          <div className="step-sep" />
          <div className="step-item">
            <span className="step-n">2</span>
            <span className="step-t">Open the Operate dashboard — watch context, root cause &amp; verification run live</span>
          </div>
          <div className="step-sep" />
          <div className="step-item">
            <span className="step-n">3</span>
            <span className="step-t">Review the finding &amp; approve — nothing ships without sign-off</span>
          </div>
        </div>
      </main>
    </div>
  </>
);

export default HomePage;
