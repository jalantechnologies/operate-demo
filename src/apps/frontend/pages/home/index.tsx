import React from 'react';

interface ScenarioCardProps {
  title: string;
  description: string;
}

const ScenarioCard: React.FC<ScenarioCardProps> = ({ title, description }) => (
  <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div>
      <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-500">{description}</p>
    </div>
    <div className="mt-6">
      <button
        disabled
        className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 opacity-50"
      >
        Trigger
      </button>
    </div>
  </div>
);

const HomePage: React.FC = () => (
  <div className="min-h-screen bg-gray-50">
    {/* Top bar */}
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Reclr
          </span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-500">Recruitment Platform</span>
        </div>
      </div>
    </header>

    {/* Main content */}
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-12">
        <p className="text-xl font-medium leading-relaxed text-gray-700">
          Your team loses hours every week investigating production issues that
          look like this:
        </p>
      </div>

      {/* Scenario cards — top row */}
      <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <ScenarioCard
          title="Email delivery failure"
          description="A notification send is returning 500s. Candidates aren't getting interview confirmations."
        />
        <ScenarioCard
          title="Candidate search slowdown"
          description="A slow query on the applications table is degrading search for recruiters."
        />
      </div>

      {/* Support ticket card — full width */}
      <div className="mb-12 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 text-base font-semibold text-gray-900">
          Support ticket
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          &ldquo;Candidates from mobile aren&rsquo;t receiving confirmation
          emails&rdquo; &mdash; submit this as a support ticket directly to
          Operate.
        </p>
        <button
          disabled
          className="cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-400 opacity-50"
        >
          Open ticket &rarr;
        </button>
      </div>

      {/* Divider + CTA */}
      <div className="border-t border-gray-200 pt-8">
        <p className="mb-4 text-sm text-gray-500">
          Already triggered a scenario?
        </p>
        <a
          href="/operate"
          className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
        >
          Open Operate Dashboard &rarr;
        </a>
      </div>
    </main>
  </div>
);

export default HomePage;
