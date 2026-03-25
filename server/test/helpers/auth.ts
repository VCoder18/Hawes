import { Session, SupabaseClient } from '@supabase/supabase-js';

export async function createTestUser(
  supabase: SupabaseClient,
  email: string,
): Promise<Session> {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password: 'ilikeskibidi67',
  });
  if (error || !session)
    throw new Error(`Failed to create test user: ${error?.message}`);
  return session;
}

export async function deleteTestUser(
  adminSupabase: SupabaseClient,
  userId: string,
) {
  await adminSupabase.auth.admin.deleteUser(userId);
}
