'use client';

import {
  BarChart2,
  BriefcaseBusiness,
  Clock3,
  CheckCircle2,
  ArrowUpRight,
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
/* MOCK DATA */
/* ================================================= */

const STATS = [
  { label: 'Applications', value: 124, icon: BriefcaseBusiness },
  { label: 'Interviews', value: 18, icon: Clock3 },
  { label: 'Offers', value: 3, icon: CheckCircle2 },
];

const momentumData = [
  { week: 'Week 1', applications: 12 },
  { week: 'Week 2', applications: 19 },
  { week: 'Week 3', applications: 8 },
  { week: 'Week 4', applications: 24 },
  { week: 'Week 5', applications: 15 },
  { week: 'Week 6', applications: 30 },
];

const pipelineData = [
  { name: 'Applied', value: 45, color: '#94a3b8' },      // Slate (Neutral)
  { name: 'Screening', value: 20, color: '#3b82f6' },    // Blue (Active)
  { name: 'Interview', value: 15, color: '#f59e0b' },    // Amber/Orange (Progress)
  { name: 'Offer', value: 5, color: '#10b981' },         // Emerald (Success)
  { name: 'Rejected', value: 25, color: '#ef4444' },     // Red (Declined)
];

/* ================================================= */
/* MAIN COMPONENT */
/* ================================================= */

export default function ReportsPage() {
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
          <header>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-slate-950 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                <BarChart2 size={26} strokeWidth={2.5} />
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Reports
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-950 leading-none">
                  Application Reports
                </h1>
                <p className="mt-1.5 text-xs md:text-sm text-slate-500">
                  Analyze your OJT and internship application activity.
                </p>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* ================================================= */}
      {/* SCROLLABLE CONTENT WITH MASK FOR FADE EFFECT */}
      {/* ================================================= */}
      <main 
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide pt-4 pb-32"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 32px, black calc(100% - 80px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 32px, black calc(100% - 80px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
          
          {/* ================= KPI CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            {STATS.map(({ label, value, icon: Icon }) => (
              <div 
                key={label} 
                className="bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 transition-transform duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                    <Icon size={21} className="text-blue-600" strokeWidth={2} />
                  </div>
                  <ArrowUpRight size={18} className="text-slate-300" />
                </div>
                <div className="mt-5">
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                  <p className="mt-1 text-3xl md:text-4xl font-extrabold text-slate-950">{value}</p>
                  <p className="mt-1.5 text-xs font-medium text-slate-400">Total {label.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ================= CHARTS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Bar Chart (8 cols) */}
            <div className="lg:col-span-8 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
              <div className="mb-8">
                <h2 className="text-base font-bold text-slate-950">Applications Over Time</h2>
                <p className="text-xs text-slate-400 mt-1">Number of applications submitted per week.</p>
              </div>
              
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={momentumData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="week" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }} 
                      dy={15}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 500 }}
                    />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', fontWeight: '600', color: '#0f172a' }}
                    />
                    <Bar 
                      dataKey="applications" 
                      fill="#3b82f6" 
                      radius={[6, 6, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut Chart (4 cols) */}
            <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgba(15,23,42,0.03)] flex flex-col">
              <div className="mb-4">
                <h2 className="text-base font-bold text-slate-950">Pipeline Funnel</h2>
                <p className="text-xs text-slate-400 mt-1">Current distribution of applications.</p>
              </div>
              
              <div className="flex-1 min-h-[280px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipelineData}
                      cx="50%"
                      cy="45%"
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pipelineData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(15,23,42,0.05)', fontWeight: '600', color: '#0f172a' }}
                      itemStyle={{ fontWeight: 'bold' }}
                    />
                    <Legend 
                      verticalAlign="bottom" 
                      height={60}
                      iconType="circle"
                      formatter={(value) => <span className="text-xs font-semibold text-slate-700 ml-1">{value}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
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