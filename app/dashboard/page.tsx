import Link from 'next/link';
import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  FileText,
} from 'lucide-react';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Applied',
      count: 0,
      description: 'Applications submitted',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Interview',
      count: 0,
      description: 'Applications in interview',
      icon: Clock3,
    },
    {
      title: 'Offer',
      count: 0,
      description: 'Offers received',
      icon: CheckCircle2,
    },
    {
      title: 'Rejected',
      count: 0,
      description: 'Applications closed',
      icon: XCircle,
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f7fb]">

      {/* ================= BACKGROUND DESIGN ================= */}

      {/* Soft blue / indigo glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl" />

      </div>


      {/* Grid background — same style as Login */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />




      {/* ================= MAIN CONTENT ================= */}

      <main className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-8 lg:py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <div className="w-2 h-2 rounded-full bg-blue-600" />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Dashboard
              </p>

            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
              Application Overview
            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-500">
              Monitor your OJT and internship applications.
            </p>

          </div>

          <Link
            href="/applications/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-all"
          >
            <Plus size={18} strokeWidth={2.5} />
            Add Application
          </Link>

        </div>


        {/* Main Summary Card */}
        <section className="mt-8">

          <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-7 md:p-9 shadow-xl shadow-slate-900/10">

            {/* Decorative glow */}
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="absolute right-24 bottom-[-100px] w-52 h-52 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative">

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

                <div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-5">

                    <TrendingUp
                      size={14}
                      className="text-blue-400"
                    />

                    <span className="text-xs font-medium text-slate-300">
                      Application Activity
                    </span>

                  </div>

                  <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">

                    You have{' '}

                    <span className="text-blue-400">
                      0
                    </span>{' '}

                    active applications.

                  </h2>

                  <p className="mt-2 text-sm text-slate-400 max-w-lg">
                    Add your applications to start tracking interviews,
                    responses, offers, and overall progress.
                  </p>

                </div>


                <div className="grid grid-cols-3 gap-0 lg:min-w-[430px]">

                  <div className="pr-5">

                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      Active
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      0
                    </p>

                  </div>


                  <div className="px-5 border-l border-white/10">

                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      Awaiting Reply
                    </p>

                    <p className="mt-1 text-2xl font-bold text-white">
                      0
                    </p>

                  </div>


                  <div className="pl-5 border-l border-white/10">

                    <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                      Offer Pending
                    </p>

                    <p className="mt-1 text-2xl font-bold text-blue-400">
                      0
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* Statistics */}
        <section className="mt-8">

          <div className="flex items-end justify-between mb-4">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Application Pipeline
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Track where your applications currently stand.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            {stats.map(({ title, count, description, icon: Icon }) => (

              <div
                key={title}
                className="group bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
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
                    className="text-slate-300 group-hover:text-blue-500 transition-colors"
                  />

                </div>


                <div className="mt-5">

                  <p className="text-sm font-semibold text-slate-500">
                    {title}
                  </p>

                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                    {count}
                  </p>

                  <p className="mt-1.5 text-xs text-slate-400">
                    {description}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </section>


        {/* Recent Applications */}
        <section className="mt-8">

          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">

              <div>

                <h2 className="font-bold text-slate-900">
                  Recent Applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest application activity.
                </p>

              </div>


              <Link
                href="/applications"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
              >
                View all
                <ArrowUpRight size={15} />
              </Link>

            </div>


            {/* Empty state */}
            <div className="px-6 py-16 md:py-20 text-center">

              <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">

                <BriefcaseBusiness
                  size={27}
                  className="text-slate-400"
                />

              </div>


              <h3 className="mt-5 text-base font-bold text-slate-900">
                No applications yet
              </h3>


              <p className="mt-2 max-w-md mx-auto text-sm text-slate-500 leading-relaxed">
                Your recent applications will appear here. Start by adding
                your first OJT or internship application.
              </p>


              <Link
                href="/applications/new"
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition"
              >
                <Plus size={17} />
                Add Application
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}