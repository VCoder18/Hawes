import { configDefaults, defineConfig } from 'vitest/config';
import { resolve } from 'path';
import { config } from 'dotenv';

config({ path: resolve(__dirname, '.env') });

export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      test: resolve(__dirname, './test'),
    },
  },
  test: {
    globals: true,
    exclude: [...configDefaults.exclude, 'src/supabase/*'],
  },
});
