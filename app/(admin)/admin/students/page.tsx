'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Ban,
  CheckCircle2,
  Crown,
  Filter,
  Loader2,
  Search,
  Shield,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';

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

const roleLabels: Record<AccountRole, string> = {
  user: 'Student',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

const roleStyles: Record<AccountRole, string> = {
  user: 'border-slate-200 bg-slate-100 text-slate-700',
  admin: 'border-blue-200 bg-blue-50 text-blue-700',
  super_admin: 'border-amber-200 bg-amber-50 text-amber-700',
};

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function StudentManagementPage() {
  const supabase = useMemo(() => createClient(), []);
  const currentUser = getStoredApplicationUser();
  const isSuperAdmin = currentUser?.role === 'super_admin';

  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AccountRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [loading, setLoading] = useState(true);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function loadUsers() {
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: listError } = await supabase.rpc(
      'list_application_users_for_admin',
      {
        p_actor_user_id: currentUser.id,
      }
    );

    if (listError) {
      setError(listError.message || 'Unable to load accounts.');
      setUsers([]);
      setLoading(false);
      return;
    }

    setUsers((data as ManagedUser[] | null) || []);
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchText = `${user.full_name} ${user.username}`.toLowerCase();
    const matchesSearch = searchText.includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.account_role === roleFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !user.is_blocked) ||
      (statusFilter === 'blocked' && user.is_blocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  async function setBlocked(user: ManagedUser, isBlocked: boolean) {
    if (!currentUser?.id) {
      return;
    }

    setSavingUserId(user.id);
    setError('');

    const { error: blockError } = await supabase.rpc(
      'set_application_user_blocked',
      {
        p_actor_user_id: currentUser.id,
        p_target_user_id: user.id,
        p_is_blocked: isBlocked,
      }
    );

    if (blockError) {
      setError(blockError.message || 'Unable to update account access.');
      setSavingUserId(null);
      return;
    }

    await loadUsers();
    setSavingUserId(null);
  }

  async function setRole(user: ManagedUser, role: 'user' | 'admin') {
    if (!currentUser?.id) {
      return;
    }

    setSavingUserId(user.id);
    setError('');

    const { error: roleError } = await supabase.rpc(
      'set_application_user_role',
      {
        p_actor_user_id: currentUser.id,
        p_target_user_id: user.id,
        p_role: role,
      }
    );

    if (roleError) {
      setError(roleError.message || 'Unable to update account role.');
      setSavingUserId(null);
      return;
    }

    await loadUsers();
    setSavingUserId(null);
  }

  const totals = {
    users: users.length,
    admins: users.filter((user) => user.account_role === 'admin').length,
    blocked: users.filter((user) => user.is_blocked).length,
  };

  return (
    <>
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[420px] h-[420px] rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-48 -right-40 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl animate-pulse" />
      </div>

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 w-full scroll-smooth scrollbar-hide">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 pb-32">
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                  Administration
                </p>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Account Management
              </h1>
              <p className="mt-2 text-sm text-slate-500 md:text-base">
                Manage logged-in accounts, admin access, and blocked users.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
              <div className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                <Users size={17} className="text-blue-600" />
                <p className="mt-2 text-2xl font-bold text-slate-950">{totals.users}</p>
                <p className="text-[11px] font-semibold text-slate-400">Accounts</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
                <Shield size={17} className="text-blue-700" />
                <p className="mt-2 text-2xl font-bold text-blue-950">{totals.admins}</p>
                <p className="text-[11px] font-semibold text-blue-500">Admins</p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 shadow-sm">
                <Ban size={17} className="text-red-700" />
                <p className="mt-2 text-2xl font-bold text-red-950">{totals.blocked}</p>
                <p className="text-[11px] font-semibold text-red-500">Blocked</p>
              </div>
            </div>
          </header>

          <section className="mt-8 rounded-2xl border border-slate-200/80 bg-white/90 shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search name or username..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3">
                  <Filter size={15} className="text-slate-400" />
                  <select
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(event.target.value as 'all' | AccountRole)
                    }
                    className="bg-transparent text-sm font-semibold text-slate-700 outline-none"
                  >
                    <option value="all">All roles</option>
                    <option value="user">Students</option>
                    <option value="admin">Admins</option>
                    <option value="super_admin">Super admin</option>
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as 'all' | 'active' | 'blocked')
                  }
                  className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm font-semibold text-red-600">
                {error}
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em]">Account</th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em]">Role</th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em]">Applications</th>
                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-[0.12em]">Status</th>
                    <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-[0.12em]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-14 text-center text-sm font-semibold text-slate-400">
                        <Loader2 size={20} className="mx-auto mb-2 animate-spin text-blue-600" />
                        Loading accounts...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-14 text-center text-sm font-semibold text-slate-400">
                        No accounts found.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isSelf = user.id === currentUser?.id;
                      const isSaving = savingUserId === user.id;
                      const canEditRole =
                        isSuperAdmin &&
                        !isSelf &&
                        user.account_role !== 'super_admin';
                      const canBlock =
                        !isSelf &&
                        user.account_role !== 'super_admin';

                      return (
                        <tr key={user.id} className="bg-white hover:bg-slate-50">
                          <td className="border-t border-slate-200 px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-100 text-xs font-extrabold text-slate-600">
                                {getInitials(user.full_name) || user.username[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-slate-950">{user.full_name}</p>
                                <p className="text-xs font-medium text-slate-500">@{user.username}</p>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-300">
                                  Joined {formatDate(user.created_at)}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="border-t border-slate-200 px-5 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${roleStyles[user.account_role]}`}>
                              {user.account_role === 'super_admin' ? <Crown size={12} /> : <ShieldCheck size={12} />}
                              {roleLabels[user.account_role]}
                            </span>
                          </td>

                          <td className="border-t border-slate-200 px-5 py-4 font-bold text-slate-700">
                            {user.application_count}
                          </td>

                          <td className="border-t border-slate-200 px-5 py-4">
                            <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] ${
                              user.is_blocked
                                ? 'border-red-200 bg-red-50 text-red-700'
                                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            }`}>
                              {user.is_blocked ? <Ban size={12} /> : <CheckCircle2 size={12} />}
                              {user.is_blocked ? 'Blocked' : 'Active'}
                            </span>
                          </td>

                          <td className="border-t border-slate-200 px-5 py-4">
                            <div className="flex justify-end gap-2">
                              {canEditRole && (
                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    setRole(
                                      user,
                                      user.account_role === 'admin' ? 'user' : 'admin'
                                    )
                                  }
                                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-bold text-blue-700 hover:bg-blue-100 disabled:opacity-50"
                                >
                                  <UserCog size={13} />
                                  {user.account_role === 'admin' ? 'Make Student' : 'Make Admin'}
                                </button>
                              )}

                              <button
                                type="button"
                                disabled={!canBlock || isSaving}
                                onClick={() => setBlocked(user, !user.is_blocked)}
                                className={`inline-flex h-9 items-center gap-1.5 rounded-lg border px-3 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 ${
                                  user.is_blocked
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                                }`}
                              >
                                {isSaving ? <Loader2 size={13} className="animate-spin" /> : <Ban size={13} />}
                                {user.is_blocked ? 'Unblock' : 'Block'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
