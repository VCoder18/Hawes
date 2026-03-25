import { SupabaseClient } from '@supabase/supabase-js';

export async function createTestUser(supabase: SupabaseClient, email: string) {
  const {
    data: { session },
    error,
  } = await supabase.auth.signUp({
    email,
    password: 'ilikeskibidi67',
  });
  if (error || !session)
    throw new Error(`Failed to create test user: ${error?.message}`);
  supabase.auth.signOut();
  return { jwt: session.access_token, userId: session.user.id };
}

export async function deleteTestUser(
  adminSupabase: SupabaseClient,
  userId: string,
) {
  await adminSupabase.auth.admin.deleteUser(userId);
}
