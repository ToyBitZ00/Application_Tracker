'use client';

import {
  Users,
  BriefcaseBusiness,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

/* ================================================= */
/* MOCK DATA: ADMIN METRICS */
/* ================================================= */

const systemKpis = [
  { title: 'Total Students', value: '1,248', trend: '+12% this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { title: 'Active Applications', value: '4,821', trend: '+8% this week', icon: BriefcaseBusiness, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { title: 'Offers Secured', value: '312', trend: '+24% this month', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
];

const signupsData = [
  { month: 'Jan', students: 120 },
  { month: 'Feb', students: 210 },
  { month: 'Mar', students: 180 },
  { month: 'Apr', students: 290 },
  { month: 'May', students: 350 },
  { month: 'Jun', students: 420 },
];

const courseDistribution = [
  { name: 'BSCS', value: 450, color: '#2563eb' }, // Blue 600
  { name: 'BSBA', value: 320, color: '#3b82f6' }, // Blue 500
  { name: 'BSHM', value: 210, color: '#60a5fa' }, // Blue 400
  { name: 'BEED', value: 150, color: '#8b5cf6' }, // Violet 500
  { name: 'BSEd', value: 118, color: '#a855f7' }, // Purple 500
];

const recentUsers = [
  { name: 'Paul Nerie B. Aguirre', course: 'BSCS', date: 'Just now', status: 'Active' },
  { name: 'Mark MJ Punzalan', course: 'BSCS', date: '2 mins ago', status: 'Active' },
  { name: 'Rob King Cunanan', course: 'BSCS', date: '15 mins ago', status: 'Active' },
  { name: 'Maria Santos', course: 'BSBA', date: '1 hour ago', status: 'Active' },
  { name: 'Juan Dela Cruz', course: 'BSHM', date: '3 hours ago', status: 'Suspended' },
];

/* ================================================= */
/* DASHBOARD PAGE COMPONENT */
/* ================================================= */

export default function AdminDashboardPage() {
  return (
    <>
      {/* ================================================= */}
      {/* BACKGROUND DESIGN (UNIFIED) */}
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
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />

      {/* ================================================= */}
      {/* FIXED HEADER (TRANSPARENT & UNIFIED) */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  System
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                System Dashboard
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-500">
                Overview of platform metrics and activities.
              </p>
            </div>
          </header>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCROLLABLE CONTENT */}
      {/* ================================================= */}
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-8 pb-32">
          
          {/* KPI Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {systemKpis.map((kpi) => (
              <div key={kpi.title} className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-sm hover:-translate-y-0.5 transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${kpi.bg}`}>
                    <kpi.icon size={20} className={kpi.color} strokeWidth={2.5} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500">{kpi.title}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <p className="text-3xl font-bold tracking-tight text-slate-950">{kpi.value}</p>
                  </div>
                  <p className="text-xs font-medium text-slate-400 mt-2">{kpi.trend}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Charts Area */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8">
            
            {/* Bar Chart (8 cols) */}
            <div className="lg:col-span-8 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900">Student Registrations</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Platform growth over the last 6 months.</p>
                </div>
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={signupsData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 500 }} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', fontWeight: '600' }}
                    />
                    <Bar dataKey="students" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart (4 cols) */}
            <div className="lg:col-span-4 bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col">
              <div className="mb-2">
                <h2 className="text-base font-bold text-slate-900">Program Distribution</h2>
                <p className="text-xs text-slate-500 mt-0.5">Active students by course.</p>
              </div>
              
              <div className="flex-1 min-h-[250px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={courseDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                      {courseDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: '600' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 600, color: '#475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </section>

          {/* Recent Activity Table */}
          <section className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recent Registrations</h2>
                <p className="text-xs text-slate-500 mt-0.5">The latest students to join the platform.</p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold sm:px-5">Student Name</th>
                    <th className="px-4 py-3 font-semibold sm:px-5">Course</th>
                    <th className="px-4 py-3 font-semibold sm:px-5">Joined</th>
                    <th className="px-4 py-3 font-semibold sm:px-5 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((user, idx) => (
                    <tr key={idx} className="border-t border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-semibold text-slate-900 truncate">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 sm:px-5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
                          {user.course}
                        </span>
                      </td>
                      <td className="px-4 py-3 sm:px-5 text-slate-500 font-medium text-xs whitespace-nowrap">
                        {user.date}
                      </td>
                      <td className="px-4 py-3 sm:px-5 text-right">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.status === 'Active' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

      {/* ================================================= */}
      {/* BOTTOM FADE-IN EFFECT */}
      {/* ================================================= */}
      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

      {/* GLOBAL STYLES */}
      <style jsx global>{`
        @keyframes header-in {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-header-in { animation: header-in 0.4s ease-out forwards; }
      `}</style>
    </>
  );
}