import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: [
      'src/utils/**/*.test.ts',
      'src/styles/**/*.test.ts',
      'src/tokens/theme/__tests__/createTheme.test.ts',
    ],
  },
  define: {
    __DEV__: true,
  },
  resolve: {
    alias: {
      '~utils': path.resolve(__dirname, 'src/utils'),
      '~tokens': path.resolve(__dirname, 'src/tokens'),
      '~src': path.resolve(__dirname, 'src'),
    },
    extensions: ['.web.ts', '.web.tsx', '.web.js', '.ts', '.tsx', '.js', '.jsx', '.json'],
  },
});
