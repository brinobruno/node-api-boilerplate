import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    environment: 'node',
    fileParallelism: false,
    exclude: ['build/**', 'node_modules/**'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
});
