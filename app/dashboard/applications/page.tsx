'use client';

import Link from 'next/link';
import {
  Plus,
  Search,
  SlidersHorizontal,
  BriefcaseBusiness,
  MoreHorizontal,
  CalendarDays,
  MapPin,
} from 'lucide-react';

type ApplicationStatus =
  | 'Applied'
  | 'Interview'
  | 'Offer'
  | 'Rejected';

type Application = {
  company: string;
  position: string;
  location: string;
  date: string;
  status: ApplicationStatus;
};

/*
 * Keep static data outside the component.
 * This prevents the array from being recreated
 * every time the component renders.
 */
const APPLICATIONS: Application[] = [];

export default function ApplicationsPage() {
  const applicationCount = APPLICATIONS.length;

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
      {/* FLOATING DECORATIVE SQUARES */}
      {/* ================================================= */}

      {/* Top-right square */}
      <div
        className="pointer-events-none fixed hidden xl:block right-[7%] top-[14%] w-28 h-28 border border-blue-200/50 rounded-3xl rotate-12"
        style={{
          animation: 'applicationFloat 7s ease-in-out infinite',
        }}
      >
        <div className="absolute inset-4 border border-blue-200/40 rounded-2xl" />
      </div>


      {/* Left square */}
      <div
        className="pointer-events-none fixed hidden xl:block left-[4%] top-[48%] w-20 h-20 border border-indigo-200/50 rounded-2xl -rotate-12"
        style={{
          animation: 'applicationFloat 8s ease-in-out infinite',
          animationDelay: '1.5s',
        }}
      >
        <div className="absolute inset-3 border border-indigo-200/40 rounded-xl" />
      </div>


      {/* Bottom-left small square */}
      <div
        className="pointer-events-none fixed hidden lg:block left-[9%] bottom-[13%] w-12 h-12 border border-blue-200/40 rounded-xl rotate-12"
        style={{
          animation: 'applicationFloat 6s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />


      {/* Bottom-right dot pattern */}
      <div className="pointer-events-none fixed hidden lg:block right-[8%] bottom-[12%]">

        <div className="grid grid-cols-4 gap-2 opacity-30">

          {Array.from({ length: 16 }, (_, index) => (
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

        {/* ================= HEADER ================= */}

        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

          <div>

            <div className="flex items-center gap-2 mb-2">

              <div className="w-2 h-2 rounded-full bg-blue-600" />

              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                Applications
              </p>

            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
              Your Applications
            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-500">
              Keep track of your OJT and internship applications.
            </p>

          </div>


          <Link
            href="/applications/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white text-sm font-semibold shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md transition-[background-color,box-shadow] duration-200"
          >
            <Plus
              size={18}
              strokeWidth={2.5}
            />

            Add Application
          </Link>

        </header>


        {/* ================================================= */}
        {/* TOOLBAR */}
        {/* ================================================= */}

        <section className="mt-8">

          <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 shadow-sm">

            <div className="flex flex-col lg:flex-row gap-3">

              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search company or position..."
                  className="w-full h-11 pl-11 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-[border-color,box-shadow] duration-200"
                />

              </div>


              {/* Filter */}

              <button
                type="button"
                className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors duration-150"
              >

                <SlidersHorizontal size={16} />

                Filter

              </button>


              {/* Sort */}

              <button
                type="button"
                className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-150"
              >
                Latest
              </button>

            </div>

          </div>

        </section>


        {/* ================================================= */}
        {/* APPLICATION CONTENT */}
        {/* ================================================= */}

        <section className="mt-6">

          {applicationCount === 0 ? (

            /* ================= EMPTY STATE ================= */

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl shadow-sm min-h-[480px] flex items-center justify-center px-6">

              <div className="text-center max-w-md">

                <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">

                  <BriefcaseBusiness
                    size={27}
                    className="text-blue-600"
                    strokeWidth={2}
                  />

                </div>


                <h2 className="mt-5 text-base font-bold text-slate-900">
                  No applications yet
                </h2>


                <p className="mt-2 max-w-md mx-auto text-sm text-slate-500 leading-relaxed">
                  Your applications will appear here. Start by adding
                  your first OJT or internship application.
                </p>


                <Link
                  href="/applications/new"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors duration-200"
                >

                  <Plus size={17} />

                  Add Application

                </Link>

              </div>

            </div>

          ) : (

            /* ================= APPLICATION LIST ================= */

            <div className="bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">

              {/* Desktop Header */}

              <div className="hidden md:grid grid-cols-[2fr_1.5fr_1fr_1fr_40px] gap-4 px-6 py-3 bg-slate-50/90 border-b border-slate-200">

                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Company
                </span>

                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Position
                </span>

                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Applied
                </span>

                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">
                  Status
                </span>

                <span />

              </div>


              {/* Application Rows */}

              {APPLICATIONS.map((application) => (

                <ApplicationRow
                  key={`${application.company}-${application.position}`}
                  application={application}
                />

              ))}

            </div>

          )}

        </section>


        {/* ================================================= */}
        {/* FOOTER HINT */}
        {/* ================================================= */}

        <div className="mt-5 flex items-center justify-between text-xs text-slate-400">

          <span>
            {applicationCount} application
            {applicationCount !== 1 ? 's' : ''}
          </span>

          <span>
            Keep your application status up to date.
          </span>

        </div>


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
      {/* FLOAT ANIMATION */}
      {/* ================================================= */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          scroll-behavior: smooth;
        }

        @keyframes applicationFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(12deg);
          }

          50% {
            transform: translateY(-12px) rotate(12deg);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          html,
          body {
            scroll-behavior: auto;
          }

          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

    </div>
  );
}


/* ================================================= */
/* APPLICATION ROW */
/* ================================================= */

function ApplicationRow({
  application,
}: {
  application: Application;
}) {
  const statusClass =
    application.status === 'Applied'
      ? 'bg-blue-50 text-blue-700'
      : application.status === 'Interview'
        ? 'bg-amber-50 text-amber-700'
        : application.status === 'Offer'
          ? 'bg-emerald-50 text-emerald-700'
          : 'bg-red-50 text-red-600';

  return (
    <div
      className="group grid grid-cols-1 md:grid-cols-[2fr_1.5fr_1fr_1fr_40px] gap-4 md:items-center px-6 py-5 border-b border-slate-100 last:border-0 hover:bg-slate-50/70 transition-colors duration-150"
    >

      {/* ================= COMPANY ================= */}

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-semibold shrink-0">
          {application.company.charAt(0)}
        </div>

        <div className="min-w-0">

          <p className="text-sm font-semibold text-slate-900 truncate">
            {application.company}
          </p>

          <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">

            <MapPin size={12} />

            {application.location}

          </div>

        </div>

      </div>


      {/* ================= POSITION ================= */}

      <div>

        <p className="text-sm text-slate-700">
          {application.position}
        </p>

      </div>


      {/* ================= DATE ================= */}

      <div className="flex items-center gap-2 text-sm text-slate-500">

        <CalendarDays size={15} />

        {application.date}

      </div>


      {/* ================= STATUS ================= */}

      <div>

        <span
          className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {application.status}
        </span>

      </div>


      {/* ================= MENU ================= */}

      <button
        type="button"
        className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors duration-150"
        aria-label="Application options"
      >

        <MoreHorizontal size={18} />

      </button>

    </div>
  );
}