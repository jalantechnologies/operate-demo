import React from 'react';

const scenarios = [
  {
    id: 'support-ticket',
    category: 'User-reported',
    categoryColor: '#94a3b8',
    borderColor: '#e2e8f0',
    title: '"Something is broken"',
    description:
      'A recruiter files a ticket. Operate reconstructs the full request path, surfaces the root cause, and hands your engineer a ready-to-review finding.',
  },
  {
    id: 'silent-failure',
    category: 'Silent failure',
    categoryColor: '#f97316',
    borderColor: '#fed7aa',
    title: 'Nobody noticed — until candidates stopped showing up',
    description:
      'Notifications return 200s but emails never arrive. No alert fires. Operate traces the silent failure through the pipeline before a churned candidate is the first signal.',
  },
  {
    id: 'performance',
    category: 'Performance degradation',
    categoryColor: '#f59e0b',
    borderColor: '#fde68a',
    title: 'It works. Just not well enough.',
    description:
      'Recruiter search slows down intermittently. No recent deploy explains it. Operate correlates the slow query, identifies the degradation path, proposes a fix.',
  },
];

const HomePage: React.FC = () => (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700&display=swap');

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      html, body, #app {
        height: 100%;
        font-family: 'Inter', sans-serif;
        background: #fff;
        color: #0f172a;
        overflow: hidden;
      }

      .shell {
        display: flex;
        flex-direction: column;
        height: 100dvh;
        overflow: hidden;
      }

      /* ── Nav ── */
      .nav {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 40px;
        height: 52px;
        border-bottom: 1px solid #f1f5f9;
      }
      .nav-brand {
        display: flex;
        align-items: baseline;
        gap: 3px;
      }
      .nav-wordmark {
        font-size: 17px;
        font-weight: 700;
        letter-spacing: -0.03em;
        color: #0f172a;
      }
      .nav-dot {
        font-size: 20px;
        font-weight: 700;
        color: #01417f;
        line-height: 1;
      }
      .nav-meta {
        font-size: 12px;
        color: #94a3b8;
        margin-left: 10px;
        font-weight: 400;
      }
      .nav-right {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
      }
      .nav-powered { color: #94a3b8; }
      .nav-operate-link {
        color: #01417f;
        font-weight: 600;
        text-decoration: none;
        font-size: 12px;
      }
      .nav-operate-link:hover { text-decoration: underline; }

      /* ── Body split ── */
      .body {
        flex: 1;
        display: grid;
        grid-template-columns: 300px 1fr;
        overflow: hidden;
        min-height: 0;
      }

      /* ── Left panel ── */
      .left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 36px 32px 32px;
        border-right: 1px solid #f1f5f9;
        background: #fafbfc;
        overflow: hidden;
      }

      .left-eyebrow {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #01417f;
        margin-bottom: 14px;
      }

      .left-heading {
        font-size: 18px;
        font-weight: 600;
        letter-spacing: -0.025em;
        line-height: 1.35;
        color: #0f172a;
        margin-bottom: 12px;
      }

      .left-body {
        font-size: 13px;
        line-height: 1.65;
        color: #64748b;
        margin-bottom: 0;
      }

      .steps {
        display: flex;
        flex-direction: column;
        gap: 9px;
        margin-top: 24px;
      }

      .step {
        display: flex;
        align-items: flex-start;
        gap: 9px;
      }

      .step-n {
        width: 16px;
        height: 16px;
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

      .step-t {
        font-size: 12px;
        line-height: 1.55;
        color: #64748b;
      }

      /* ── Left bottom ── */
      .left-footer {
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
      }

      .cta-hint {
        font-size: 11px;
        color: #94a3b8;
        margin-bottom: 10px;
      }

      .cta-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #01417f;
        color: #fff;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        text-decoration: none;
        letter-spacing: -0.01em;
        font-family: inherit;
        cursor: pointer;
        border: none;
        transition: background 0.12s;
      }
      .cta-btn:hover { background: #01518f; }

      /* ── Right panel — scenarios ── */
      .right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 32px 40px;
        gap: 10px;
        overflow: hidden;
      }

      .right-eyebrow {
        font-size: 10px;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #94a3b8;
        margin-bottom: 6px;
      }

      .cards {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .card {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 16px;
        align-items: center;
        padding: 16px 18px;
        background: #fff;
        border: 1px solid #e2e8f0;
        border-left-width: 3px;
        border-radius: 8px;
      }

      .card-cat {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        margin-bottom: 5px;
      }

      .card-title {
        font-size: 14px;
        font-weight: 600;
        letter-spacing: -0.015em;
        color: #0f172a;
        margin-bottom: 5px;
        line-height: 1.3;
      }

      .card-desc {
        font-size: 12px;
        line-height: 1.6;
        color: #64748b;
      }

      .trigger-btn {
        flex-shrink: 0;
        padding: 6px 14px;
        border-radius: 6px;
        border: 1px solid #e2e8f0;
        background: #f8fafc;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 500;
        cursor: not-allowed;
        font-family: inherit;
        white-space: nowrap;
      }
    `}</style>

    <div className="shell">
      {/* Nav — mirrors bettrsw.com style */}
      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="nav-brand">
            <span className="nav-wordmark">Reclr</span>
            <span className="nav-dot">.</span>
          </div>
          <span className="nav-meta">Recruitment Platform · Operate Demo</span>
        </div>
        <div className="nav-right">
          <span className="nav-powered">Powered by</span>
          <a
            className="nav-operate-link"
            href="https://bettrsw.com/operate"
            target="_blank"
            rel="noreferrer"
          >
            Operate by Better
          </a>
        </div>
      </nav>

      {/* Split body */}
      <div className="body">

        {/* Left — orientation */}
        <aside className="left">
          <div>
            <p className="left-eyebrow">Interactive Demo</p>
            <h1 className="left-heading">
              See Operate investigate a live production incident.
            </h1>
            <p className="left-body">
              Reclr is a fictional recruitment SaaS. The three scenarios on the
              right are the exact failure patterns Operate is built to handle —
              the ones your engineers are losing hours to right now.
            </p>
            <div className="steps">
              <div className="step">
                <span className="step-n">1</span>
                <span className="step-t">Trigger a scenario to inject the incident into the app</span>
              </div>
              <div className="step">
                <span className="step-n">2</span>
                <span className="step-t">Open the Operate dashboard — watch context gathering, root cause analysis, and verification run in real time</span>
              </div>
              <div className="step">
                <span className="step-n">3</span>
                <span className="step-t">Review the finding and approve — nothing ships without sign-off</span>
              </div>
            </div>
          </div>

          <div className="left-footer">
            <p className="cta-hint">Already triggered a scenario?</p>
            <a className="cta-btn" href="/operate">
              Open Operate Dashboard →
            </a>
          </div>
        </aside>

        {/* Right — scenario cards */}
        <section className="right">
          <p className="right-eyebrow">Demo Scenarios — triggers coming soon</p>
          <div className="cards">
            {scenarios.map((s) => (
              <div
                className="card"
                key={s.id}
                style={{ borderLeftColor: s.borderColor }}
              >
                <div>
                  <p className="card-cat" style={{ color: s.categoryColor }}>
                    {s.category}
                  </p>
                  <p className="card-title">{s.title}</p>
                  <p className="card-desc">{s.description}</p>
                </div>
                <button disabled className="trigger-btn">
                  Trigger
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </>
);

export default HomePage;
