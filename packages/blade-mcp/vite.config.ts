import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  root: 'mcp-app',
  build: {
    outDir: path.resolve(__dirname, 'dist', 'mcp-app'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'mcp-app', 'index.html'),
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
