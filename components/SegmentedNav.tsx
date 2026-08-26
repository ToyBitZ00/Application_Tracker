'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Home, LayoutGrid, BarChart3, Settings } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: Home },
  { label: 'Applications', href: '/dashboard/applications', icon: LayoutGrid },
  { label: 'Reports & Analytics', href: '/dashboard/reports', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function SegmentedNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-1 bg-white rounded-full shadow-lg border border-hairline p-2">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center gap-2 px-4 sm:px-6 py-3.5 rounded-full text-sm font-semibold whitespace-nowrap shrink-0"
            >
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <Icon
                size={18}
                className={`relative z-10 transition-colors ${isActive ? 'text-white' : 'text-ink'}`}
              />
              <span
                className={`relative z-10 hidden sm:inline transition-colors ${isActive ? 'text-white' : 'text-ink'}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}