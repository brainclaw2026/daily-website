import { createClient } from '@supabase/supabase-js';
import { assertServerEnv, getEnv } from '@/lib/utils/env';

export function getServiceSupabase() {
  const env = assertServerEnv();
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}

export function getPublicSupabase() {
  const env = getEnv();
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new Error('Public Supabase env is missing');
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { persistSession: false },
  });
}
