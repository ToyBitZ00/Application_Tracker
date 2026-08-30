'use client';

import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

type StatusKey = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

type InterviewRoundState = 'completed' | 'active' | 'upcoming';

type InterviewRound = {
  label: string;
  state: InterviewRoundState;
};

type ApplicationTableRow = {
  company: string;
  role: string;
  date: string;
  status: string;
  note: string;
  rounds?: InterviewRound[];
};

const getOrdinalLabel = (value: number) => {
  const mod100 = value % 100;
  const mod10 = value % 10;

  if (mod10 === 1 && mod100 !== 11) return `${value}st`;
  if (mod10 === 2 && mod100 !== 12) return `${value}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${value}rd`;

  return `${value}th`;
};

const getInterviewRoundLabel = (roundNumber: number) => `${getOrdinalLabel(roundNumber)} Interview Round`;

const stats = [
  {
    title: 'Applied' as StatusKey,
    count: 18,
    description: 'Applications submitted',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Interview' as StatusKey,
    count: 6,
    description: 'Applications in interview',
    icon: Clock3,
  },
  {
    title: 'Offer' as StatusKey,
    count: 3,
    description: 'Offers received',
    icon: CheckCircle2,
  },
  {
    title: 'Rejected' as StatusKey,
    count: 9,
    description: 'Applications closed',
    icon: XCircle,
  },
];

const dashboardData: Record<
  StatusKey,
  {
    title: string;
    subtitle: string;
    rows: ApplicationTableRow[];
  }
> = {
  Applied: {
    title: 'Recent Applications',
    subtitle: 'Your latest application activity.',
    rows: [
      {
        company: 'Northstar Labs',
        role: 'Frontend Developer Intern',
        date: 'Jun 24',
        status: 'Under review',
        note: 'Portfolio reviewed by design team',
      },
      {
        company: 'Signal Works',
        role: 'Product Analyst',
        date: 'Jun 22',
        status: 'Awaiting response',
        note: 'Resume sent to hiring manager',
      },
      {
        company: 'Pixel Harbor',
        role: 'UI Engineer',
        date: 'Jun 18',
        status: 'Applied',
        note: 'Application submitted successfully',
      },
    ],
  },
  Interview: {
    title: 'Interview Pipeline',
    subtitle: 'Progress through each interview round.',
    rows: [
      {
        company: 'Aster Cloud',
        role: 'Software Engineer',
        date: 'Jul 02',
       status: '2nd Interview Round',
       note: 'System design questions and coding challenge',
       rounds: [
         { label: getInterviewRoundLabel(1), state: 'completed' },
         { label: getInterviewRoundLabel(2), state: 'active' },
         { label: getInterviewRoundLabel(3), state: 'upcoming' },
       ],
     },
     {
       company: 'Orbit Studio',
       role: 'Frontend Engineer',
       date: 'Jul 05',
       status: '3rd Interview Round',
       note: 'Live UI review with engineering leads',
       rounds: [
         { label: getInterviewRoundLabel(1), state: 'completed' },
         { label: getInterviewRoundLabel(2), state: 'completed' },
         { label: getInterviewRoundLabel(3), state: 'active' },
       ],
     },
     {
       company: 'Luna Digital',
       role: 'Product Designer',
       date: 'Jul 08',
       status: '1st Interview Round',
       note: 'Design critique and role fit discussion',
       rounds: [
         { label: getInterviewRoundLabel(1), state: 'active' },
         { label: getInterviewRoundLabel(2), state: 'upcoming' },
         { label: getInterviewRoundLabel(3), state: 'upcoming' },
       ],
     },
   ],
  },
  Offer: {
    title: 'Offer Stage',
    subtitle: 'Companies that have moved forward with offers.',
    rows: [
      {
        company: 'Summit Grid',
        role: 'Product Engineer',
        date: 'Jul 11',
        status: 'Offer received',
        note: 'Compensation package under review',
      },
      {
        company: 'BrightPath',
        role: 'Full-Stack Developer',
        date: 'Jul 15',
        status: 'Negotiation',
        note: 'Offer details and start date being discussed',
      },
      {
        company: 'Verve Labs',
        role: 'Web Developer',
        date: 'Jul 18',
        status: 'Accepted',
        note: 'Final onboarding packet sent',
      },
    ],
  },
  Rejected: {
    title: 'Rejected Applications',
    subtitle: 'Applications that did not move forward.',
    rows: [
      {
        company: 'Clearline',
        role: 'Junior QA Analyst',
        date: 'Jun 12',
        status: 'Not selected',
        note: 'Role filled internally before final review',
      },
      {
        company: 'Delta Forge',
        role: 'Business Analyst',
        date: 'Jun 05',
        status: 'Rejected',
        note: 'Interview panel selected another candidate',
      },
      {
        company: 'Harbor One',
        role: 'Operations Intern',
        date: 'May 30',
        status: 'Closed',
        note: 'Application was not advanced to shortlist',
      },
    ],
  },
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<StatusKey>('Applied');
  const activePanel = dashboardData[activeTab];

  const handleTabChange = (tab: StatusKey) => {
    setActiveTab(tab);
  };

  return (
    // Fixed page height so only the <main> block inside will scroll.
    <div className="relative h-screen w-full flex flex-col overflow-hidden bg-[#f5f7fb]">
      
      {/* ================================================= */}
      {/* BACKGROUND DESIGN (FIXED) */}
      {/* ================================================= */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div 
          className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse" 
          style={{ animationDelay: '1.5s' }}
        />
        <div 
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-400/5 blur-3xl animate-pulse" 
          style={{ animationDelay: '3s' }}
        />
      </div>

      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35] z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
        }}
      />

      {/* ================================================= */}
      {/* FIXED HEADER (TRANSPARENT) */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
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
          </header>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCROLLABLE CONTENT WITH MASK FOR FADE EFFECT */}
      {/* ================================================= */}
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide pt-10 pb-32"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 32px, black calc(100% - 80px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 32px, black calc(100% - 80px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          
          <section className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-[#0f172a] p-7 md:p-9 shadow-xl shadow-slate-900/10">
              <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-600/20 blur-3xl" />
              <div className="absolute right-24 bottom-[-100px] w-52 h-52 rounded-full bg-indigo-500/10 blur-3xl" />

              <div className="relative">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 mb-5">
                      <TrendingUp size={14} className="text-blue-400" />
                      <span className="text-xs font-medium text-slate-300">
                        Application Activity
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      You have <span className="text-blue-400">26</span> active applications.
                    </h2>
                    <p className="mt-2 text-sm text-slate-400 max-w-lg">
                      Track interviews, responses, offers, and follow-ups from one clean workflow.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-0 lg:min-w-[430px]">
                    <div className="pr-5">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                        Active
                      </p>
                      <p className="mt-1 text-2xl font-bold text-white">18</p>
                    </div>

                    <div className="px-5 border-l border-white/10">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                        Awaiting Reply
                      </p>
                      <p className="mt-1 text-2xl font-bold text-white">8</p>
                    </div>

                    <div className="pl-5 border-l border-white/10">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                        Offer Pending
                      </p>
                      <p className="mt-1 text-2xl font-bold text-blue-400">3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Application Pipeline</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Track where your applications currently stand.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ title, count, description, icon: Icon }) => {
                const isActive = activeTab === title;

                return (
                  <button
                    key={title}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleTabChange(title)}
                    className={[
                      'group rounded-2xl border p-5 text-left shadow-sm transition-all md:p-6',
                      isActive
                        ? 'border-blue-200 bg-blue-50 shadow-blue-100/80 -translate-y-0.5'
                        : 'border-slate-200/80 bg-white/95 backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-md',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={[
                          'flex h-11 w-11 items-center justify-center rounded-xl',
                          isActive ? 'bg-blue-600' : 'bg-blue-50',
                        ].join(' ')}
                      >
                        <Icon size={21} className={isActive ? 'text-white' : 'text-blue-600'} strokeWidth={2} />
                      </div>
                      <ArrowUpRight
                        size={18}
                        className={isActive ? 'text-blue-600' : 'text-slate-300 group-hover:text-blue-500'}
                      />
                    </div>

                    <div className="mt-5">
                      <p className={['text-sm font-semibold', isActive ? 'text-blue-700' : 'text-slate-500'].join(' ')}>
                        {title}
                      </p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">{count}</p>
                      <p className="mt-1.5 text-xs text-slate-400">{description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section>
            <div className="rounded-2xl border border-slate-200/80 bg-white/95 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {dashboardData[activeTab].title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{dashboardData[activeTab].subtitle}</p>
                </div>

                <Link
                  href="/applications"
                  className="hidden items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:inline-flex"
                >
                  View all
                  <ArrowUpRight size={15} />
                </Link>
              </div>

              <div
                ref={carouselRef}
                onWheel={handleWheel}
                className="scroll-smooth px-3 py-5 sm:px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                style={{
                  overflowX: 'auto',
                  display: 'flex',
                  gap: '1rem',
                  scrollSnapType: 'x mandatory',
                  scrollPaddingInline: '0.75rem',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {statuses.map((tab, index) => {
                  const panel = dashboardData[tab];

                  return (
                    <div
                      key={tab}
                      ref={(el) => {
                        cardRefs.current[index] = el;
                      }}
                      style={{ scrollSnapAlign: 'center', flex: '0 0 82%', minWidth: 0 }}
                      className="md:flex-[0_0_70%] lg:flex-[0_0_62%]"
                    >
                      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm">
                        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
                          <div>
                            <h3 className="text-base font-bold text-slate-900">{panel.title}</h3>
                            <p className="text-xs text-slate-500">{panel.rows.length} entries</p>
                          </div>
                          <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
                            <Sparkles size={10} />
                            {tab}
                          </div>
                        </div>

                        <div className="overflow-x-auto">
                          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                            <thead className="bg-slate-100 text-slate-600">
                              <tr>
                                <th className="px-4 py-3 font-semibold sm:px-5">Company</th>
                                <th className="px-4 py-3 font-semibold sm:px-5">Stage</th>
                                <th className="px-4 py-3 font-semibold sm:px-5 text-right">Date</th>
                              </tr>
                            </thead>
                            <tbody>
                              {panel.rows.map((item) => (
                                <tr key={`${tab}-${item.company}-${item.role}`} className="border-t border-slate-200 bg-white">
                                  <td className="px-4 py-3 align-top sm:px-5">
                                    <div className="font-semibold text-slate-900">{item.company}</div>
                                    <div className="mt-1 text-xs text-slate-500">{item.role}</div>
                                  </td>
                                  <td className="px-4 py-3 align-top sm:px-5">
                                    {item.rounds ? (
                                      <div className="flex flex-wrap gap-2">
                                        {item.rounds.map((round) => (
                                          <span
                                            key={`${item.company}-${round}`}
                                            className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700"
                                          >
                                            {round}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-700">
                                        {item.status}
                                      </span>
                                    )}
                                    <p className="mt-2 text-xs text-slate-500">{item.note}</p>
                                  </td>
                                  <td className="px-4 py-3 align-top text-right sm:px-5">
                                    <div className="font-medium text-slate-700">{item.date}</div>
                                    <div className="mt-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.11em] text-emerald-700">
                                      {item.status}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ================================================= */}
      {/* BOTTOM FADE-IN EFFECT & GLOBAL STYLES */}
      {/* ================================================= */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

      <style jsx global>{`
        html, body {
          scroll-behavior: smooth;
        }

        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
}