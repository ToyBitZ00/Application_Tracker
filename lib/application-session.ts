'use client';

type StoredApplicationUser = {
  id: string;
  username: string;
  fullName?: string;
};

const SESSION_KEY = 'application_tracker_user';

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

  LEGACY_USERNAME_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });

  LEGACY_SESSION_KEYS.forEach((key) => {
    localStorage.removeItem(key);
  });
}
