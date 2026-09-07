'use client';

import { useState } from 'react';
import {
  Search,
  RefreshCw,
  ClipboardList,
  Shield,
  Filter
} from 'lucide-react';

/* ================================================= */
/* MOCK DATA */
/* ================================================= */

type ActionType = 'Created' | 'Updated' | 'Suspended' | 'Deleted' | 'System';

interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  type: ActionType;
  performedBy: string;
  entity: string;
  category: 'System' | 'Users' | 'Courses';
  changes: string;
}

const MOCK_LOGS: AuditLog[] = [
  { id: '1', timestamp: 'Thursday, Sep 7, 2026 • 09:38 AM', action: 'Course Created', type: 'Created', performedBy: 'admin@basc.edu.ph', entity: 'BSA', category: 'Courses', changes: 'Added Bachelor of Science in Agriculture' },
  { id: '2', timestamp: 'Thursday, Sep 7, 2026 • 09:15 AM', action: 'User Suspended', type: 'Suspended', performedBy: 'admin@basc.edu.ph', entity: 'juan.delacruz@basc.edu.ph', category: 'Users', changes: 'Status changed: Active → Suspended' },
  { id: '3', timestamp: 'Wednesday, Sep 6, 2026 • 04:30 PM', action: 'Settings Updated', type: 'System', performedBy: 'admin@basc.edu.ph', entity: 'Platform Config', category: 'System', changes: 'Maintenance Mode: Disabled' },
  { id: '4', timestamp: 'Wednesday, Sep 6, 2026 • 02:12 PM', action: 'User Created', type: 'Created', performedBy: 'System', entity: 'sarah.lee@basc.edu.ph', category: 'Users', changes: 'New student registration (BSCS)' },
  { id: '5', timestamp: 'Tuesday, Sep 5, 2026 • 11:45 AM', action: 'Course Updated', type: 'Updated', performedBy: 'admin@basc.edu.ph', entity: 'BSIT', category: 'Courses', changes: 'Updated curriculum syllabus link' },
  { id: '6', timestamp: 'Tuesday, Sep 5, 2026 • 10:20 AM', action: 'User Deleted', type: 'Deleted', performedBy: 'admin@basc.edu.ph', entity: 'dummy.account@basc.edu.ph', category: 'Users', changes: 'Permanently removed account and data' },
  { id: '7', timestamp: 'Monday, Sep 4, 2026 • 08:00 AM', action: 'Settings Updated', type: 'System', performedBy: 'admin@basc.edu.ph', entity: 'Security', category: 'System', changes: 'Master password rotated' },
];

/* ================================================= */
/* MAIN COMPONENT */
/* ================================================= */

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('All time');
  const [actionFilter, setActionFilter] = useState('All actions');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTimeFilter('All time');
    setActionFilter('All actions');
  };

  // Filter Logic
  const filteredLogs = MOCK_LOGS.filter((log) => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.entity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'All actions' || log.type === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  const getBadgeStyles = (type: ActionType) => {
    switch (type) {
      case 'Created': return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'Updated': return 'bg-blue-50 text-blue-700 border-blue-200/80';
      case 'Suspended': return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'Deleted': return 'bg-red-50 text-red-700 border-red-200/80';
      case 'System': return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default: return 'bg-slate-100 text-slate-700 border-slate-200/80';
    }
  };

  return (
    <>
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
          maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
        }}
      />

      {/* ================================================= */}
      {/* FIXED HEADER */}
      {/* ================================================= */}
      <div className="relative z-40 w-full shrink-0 pt-8 pb-4 bg-transparent pointer-events-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pointer-events-auto">
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 animate-header-in">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Administration
                </p>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-950">
                System Audit Logs
              </h1>
              <p className="mt-2 text-sm md:text-base text-slate-500">
                System-wide activity tracker for security and monitoring.
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
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Controls Area */}
          <div className="flex flex-col mb-6">
            
            {/* Top Row: Search & Filters Button */}
            <div className="flex flex-col lg:flex-row items-center gap-4">
              
              {/* Search Bar Container */}
              <div className="flex items-center flex-1 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden w-full h-14 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500">
                <div className="relative flex-1 w-full flex items-center h-full">
                  <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
                  <input 
                    type="text" 
                    placeholder="Search email, action, entity..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full h-full pl-11 pr-4 bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />
                  
                  {/* Results Badge */}
                  <div className="px-4 text-xs font-semibold text-slate-400 border-l border-slate-200 shrink-0 flex items-center h-full bg-slate-50/50">
                    {filteredLogs.length} results
                  </div>

                  {/* Integrated Refresh Button */}
                  <button 
                    onClick={handleRefresh}
                    title="Refresh logs"
                    className="px-4 h-full flex items-center justify-center border-l border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors shrink-0 focus:outline-none focus:bg-blue-50"
                  >
                    <RefreshCw size={18} className={isRefreshing ? 'animate-spin text-blue-600' : ''} />
                  </button>
                </div>
              </div>

              {/* Filters Toggle Button (With Active State) */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-center gap-2 h-14 px-6 text-sm font-semibold rounded-2xl transition-all duration-300 active:scale-95 shrink-0 outline-none ${
                  showFilters
                    ? 'bg-blue-700 text-white border border-blue-700 ring-4 ring-blue-500/20 shadow-inner'
                    : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 shadow-sm hover:shadow-md'
                }`}
              >
                <Filter size={18} />
                <span className="max-lg:hidden">Filters</span>
              </button>
            </div>

            {/* Expandable Filter Row (Smooth CSS Grid Animation) */}
            <div 
              className={`grid transition-all duration-300 ease-in-out ${
                showFilters 
                  ? 'grid-rows-[1fr] opacity-100 mt-4 pointer-events-auto' 
                  : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 py-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Filter By</span>
                  
                  {/* Time Filter */}
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="h-9 px-4 rounded-xl border border-blue-600/20 bg-blue-50/30 text-sm font-semibold text-blue-700 outline-none cursor-pointer hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All time">All time</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>

                  {/* Action Filter */}
                  <select 
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="h-9 px-4 rounded-xl border border-blue-600/20 bg-blue-50/30 text-sm font-semibold text-blue-700 outline-none cursor-pointer hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All actions">All actions</option>
                    <option value="Created">Created</option>
                    <option value="Updated">Updated</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Deleted">Deleted</option>
                    <option value="System">System</option>
                  </select>

                  {/* Clear All Button */}
                  <button 
                    onClick={handleClearFilters}
                    className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table Container */}
          <div className="bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-2xl shadow-sm overflow-visible">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="min-w-full text-left text-sm whitespace-nowrap border-separate border-spacing-0">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">#</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Date & Time</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Action</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Performed By</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Entity</th>
                    <th className="px-5 py-4 font-semibold text-xs uppercase tracking-wider">Changes</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log, idx) => (
                      <tr key={log.id} className="border-t border-slate-200 hover:bg-slate-50 transition-colors group">
                        
                        <td className="px-5 py-4 border-t border-slate-200 text-slate-400 font-medium">
                          {idx + 1}
                        </td>
                        
                        <td className="px-5 py-4 border-t border-slate-200">
                          <span className="text-xs text-slate-500 font-medium">{log.timestamp}</span>
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getBadgeStyles(log.type)}`}>
                            {log.action}
                          </span>
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200">
                          <div className="flex items-center gap-2">
                            {log.performedBy === 'System' ? (
                              <Shield size={14} className="text-slate-400" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {log.performedBy.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-semibold text-slate-700">{log.performedBy}</span>
                          </div>
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200 font-medium text-slate-700">
                          {log.entity}
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200">
                          <span className="text-xs text-slate-500 truncate max-w-[250px] inline-block">
                            {log.changes}
                          </span>
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center border-t border-slate-200">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <ClipboardList size={32} className="mb-3 opacity-20" />
                          <p className="text-sm font-semibold text-slate-600">No logs found.</p>
                          <p className="text-xs mt-1">Try adjusting your filters or search criteria.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Footer */}
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500 rounded-b-2xl">
              
              <div className="flex items-center gap-4">
                <span className="text-slate-500">Showing 1–{filteredLogs.length} of {MOCK_LOGS.length}</span>
                <div className="flex items-center gap-2">
                  <span>Rows per page</span>
                  <select className="border border-slate-200 bg-white rounded-md px-2 py-1 outline-none text-slate-700 font-medium cursor-pointer focus:ring-2 focus:ring-blue-500/20">
                    <option>10</option>
                    <option>20</option>
                    <option>50</option>
                    <option>100</option>
                    <option>500</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-semibold text-slate-700">Page 1 of 1</span>
                <div className="flex items-center gap-1">
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors" disabled>Previous</button>
                  <button className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 transition-colors" disabled>Next</button>
                </div>
              </div>

            </div>
          </div>

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