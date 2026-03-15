import React from 'react';

const scenarios = [
  {
    id: 'email-failure',
    tag: 'Scenario 01',
    title: 'Email delivery failure',
    situation:
      'A notification send is returning 500s. Candidates are not receiving interview confirmations.',
    whatOperateDoes:
      'Operate traces the failure across the notification service, surfaces the faulting downstream dependency, and delivers a root cause finding — without a single engineer needing to open a log.',
  },
  {
    id: 'search-slowdown',
    tag: 'Scenario 02',
    title: 'Candidate search slowdown',
    situation:
      'A slow query on the applications table is degrading search response times for recruiters.',
    whatOperateDoes:
      'Operate identifies the query, correlates it with recent schema changes, and proposes an indexed fix — in under 15 minutes.',
  },
  {
    id: 'support-ticket',
    tag: 'Scenario 03',
    title: 'Support ticket → investigation',
    situation:
      '"Candidates from mobile aren\'t receiving confirmation emails" — a ticket filed by a recruiter.',
    whatOperateDoes:
      'Operate picks up the ticket, reconstructs the full request path, and delivers a structured finding with a proposed resolution. Your engineer reviews and approves.',
  },
];

const HomePage: React.FC = () => (
  <div
    className="min-h-screen"
    style={{
      fontFamily: "'Inter', sans-serif",
      backgroundColor: '#0b1120',
      color: '#e2e8f0',
    }}
  >
    {/* Nav */}
    <header
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        backgroundColor: 'rgba(11,17,32,0.95)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '56px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              fontSize: '15px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#f1f5f9',
            }}
          >
            Reclr
          </span>
          <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '13px' }}>
            /
          </span>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
            Recruitment Platform
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>
            Powered by
          </span>
          <a
            href="https://bettrsw.com/operate"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#4da6ff',
              textDecoration: 'none',
              letterSpacing: '0.01em',
            }}
          >
            Operate
          </a>
        </div>
      </div>
    </header>

    {/* Hero */}
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '96px 24px 72px',
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#4da6ff',
          marginBottom: '20px',
        }}
      >
        Interactive Demo — Operate by Better
      </p>

      {/* Headline */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 600,
          letterSpacing: '-0.03em',
          lineHeight: 1.08,
          color: '#f1f5f9',
          maxWidth: '780px',
          marginBottom: '24px',
        }}
      >
        Your team loses{' '}
        <span style={{ color: '#4da6ff' }}>30–40% of engineering capacity</span>{' '}
        to production investigation.
      </h1>

      {/* Subhead */}
      <p
        style={{
          fontSize: '16px',
          lineHeight: 1.7,
          color: 'rgba(226,232,240,0.6)',
          maxWidth: '560px',
          marginBottom: '32px',
        }}
      >
        This is a live demo of{' '}
        <span style={{ color: '#e2e8f0', fontWeight: 500 }}>Reclr</span>, a
        fictional recruitment SaaS. Use it to see how Operate — Better
        Software&apos;s AI investigation service — handles the exact incidents
        your engineers lose hours to every week.
      </p>

      {/* How it works callout */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '10px',
          backgroundColor: 'rgba(77,166,255,0.06)',
          border: '1px solid rgba(77,166,255,0.15)',
          borderRadius: '10px',
          padding: '12px 16px',
          maxWidth: '520px',
        }}
      >
        <span
          style={{
            color: '#4da6ff',
            fontSize: '13px',
            marginTop: '1px',
            flexShrink: 0,
          }}
        >
          ↓
        </span>
        <p style={{ fontSize: '13px', color: 'rgba(226,232,240,0.55)', lineHeight: 1.6 }}>
          Trigger a scenario below, then open the Operate dashboard to watch the
          investigation run in real time. Your engineer reviews the finding and
          approves — nothing ships without their sign-off.
        </p>
      </div>
    </section>

    {/* Divider */}
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    />

    {/* Scenarios */}
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '64px 24px 80px',
      }}
    >
      <p
        style={{
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.3)',
          marginBottom: '32px',
        }}
      >
        Demo Scenarios
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px',
        }}
      >
        {scenarios.map((s) => (
          <div
            key={s.id}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '12px',
              padding: '28px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0',
            }}
          >
            {/* Tag */}
            <p
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(77,166,255,0.6)',
                marginBottom: '12px',
              }}
            >
              {s.tag}
            </p>

            {/* Title */}
            <h3
              style={{
                fontSize: '15px',
                fontWeight: 600,
                letterSpacing: '-0.01em',
                color: '#f1f5f9',
                marginBottom: '10px',
              }}
            >
              {s.title}
            </h3>

            {/* Situation */}
            <p
              style={{
                fontSize: '13px',
                lineHeight: 1.65,
                color: 'rgba(226,232,240,0.5)',
                marginBottom: '20px',
              }}
            >
              {s.situation}
            </p>

            {/* What Operate does */}
            <div
              style={{
                borderTop: '1px solid rgba(255,255,255,0.06)',
                paddingTop: '16px',
                marginBottom: '24px',
                flex: 1,
              }}
            >
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                  marginBottom: '8px',
                }}
              >
                What Operate does
              </p>
              <p
                style={{
                  fontSize: '13px',
                  lineHeight: 1.65,
                  color: 'rgba(226,232,240,0.45)',
                }}
              >
                {s.whatOperateDoes}
              </p>
            </div>

            {/* CTA */}
            <button
              disabled
              style={{
                width: '100%',
                padding: '9px 16px',
                borderRadius: '8px',
                border: '1px solid rgba(255,255,255,0.08)',
                backgroundColor: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.2)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'not-allowed',
                letterSpacing: '0.01em',
              }}
            >
              Trigger scenario — coming soon
            </button>
          </div>
        ))}
      </div>
    </section>

    {/* Divider */}
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    />

    {/* Footer CTA */}
    <section
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '64px 24px 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <div>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '6px',
          }}
        >
          Already triggered a scenario?
        </p>
        <p
          style={{
            fontSize: '13px',
            color: 'rgba(226,232,240,0.5)',
            maxWidth: '440px',
            lineHeight: 1.6,
          }}
        >
          Open the Operate dashboard to watch the investigation unfold — context
          gathering, root cause analysis, verification, proposed resolution.
        </p>
      </div>

      <a
        href="/operate"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#01417f',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
          letterSpacing: '0.01em',
          width: 'fit-content',
          transition: 'background-color 0.15s',
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            '#01518f')
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            '#01417f')
        }
      >
        Open Operate Dashboard
        <span style={{ opacity: 0.7 }}>→</span>
      </a>

      {/* About Operate footnote */}
      <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', maxWidth: '480px', lineHeight: 1.6, marginTop: '12px' }}>
        Operate is a service by{' '}
        <a
          href="https://bettrsw.com/operate"
          target="_blank"
          rel="noreferrer"
          style={{ color: 'rgba(77,166,255,0.6)', textDecoration: 'none' }}
        >
          Better Software
        </a>
        {' '}that deploys custom AI investigation agents into your engineering
        workflow — reclaiming the 30–40% of engineering capacity typically lost
        to unplanned production debugging.
      </p>
    </section>
  </div>
);

export default HomePage;
