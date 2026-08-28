'use client';

import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  TrendingUp,
  FileText,
  Target,
} from 'lucide-react';

export default function ReportsPage() {
  const stats = [
    {
      label: 'Applications',
      value: 0,
      icon: BriefcaseBusiness,
    },
    {
      label: 'Interviews',
      value: 0,
      icon: Clock3,
    },
    {
      label: 'Offers',
      value: 0,
      icon: CheckCircle2,
    },
  ];

  const months = [
    { month: 'Jan', value: 0 },
    { month: 'Feb', value: 0 },
    { month: 'Mar', value: 0 },
    { month: 'Apr', value: 0 },
    { month: 'May', value: 0 },
    { month: 'Jun', value: 0 },
    { month: 'Jul', value: 0 },
    { month: 'Aug', value: 0 },
  ];

  const stages = [
    { name: 'Applied', value: 0 },
    { name: 'Interview', value: 0 },
    { name: 'Offer', value: 0 },
    { name: 'Rejected', value: 0 },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">

      {/* ================================================= */}
      {/* BACKGROUND DESIGN */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Top-left blue glow */}
        <div
          className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-3xl animate-pulse"
        />

        {/* Bottom-right indigo glow */}
        <div
          className="absolute -bottom-48 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />

        {/* Center blue glow */}
        <div
          className="absolute top-[35%] left-[45%] w-96 h-96 rounded-full bg-blue-400/5 blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        />

      </div>


      {/* ================================================= */}
      {/* SQUARE GRID */}
      {/* ================================================= */}

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
        }}
      />


      {/* ================================================= */}
      {/* DECORATIVE FLOATING ELEMENTS */}
      {/* ================================================= */}

      {/* Top-right decorative square */}
      <div
        className="pointer-events-none fixed hidden xl:block right-[7%] top-[15%] w-28 h-28 border border-blue-200/50 rounded-3xl rotate-12"
        style={{
          animation: 'reportFloat 7s ease-in-out infinite',
        }}
      >
        <div className="absolute inset-4 border border-blue-200/40 rounded-2xl" />
      </div>


      {/* Left decorative square */}
      <div
        className="pointer-events-none fixed hidden xl:block left-[4%] top-[48%] w-20 h-20 border border-indigo-200/50 rounded-2xl -rotate-12"
        style={{
          animation: 'reportFloat 8s ease-in-out infinite',
          animationDelay: '1.5s',
        }}
      >
        <div className="absolute inset-3 border border-indigo-200/40 rounded-xl" />
      </div>


      {/* Bottom-right decorative dots */}
      <div className="pointer-events-none fixed hidden lg:block right-[8%] bottom-[12%]">
        <div className="grid grid-cols-4 gap-2 opacity-30">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              className="w-1.5 h-1.5 rounded-full bg-blue-400"
            />
          ))}
        </div>
      </div>


      {/* ================================================= */}
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <div className="w-2 h-2 rounded-full bg-blue-600" />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Reports
              </p>

            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
              Application Reports
            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-500 max-w-xl">
              Analyze your OJT and internship application activity.
            </p>

          </div>

          <div className="text-xs text-slate-400">
            Application overview · 2026
          </div>

        </header>


        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

          {stats.map(({ label, value, icon: Icon }) => (

            <div
              key={label}
              className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >

              <div className="flex items-center justify-between">

                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <Icon
                    size={21}
                    className="text-blue-600"
                    strokeWidth={2}
                  />

                </div>

                <ArrowUpRight
                  size={18}
                  className="text-slate-300"
                />

              </div>

              <div className="mt-5">

                <p className="text-sm font-semibold text-slate-500">
                  {label}
                </p>

                <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                  {value}
                </p>

                <p className="mt-1.5 text-xs text-slate-400">
                  Total {label.toLowerCase()}
                </p>

              </div>

            </div>

          ))}

        </section>


        {/* Main Analytics */}
        <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mt-8">

          {/* Activity */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 md:p-7 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Activity
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  Applications over time
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Number of applications submitted each month
                </p>

              </div>

              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">

                <BarChart3
                  size={18}
                  className="text-slate-500"
                  strokeWidth={1.8}
                />

              </div>

            </div>


            {/* Chart */}
            <div className="mt-9">

              <div className="relative h-56">

                <div className="absolute inset-0 flex flex-col justify-between">

                  {[1, 2, 3, 4].map((line) => (

                    <div
                      key={line}
                      className="border-t border-slate-100"
                    />

                  ))}

                  <div className="border-t border-slate-200" />

                </div>


                <div className="absolute inset-0 flex items-end gap-2 sm:gap-4 px-1">

                  {months.map(({ month, value }) => (

                    <div
                      key={month}
                      className="flex-1 h-full flex flex-col justify-end items-center"
                    >

                      <div className="w-full max-w-[42px] flex justify-center">

                        <div
                          className="w-full rounded-t-lg bg-blue-100 transition-all"
                          style={{
                            height: `${Math.max(value * 20, 5)}px`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </div>


              <div className="flex gap-2 sm:gap-4 px-1 mt-3">

                {months.map(({ month }) => (

                  <div
                    key={month}
                    className="flex-1 text-center text-[10px] font-medium text-slate-400"
                  >
                    {month}
                  </div>

                ))}

              </div>

            </div>


            <div className="mt-7 flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-blue-500" />

              <span className="text-xs text-slate-500">
                Applications submitted
              </span>

            </div>

          </div>


          {/* Funnel */}
          <div className="bg-slate-950 rounded-2xl p-6 md:p-7 text-white shadow-xl shadow-slate-900/10">

            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">
              Conversion
            </p>

            <h2 className="mt-1 text-lg font-bold">
              Application funnel
            </h2>

            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              See where your applications currently stand throughout
              the hiring process.
            </p>


            <div className="mt-9 space-y-6">

              {stages.map(({ name, value }, index) => (

                <div key={name}>

                  <div className="flex items-center justify-between mb-2">

                    <div className="flex items-center gap-2">

                      <span
                        className={`w-2 h-2 rounded-full ${
                          index === 0
                            ? 'bg-blue-400'
                            : index === 1
                            ? 'bg-amber-400'
                            : index === 2
                            ? 'bg-emerald-400'
                            : 'bg-red-400'
                        }`}
                      />

                      <span className="text-xs text-slate-300">
                        {name}
                      </span>

                    </div>

                    <span className="text-xs font-semibold text-white">
                      {value}
                    </span>

                  </div>


                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">

                    <div
                      className={`h-full rounded-full transition-all ${
                        index === 0
                          ? 'bg-blue-400'
                          : index === 1
                          ? 'bg-amber-400'
                          : index === 2
                          ? 'bg-emerald-400'
                          : 'bg-red-400'
                      }`}
                      style={{
                        width: `${value === 0 ? 0 : 100}%`,
                      }}
                    />

                  </div>

                </div>

              ))}

            </div>


            <div className="mt-9 pt-5 border-t border-white/10">

              <div className="flex items-center justify-between">

                <span className="text-xs text-slate-500">
                  Total applications
                </span>

                <span className="text-sm font-semibold text-white">
                  0
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* Insights */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* Response Rate */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 md:p-7 shadow-sm">

            <div className="flex items-start justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Response rate
                </p>

                <div className="flex items-baseline gap-2 mt-2">

                  <h2 className="text-4xl font-bold tracking-tight text-slate-950">
                    0%
                  </h2>

                  <span className="text-xs text-slate-400">
                    response rate
                  </span>

                </div>

              </div>


              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">

                <TrendingUp
                  size={18}
                  className="text-blue-600"
                />

              </div>

            </div>


            <div className="mt-7">

              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">

                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: '0%' }}
                />

              </div>


              <div className="flex justify-between mt-2">

                <span className="text-[11px] text-slate-400">
                  0 responses
                </span>

                <span className="text-[11px] text-slate-400">
                  0 applications
                </span>

              </div>

            </div>

          </div>


          {/* Next Step */}
          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 md:p-7 shadow-sm">

            <div className="flex items-start justify-between gap-5">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
                  Next step
                </p>

                <h2 className="mt-2 text-lg font-bold text-slate-900">
                  Build your application history
                </h2>

                <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-md">
                  Add your applications and interviews to start seeing
                  useful patterns in your internship search.
                </p>

              </div>


              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">

                <Target
                  size={18}
                  className="text-blue-600"
                />

              </div>

            </div>


            <div className="mt-6 flex items-center gap-2 text-xs font-medium text-blue-600">

              <span>
                Start tracking applications
              </span>

              <ArrowUpRight size={13} />

            </div>

          </div>

        </section>


        {/* Status Breakdown */}
        <section className="mt-6 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

          <div className="px-6 md:px-7 py-5 border-b border-slate-100">

            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">
              Breakdown
            </p>

            <h2 className="mt-1 text-lg font-bold text-slate-900">
              Application status
            </h2>

          </div>


          <div className="divide-y divide-slate-100">

            {stages.map(({ name, value }) => (

              <div
                key={name}
                className="px-6 md:px-7 py-4.5 flex items-center justify-between hover:bg-slate-50/70 transition"
              >

                <div className="flex items-center gap-3">

                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      name === 'Offer'
                        ? 'bg-emerald-500'
                        : name === 'Rejected'
                        ? 'bg-red-400'
                        : name === 'Interview'
                        ? 'bg-amber-400'
                        : 'bg-blue-500'
                    }`}
                  />

                  <span className="text-sm font-medium text-slate-700">
                    {name}
                  </span>

                </div>


                <span className="text-sm font-semibold text-slate-950">
                  {value}
                </span>

              </div>

            ))}

          </div>

        </section>


        {/* Footer */}
        <footer className="text-center pt-8 pb-8">

          <p className="text-xs text-slate-400">
            Application Tracker · Software Engineering 2
          </p>

          <p className="text-[11px] text-slate-300 mt-1">
            Version 1.0.0
          </p>

        </footer>

      </main>


      {/* ================================================= */}
      {/* FLOAT ANIMATION */}
      {/* ================================================= */}

      <style jsx global>{`
        @keyframes reportFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }

          50% {
            transform: translateY(-12px) rotate(12deg);
          }
        }
      `}</style>

    </div>
  );
}