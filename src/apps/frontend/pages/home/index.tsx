import { clsx } from 'clsx';
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
      className={clsx(
        'fixed left-0 right-0 top-0 z-50 bg-white transition-colors duration-300',
        scrolled ? 'border-b border-slate-200' : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto max-w-7xl px-8">
        <nav className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="https://bettrsw.com" target="_blank" rel="noreferrer">
              <img
                src="/assets/img/better-logo-blue.png"
                alt="Better Software"
                className="block h-[26px] w-auto"
              />
            </a>
            <div className="h-5 w-px bg-slate-200" />
            <span className="text-[13px] text-slate-400">Reclr · Operate Demo</span>
          </div>

          <a
            href="https://bettrsw.com/operate"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-[13px] font-medium text-[#01417f] no-underline md:inline-flex"
          >
            About Operate <span className="opacity-60">→</span>
          </a>
        </nav>
      </div>
    </header>
  );
};

// ─── Footer ──────────────────────────────────────────────────────────────────

const BetterFooter: React.FC = () => (
  <footer className="border-t border-slate-100 px-8 py-6">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <a href="https://bettrsw.com" target="_blank" rel="noreferrer">
          <img
            src="/assets/img/better-logo-blue.png"
            alt="Better Software"
            className="block h-5 w-auto"
          />
        </a>
        <span className="text-[13px] text-slate-300">·</span>
        <span className="text-[13px] text-slate-400">
          Reclr is a demo app built on{' '}
          <a
            href="https://bettrsw.com/operate"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-slate-500 no-underline"
          >
            Operate
          </a>
        </span>
      </div>
      <p className="text-[13px] text-slate-400">
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
      "A user can't complete checkout. The PM escalates. Operate reads the ticket, traces the request, identifies the failing service, and raises a fix PR — before your engineer has finished reading the Slack thread.",
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
      "Search response times spike under load. Users notice. Engineers don't. Operate correlates the slowdown to a specific query, identifies the bottleneck, and proposes a targeted fix.",
    enabled: false,
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

const HomePage: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  return (
    <div className="flex min-h-dvh flex-col bg-white font-sans text-slate-900">
      <BetterHeader />

      {activeModal === 'silent-failure' && (
        <SilentFailureModal onClose={() => setActiveModal(null)} />
      )}

      <main className="flex flex-1 justify-center px-8 pb-18 pt-14 md:pt-20">
        <div className="w-full max-w-[900px]">

          {/* Hero */}
          <div className="mb-9 flex flex-col items-start justify-between gap-5 border-b border-slate-100 pb-8 sm:flex-row sm:items-start">
            <div>
              <h1 className="mb-2.5 text-[32px] font-bold leading-none tracking-tight text-slate-900">
                Operate Demo
              </h1>
              <p className="max-w-[400px] text-[14px] leading-relaxed text-slate-500">
                Trigger a production incident below. Operate detects it,
                investigates, and raises a fix PR — autonomously.
              </p>
            </div>

            <div className="shrink-0 sm:pt-1">
              <p className="mb-2 text-right text-[11px] text-slate-400">
                Already triggered a scenario?
              </p>
              <a
                href="/operate"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#01417f] px-4 py-2.5 text-[13px] font-medium tracking-tight text-white no-underline"
              >
                Open Operate Dashboard →
              </a>
            </div>
          </div>

          {/* Scenario cards */}
          <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {scenarios.map((s) => (
              <div
                key={s.id}
                className="flex flex-col rounded-xl border border-slate-200 bg-white p-[18px] pb-3.5 transition-shadow hover:shadow-md"
              >
                <p className="mb-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {s.category}
                </p>
                <p className="mb-2 text-[14px] font-semibold leading-snug tracking-tight text-slate-900">
                  {s.title}
                </p>
                <p className="mb-3.5 flex-1 text-[12px] leading-relaxed text-slate-500">
                  {s.description}
                </p>
                <div className="flex items-center justify-between border-t border-slate-50 pt-2.5">
                  <span className="text-[10px] font-medium text-slate-300">
                    {s.enabled ? '' : 'Coming soon'}
                  </span>
                  <button
                    disabled={!s.enabled}
                    onClick={() => s.enabled && setActiveModal(s.id)}
                    className={clsx(
                      'rounded-md border border-slate-200 px-3 py-1 text-[11px] font-medium transition-colors',
                      s.enabled
                        ? 'cursor-pointer bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50'
                        : 'cursor-not-allowed bg-slate-50 text-slate-400',
                    )}
                  >
                    Trigger
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Steps strip */}
          <div className="flex flex-col gap-2.5 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 sm:flex-row sm:gap-0">
            {[
              'Trigger a scenario to inject the incident into the app',
              'Operate detects it, investigates, and raises a fix PR',
              'Review the PR and approve — nothing merges without sign-off',
            ].map((text, i) => (
              <React.Fragment key={i}>
                {i > 0 && <div className="hidden w-px self-stretch bg-slate-200 sm:block" />}
                <div className="flex flex-1 items-start gap-2 px-3 first:pl-1 last:pr-1">
                  <span className="mt-px flex size-[17px] shrink-0 items-center justify-center rounded-full bg-slate-200 text-[9px] font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-[11px] leading-snug text-slate-500">{text}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

        </div>
      </main>

      <BetterFooter />
    </div>
  );
};

export default HomePage;
