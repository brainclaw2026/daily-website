const required = ['NEXT_PUBLIC_SITE_URL', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'] as const;

export function getEnv() {
  return {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
    cronSecret: process.env.CRON_SECRET || '',
    openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
    openRouterModel: process.env.OPENROUTER_MODEL || 'openrouter/auto',
    ingestLookbackDays: Number(process.env.INGEST_LOOKBACK_DAYS || '7'),
    ingestMaxItemsPerSource: Number(process.env.INGEST_MAX_ITEMS_PER_SOURCE || '20'),
  };
}

export function assertServerEnv() {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env vars: ${missing.join(', ')}`);
  }
  return getEnv();
}
