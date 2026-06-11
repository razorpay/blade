import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

const bladeRoot = resolve(__dirname, '..');

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/dashboard/',
  build: {
    outDir: 'dist',
  },
  resolve: {
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.js', '.mjs', '.js', '.jsx', '.json'],
    alias: {
      '@razorpay/blade/components': resolve(bladeRoot, 'src/components/index.ts'),
      '@razorpay/blade/tokens': resolve(bladeRoot, 'src/tokens/index.ts'),
      '~utils': resolve(bladeRoot, 'src/utils'),
      '~components': resolve(bladeRoot, 'src/components'),
      '~tokens': resolve(bladeRoot, 'src/tokens'),
      '~src': resolve(bladeRoot, 'src'),
    },
  },
  define: {
    __DEV__: false,
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
