'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, 
  LayoutGrid, 
  BarChart3, 
  Settings, 
  LayoutDashboard, 
  Users, 
  GraduationCap 
} from 'lucide-react';

// Student Nav Items
const studentNavItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Applications', href: '/applications', icon: LayoutGrid },
  { label: 'Reports & Analytics', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

// Super Admin Nav Items (Now unified with the Blue Theme)
const adminNavItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Students', href: '/admin/students', icon: Users },
  { label: 'Courses', href: '/admin/courses', icon: GraduationCap },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const HIDDEN_ON = ['/', '/login', '/onboarding', '/forgot-password', '/reset-password'];
const COLLAPSE_DELAY = 900;

export default function SegmentedNav() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);
  const collapseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCollapseTimer = useCallback(() => {
    if (collapseTimerRef.current) {
      clearTimeout(collapseTimerRef.current);
      collapseTimerRef.current = null;
    }
  }, []);

  const scheduleCollapse = useCallback(() => {
    clearCollapseTimer();
    collapseTimerRef.current = setTimeout(() => setIsExpanded(false), COLLAPSE_DELAY);
  }, [clearCollapseTimer]);

  useEffect(() => {
    scheduleCollapse();
    return () => clearCollapseTimer();
  }, [clearCollapseTimer, scheduleCollapse]);

  if (HIDDEN_ON.includes(pathname)) {
    return null;
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const navItems = isAdminRoute ? adminNavItems : studentNavItems;

  // Both student and admin now share the exact same blue gradient active pill
  const activePillColor = 'bg-gradient-to-r from-blue-600 to-blue-500';

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-1 bg-white/95 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-slate-200/80 p-2 transition-all duration-300 ease-out"
        onMouseEnter={() => {
          clearCollapseTimer();
          setIsExpanded(true);
        }}
        onMouseLeave={scheduleCollapse}
        onFocusCapture={() => {
          clearCollapseTimer();
          setIsExpanded(true);
        }}
        onBlurCapture={scheduleCollapse}
      >
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');

          return (
            <Link
              key={href}
              href={href}
              className={`relative flex items-center ${isExpanded ? 'gap-2 px-4 sm:px-5' : 'gap-0 px-3.5'} py-3 rounded-full text-sm font-semibold whitespace-nowrap shrink-0 transition-all duration-300 ease-out`}
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className={`absolute inset-0 ${activePillColor} rounded-full shadow-sm`}
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
              />
              <motion.span
                initial={false}
                animate={{
                  maxWidth: isExpanded ? 180 : 0,
                  opacity: isExpanded ? 1 : 0,
                  scaleX: isExpanded ? 1 : 0.8,
                }}
                transition={{ duration: 0.1, ease: 'easeOut' }}
                className="relative z-10 overflow-hidden whitespace-nowrap origin-left"
              >
                <span className={isActive ? 'text-white' : 'text-slate-600'}>{label}</span>
              </motion.span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}