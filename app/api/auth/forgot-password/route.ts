import { createServerClient } from '@/lib/supabase/server';
import {
  checkRateLimit,
  getRequestIp,
  RATE_LIMIT_RULES,
  rateLimitResponse,
} from '@/lib/rate-limit';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const ip = getRequestIp(request);
  const limits = [
    checkRateLimit(`reset:ip:${ip}`, RATE_LIMIT_RULES.resetIp),
    checkRateLimit(
      `reset:identity:${email || 'unknown'}`,
      RATE_LIMIT_RULES.resetIdentity
    ),
  ];
  const blockedLimit = limits.find((limit) => !limit.allowed);

  if (blockedLimit) {
    return rateLimitResponse(blockedLimit.retryAfterSeconds);
  }

  if (!email) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${new URL(request.url).origin}/reset-password`,
  });

  if (error) {
    return Response.json(
      { error: 'Unable to send reset link. Please try again.' },
      { status: 400 }
    );
  }

  return Response.json({ success: true });
}