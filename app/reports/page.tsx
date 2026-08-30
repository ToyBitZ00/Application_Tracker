'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Target,
  Clock,
  TrendingUp,
  ArrowUpRight,
  Calendar,
  ChevronDown,
  X,
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

const momentumData = [
  { week: 'Week 1', applications: 12 },
  { week: 'Week 2', applications: 19 },
  { week: 'Week 3', applications: 8 },
  { week: 'Week 4', applications: 24 },
  { week: 'Week 5', applications: 15 },
  { week: 'Week 6', applications: 30 },
];

const pipelineData = [
  { 
    name: 'Applied', 
    value: 45, 
    color: '#94a3b8',
    companies: [
      { name: 'Northstar Labs', role: 'Frontend Developer Intern', date: 'Aug 28' },
      { name: 'Pixel Harbor', role: 'UI Engineer', date: 'Aug 25' },
      { name: 'Quantum Tech', role: 'Web Developer Intern', date: 'Aug 20' },
    ]
  },
  { 
    name: 'Screening', 
    value: 20, 
    color: '#3b82f6',
    companies: [
      { name: 'Signal Works', role: 'Product Analyst', date: 'Aug 15' },
      { name: 'Nexus Systems', role: 'IT Support Intern', date: 'Aug 12' },
    ]
  },
  { 
    name: 'Interview', 
    value: 15, 
    color: '#f59e0b',
    companies: [
      { name: 'Aster Cloud', role: 'Software Engineer', date: 'Jul 02', currentRound: '2nd Interview' },
      { name: 'Orbit Studio', role: 'Frontend Engineer', date: 'Jul 05', currentRound: '3rd Interview' },
      { name: 'Luna Digital', role: 'Product Designer', date: 'Jul 08', currentRound: '1st Interview' },
    ]
  },
  { 
    name: 'Offer', 
    value: 5, 
    color: '#10b981',
    companies: [
      { name: 'Summit Grid', role: 'Product Engineer', date: 'Jul 11' },
      { name: 'BrightPath', role: 'Full-Stack Developer', date: 'Jul 15' },
    ]
  },
  { 
    name: 'Rejected', 
    value: 25, 
    color: '#ef4444',
    companies: [
      { name: 'Clearline', role: 'Junior QA Analyst', date: 'Jun 12' },
      { name: 'Delta Forge', role: 'Business Analyst', date: 'Jun 05' },
    ]
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = ['2026', '2025', '2024', '2023'];

// Upgraded Data for the Light Blue Header Modals
const KPI_DETAILS: Record<string, any> = {
  responseRate: {
    title: 'Response Rate',
    value: '42.5%',
    trend: '+4.2%',
    trendColor: 'bg-white shadow-sm border border-emerald-100 text-emerald-600',
    icon: <Activity size={24} className="text-blue-600" strokeWidth={2} />,
    description: 'Detailed breakdown of companies that have replied to your applications.',
    items: [
      { company: 'Northstar Labs', avatar: 'NL', avatarBg: 'bg-blue-100 text-blue-700', detail: 'Replied in 2 days', badge: 'Interview', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
      { company: 'Pixel Harbor', avatar: 'PH', avatarBg: 'bg-indigo-100 text-indigo-700', detail: 'Replied in 5 days', badge: 'Screening', badgeColor: 'bg-blue-50 text-blue-700 border-blue-200' },
      { company: 'Clearline', avatar: 'CL', avatarBg: 'bg-slate-200 text-slate-700', detail: 'Replied in 12 days', badge: 'Rejected', badgeColor: 'bg-red-50 text-red-700 border-red-200' },
    ]
  },
  conversion: {
    title: 'Interview Conversion',
    value: '18.0%',
    trend: '+2.1%',
    trendColor: 'bg-white shadow-sm border border-emerald-100 text-emerald-600',
    icon: <Target size={24} className="text-blue-600" strokeWidth={2} />,
    description: 'Applications that successfully moved from applied to the interview stage.',
    items: [
      { company: 'Aster Cloud', avatar: 'AC', avatarBg: 'bg-purple-100 text-purple-700', detail: 'Software Engineer', badge: 'Technical', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
      { company: 'Orbit Studio', avatar: 'OS', avatarBg: 'bg-orange-100 text-orange-700', detail: 'Frontend Engineer', badge: 'Panel', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200' },
      { company: 'Luna Digital', avatar: 'LD', avatarBg: 'bg-emerald-100 text-emerald-700', detail: 'Product Designer', badge: 'Hiring Mgr', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    ]
  },
  timeToResponse: {
    title: 'Avg Time-to-Response',
    value: '8.4 Days',
    trend: '-1.2 Days', 
    trendColor: 'bg-white shadow-sm border border-emerald-100 text-emerald-600',
    icon: <Clock size={24} className="text-blue-600" strokeWidth={2} />,
    description: 'The average wait time before initial contact, sorted by fastest response.',
    items: [
      { company: 'Northstar Labs', avatar: 'NL', avatarBg: 'bg-blue-100 text-blue-700', detail: 'Frontend Developer Intern', badge: '2 Days', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { company: 'Pixel Harbor', avatar: 'PH', avatarBg: 'bg-indigo-100 text-indigo-700', detail: 'UI Engineer', badge: '5 Days', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
      { company: 'Clearline', avatar: 'CL', avatarBg: 'bg-slate-200 text-slate-700', detail: 'Junior QA Analyst', badge: '12 Days', badgeColor: 'bg-amber-50 text-amber-700 border-amber-200' },
      { company: 'Delta Forge', avatar: 'DF', avatarBg: 'bg-red-100 text-red-700', detail: 'Business Analyst', badge: '14 Days', badgeColor: 'bg-red-50 text-red-700 border-red-200' },
    ]
  }
};

/* ================================================= */
/* MAIN COMPONENT */
/* ================================================= */

export default function ReportsPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('This Month');
  const [customMonth, setCustomMonth] = useState('Dec');
  const [customYear, setCustomYear] = useState('2025');
  
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);
  const [activeKpiModal, setActiveKpiModal] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveKpiModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
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
      {/* FIXED HEADER (TRANSPARENT & UNIFORM) */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Reports
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                Reports & Analytics
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-500 max-w-xl">
                Analyze your OJT and internship application activity.
              </p>
            </div>

            {/* CUSTOM RANGE FILTER DROPDOWN */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 h-10 pl-4 pr-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-xl text-sm font-bold text-slate-700 shadow-sm hover:bg-white hover:border-slate-300 transition-all"
              >
                <Calendar size={15} className="text-blue-600" />
                {timeRange}
                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)] border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="p-2 flex flex-col">
                    
                    {['This Week', 'Last Week', 'This Month', 'Last Month'].map((range) => (
                      <button
                        key={range}
                        onClick={() => {
                          setTimeRange(range);
                          setIsDropdownOpen(false);
                        }}
                        className={`text-left px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                          timeRange === range 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {range}
                      </button>
                    ))}
                    
                    <div className="h-px bg-slate-100 my-2 mx-2" />
                    
                    <div className="px-4 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                        Specify Past Period
                      </p>
                      
                      <div className="flex gap-2 mb-3">
                        <select 
                          value={customMonth}
                          onChange={(e) => setCustomMonth(e.target.value)}
                          className="w-1/2 h-9 px-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50 hover:bg-white transition cursor-pointer"
                        >
                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <select
                          value={customYear}
                          onChange={(e) => setCustomYear(e.target.value)}
                          className="w-1/2 h-9 px-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-slate-50 hover:bg-white transition cursor-pointer"
                        >
                          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTimeRange(`${customMonth} ${customYear}`);
                          setIsDropdownOpen(false);
                        }}
                        className="w-full h-9 rounded-lg bg-slate-950 text-white text-xs font-semibold shadow-[0_4px_12px_rgba(15,23,42,0.15)] hover:bg-slate-900 transition active:scale-[0.98]"
                      >
                        Apply Filter
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>

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
          
          {/* ================= INTERACTIVE KPI CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            
            {/* Response Rate Button */}
            <button 
              type="button"
              onClick={() => setActiveKpiModal('responseRate')}
              className="text-left bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Activity size={21} className="text-blue-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-500">Response Rate</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-slate-950">42.5%</p>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp size={12} strokeWidth={3} />
                    +4.2%
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-slate-400">Of total applications received a reply.</p>
              </div>
            </button>

            {/* Interview Conversion Button */}
            <button 
              type="button"
              onClick={() => setActiveKpiModal('conversion')}
              className="text-left bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Target size={21} className="text-blue-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-500">Interview Conversion</p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-slate-950">18.0%</p>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <TrendingUp size={12} strokeWidth={3} />
                    +2.1%
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-slate-400">Converted from applied to interview.</p>
              </div>
            </button>

            {/* Avg Time-to-Response Button */}
            <button 
              type="button"
              onClick={() => setActiveKpiModal('timeToResponse')}
              className="text-left bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-6 shadow-[0_4px_20px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/10 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                  <Clock size={21} className="text-blue-600 group-hover:text-white transition-colors" strokeWidth={2} />
                </div>
                <ArrowUpRight size={18} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
              <div className="mt-5">
                <p className="text-sm font-semibold text-slate-500">Avg Time-to-Response</p>
                <div className="flex items-end gap-2 mt-1">
                  <p className="text-3xl md:text-4xl font-extrabold text-slate-950">8.4</p>
                  <span className="text-sm font-bold text-slate-600 mb-1.5">Days</span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-slate-400">Average wait time for initial contact.</p>
              </div>
            </button>

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

          {/* ================= INTERACTIVE STATUS BREAKDOWN (Accordion) ================= */}
          <div className="mt-5 bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.03)]">
            <div className="px-6 md:px-8 py-5 border-b border-slate-100">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Breakdown
              </p>
              <h2 className="text-lg font-bold text-slate-950 mt-1">
                Application status
              </h2>
            </div>
            
            <div className="divide-y divide-slate-100">
              {pipelineData.map((item, index) => {
                const isExpanded = expandedStatus === item.name;

                return (
                  <div key={index} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setExpandedStatus(isExpanded ? null : item.name)}
                      className="px-6 md:px-8 py-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors duration-150 w-full text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-slate-950">
                          {item.value}
                        </span>
                        <ChevronDown 
                          size={16} 
                          className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-slate-50/50 px-6 md:px-8 py-3 border-t border-slate-50 animate-in slide-in-from-top-2 duration-200">
                        <div 
                          className="ml-4 pl-4 border-l-[3px]" 
                          style={{ borderColor: `${item.color}40` }}
                        >
                          {item.companies.length > 0 ? (
                            <div className="space-y-4 py-2">
                              {item.companies.map((company, cIndex) => (
                                <div key={cIndex} className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-sm font-semibold text-slate-800">{company.name}</p>
                                      
                                      {/* ONLY DISPLAY THE SINGLE MOST RECENT ROUND */}
                                      {company.currentRound && (
                                        <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wide rounded-full border text-blue-700 bg-blue-50 border-blue-200">
                                          {company.currentRound}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">{company.role}</p>
                                  </div>
                                  
                                  <span className="text-[11px] font-medium text-slate-400 bg-white border border-slate-200 px-2.5 py-1 rounded-md shrink-0 w-fit mt-1 sm:mt-0">
                                    {company.date}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-slate-400 py-3 italic">No applications found in this stage.</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </main>

      {/* ================================================= */}
      {/* BOTTOM FADE-IN EFFECT */}
      {/* ================================================= */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />

      {/* ================================================= */}
      {/* REDESIGNED LIGHT BLUE KPI BREAKDOWN MODAL */}
      {/* ================================================= */}
      {activeKpiModal && KPI_DETAILS[activeKpiModal] && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Blurred Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setActiveKpiModal(null)} 
          />
          
          {/* Modal Container */}
          <div 
            role="dialog" 
            aria-modal="true"
            className="relative w-full max-w-lg bg-slate-50 rounded-3xl shadow-[0_32px_80px_rgba(15,23,42,0.2)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-slate-200"
          >
            
            {/* Dynamic Header (Light Blue Theme) */}
            <div className="relative px-6 py-6 bg-blue-50/80 border-b border-blue-100 flex items-start justify-between rounded-t-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100/50 flex shrink-0 items-center justify-center">
                  {KPI_DETAILS[activeKpiModal].icon}
                </div>
                <div>
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-blue-400 mb-0.5 mt-1">
                    {KPI_DETAILS[activeKpiModal].title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl font-extrabold text-blue-950 leading-none">
                      {KPI_DETAILS[activeKpiModal].value}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${KPI_DETAILS[activeKpiModal].trendColor}`}>
                      {KPI_DETAILS[activeKpiModal].trend}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setActiveKpiModal(null)}
                className="w-8 h-8 rounded-full bg-white border border-blue-200/60 flex shrink-0 items-center justify-center text-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 mt-1 shadow-sm"
              >
                <X size={16} />
              </button>
            </div>

            {/* List Body */}
            <div className="px-6 py-5 max-h-[55vh] overflow-y-auto">
              <p className="text-xs font-medium text-slate-500 mb-4 px-1">
                {KPI_DETAILS[activeKpiModal].description}
              </p>
              
              <div className="space-y-3">
                {KPI_DETAILS[activeKpiModal].items.map((item: any, index: number) => (
                  <div 
                    key={index}
                    className="flex items-center p-3 sm:p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center text-xs font-bold ${item.avatarBg}`}>
                      {item.avatar}
                    </div>
                    
                    {/* Details */}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{item.company}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{item.detail}</p>
                    </div>
                    
                    {/* Badge */}
                    <div className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${item.badgeColor} shrink-0 ml-2`}>
                      {item.badge}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Subtle Bottom Fade for Scrollable Area */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none rounded-b-3xl" />
          </div>
        </div>
      )}

      {/* GLOBAL STYLES */}
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