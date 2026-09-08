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

  const result = data as {
    success?: boolean;
    id?: string;
    username?: string;
    full_name?: string;
  } | null;

  if (result?.success && result.id) {
    await supabase.rpc('record_application_audit_log', {
      p_actor_user_id: null,
      p_action: 'User Created',
      p_action_type: 'Created',
      p_category: 'Users',
      p_entity: result.username || username,
      p_changes: `New account registered for ${result.full_name || fullName}.`,
      p_metadata: {
        source: 'signup_api',
        user_id: result.id,
      },
    });
  }

  return Response.json(data);
}
