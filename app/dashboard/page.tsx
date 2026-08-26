export default function DashboardPage() {
  return (
    <div className="px-8 pt-16 pb-32 max-w-4xl mx-auto">
      <p className="text-xs uppercase tracking-widest text-slate mb-4">Dashboard</p>

      <h1 className="font-display text-3xl md:text-4xl leading-snug text-ink">
        You have{' '}
        <span className="font-mono font-semibold text-coral">0</span>{' '}
        active applications,{' '}
        <span className="font-mono font-semibold text-ink">0</span>{' '}
        awaiting reply, and{' '}
        <span className="font-mono font-semibold text-offer">0</span>{' '}
        offer pending.
      </h1>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { stage: 'Applied', count: 0 },
          { stage: 'Interview', count: 0 },
          { stage: 'Offer', count: 0 },
          { stage: 'Rejected', count: 0 },
        ].map(({ stage, count }) => (
          <div key={stage} className="border border-hairline rounded-lg p-5 bg-white">
            <p className="text-xs uppercase tracking-wide text-slate mb-2">{stage}</p>
            <p className="font-mono text-2xl font-semibold text-ink">{count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}