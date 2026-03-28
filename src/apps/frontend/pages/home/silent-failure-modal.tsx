import React, { useEffect, useState } from 'react';

type TriggerState = 'idle' | 'loading' | 'done' | 'error';

type SilentFailureModalProps = {
  onClose: () => void;
};

const SilentFailureModal: React.FC<SilentFailureModalProps> = ({ onClose }) => {
  const [state, setState] = useState<TriggerState>('idle');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const trigger = async () => {
    setState('loading');
    try {
      const res = await fetch('/api/scenarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_id: 'silent-failure' }),
      });
      if (!res.ok) throw new Error('Request failed');
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          zIndex: 100,
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 101,
          width: '100%',
          maxWidth: '560px',
          margin: '0 16px',
          background: '#fff',
          borderRadius: '14px',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px 24px 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '16px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                marginBottom: '4px',
              }}
            >
              Silent failure
            </p>
            <h2
              style={{
                fontSize: '17px',
                fontWeight: 600,
                letterSpacing: '-0.02em',
                lineHeight: 1.3,
                color: '#0f172a',
              }}
            >
              Emails drop. No alert fires.
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              flexShrink: 0,
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              color: '#64748b',
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'inherit',
              marginTop: '2px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* What is happening */}
          <div>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                marginBottom: '6px',
              }}
            >
              The scenario
            </p>
            <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#475569' }}>
              Reclr's email pipeline returns <code style={{ fontSize: '12px', background: '#f1f5f9', padding: '1px 5px', borderRadius: '3px', color: '#0f172a' }}>200 OK</code> but
              silently drops the message before delivery. The candidate never hears back.
              No alert fires. Your on-call never wakes up. The only signal is a recruiter
              noticing a dead pipeline days later.
            </p>
          </div>

          {/* What Operate does */}
          <div>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#94a3b8',
                marginBottom: '6px',
              }}
            >
              What Operate does
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Detects the error in Datadog logs and opens a case automatically — no ticket, no manual triage.',
                'Reads the request path, correlates log signals, and identifies where the message was dropped.',
                'Surfaces a finding with root cause and a suggested fix. Your engineer reviews and approves — nothing ships without sign-off.',
              ].map((text, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      flexShrink: 0,
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#e2e8f0',
                      color: '#475569',
                      fontSize: '9px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: '2px',
                    }}
                  >
                    {i + 1}
                  </span>
                  <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#475569' }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flow diagram */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexWrap: 'wrap',
              padding: '10px 12px',
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '7px',
            }}
          >
            {[
              'Error logged',
              'Datadog alert',
              'Operate webhook',
              'Case created',
              'Finding ready',
            ].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap' }}>
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <span style={{ fontSize: '11px', color: '#cbd5e1' }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            background: '#fafbfc',
          }}
        >
          {state === 'done' ? (
            <>
              <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 500 }}>
                ✓ Failure injected — Operate is on it
              </span>
              <a
                href="/operate"
                style={{
                  padding: '7px 16px',
                  borderRadius: '6px',
                  background: '#01417f',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Open Operate Dashboard →
              </a>
            </>
          ) : (
            <>
              {state === 'error' && (
                <span style={{ fontSize: '12px', color: '#dc2626' }}>
                  Something went wrong. Try again.
                </span>
              )}
              {state !== 'error' && <span />}
              <button
                onClick={trigger}
                disabled={state === 'loading'}
                style={{
                  padding: '7px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  background: state === 'error' ? '#fee2e2' : '#01417f',
                  color: state === 'error' ? '#dc2626' : '#fff',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit',
                  transition: 'background 0.15s',
                  whiteSpace: 'nowrap',
                }}
              >
                {state === 'loading' ? 'Triggering…' : state === 'error' ? 'Retry' : 'Trigger scenario'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SilentFailureModal;
