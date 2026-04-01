import { configDefaults, defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { config } from 'dotenv';
import tsconfigPaths from 'vite-tsconfig-paths';

config({ path: resolve(__dirname, '.env') });

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, 'src/supabase/*'],
  },
});
