import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

config({ path: resolve(__dirname, '.env.test') });

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ['**/*.e2e-spec.ts'],
    globals: true,
    environment: 'node',
    testTimeout: 30_000,
    hookTimeout: 30_000,
    pool: 'forks',
  },
});
