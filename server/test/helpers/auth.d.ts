import { Session, SupabaseClient } from '@supabase/supabase-js';
export declare function createTestUser(supabase: SupabaseClient, email: string): Promise<Session>;
export declare function deleteTestUser(adminSupabase: SupabaseClient, userId: string): Promise<void>;
