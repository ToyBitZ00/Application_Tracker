'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Ban,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Crown,
  Loader2,
  ShieldCheck,
  Users,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { getStoredApplicationUser } from '@/lib/application-session';
import { createClient } from '@/lib/supabase/client';

type AccountRole = 'user' | 'admin' | 'super_admin';

type ManagedUser = {
  id: string;
  full_name: string;
  username: string;
  account_role: AccountRole;
  is_blocked: boolean;
  blocked_at: string | null;
  created_at: string;
  updated_at: string;
  application_count: number;
};

type ApplicationNoteMetric = {
  status: string;
  created_at: string;
};

const roleLabels: Record<AccountRole, string> = {
  user: 'Students',
  admin: 'Admins',
  super_admin: 'Super Admin',
};

const roleColors: Record<AccountRole, string> = {
  user: '#2563eb',
  admin: '#7c3aed',
  super_admin: '#f59e0b',
};

const monthOptions = [
  'All',
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });
}

function buildSignupData(users: ManagedUser[]) {
  const now = new Date();

  return Array.from({ length: 12 }, (_, index) => {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - (11 - index),
      1
    );

    const month = monthDate.toLocaleDateString('en-US', {
      month: 'short',
    });

    const count = users.filter((user) => {
      const createdAt = new Date(user.created_at);

      return (
        createdAt.getFullYear() === monthDate.getFullYear() &&
        createdAt.getMonth() === monthDate.getMonth()
      );
    }).length;

    return {
      month,
      students: count,
    };
  });
}

function getPeakMonth(
  data: ReturnType<typeof buildSignupData>
) {
  return data.reduce(
    (peak, item) =>
      item.students > peak.students
        ? item
        : peak,
    data[0] || {
      month: '',
      students: 0,
    }
  );
}

export default function AdminDashboardPage() {
  const supabase = useMemo(() => createClient(), []);
  const currentUser = getStoredApplicationUser();

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [notes, setNotes] = useState<ApplicationNoteMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registrationMonth, setRegistrationMonth] = useState('All');
  const [registrationYear, setRegistrationYear] = useState('All');

  useEffect(() => {
    let mounted = true;

    async function loadDashboardData() {
      if (!currentUser?.id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      const [
        usersResponse,
        notesResponse,
      ] = await Promise.all([
        supabase.rpc(
          'list_application_users_for_admin',
          {
            p_actor_user_id: currentUser.id,
          }
        ),
        supabase
          .from('application_notes')
          .select('status, created_at'),
      ]);

      if (usersResponse.error) {
        if (mounted) {
          setError(
            usersResponse.error.message ||
              'Unable to load dashboard data.'
          );
          setUsers([]);
          setNotes([]);
          setLoading(false);
        }

        return;
      }

      if (mounted) {
        setUsers((usersResponse.data as ManagedUser[] | null) || []);
        setNotes(
          (notesResponse.data as ApplicationNoteMetric[] | null) ||
            []
        );
        setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      mounted = false;
    };
  }, [currentUser?.id, supabase]);

  const totalStudents = users.filter(
    (user) => user.account_role === 'user'
  ).length;

  const activeApplications = notes.filter(
    (note) => note.status !== 'rejected'
  ).length;

  const offersSecured = notes.filter(
    (note) => note.status === 'offer'
  ).length;

  const blockedAccounts = users.filter(
    (user) => user.is_blocked
  ).length;

  const systemKpis = [
    {
      title: 'Total Students',
      value: totalStudents,
      trend: `${users.length} total accounts`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Active Applications',
      value: activeApplications,
      trend: `${notes.length} tracked applications`,
      icon: BriefcaseBusiness,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      title: 'Offers Secured',
      value: offersSecured,
      trend: `${blockedAccounts} blocked accounts`,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  const registrationYears = useMemo(() => {
    const years = Array.from(
      new Set(
        users
          .map((user) => new Date(user.created_at).getFullYear())
          .filter((year) => !Number.isNaN(year))
      )
    ).sort((a, b) => b - a);

    return ['All', ...years.map(String)];
  }, [users]);

  const filteredRegistrationUsers = useMemo(
    () =>
      users.filter((user) => {
        const createdAt = new Date(user.created_at);

        if (Number.isNaN(createdAt.getTime())) {
          return false;
        }

        const matchesYear =
          registrationYear === 'All' ||
          createdAt.getFullYear() === Number(registrationYear);
        const matchesMonth =
          registrationMonth === 'All' ||
          createdAt.toLocaleDateString('en-US', {
            month: 'short',
          }) === registrationMonth;

        return matchesYear && matchesMonth;
      }),
    [
      registrationMonth,
      registrationYear,
      users,
    ]
  );

  const signupsData = buildSignupData(filteredRegistrationUsers);
  const peakSignupMonth =
    getPeakMonth(signupsData);

  const roleDistribution = ([
    'user',
    'admin',
    'super_admin',
  ] as AccountRole[])
    .map((role) => ({
      name: roleLabels[role],
      value: users.filter((user) => user.account_role === role)
        .length,
      color: roleColors[role],
    }))
    .filter((item) => item.value > 0);

  const recentUsers = [...users]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
    )
    .slice(0, 6);

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-32">
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600" />
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                System
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
              System Dashboard
            </h1>
            <p className="text-sm md:text-base text-slate-500">
              Live Supabase overview of users, applications, and admin
              activity.
            </p>
          </header>

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-10 flex items-center justify-center rounded-2xl border border-slate-200 bg-white/90 py-16 text-sm font-semibold text-slate-500">
              <Loader2 size={20} className="mr-2 animate-spin text-blue-600" />
              Loading Supabase data...
            </div>
          ) : (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-8">
                {systemKpis.map((kpi) => (
                  <div
                    key={kpi.title}
                    className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 transition-transform"
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                      <kpi.icon
                        size={20}
                        className={kpi.color}
                        strokeWidth={2.5}
                      />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-500">
                      {kpi.title}
                    </h3>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
                      {kpi.value}
                    </p>
                    <p className="text-xs font-medium text-slate-400 mt-2">
                      {kpi.trend}
                    </p>
                  </div>
                ))}
              </section>

              <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
                <div className="lg:col-span-8 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
                  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900">
                        Account Registrations
                      </h2>
                      <p className="text-xs text-slate-500 mt-0.5">
                        New accounts by month from Supabase.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:flex">
                      <select
                        value={registrationMonth}
                        onChange={(event) =>
                          setRegistrationMonth(event.target.value)
                        }
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        {monthOptions.map((month) => (
                          <option key={month} value={month}>
                            {month === 'All' ? 'All Months' : month}
                          </option>
                        ))}
                      </select>
                      <select
                        value={registrationYear}
                        onChange={(event) =>
                          setRegistrationYear(event.target.value)
                        }
                        className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      >
                        {registrationYears.map((year) => (
                          <option key={year} value={year}>
                            {year === 'All' ? 'All Years' : year}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="h-[310px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={signupsData}
                        margin={{
                          top: 8,
                          right: 12,
                          left: 0,
                          bottom: 22,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="4 4"
                          vertical={false}
                          stroke="#e2e8f0"
                        />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: '#64748b',
                            fontWeight: 500,
                          }}
                          interval={0}
                          minTickGap={0}
                          height={36}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fontSize: 12,
                            fill: '#64748b',
                            fontWeight: 500,
                          }}
                        />
                        <Tooltip
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow:
                              '0 10px 25px rgba(15,23,42,0.05)',
                            fontWeight: '600',
                          }}
                        />
                        <Bar
                          dataKey="students"
                          fill="#2563eb"
                          radius={[4, 4, 0, 0]}
                          barSize={32}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                          <CalendarDays size={16} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Registration Calendar
                          </h3>
                          <p className="text-[11px] font-medium text-slate-400">
                            Monthly signups for this year
                          </p>
                        </div>
                      </div>

                      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-700">
                        Peak: {peakSignupMonth.month || 'None'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
                      {signupsData.map((item) => {
                        const isPeak =
                          item.month ===
                            peakSignupMonth.month &&
                          item.students > 0;

                        return (
                          <div
                            key={item.month}
                            className={`rounded-xl border px-3 py-2 ${
                              isPeak
                                ? 'border-blue-300 bg-blue-50'
                                : 'border-slate-200 bg-white'
                            }`}
                          >
                            <p
                              className={`text-[11px] font-bold uppercase ${
                                isPeak
                                  ? 'text-blue-700'
                                  : 'text-slate-500'
                              }`}
                            >
                              {item.month}
                            </p>
                            <p className="mt-1 text-xl font-extrabold text-slate-950">
                              {item.students}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
                  <div className="mb-2">
                    <h2 className="text-base font-bold text-slate-900">
                      Account Roles
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Current users grouped by access level.
                    </p>
                  </div>

                  <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={roleDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={85}
                          paddingAngle={4}
                          dataKey="value"
                          stroke="none"
                        >
                          {roleDistribution.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            fontWeight: '600',
                          }}
                        />
                        <Legend
                          verticalAlign="bottom"
                          height={36}
                          iconType="circle"
                          wrapperStyle={{
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#475569',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              <section className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200">
                  <h2 className="text-base font-bold text-slate-900">
                    Recent Accounts
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Latest users synced from Supabase.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                    <thead className="bg-slate-100 text-slate-600">
                      <tr>
                        <th className="px-4 py-3 font-semibold sm:px-5">
                          Account
                        </th>
                        <th className="px-4 py-3 font-semibold sm:px-5">
                          Role
                        </th>
                        <th className="px-4 py-3 font-semibold sm:px-5">
                          Joined
                        </th>
                        <th className="px-4 py-3 font-semibold sm:px-5 text-right">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="border-t border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                        >
                          <td className="px-4 py-3 sm:px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                                {user.full_name.charAt(0)}
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {user.full_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  @{user.username}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 sm:px-5">
                            <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                              {user.account_role === 'super_admin' ? (
                                <Crown size={12} />
                              ) : (
                                <ShieldCheck size={12} />
                              )}
                              {roleLabels[user.account_role]}
                            </span>
                          </td>
                          <td className="px-4 py-3 sm:px-5 text-slate-500 font-medium text-xs whitespace-nowrap">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-4 py-3 sm:px-5 text-right">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                user.is_blocked
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {user.is_blocked ? (
                                <Ban size={12} />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              {user.is_blocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />
    </>
  );
}
