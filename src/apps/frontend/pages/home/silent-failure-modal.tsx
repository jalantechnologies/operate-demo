import { clsx } from 'clsx';
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
        className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[101] mx-4 w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Silent failure
            </p>
            <h2 className="text-[17px] font-semibold leading-snug tracking-tight text-slate-900">
              Errors are appearing in logs. Nobody has noticed yet.
            </h2>
          </div>
          <button
            onClick={onClose}
            className="mt-0.5 flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-5 px-6 py-5">
          {/* The scenario */}
          <div>
            <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              The scenario
            </p>
            <p className="text-[13px] leading-relaxed text-slate-500">
              Errors start appearing in application logs — a notification that
              never delivered, a job that silently failed, a request that
              returned success but wrote nothing. No alert fires. The team
              doesn't know yet. Operate catches it first.
            </p>
          </div>

          {/* What Operate does */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              What Operate does
            </p>
            <div className="flex flex-col gap-2">
              {[
                'Detects the error in logs — no manual triage, no ticket needed — and opens a case automatically.',
                'Traces the root cause: which service, which line, which condition caused the failure.',
                'Takes it to resolution — a fix PR, a data correction, or added logging if more signal is needed. The engineer reviews and approves.',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <p className="text-[13px] leading-relaxed text-slate-500">
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Flow */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
            {[
              'Error logged',
              'Datadog alert',
              'Operate webhook',
              'Case created',
              'Fix PR raised',
            ].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="whitespace-nowrap text-[11px] text-slate-500">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-[11px] text-slate-300">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          {state === 'done' ? (
            <>
              <span className="text-[12px] font-medium text-green-600">
                ✓ Failure injected — Operate is on it
              </span>
              <a
                href="/operate"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#01417f] px-4 py-2 text-[12px] font-medium text-white no-underline"
              >
                Open Operate Dashboard →
              </a>
            </>
          ) : (
            <>
              {state === 'error' ? (
                <span className="text-[12px] text-red-600">
                  Something went wrong. Try again.
                </span>
              ) : (
                <span />
              )}
              <button
                onClick={() => {
                  trigger().catch(() => undefined);
                }}
                disabled={state === 'loading'}
                className={clsx(
                  'rounded-lg px-4 py-2 text-[12px] font-medium transition-colors',
                  state === 'error'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-[#01417f] text-white',
                  state === 'loading'
                    ? 'cursor-not-allowed opacity-70'
                    : 'cursor-pointer',
                )}
              >
                {state === 'loading' && 'Triggering…'}
                {state === 'error' && 'Retry'}
                {state !== 'loading' && state !== 'error' && 'Trigger scenario'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SilentFailureModal;
