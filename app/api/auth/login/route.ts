import { createServerClient } from '@/lib/supabase/server';
import {
  checkRateLimit,
  getRequestIp,
  RATE_LIMIT_RULES,
  rateLimitResponse,
} from '@/lib/rate-limit';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const username =
    typeof body?.username === 'string'
      ? body.username.trim().toLowerCase()
      : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  const ip = getRequestIp(request);

  const limits = [
    checkRateLimit(`login:ip:${ip}`, RATE_LIMIT_RULES.loginIp),
    checkRateLimit(
      `login:identity:${username || 'unknown'}`,
      RATE_LIMIT_RULES.loginIdentity
    ),
  ];

  const blockedLimit = limits.find((limit) => !limit.allowed);

  if (blockedLimit) {
    return rateLimitResponse(blockedLimit.retryAfterSeconds);
  }

  if (!username || !password) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase.rpc('login_application_user', {
    p_username: username,
    p_password: password,
  });

  if (error) {
    return Response.json({ error: 'Invalid username or password.' }, { status: 401 });
  }

  const result = data as {
    success?: boolean;
    id?: string;
    username?: string;
    account_role?: string;
    blocked?: boolean;
  } | null;

  if (result?.success && result.id) {
    await supabase.rpc('record_application_audit_log', {
      p_actor_user_id: result.id,
      p_action: result.account_role === 'user' ? 'User Login' : 'Admin Login',
      p_action_type: 'System',
      p_category: 'System',
      p_entity: result.username || username,
      p_changes: `${result.username || username} signed in successfully.`,
      p_metadata: {
        source: 'login_api',
        role: result.account_role || 'user',
      },
    });
  }

  return Response.json(data);
}
