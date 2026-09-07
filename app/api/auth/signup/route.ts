import { createServerClient } from '@/lib/supabase/server';
import {
  checkRateLimit,
  getRequestIp,
  RATE_LIMIT_RULES,
  rateLimitResponse,
} from '@/lib/rate-limit';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const fullName = typeof body?.fullName === 'string' ? body.fullName.trim() : '';
  const username =
    typeof body?.username === 'string'
      ? body.username.trim().toLowerCase()
      : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const limit = checkRateLimit(
    `signup:ip:${getRequestIp(request)}`,
    RATE_LIMIT_RULES.signupIp
  );

  if (!limit.allowed) {
    return rateLimitResponse(limit.retryAfterSeconds);
  }

  if (!fullName || !username || !password) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('create_application_user', {
    p_full_name: fullName,
    p_username: username,
    p_password: password,
  });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(data);
}