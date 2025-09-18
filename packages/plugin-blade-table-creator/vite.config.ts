import { resolve } from 'path';
import { defineConfig, loadEnv } from 'vite';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const SEGMENT_AUTH = `Basic ${Buffer.from(`${env.SEGMENT_WRITE_KEY || ''}:`, 'utf8').toString(
    'base64',
  )}`;
  return {
    build: {
      target: 'es2017',
      outDir: 'dist',
      rollupOptions: {
        input: {
          code: resolve(__dirname, 'src/code.ts'),
          ui: resolve(__dirname, 'src/ui.html'),
          icons: resolve(__dirname, 'src/assets/icon.png'),
        },
        output: {
          entryFileNames: (chunkInfo) => {
            return chunkInfo.name === 'code' ? 'code.js' : 'assets/[name]-[hash].js';
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'icon.png') {
              return 'assets/icon.png';
            }
            return 'assets/[name]-[hash].[ext]';
          },
        },
      },
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      'process.env.SEGMENT_AUTH': JSON.stringify(SEGMENT_AUTH),
    },
  };
});
