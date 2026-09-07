'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import {
  clearStoredApplicationUser,
  getStoredApplicationSessionLastActivity,
  getStoredApplicationUser,
  SESSION_TIMEOUT_MS,
  touchStoredApplicationSession,
} from '@/lib/application-session';

const ACTIVITY_REFRESH_INTERVAL_MS = 60 * 1000;

export default function SessionTimeoutMonitor() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!getStoredApplicationUser()) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastRefresh = 0;

    const logout = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      clearStoredApplicationUser();
      router.replace('/login');
    };

    const scheduleTimeout = () => {
      const lastActivity = getStoredApplicationSessionLastActivity();

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (!lastActivity) {
        logout();
        return;
      }

      const remaining = SESSION_TIMEOUT_MS - (Date.now() - lastActivity);

      if (remaining <= 0) {
        logout();
        return;
      }

      timeoutId = setTimeout(scheduleTimeout, remaining);
    };

    const handleActivity = () => {
      const now = Date.now();

      if (now - lastRefresh >= ACTIVITY_REFRESH_INTERVAL_MS) {
        touchStoredApplicationSession();
        lastRefresh = now;
        scheduleTimeout();
      }
    };

    const activityEvents = [
      'click',
      'keydown',
      'pointerdown',
      'scroll',
      'touchstart',
    ] as const;

    const lastActivity = getStoredApplicationSessionLastActivity();

    if (!lastActivity || Date.now() - lastActivity >= SESSION_TIMEOUT_MS) {
      logout();
      return;
    } else {
      lastRefresh = lastActivity;
    }

    activityEvents.forEach((eventName) => {
      window.addEventListener(eventName, handleActivity, {
        passive: true,
      });
    });
    document.addEventListener('visibilitychange', scheduleTimeout);
    scheduleTimeout();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      activityEvents.forEach((eventName) => {
        window.removeEventListener(eventName, handleActivity);
      });
      document.removeEventListener('visibilitychange', scheduleTimeout);
    };
  }, [pathname, router]);

  return null;
}