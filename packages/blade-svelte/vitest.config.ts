import { defineConfig } from 'vitest/config';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const dir = fileURLToPath(new URL('.', import.meta.url));
const bladeCoreRoot = resolve(dir, '../blade-core/src');

// blade-core is consumed as source (not built) during tests. These aliases mirror
// `.storybook/main.js` viteFinal so test resolution matches Storybook/dev exactly:
// - exact `@razorpay/blade-core/*` entry points -> blade-core source index files
// - blade-core's internal `~utils` / `~tokens` / `~src` imports -> blade-core source
// - `.web.ts` extension resolution so platform-split modules (elevation, fontFamily) resolve
const bladeCoreExtensions = [
  '.web.ts',
  '.web.tsx',
  '.web.js',
  '.mjs',
  '.js',
  '.mts',
  '.ts',
  '.jsx',
  '.tsx',
  '.json',
];

const bladeCoreAlias = [
  {
    find: /^@razorpay\/blade-core\/utils$/,
    replacement: resolve(bladeCoreRoot, 'utils/index.ts'),
  },
  {
    find: /^@razorpay\/blade-core\/styles$/,
    replacement: resolve(bladeCoreRoot, 'styles/index.ts'),
  },
  {
    find: /^@razorpay\/blade-core\/tokens$/,
    replacement: resolve(bladeCoreRoot, 'tokens/index.ts'),
  },
  { find: /^~utils(\/.*)?$/, replacement: resolve(bladeCoreRoot, 'utils$1') },
  { find: /^~tokens(\/.*)?$/, replacement: resolve(bladeCoreRoot, 'tokens$1') },
  { find: /^~src(\/.*)?$/, replacement: resolve(bladeCoreRoot, '$1') },
];

// A fresh svelte plugin instance is created per project on purpose: sharing one
// instance makes Vitest's deep-merge of project configs recurse on the plugin's
// internal circular refs and blow the stack.
const sveltePlugin = (): ReturnType<typeof svelte> => svelte({ preprocess: vitePreprocess() });

export default defineConfig({
  test: {
    // Two projects mirror the React package's CSR/SSR split (packages/blade/jest.web.config.js):
    // - `client`: component tests in jsdom (Testing Library, user interactions)
    // - `ssr`: server-render smoke tests via `svelte/server` in a node environment
    projects: [
      {
        plugins: [sveltePlugin()],
        define: { __DEV__: true },
        resolve: {
          // Browser (client) entry points so Testing Library mounts real DOM under jsdom.
          conditions: ['browser'],
          alias: bladeCoreAlias,
          extensions: bladeCoreExtensions,
        },
        test: {
          name: 'client',
          environment: 'jsdom',
          globals: true,
          setupFiles: ['./vitest-setup.ts'],
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.ssr.{test,spec}.{js,ts}'],
        },
      },
      {
        plugins: [sveltePlugin()],
        define: { __DEV__: true },
        resolve: { alias: bladeCoreAlias, extensions: bladeCoreExtensions },
        test: {
          name: 'ssr',
          environment: 'node',
          globals: true,
          include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{svelte,ts}'],
      exclude: ['src/**/*.stories.*', 'src/**/types.ts', 'src/**/index.ts', 'src/**/*.d.ts'],
      // React parity target (packages/blade/jest.web.config.js). These gate
      // `test:coverage` only; CI runs `yarn test` (non-gating) while coverage ramps up.
      thresholds: {
        statements: 75,
        branches: 75,
        functions: 75,
        lines: 75,
      },
    },
  },
});
