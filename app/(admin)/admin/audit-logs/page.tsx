'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ClipboardList,
  Filter,
  Loader2,
  RefreshCw,
  Search,
  Shield,
} from 'lucide-react';

import { getStoredApplicationUser } from '@/lib/application-session';
import { createClient } from '@/lib/supabase/client';

type ActionType =
  | 'Created'
  | 'Updated'
  | 'Suspended'
  | 'Deleted'
  | 'System';

type AuditCategory =
  | 'System'
  | 'Users'
  | 'Courses'
  | 'Applications';

type AuditLog = {
  id: string;
  created_at: string;
  action: string;
  action_type: ActionType;
  performed_by: string;
  entity: string;
  category: AuditCategory;
  changes: string;
};

const PAGE_SIZE = 10;

function formatTimestamp(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function isWithinTimeFilter(
  value: string,
  filter: string
) {
  if (filter === 'All time') {
    return true;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const now = new Date();
  const start = new Date(now);

  if (filter === 'Today') {
    start.setHours(0, 0, 0, 0);
  } else if (filter === 'Last 7 Days') {
    start.setDate(now.getDate() - 7);
  } else if (filter === 'Last 30 Days') {
    start.setDate(now.getDate() - 30);
  }

  return date >= start;
}

function getBadgeStyles(type: ActionType) {
  switch (type) {
    case 'Created':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
    case 'Updated':
      return 'bg-blue-50 text-blue-700 border-blue-200/80';
    case 'Suspended':
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    case 'Deleted':
      return 'bg-red-50 text-red-700 border-red-200/80';
    case 'System':
      return 'bg-purple-50 text-purple-700 border-purple-200/80';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200/80';
  }
}

export default function AuditLogsPage() {
  const supabase = useMemo(() => createClient(), []);
  const currentUser = getStoredApplicationUser();

  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('All time');
  const [actionFilter, setActionFilter] = useState('All actions');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadLogs = async () => {
    if (!currentUser?.id) {
      setLogs([]);
      setLoading(false);
      return;
    }

    setError('');

    const { data, error: logsError } = await supabase.rpc(
      'list_admin_audit_logs',
      {
        p_actor_user_id: currentUser.id,
      }
    );

    if (logsError) {
      setError(logsError.message || 'Unable to load audit logs.');
      setLogs([]);
      setLoading(false);
      return;
    }

    setLogs((data as AuditLog[] | null) || []);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadLogs();
    setIsRefreshing(false);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setTimeFilter('All time');
    setActionFilter('All actions');
    setCurrentPage(1);
  };

  const filteredLogs = logs.filter((log) => {
    const query = searchQuery.toLowerCase();
    const searchText = [
      log.action,
      log.entity,
      log.performed_by,
      log.category,
      log.changes,
    ]
      .join(' ')
      .toLowerCase();

    const matchesSearch = searchText.includes(query);
    const matchesAction =
      actionFilter === 'All actions' ||
      log.action_type === actionFilter;
    const matchesTime = isWithinTimeFilter(log.created_at, timeFilter);

    return matchesSearch && matchesAction && matchesTime;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredLogs.length / PAGE_SIZE)
  );
  const normalizedPage = Math.min(
    currentPage,
    totalPages
  );
  const pageStart =
    (normalizedPage - 1) * PAGE_SIZE;
  const paginatedLogs = filteredLogs.slice(
    pageStart,
    pageStart + PAGE_SIZE
  );

  return (
    <>
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
                Online activity tracker for account security and admin actions.
              </p>
            </div>
          </header>
        </div>
      </div>

      <main
        className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide"
        style={{
          maskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0px, black 24px, black calc(100% - 60px), transparent 100%)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col mb-6">
            <div className="flex flex-col lg:flex-row items-center gap-4">
              <div className="flex items-center flex-1 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden w-full h-14 transition-all focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-500">
                <div className="relative flex-1 w-full flex items-center h-full">
                  <Search
                    size={18}
                    className="absolute left-4 text-slate-400 pointer-events-none"
                  />
                  <input
                    type="text"
                    placeholder="Search user, action, entity..."
                    value={searchQuery}
                    onChange={(event) => {
                      setSearchQuery(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full h-full pl-11 pr-4 bg-transparent text-sm text-slate-800 focus:outline-none placeholder:text-slate-400"
                  />

                  <div className="px-4 text-xs font-semibold text-slate-400 border-l border-slate-200 shrink-0 flex items-center h-full bg-slate-50/50">
                    {filteredLogs.length} results
                  </div>

                  <button
                    type="button"
                    onClick={handleRefresh}
                    title="Refresh logs"
                    className="px-4 h-full flex items-center justify-center border-l border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-colors shrink-0 focus:outline-none focus:bg-blue-50"
                  >
                    <RefreshCw
                      size={18}
                      className={
                        isRefreshing
                          ? 'animate-spin text-blue-600'
                          : ''
                      }
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((previous) => !previous)}
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

            <div
              className={`grid transition-all duration-300 ease-in-out ${
                showFilters
                  ? 'grid-rows-[1fr] opacity-100 mt-4 pointer-events-auto'
                  : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
              }`}
            >
              <div className="overflow-hidden">
                <div className="flex flex-wrap items-center gap-4 py-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Filter By
                  </span>

                  <select
                    value={timeFilter}
                    onChange={(event) => {
                      setTimeFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-9 px-4 rounded-xl border border-blue-600/20 bg-blue-50/30 text-sm font-semibold text-blue-700 outline-none cursor-pointer hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All time">All time</option>
                    <option value="Today">Today</option>
                    <option value="Last 7 Days">Last 7 Days</option>
                    <option value="Last 30 Days">Last 30 Days</option>
                  </select>

                  <select
                    value={actionFilter}
                    onChange={(event) => {
                      setActionFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-9 px-4 rounded-xl border border-blue-600/20 bg-blue-50/30 text-sm font-semibold text-blue-700 outline-none cursor-pointer hover:bg-blue-50 transition-colors focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="All actions">All actions</option>
                    <option value="Created">Created</option>
                    <option value="Updated">Updated</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Deleted">Deleted</option>
                    <option value="System">System</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleClearFilters}
                    className="h-9 px-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
              {error}
            </div>
          )}

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
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-16 text-center border-t border-slate-200">
                        <Loader2 size={24} className="mx-auto mb-3 animate-spin text-blue-600" />
                        <p className="text-sm font-semibold text-slate-600">
                          Loading online audit logs...
                        </p>
                      </td>
                    </tr>
                  ) : filteredLogs.length > 0 ? (
                    paginatedLogs.map((log, index) => (
                      <tr
                        key={log.id}
                        className="border-t border-slate-200 hover:bg-slate-50 transition-colors group"
                      >
                        <td className="px-5 py-4 border-t border-slate-200 text-slate-400 font-medium">
                          {pageStart + index + 1}
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200">
                          <span className="text-xs text-slate-500 font-medium">
                            {formatTimestamp(log.created_at)}
                          </span>
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide border ${getBadgeStyles(log.action_type)}`}>
                            {log.action}
                          </span>
                        </td>

                        <td className="px-5 py-4 border-t border-slate-200">
                          <div className="flex items-center gap-2">
                            {log.performed_by === 'System' ? (
                              <Shield size={14} className="text-slate-400" />
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                {log.performed_by.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-semibold text-slate-700">
                              {log.performed_by}
                            </span>
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
                          <p className="text-sm font-semibold text-slate-600">
                            No logs found.
                          </p>
                          <p className="text-xs mt-1">
                            Try adjusting your filters or run the audit log SQL script.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-500 rounded-b-2xl">
              <span className="text-slate-500">
                Showing {filteredLogs.length === 0 ? 0 : pageStart + 1}-
                {Math.min(pageStart + PAGE_SIZE, filteredLogs.length)} of{' '}
                {filteredLogs.length} logs
              </span>

              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  Page {normalizedPage} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.max(1, page - 1)
                    )
                  }
                  disabled={normalizedPage === 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1)
                    )
                  }
                  disabled={normalizedPage === totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  <RefreshCw size={13} />
                  Sync logs
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#f5f7fb] via-[#f5f7fb]/80 to-transparent z-30 pointer-events-none" />
    </>
  );
}
