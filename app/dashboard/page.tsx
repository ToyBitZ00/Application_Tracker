'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowDown,
  TrendingUp,
} from 'lucide-react';

const applicationRows = {
  Applied: [
    { company: 'Northstar Labs', position: 'Frontend Developer Intern', date: 'Aug 10, 2026', notes: 'Application submitted with portfolio' },
    { company: 'BluePeak Studio', position: 'UI/UX Design Intern', date: 'Aug 08, 2026', notes: 'Awaiting recruiter follow-up' },
    { company: 'Helio Works', position: 'Data Analyst Intern', date: 'Aug 03, 2026', notes: 'Resume shortlisted for screening' },
  ],
  Interview: [
    { company: 'Vertex Systems', position: 'Software Engineer Intern', date: 'Aug 14, 2026', notes: 'Technical interview scheduled for Friday' },
    { company: 'UrbanGrid', position: 'Product Analyst Intern', date: 'Aug 12, 2026', notes: 'HR screening completed successfully' },
    { company: 'Nexa Dynamics', position: 'QA Automation Intern', date: 'Aug 09, 2026', notes: 'Case interview invitation sent' },
  ],
  Offer: [
    { company: 'Signal Forge', position: 'Frontend Engineer Intern', date: 'Aug 16, 2026', notes: 'Offer letter under review' },
    { company: 'Aether Labs', position: 'IT Operations Intern', date: 'Aug 11, 2026', notes: 'Final interview completed with positive feedback' },
  ],
  Rejected: [
    { company: 'Summit Core', position: 'Marketing Analyst Intern', date: 'Jul 30, 2026', notes: 'Application not shortlisted' },
    { company: 'Pioneer Byte', position: 'Mobile Developer Intern', date: 'Jul 28, 2026', notes: 'Recruiter response received: role closed' },
  ],
};

export default function DashboardPage() {
  const [activeStatus, setActiveStatus] = useState('Applied');

  const stats = [
    {
      title: 'Applied',
      count: applicationRows.Applied.length,
      description: 'Applications submitted',
      icon: BriefcaseBusiness,
    },
    {
      title: 'Interview',
      count: applicationRows.Interview.length,
      description: 'Applications in interview',
      icon: Clock3,
    },
    {
      title: 'Offer',
      count: applicationRows.Offer.length,
      description: 'Offers received',
      icon: CheckCircle2,
    },
    {
      title: 'Rejected',
      count: applicationRows.Rejected.length,
      description: 'Applications closed',
      icon: XCircle,
    },
  ];

  const selectedRows = applicationRows[activeStatus as keyof typeof applicationRows];

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

            {stats.map(({ title, count, description, icon: Icon }) => {
              const isActive = activeStatus === title;

              return (
                <button
                  key={title}
                  type="button"
                  onClick={() => setActiveStatus(title)}
                  aria-pressed={isActive}
                  className={[
                    'group w-full text-left rounded-2xl border p-5 md:p-6 shadow-sm transition-all duration-200',
                    isActive
                      ? 'border-blue-200 bg-blue-50/80 shadow-md shadow-blue-100/60 -translate-y-0.5'
                      : 'border-slate-200/80 bg-white/90 hover:-translate-y-0.5 hover:shadow-md',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={[
                        'flex h-11 w-11 items-center justify-center rounded-xl',
                        isActive ? 'bg-blue-600' : 'bg-blue-50',
                      ].join(' ')}
                    >
                      <Icon
                        size={21}
                        className={isActive ? 'text-white' : 'text-blue-600'}
                        strokeWidth={2}
                      />
                    </div>

                    <ArrowDown
                      size={18}
                      className={isActive ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-500'}
                    />
                  </div>

                  <div className="mt-5">
                    <p className={isActive ? 'text-sm font-semibold text-blue-700' : 'text-sm font-semibold text-slate-500'}>
                      {title}
                    </p>

                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                      {count}
                    </p>

                    <p className="mt-1.5 text-xs text-slate-400">
                      {description}
                    </p>
                  </div>
                </button>
              );
            })}

          </div>

        </section>


        {/* Status table */}
        <section className="mt-8">

          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-6 py-5 border-b border-slate-200 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                  {activeStatus} pipeline
                </p>

                <h2 className="mt-2 font-bold text-slate-900">
                  {activeStatus} applications
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A quick snapshot of the applications in this stage.
                </p>

              </div>

              <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
                {selectedRows.length} entries
              </div>

            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Company
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Position
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                      Notes
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-200 bg-white">
                  {selectedRows.map(({ company, position, date, notes }) => (
                    <tr key={`${company}-${position}`} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                        {company}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-700">
                        {position}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                        {date}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </section>

      </main>

    </div>
  );
}