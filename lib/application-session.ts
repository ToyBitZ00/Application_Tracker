'use client';

type StoredApplicationUser = {
  id: string;
  username: string;
  fullName?: string;
  role?: 'user' | 'admin' | 'super_admin';
  isBlocked?: boolean;
};

const SESSION_KEY = 'application_tracker_user';
const LOGIN_INSTANCE_KEY = 'application_tracker_login_instance';
const SHOW_RECOMMENDED_COMPANIES_KEY = 'application_tracker_show_recommended_companies';
const SESSION_COOKIE_KEY = 'application_tracker_session';
const ADMIN_SESSION_COOKIE_KEY = 'application_tracker_admin_session';
const SESSION_ACTIVITY_COOKIE_KEY = 'application_tracker_session_activity';
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const SESSION_TIMEOUT_SECONDS = SESSION_TIMEOUT_MS / 1000;

export function startStoredApplicationLogin() {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.setItem(LOGIN_INSTANCE_KEY, `${Date.now()}-${Math.random()}`);
  sessionStorage.removeItem('dashboard_recommended_companies_dismissed');
}

export function getStoredApplicationLoginInstance() {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem(LOGIN_INSTANCE_KEY);
}

export function getShowRecommendedCompanies(userId: string) {
  if (typeof window === 'undefined') {
    return true;
  }

  return (
    localStorage.getItem(`${SHOW_RECOMMENDED_COMPANIES_KEY}_${userId}`) !==
    'false'
  );
}

export function setShowRecommendedCompanies(userId: string, value: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(
    `${SHOW_RECOMMENDED_COMPANIES_KEY}_${userId}`,
    String(value)
  );
}

const LEGACY_USERNAME_KEYS = [
  'username',
  'loggedInUsername',
  'currentUsername',
  'application_username',
  'user_username',
];

const LEGACY_SESSION_KEYS = [
  'loggedInUser',
  'currentUser',
  'applicationUser',
];

export function getStoredApplicationUser(): StoredApplicationUser | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawUser = localStorage.getItem(SESSION_KEY);

  if (rawUser) {
    try {
      const parsed = JSON.parse(rawUser) as Partial<StoredApplicationUser>;

      if (parsed.id && parsed.username) {
        return {
          id: parsed.id,
          username: parsed.username,
          fullName: parsed.fullName,
          role: parsed.role,
          isBlocked: parsed.isBlocked,
        };
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  return null;
}

export function setStoredApplicationUser(user: StoredApplicationUser) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  document.cookie = `${SESSION_COOKIE_KEY}=${encodeURIComponent(
    user.id
  )}; path=/; max-age=${SESSION_TIMEOUT_SECONDS}; samesite=lax`;

  touchStoredApplicationSession();

  if (user.role === 'admin' || user.role === 'super_admin') {
    document.cookie = `${ADMIN_SESSION_COOKIE_KEY}=${encodeURIComponent(
      user.role
    )}; path=/; max-age=${SESSION_TIMEOUT_SECONDS}; samesite=lax`;
  } else {
    document.cookie = `${ADMIN_SESSION_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
  }
}

export function touchStoredApplicationSession() {
  if (typeof window === 'undefined') {
    return;
  }

  document.cookie = `${SESSION_ACTIVITY_COOKIE_KEY}=${Date.now()}; path=/; max-age=${SESSION_TIMEOUT_SECONDS}; samesite=lax`;
}

export function getStoredApplicationSessionLastActivity() {
  if (typeof document === 'undefined') {
    return null;
  }

  const activityCookie = document.cookie
    .split('; ')
    .find((cookie) => cookie.startsWith(`${SESSION_ACTIVITY_COOKIE_KEY}=`));

  const activity = Number(activityCookie?.split('=')[1]);

  return Number.isFinite(activity) && activity > 0 ? activity : null;
}

export function getStoredUsername(): string | null {
  const user = getStoredApplicationUser();

  if (user?.username) {
    return user.username;
  }

  if (typeof window === 'undefined') {
    return null;
  }

  for (const key of LEGACY_USERNAME_KEYS) {
    const value = localStorage.getItem(key);

    if (value && value.trim()) {
      return value.trim();
    }
  }

  return null;
}

export function clearStoredApplicationUser() {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.removeItem(SESSION_KEY);
  document.cookie = `${SESSION_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${ADMIN_SESSION_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;
  document.cookie = `${SESSION_ACTIVITY_COOKIE_KEY}=; path=/; max-age=0; samesite=lax`;

  LEGACY_USERNAME_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });

  LEGACY_SESSION_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
}
