import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bladeRoot = resolve(__dirname, '../');
const bladeSrcExists = existsSync(resolve(bladeRoot, 'src/components/index.ts'));

// When running inside the monorepo, alias @razorpay/blade/* to the local source
// so the build works without needing the published package installed.
const monoRepoAliases = bladeSrcExists
  ? {
      '@razorpay/blade/components': resolve(bladeRoot, 'src/components/index.ts'),
      '@razorpay/blade/tokens': resolve(bladeRoot, 'src/tokens/index.ts'),
      '@razorpay/blade/fonts.css': resolve(bladeRoot, 'fonts.css'),
      '~utils': resolve(bladeRoot, 'src/utils'),
      '~components': resolve(bladeRoot, 'src/components'),
      '~tokens': resolve(bladeRoot, 'src/tokens'),
      '~src': resolve(bladeRoot, 'src'),
    }
  : {};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dashboard/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.mjs', '.js', '.jsx', '.json'],
    alias: monoRepoAliases,
  },
  define: {
    __DEV__: true,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
  },
});
