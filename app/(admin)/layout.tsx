'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import {
  clearStoredApplicationUser,
  getStoredApplicationUser,
  setStoredApplicationUser,
} from '@/lib/application-session';
import { createClient } from '@/lib/supabase/client';

type ApplicationUser = {
  id: string;
  full_name: string | null;
  username: string;
  account_role?: 'user' | 'admin' | 'super_admin';
  is_blocked?: boolean;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function verifyAdmin() {
      const storedUser = getStoredApplicationUser();

      if (!storedUser) {
        clearStoredApplicationUser();
        router.replace('/login');
        return;
      }

      const { data, error } = await supabase.rpc(
        'get_application_user_profile',
        {
          p_user_id: storedUser.id,
          p_username: storedUser.username,
        }
      );

      const account = data as ApplicationUser | null;

      if (
        error ||
        !account ||
        account.is_blocked ||
        !['admin', 'super_admin'].includes(
          account.account_role || 'user'
        )
      ) {
        clearStoredApplicationUser();
        router.replace('/login');
        return;
      }

      setStoredApplicationUser({
        id: account.id,
        username: account.username,
        fullName: account.full_name || '',
        role: account.account_role || 'user',
        isBlocked: Boolean(account.is_blocked),
      });

      if (mounted) {
        setAuthorized(true);
        setChecking(false);
      }
    }

    verifyAdmin();

    return () => {
      mounted = false;
    };
  }, [router, supabase]);

  if (checking || !authorized) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#f4f7fb] dark:bg-slate-950">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-semibold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Loader2 size={18} className="animate-spin text-blue-600" />
          Checking admin access...
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden bg-[#f4f7fb] dark:bg-slate-950">
      
      {/* 
        THE FIX: Added 'min-h-0 overflow-hidden' here. 
        This forces the wrapper to lock to the screen height 
        and allows the <main> tag inside your pages to scroll properly!
      */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        {children}
      </div>

    </div>
  );
}
