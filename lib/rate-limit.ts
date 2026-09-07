type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitRule = {
  limit: number;
  windowMs: number;
};

const entries = new Map<string, RateLimitEntry>();

export const RATE_LIMIT_RULES = {
  loginIp: { limit: 10, windowMs: 15 * 60 * 1000 },
  loginIdentity: { limit: 5, windowMs: 15 * 60 * 1000 },
  signupIp: { limit: 5, windowMs: 60 * 60 * 1000 },
  resetIp: { limit: 5, windowMs: 15 * 60 * 1000 },
  resetIdentity: { limit: 3, windowMs: 15 * 60 * 1000 },
} satisfies Record<string, RateLimitRule>;

function cleanupExpiredEntries(now: number) {
  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) {
      entries.delete(key);
    }
  }
}

export function getRequestIp(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for');

  return forwardedFor?.split(',')[0]?.trim() || 'unknown';
}

export function checkRateLimit(
  key: string,
  rule: RateLimitRule
) {
  const now = Date.now();

  if (entries.size > 1000) {
    cleanupExpiredEntries(now);
  }

  const current = entries.get(key);

  if (!current || current.resetAt <= now) {
    entries.set(key, {
      count: 1,
      resetAt: now + rule.windowMs,
    });

    return {
      allowed: true,
      retryAfterSeconds: Math.ceil(rule.windowMs / 1000),
    };
  }

  current.count += 1;

  return {
    allowed: current.count <= rule.limit,
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((current.resetAt - now) / 1000)
    ),
  };
}

export function rateLimitResponse(retryAfterSeconds: number) {
  return Response.json(
    {
      error: 'Too many requests. Please try again later.',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    }
  );
}