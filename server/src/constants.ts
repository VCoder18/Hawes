function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`ENV_ERROR: env variable ${key} isn't set`);
  }
  return value;
}

export const ENV = {
  frontendOrigin: getEnv('FRONTEND_ORIGIN'),
  port: getEnv('PORT'),
  supabase: {
    serviceKey: getEnv('SUPABASE_SERVICE_KEY'),
    anonKey: getEnv('SUPABASE_ANON_KEY'),
    privateKey: getEnv('SUPABASE_PRIVATE_KEY'),
    publicKey: getEnv('SUPABASE_PUBLIC_KEY'),
    url: getEnv('SUPABASE_PROJECT_URL'),
    projectId: getEnv('SUPABASE_PROJECT_ID'),
    projectUrl: getEnv('SUPABASE_PROJECT_URL'),
  },
};
