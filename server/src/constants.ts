function getEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`ENV_ERROR: env variable ${key} isn't set`);
  }
  return value;
}

export const ENV = {
  frontend_origin: getEnv('FRONTEND_ORIGIN'),
  port: getEnv('PORT'),
  supabase: {
    key: getEnv('SUPABASE_KEY'),
    url: getEnv('SUPABASE_URL'),
    project_id: getEnv('SUPABASE_PROJECT_ID'),
  },
};
