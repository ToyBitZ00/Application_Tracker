'use client';

import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Target,
} from 'lucide-react';

const STATS = [
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

const MONTHS = [
  { month: 'Jan', value: 0 },
  { month: 'Feb', value: 0 },
  { month: 'Mar', value: 0 },
  { month: 'Apr', value: 0 },
  { month: 'May', value: 0 },
  { month: 'Jun', value: 0 },
  { month: 'Jul', value: 0 },
  { month: 'Aug', value: 0 },
];

const STAGES = [
  { name: 'Applied', value: 0 },
  { name: 'Interview', value: 0 },
  { name: 'Offer', value: 0 },
  { name: 'Rejected', value: 0 },
];

const GRID_LINES = [1, 2, 3, 4];

const STAGE_COLORS = {
  Applied: {
    dot: 'bg-blue-400',
    bar: 'bg-blue-400',
  },
  Interview: {
    dot: 'bg-amber-400',
    bar: 'bg-amber-400',
  },
  Offer: {
    dot: 'bg-emerald-400',
    bar: 'bg-emerald-400',
  },
  Rejected: {
    dot: 'bg-red-400',
    bar: 'bg-red-400',
  },
} as const;

export default function ReportsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb] scroll-smooth">

      {/* ================================================= */}
      {/* BACKGROUND DESIGN */}
      {/* ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Top-left blue glow */}
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />

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
      {/* MAIN CONTENT */}
      {/* ================================================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* ================= HEADER ================= */}

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


        {/* ================================================= */}
        {/* STATISTICS */}
        {/* ================================================= */}

        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">

          {STATS.map(({ label, value, icon: Icon }) => (

            <div
              key={label}
              className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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


        {/* ================================================= */}
        {/* MAIN ANALYTICS */}
        {/* ================================================= */}

        <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 mt-8">

          {/* ================= ACTIVITY ================= */}

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


            {/* ================= CHART ================= */}

            <div className="mt-9">

              <div className="relative h-56">

                {/* Grid lines */}

                <div className="absolute inset-0 flex flex-col justify-between">

                  {GRID_LINES.map((line) => (

                    <div
                      key={line}
                      className="border-t border-slate-100"
                    />

                  ))}

                  <div className="border-t border-slate-200" />

                </div>


                {/* Bars */}

                <div className="absolute inset-0 flex items-end gap-2 sm:gap-4 px-1">

                  {MONTHS.map(({ month, value }) => (

                    <div
                      key={month}
                      className="flex-1 h-full flex flex-col justify-end items-center"
                    >

                      <div className="w-full max-w-[42px] flex justify-center">

                        <div
                          className="w-full rounded-t-lg bg-blue-100 transition-[height] duration-300"
                          style={{
                            height: `${Math.max(value * 20, 5)}px`,
                          }}
                        />

                      </div>

                    </div>

                  ))}

                </div>

              </div>


              {/* Month labels */}

              <div className="flex gap-2 sm:gap-4 px-1 mt-3">

                {MONTHS.map(({ month }) => (

                  <div
                    key={month}
                    className="flex-1 text-center text-[10px] font-medium text-slate-400"
                  >
                    {month}
                  </div>

                ))}

              </div>

            </div>


            {/* Legend */}

            <div className="mt-7 flex items-center gap-2">

              <span className="w-2 h-2 rounded-full bg-blue-500" />

              <span className="text-xs text-slate-500">
                Applications submitted
              </span>

            </div>

          </div>


          {/* ================= FUNNEL ================= */}

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

              {STAGES.map(({ name, value }) => {

                const colors = STAGE_COLORS[
                  name as keyof typeof STAGE_COLORS
                ];

                return (

                  <div key={name}>

                    <div className="flex items-center justify-between mb-2">

                      <div className="flex items-center gap-2">

                        <span
                          className={`w-2 h-2 rounded-full ${colors.dot}`}
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
                        className={`h-full rounded-full transition-[width] duration-300 ${colors.bar}`}
                        style={{
                          width: value === 0 ? '0%' : '100%',
                        }}
                      />

                    </div>

                  </div>

                );
              })}

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


        {/* ================================================= */}
        {/* INSIGHTS */}
        {/* ================================================= */}

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* ================= RESPONSE RATE ================= */}

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
                  className="h-full bg-blue-600 rounded-full transition-[width] duration-300"
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


          {/* ================= NEXT STEP ================= */}

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


        {/* ================================================= */}
        {/* STATUS BREAKDOWN */}
        {/* ================================================= */}

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

            {STAGES.map(({ name, value }) => {

              const colors = STAGE_COLORS[
                name as keyof typeof STAGE_COLORS
              ];

              return (

                <div
                  key={name}
                  className="px-6 md:px-7 py-4.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors duration-150"
                >

                  <div className="flex items-center gap-3">

                    <span
                      className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
                    />

                    <span className="text-sm font-medium text-slate-700">
                      {name}
                    </span>

                  </div>


                  <span className="text-sm font-semibold text-slate-950">
                    {value}
                  </span>

                </div>

              );
            })}

          </div>

        </section>


        {/* ================================================= */}
        {/* FOOTER */}
        {/* ================================================= */}

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
      {/* SMOOTH SCROLL */}
      {/* ================================================= */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          scroll-behavior: smooth;
        }
      `}</style>

    </div>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function ReportsAnalyticsPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] px-4 pb-32 font-sans text-[#0F172A] sm:px-6 lg:px-8">

      <div className="mx-auto max-w-6xl">

        {/* ======================================================
            STICKY HEADER
        ======================================================= */}

        <div className="sticky top-0 z-40 bg-[#F8F7F4] pb-6 pt-5">

          <header className="overflow-hidden rounded-2xl border border-[#E2E4E8] bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">

            <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">

              <div className="flex items-center gap-4">

                {/* Page Icon */}
                <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0F172A] text-[#F8F7F4] sm:flex">
                  <Icon name="barChart" className="h-6 w-6" />
                </div>

                <div>

                  <div className="mb-1 flex items-center gap-2">

                    <span className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#94A3B8]">
                      Dashboard
                    </span>

                    <span className="h-1 w-1 rounded-full bg-[#94A3B8]" />

                    <span className="text-[10px] font-semibold text-[#94A3B8]">
                      Overview
                    </span>
                  </div>

                  <h1 className="text-xl font-extrabold tracking-tight text-[#0F172A] sm:text-2xl">
                    Reports & Analytics
                  </h1>

                  <p className="mt-1 hidden text-[13px] font-medium text-[#94A3B8] sm:block">
                    Monitor your application momentum and pipeline conversion.
                  </p>

                </div>
              </div>
            </div>

            {/* Consistent accent line */}
            <div className="h-[3px] bg-gradient-to-r from-[#0F172A] to-[#E2E4E8]" />

          </header>
        </div>

        {/* ======================================================
            KPI SUMMARY
        ======================================================= */}

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">

          <MetricCard
            label="Response Rate"
            value="42.5%"
            change="+4.2%"
            description="Of total applications received a reply."
            icon="activity"
          />

          <MetricCard
            label="Interview Conversion"
            value="18.0%"
            change="+2.1%"
            description="Converted from applied to interview."
            icon="target"
          />

          <MetricCard
            label="Avg Time-to-Response"
            value="8.4"
            description="Average wait time for initial contact."
            icon="clock"
          />

        </section>

        {/* ======================================================
            CHARTS
        ======================================================= */}

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">

          {/* ====================================================
              APPLICATION MOMENTUM
          ===================================================== */}

          <div className="rounded-2xl border border-[#E2E4E8] bg-white p-5 shadow-sm sm:p-7 lg:col-span-8">

            <div className="mb-8">

              <h2 className="text-[16px] font-bold tracking-tight text-[#0F172A]">
                Application Momentum
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-[#94A3B8]">
                Number of applications submitted per week.
              </p>

            </div>

            <div className="h-[320px] w-full">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={weeklyApplications}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={THEME.hairline}
                  />

                  <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: THEME.slate,
                      fontWeight: 500,
                    }}
                    dy={10}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: THEME.slate,
                      fontWeight: 500,
                    }}
                  />

                  <Tooltip
                    cursor={{
                      fill: THEME.paper,
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${THEME.hairline}`,
                      boxShadow:
                        "0 10px 25px rgba(15,23,42,0.05)",
                      fontWeight: "bold",
                      color: THEME.ink,
                    }}
                  />

                  <Bar
                    dataKey="applications"
                    fill={THEME.ink}
                    radius={[6, 6, 0, 0]}
                    barSize={45}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>
          </div>

          {/* ====================================================
              PIPELINE STATUS
          ===================================================== */}

          <div className="flex flex-col rounded-2xl border border-[#E2E4E8] bg-white p-5 shadow-sm sm:p-7 lg:col-span-4">

            <div className="mb-4">

              <h2 className="text-[16px] font-bold tracking-tight text-[#0F172A]">
                Pipeline Status
              </h2>

              <p className="mt-1 text-[13px] leading-5 text-[#94A3B8]">
                Current distribution of applications.
              </p>

            </div>

            <div className="min-h-[320px] w-full flex-1">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={statusDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >

                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          STATUS_COLORS[
                            index % STATUS_COLORS.length
                          ]
                        }
                      />
                    ))}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: `1px solid ${THEME.hairline}`,
                      boxShadow:
                        "0 10px 25px rgba(15,23,42,0.05)",
                      fontWeight: "bold",
                      color: THEME.ink,
                    }}
                    itemStyle={{
                      fontWeight: "bold",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={60}
                    iconType="circle"
                    formatter={(value) => (
                      <span className="ml-1 text-[13px] font-bold text-[#0F172A]">
                        {value}
                      </span>
                    )}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>
          </div>

        </section>
      </div>
    </main>
  );
}