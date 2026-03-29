import { clsx } from 'clsx';
import React, { useEffect, useRef, useState } from 'react';

type TriggerState =
  | 'idle'
  | 'triggering'
  | 'polling'
  | 'detected'
  | 'timeout'
  | 'error';

type ScenarioRunResponse = {
  id: string;
  scenario_run_type: string;
  correlation_id: string;
  status: 'pending' | 'detected';
  operate_case_id: string | null;
  triggered_at: string;
  error_logged_at: string | null;
  datadog_alerted_at: string | null;
  webhook_received_at: string | null;
  case_created_at: string | null;
};

type TimelineData = {
  errorLoggedAt: Date;
  datadogReceivedAt: Date | null;
  datadogAlertedAt: Date | null;
  caseCreatedAt: Date | null;
};

type ScenarioModalProps = {
  onClose: () => void;
};

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 30; // 90 seconds

function formatTime(d: Date): string {
  return d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short',
  });
}

function deltaLabel(a: Date, b: Date): string | null {
  const diffMs = b.getTime() - a.getTime();
  if (Math.abs(diffMs) < 1000) return null; // same second — don't show
  const diffS = Math.round(diffMs / 1000);
  return `+${diffS}s`;
}

type TimelineStepProps = {
  index: number;
  label: string;
  sublabel: string;
  time: Date | null;
  isFirst: boolean;
  referenceTime: Date | null;
  isPending: boolean;
};

const TimelineStep: React.FC<TimelineStepProps> = ({
  index,
  label,
  sublabel,
  time,
  isFirst,
  referenceTime,
  isPending,
}) => {
  const done = time !== null;
  return (
    <div className="flex items-start gap-3">
      {/* Connector + dot */}
      <div className="flex flex-col items-center">
        <div
          className={clsx(
            'flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
            done
              ? 'bg-emerald-500 text-white'
              : isPending
                ? 'bg-slate-200 text-slate-400 animate-pulse'
                : 'bg-slate-100 text-slate-300',
          )}
        >
          {done ? '✓' : index + 1}
        </div>
        {!isFirst && false /* connectors drawn above */}
      </div>

      {/* Text */}
      <div className="flex-1 pb-0.5">
        <p
          className={clsx(
            'text-[12px] font-semibold leading-tight',
            done ? 'text-slate-800' : 'text-slate-400',
          )}
        >
          {label}
        </p>
        <p className="mt-0.5 text-[11px] text-slate-400">{sublabel}</p>
      </div>

      {/* Timestamp + delta */}
      <div className="shrink-0 text-right">
        {done ? (
          <>
            <p className="text-[11px] font-medium text-slate-600">
              {formatTime(time)}
            </p>
            {referenceTime && deltaLabel(referenceTime, time) && (
              <p className="text-[10px] text-slate-400">
                {deltaLabel(referenceTime, time)} from trigger
              </p>
            )}
          </>
        ) : isPending ? (
          <span className="inline-block h-2 w-16 animate-pulse rounded bg-slate-200" />
        ) : (
          <span className="text-[11px] text-slate-300">—</span>
        )}
      </div>
    </div>
  );
};

const ScenarioModal: React.FC<ScenarioModalProps> = ({ onClose }) => {
  const [state, setState] = useState<TriggerState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [timeline, setTimeline] = useState<TimelineData | null>(null);
  const runIdRef = useRef<string | null>(null);
  const pollCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Elapsed time ticker while polling
  useEffect(() => {
    if (state === 'polling') {
      timerRef.current = setInterval(() => {
        setElapsed((s) => s + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state]);

  const poll = async (runId: string) => {
    pollCountRef.current += 1;

    if (pollCountRef.current > POLL_MAX_ATTEMPTS) {
      setState('timeout');
      return;
    }

    try {
      const r = await fetch(`/api/scenario-runs/${runId}`);
      const run = (await r.json()) as ScenarioRunResponse;

      // Update timeline on every poll:
      // - datadogReceivedAt fills in within seconds of trigger (Datadog log ingestion)
      // - datadogAlertedAt + caseCreatedAt fill in together when the monitor fires (~1 min)
      setTimeline((prev) => ({
        errorLoggedAt: prev?.errorLoggedAt ?? new Date(run.triggered_at),
        datadogReceivedAt: run.error_logged_at
          ? new Date(run.error_logged_at)
          : null,
        datadogAlertedAt: run.datadog_alerted_at
          ? new Date(run.datadog_alerted_at)
          : null,
        caseCreatedAt: run.case_created_at
          ? new Date(run.case_created_at)
          : null,
      }));

      if (run.status === 'detected') {
        setState('detected');
      } else {
        setTimeout(() => { poll(runId).catch(() => setState('error')); }, POLL_INTERVAL_MS);
      }
    } catch {
      setState('error');
    }
  };

  const trigger = async () => {
    setState('triggering');
    setTimeline(null);
    try {
      const res = await fetch('/api/scenario-runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario_run_type: 'proactive-error-monitoring' }),
      });
      if (!res.ok) throw new Error('Request failed');
      const run = (await res.json()) as ScenarioRunResponse;
      runIdRef.current = run.id;
      pollCountRef.current = 0;
      setElapsed(0);
      // Seed step 1 immediately from triggered_at
      setTimeline({
        errorLoggedAt: new Date(run.triggered_at),
        datadogReceivedAt: null,
        datadogAlertedAt: null,
        caseCreatedAt: null,
      });
      setState('polling');
      setTimeout(() => { poll(run.id).catch(() => setState('error')); }, POLL_INTERVAL_MS);
    } catch {
      setState('error');
    }
  };

  const isActive = state === 'polling' || state === 'detected';

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="fixed inset-0 z-[100] w-full cursor-default bg-slate-900/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 z-[101] mx-4 w-full max-w-[580px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <p className="mb-1 text-[9px] font-bold uppercase tracking-widest text-slate-400">
              Proactive error monitoring
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
              never delivered, a job that failed, a request that returned
              success but wrote nothing. No alert fires. The team doesn't know
              yet. Operate catches it first.
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
                <div key={text} className="flex items-start gap-2.5">
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

          {/* Live timeline — shown once triggered */}
          {isActive && timeline && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Live detection timeline
              </p>
              <div className="flex flex-col gap-3">
                {/* Vertical connector line */}
                <div className="relative flex flex-col gap-3">
                  {/* Line behind steps */}
                  <div className="absolute left-[11px] top-6 h-[calc(100%-24px)] w-px bg-slate-200" />

                  <TimelineStep
                    index={0}
                    label="Error logged"
                    sublabel="Error written to application logs"
                    time={timeline.errorLoggedAt}
                    isFirst={true}
                    referenceTime={null}
                    isPending={false}
                  />
                  <TimelineStep
                    index={1}
                    label="Datadog received"
                    sublabel="Log ingested by Datadog"
                    time={timeline.datadogReceivedAt}
                    isFirst={false}
                    referenceTime={timeline.errorLoggedAt}
                    isPending={state === 'polling'}
                  />
                  <TimelineStep
                    index={2}
                    label="Datadog alerted Operate"
                    sublabel="Monitor fired — may take up to 60s"
                    time={timeline.datadogAlertedAt}
                    isFirst={false}
                    referenceTime={timeline.errorLoggedAt}
                    isPending={state === 'polling'}
                  />
                  <TimelineStep
                    index={3}
                    label="Case created"
                    sublabel="Investigation opened in Operate"
                    time={timeline.caseCreatedAt}
                    isFirst={false}
                    referenceTime={timeline.errorLoggedAt}
                    isPending={state === 'polling'}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
          {state === 'detected' && (
            <>
              <span className="text-[12px] font-medium text-emerald-600">
                ✓ Case opened — Operate is investigating
              </span>
              <a
                href="/operate/cases"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#01417f] px-4 py-2 text-[12px] font-medium text-white no-underline hover:opacity-90"
              >
                View case in Operate →
              </a>
            </>
          )}

          {state === 'polling' && (
            <>
              <span className="text-[12px] text-slate-500">
                <span className="mr-1.5 inline-block animate-pulse">⏳</span>
                Waiting for Operate to detect the error
                {elapsed > 0 && (
                  <span className="ml-1 text-slate-400">({elapsed}s)</span>
                )}
              </span>
              <a
                href="/operate/cases"
                target="_blank"
                rel="noreferrer"
                className="text-[12px] text-slate-400 underline hover:text-slate-600"
              >
                Open dashboard
              </a>
            </>
          )}

          {state === 'timeout' && (
            <>
              <span className="text-[12px] text-slate-500">
                Detection is taking longer than usual.
              </span>
              <a
                href="/operate/cases"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#01417f] px-4 py-2 text-[12px] font-medium text-white no-underline hover:opacity-90"
              >
                Check dashboard →
              </a>
            </>
          )}

          {(state === 'idle' ||
            state === 'triggering' ||
            state === 'error') && (
            <>
              {state === 'error' ? (
                <span className="text-[12px] text-red-600">
                  Something went wrong. Try again.
                </span>
              ) : (
                <span />
              )}
              <button
                onClick={() => { trigger().catch(() => setState('error')); }}
                disabled={state === 'triggering'}
                className={clsx(
                  'rounded-lg px-4 py-2 text-[12px] font-medium transition-colors',
                  state === 'error'
                    ? 'bg-red-50 text-red-600'
                    : 'bg-[#01417f] text-white hover:opacity-90',
                  state === 'triggering' && 'cursor-not-allowed opacity-70',
                )}
              >
                {state === 'triggering'
                  ? 'Triggering…'
                  : state === 'error'
                    ? 'Retry'
                    : 'Trigger scenario'}
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ScenarioModal;
