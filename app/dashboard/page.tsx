'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Building2,
} from 'lucide-react';

import {
  clearStoredApplicationUser,
  getStoredApplicationUser,
  getStoredUsername,
  setStoredApplicationUser,
} from '@/lib/application-session';
import { createClient } from '@/lib/supabase/client';

type StatusKey = 'Applied' | 'Interview' | 'Offer' | 'Rejected';

type InterviewRoundState = 'completed' | 'scheduled';

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

type SupabaseNote = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  interview_tag: string | null;
  status: string;
  position: number;
  created_at: string;
  updated_at: string;
};

type ApplicationUser = {
  id: string;
  full_name: string | null;
  username: string;
  created_at: string;
  updated_at: string;
};

type RecommendedCompany = {
  name: string;
  role: string;
  location: string;
};

const RECOMMENDED_COMPANIES_CACHE_KEY = 'dashboard_recommended_companies';

const statusLabels: Record<string, string> = {
  applied: 'Applied',
  screening: 'Screening',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const statusTabs: Record<string, StatusKey> = {
  applied: 'Applied',
  screening: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
};

const interviewTagStatuses = ['interview', 'offer', 'rejected'];

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });
};

const statConfig = [
  {
    title: 'Applied' as StatusKey,
    description: 'Applications submitted',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Interview' as StatusKey,
    description: 'Applications in interview',
    icon: Clock3,
  },
  {
    title: 'Offer' as StatusKey,
    description: 'Offers received',
    icon: CheckCircle2,
  },
  {
    title: 'Rejected' as StatusKey,
    description: 'Applications closed',
    icon: XCircle,
  },
];

const emptyDashboardData: Record<
  StatusKey,
  { title: string; subtitle: string; rows: ApplicationTableRow[] }
> = {
  Applied: {
    title: 'Recent Applications',
    subtitle: 'Your latest application activity.',
    rows: [],
  },
  Interview: {
    title: 'Interview Pipeline',
    subtitle: 'Progress through each interview round.',
    rows: [],
  },
  Offer: {
    title: 'Offer Stage',
    subtitle: 'Companies that have moved forward with offers.',
    rows: [],
  },
  Rejected: {
    title: 'Rejected Applications',
    subtitle: 'Applications that did not move forward.',
    rows: [],
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [activeTab, setActiveTab] = useState<StatusKey>('Applied');
  const [notes, setNotes] = useState<SupabaseNote[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(true);
  const [showRecommended, setShowRecommended] = useState(true);
  const [recommendedCompanies, setRecommendedCompanies] = useState<
    RecommendedCompany[]
  >([]);
  const [loadingRecommended, setLoadingRecommended] = useState(true);

  /* ================================================= */
  /* LOAD APPLICATION NOTES */
  /* ================================================= */
  useEffect(() => {
    let mounted = true;

    async function loadApplications() {
      const storedUser = getStoredApplicationUser();
      const username = storedUser?.username || getStoredUsername();

      if (!username) {
        if (mounted) {
          setNotes([]);
          setLoadingApplications(false);
        }

        clearStoredApplicationUser();
        router.replace('/login');
        return;
      }

      const { data: profile } = await supabase.rpc(
        'get_application_user_profile',
        {
          p_user_id: storedUser?.id || null,
          p_username: username,
        }
      );

      const account = profile as ApplicationUser | null;

      if (!account) {
        if (mounted) {
          setNotes([]);
          setLoadingApplications(false);
        }

        clearStoredApplicationUser();
        router.replace('/login');
        return;
      }

      setStoredApplicationUser({
        id: account.id,
        username: account.username,
        fullName: account.full_name || '',
      });

      const { data, error } = await supabase
        .from('application_notes')
        .select(
          'id, user_id, title, description, interview_tag, status, position, created_at, updated_at'
        )
        .eq('user_id', account.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading dashboard applications:', error);
        if (mounted) {
          setNotes([]);
          setLoadingApplications(false);
        }
        return;
      }

      if (mounted) {
        setNotes((data as SupabaseNote[] | null) || []);
        setLoadingApplications(false);
      }
    }

    loadApplications();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  /* ================================================= */
  /* LOAD RECOMMENDED COMPANIES (cached per session) */
  /* ================================================= */
  useEffect(() => {
    let mounted = true;

    async function loadRecommendedCompanies() {
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem(
          RECOMMENDED_COMPANIES_CACHE_KEY
        );

        if (cached) {
          try {
            const parsed = JSON.parse(cached) as RecommendedCompany[];
            if (mounted) {
              setRecommendedCompanies(parsed);
              setLoadingRecommended(false);
            }
            return;
          } catch {
            sessionStorage.removeItem(RECOMMENDED_COMPANIES_CACHE_KEY);
          }
        }
      }

      const { data, error } = await supabase
        .from('companies')
        .select('name, role, location');

      if (error) {
        console.error('Error loading recommended companies:', error);
        if (mounted) {
          setRecommendedCompanies([]);
          setLoadingRecommended(false);
        }
        return;
      }

      const companies = (data as RecommendedCompany[] | null) || [];

      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          RECOMMENDED_COMPANIES_CACHE_KEY,
          JSON.stringify(companies)
        );
      }

      if (mounted) {
        setRecommendedCompanies(companies);
        setLoadingRecommended(false);
      }
    }

    loadRecommendedCompanies();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  /* ================================================= */
  /* DERIVE TABLE DATA FROM NOTES */
  /* ================================================= */
  const syncedDashboardData = useMemo(() => {
    const nextData = Object.fromEntries(
      Object.entries(emptyDashboardData).map(([key, value]) => [
        key,
        { ...value, rows: [] as ApplicationTableRow[] },
      ])
    ) as typeof emptyDashboardData;

    notes.forEach((note) => {
      const tab = statusTabs[note.status];
      if (!tab) return;

      nextData[tab].rows.push({
        company: note.title,
        role: statusLabels[note.status] || note.status,
        date: formatDate(note.updated_at || note.created_at),
        status: statusLabels[note.status] || note.status,
        note: note.description || 'No details added yet.',
        rounds:
          note.interview_tag && interviewTagStatuses.includes(note.status)
            ? [{ label: note.interview_tag, state: 'scheduled' }]
            : undefined,
      });
    });

    return nextData;
  }, [notes]);

  const stats = useMemo(
    () =>
      statConfig.map((item) => ({
        ...item,
        count: notes.filter((note) => statusTabs[note.status] === item.title)
          .length,
      })),
    [notes]
  );

  const activePanel = syncedDashboardData[activeTab];
  const activeApplications = notes.filter(
    (note) => note.status !== 'rejected'
  ).length;
  const awaitingReply = notes.filter((note) =>
    ['applied', 'screening'].includes(note.status)
  ).length;
  const offerPending = notes.filter((note) => note.status === 'offer').length;

  const handleTabChange = (tab: StatusKey) => {
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#f5f7fb]">

      {/* ================================================= */}
      {/* BACKGROUND DESIGN */}
      {/* ================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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
        className="absolute inset-0 pointer-events-none opacity-[0.35] z-0"
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

      {/* ================================================= */}
      {/* FIXED HEADER (TRANSPARENT) */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">
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
      {/* SCROLLABLE CONTENT */}
      {/* ================================================= */}
      <main
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-32">

          {/* RECOMMENDED COMPANIES */}
          <AnimatePresence>
            {showRecommended &&
              !loadingRecommended &&
              recommendedCompanies.length > 0 && (
                <motion.section
                  key="recommended-companies"
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="mb-8 overflow-hidden"
                >
                  <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/40 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                          <Building2 size={17} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-bold text-slate-900">
                              Recommended Companies
                            </h2>
                            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                              <Sparkles size={10} />
                              Suggested for you
                            </span>
                          </div>
                          <p className="mt-0.5 text-sm text-slate-500">
                            Based on your course and profile — not part of your tracked applications.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mx-6 rounded-xl border border-blue-100 bg-white overflow-hidden">
                      <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-3 font-semibold">Company</th>
                            <th className="px-5 py-3 font-semibold">Suggested Role</th>
                            <th className="px-5 py-3 font-semibold">Location</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recommendedCompanies.map((company) => (
                            <tr key={company.name} className="border-t border-slate-100">
                              <td className="px-5 py-3 font-semibold text-slate-900">
                                {company.name}
                              </td>
                              <td className="px-5 py-3 text-slate-600">{company.role}</td>
                              <td className="px-5 py-3 text-slate-500">{company.location}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex items-center justify-end gap-6 px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setShowRecommended(false)}
                        className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                      >
                        Dismiss
                      </button>
                      <Link
                        href="/applications"
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Proceed to Applications →
                      </Link>
                    </div>
                  </div>
                </motion.section>
              )}
          </AnimatePresence>

          {/* HERO CARD */}
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
                      You have <span className="text-blue-400">{activeApplications}</span> active applications.
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
                      <p className="mt-1 text-2xl font-bold text-white">{activeApplications}</p>
                    </div>

                    <div className="px-5 border-l border-white/10">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                        Awaiting Reply
                      </p>
                      <p className="mt-1 text-2xl font-bold text-white">{awaitingReply}</p>
                    </div>

                    <div className="pl-5 border-l border-white/10">
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                        Offer Pending
                      </p>
                      <p className="mt-1 text-2xl font-bold text-blue-400">{offerPending}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STATS ROW */}
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
                const isRejected = title === 'Rejected';

                const cardClass = isRejected
                  ? isActive
                    ? 'border-red-200 bg-red-50 shadow-red-100/80 -translate-y-0.5'
                    : 'border-red-100 bg-red-50/60 hover:border-red-200 hover:bg-red-50 hover:-translate-y-0.5 hover:shadow-red-100/80'
                  : isActive
                    ? 'border-blue-200 bg-blue-50 shadow-blue-100/80 -translate-y-0.5'
                    : 'border-slate-200/80 bg-white/90 hover:-translate-y-0.5 hover:shadow-md';

                const iconWrapClass = isRejected
                  ? isActive
                    ? 'bg-red-600'
                    : 'bg-red-100'
                  : isActive
                    ? 'bg-blue-600'
                    : 'bg-blue-50';

                const iconColorClass = isRejected
                  ? isActive
                    ? 'text-white'
                    : 'text-red-600'
                  : isActive
                    ? 'text-white'
                    : 'text-blue-600';

                const arrowClass = isRejected
                  ? isActive
                    ? 'text-red-600'
                    : 'text-red-400 group-hover:text-red-600'
                  : isActive
                    ? 'text-blue-600'
                    : 'text-slate-300 group-hover:text-blue-500';

                const labelClass = isRejected
                  ? isActive
                    ? 'text-red-700'
                    : 'text-red-600'
                  : isActive
                    ? 'text-blue-700'
                    : 'text-slate-500';

                return (
                  <button
                    key={title}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => handleTabChange(title)}
                    className={[
                      'group rounded-2xl border p-5 text-left shadow-sm transition-all md:p-6',
                      cardClass,
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={[
                          'flex h-11 w-11 items-center justify-center rounded-xl',
                          iconWrapClass,
                        ].join(' ')}
                      >
                        <Icon size={21} className={iconColorClass} strokeWidth={2} />
                      </div>
                      <ArrowUpRight size={18} className={arrowClass} />
                    </div>

                    <div className="mt-5">
                      <p className={['text-sm font-semibold', labelClass].join(' ')}>
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

          {/* DATA TABLE */}
          <section>
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
                <div>
                  <h2 className="font-bold text-slate-900">
                    {activePanel.title}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">{activePanel.subtitle}</p>
                </div>

                <Link
                  href="/applications"
                  className="hidden items-center gap-1 text-sm font-semibold text-blue-600 transition hover:text-blue-700 sm:inline-flex"
                >
                  View all
                  <ArrowUpRight size={15} />
                </Link>
              </div>

              <div className="px-3 py-5 sm:px-5 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                  >
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50/80 shadow-sm">
                      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
                        <div>
                          <h3 className="text-base font-bold text-slate-900">{activePanel.title}</h3>
                          <p className="text-xs text-slate-500">{activePanel.rows.length} entries</p>
                        </div>
                        <div
                          className={[
                            'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
                            activeTab === 'Rejected' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700',
                          ].join(' ')}
                        >
                          <Sparkles size={10} />
                          {activeTab}
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
                            {activePanel.rows.length === 0 && (
                              <tr className="border-t border-slate-200 bg-white">
                                <td
                                  colSpan={3}
                                  className="px-4 py-8 text-center text-sm text-slate-400 sm:px-5"
                                >
                                  {loadingApplications
                                    ? 'Loading applications...'
                                    : 'No applications in this stage yet.'}
                                </td>
                              </tr>
                            )}

                            {activePanel.rows.map((item) => (
                              <tr key={`${activeTab}-${item.company}-${item.role}`} className="border-t border-slate-200 bg-white">
                                <td className="px-4 py-3 align-top sm:px-5">
                                  <div className="font-semibold text-slate-900">{item.company}</div>
                                  <div className="mt-1 text-xs text-slate-500">{item.role}</div>
                                </td>
                                <td className="px-4 py-3 align-top sm:px-5">
                                  {item.rounds ? (
                                    <div className="flex flex-wrap gap-2">
                                      {item.rounds.map((round) => (
                                        <span
                                          key={`${item.company}-${round.label}`}
                                          className={
                                            round.state === 'completed'
                                              ? 'inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-emerald-700'
                                              : 'inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-blue-700'
                                          }
                                        >
                                          <Clock3 size={10} />
                                          {round.label}
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
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* ================================================= */}
      {/* BOTTOM FADE-IN EFFECT */}
      {/* ================================================= */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

      <style jsx global>{`
        html, body {
          scroll-behavior: smooth;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        @keyframes header-in {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-header-in {
          animation: header-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
