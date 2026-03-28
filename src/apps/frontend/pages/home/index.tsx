import { clsx } from 'clsx';
import React, { useState } from 'react';

import SilentFailureModal from 'frontend/pages/home/silent-failure-modal';

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
      "A user can't complete checkout. Operate reads the ticket, traces the failing request, and raises a fix PR — before your engineer finishes reading the Slack thread.",
    enabled: false,
  },
  {
    id: 'silent-failure',
    category: 'Silent failure',
    title: 'System is failing. Nobody knows.',
    description:
      'Candidate emails are dropped. The API returns 200 so no alert fires. Operate detects the failure in your logs, traces the cause, and raises a fix PR before it becomes a complaint.',
    enabled: true,
  },
  {
    id: 'performance',
    category: 'Performance regression',
    title: 'Users are frustrated. App feels slow.',
    description:
      "Search spikes under load. Users notice, engineers don't. Operate correlates the slowdown to a specific query, identifies the bottleneck, and proposes a fix.",
    enabled: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="min-h-dvh bg-white font-sans text-slate-900 antialiased">
      {activeModal === 'silent-failure' && (
        <SilentFailureModal onClose={() => setActiveModal(null)} />
      )}

      {/* ── Full-height two-column layout ── */}
      <div className="flex min-h-dvh flex-col lg:flex-row">
        {/* ── LEFT PANEL ─────────────────────────────────────────────────── */}
        <div className="flex flex-col justify-between bg-[#f8f9fb] px-10 py-10 lg:sticky lg:top-0 lg:h-dvh lg:w-[42%] lg:px-14 lg:py-16">
          {/* Logo */}
          <div>
            <a href="https://bettrsw.com" target="_blank" rel="noreferrer">
              <img
                src="/assets/img/better-logo-blue.png"
                alt="Better Software"
                className="mb-12 block h-6 w-auto opacity-80"
              />
            </a>

            {/* Heading */}
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400">
              Interactive Demo
            </p>
            <h1 className="mb-5 text-[38px] font-bold leading-[1.1] tracking-[-0.04em] text-slate-900">
              See Operate fix a production bug — live.
            </h1>
            <p className="mb-8 max-w-[340px] text-[15px] leading-relaxed text-slate-500">
              Pick a scenario. Operate detects the incident, investigates, and
              raises a fix PR in your repo — autonomously.
            </p>

            {/* How it works */}
            <div className="flex flex-col gap-4">
              {[
                {
                  n: '1',
                  label: 'Trigger a scenario',
                  sub: 'Inject a real incident into the demo app',
                },
                {
                  n: '2',
                  label: 'Operate investigates',
                  sub: 'Detects, traces root cause, raises a fix PR',
                },
                {
                  n: '3',
                  label: 'You approve',
                  sub: 'Nothing merges without engineer sign-off',
                },
              ].map(({ n, label, sub }) => (
                <div key={n} className="flex items-start gap-3.5">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-500 shadow-sm ring-1 ring-slate-200">
                    {n}
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-700">
                      {label}
                    </p>
                    <p className="text-[12px] text-slate-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 flex items-center justify-between">
            <span className="text-[12px] text-slate-400">
              Built on{' '}
              <a
                href="https://bettrsw.com/operate"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-slate-500 no-underline hover:text-slate-700"
              >
                Operate
              </a>
            </span>
            <a
              href="https://bettrsw.com/operate"
              target="_blank"
              rel="noreferrer"
              className="text-[12px] font-medium text-[#01417f] no-underline hover:opacity-80"
            >
              About Operate →
            </a>
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col px-8 py-10 lg:overflow-y-auto lg:px-12 lg:py-16">
          {/* Top bar */}
          <div className="mb-10 flex items-center justify-between">
            <p className="text-[13px] font-medium text-slate-400">
              Choose a scenario to trigger
            </p>
            <a
              href="/operate"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#01417f] px-4 py-2 text-[13px] font-medium text-white no-underline hover:opacity-90"
            >
              Open Operate Dashboard →
            </a>
          </div>

          {/* Scenario cards */}
          <div className="flex flex-col gap-4">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className={clsx(
                  'group rounded-2xl border bg-white p-6 transition-all duration-200',
                  s.enabled
                    ? 'border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md'
                    : 'border-slate-100 opacity-60',
                )}
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                      {s.category}
                    </p>
                    <h2 className="text-[17px] font-semibold leading-snug tracking-tight text-slate-900">
                      {s.title}
                    </h2>
                  </div>
                  {s.enabled && (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-600">
                      Live
                    </span>
                  )}
                </div>

                <p className="mb-5 text-[13px] leading-relaxed text-slate-500">
                  {s.description}
                </p>

                <div className="flex items-center justify-between">
                  {s.enabled ? (
                    <button
                      onClick={() => setActiveModal(s.id)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-medium text-slate-700 transition-all hover:border-[#01417f] hover:text-[#01417f]"
                    >
                      Trigger scenario →
                    </button>
                  ) : (
                    <span className="text-[12px] text-slate-300">
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom branding */}
          <div className="mt-auto pt-12">
            <p className="text-center text-[12px] text-slate-300">
              © {new Date().getFullYear()} Jalan Technology Consulting Pvt.
              Ltd.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
