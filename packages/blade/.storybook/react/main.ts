import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

const bladeRoot = resolve(__dirname, '../../');

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: StorybookConfig = {
  typescript: {
    check: !isDevelopment,
    checkOptions: {
      typescript: {
        configFile: resolve(bladeRoot, 'tsconfig-typecheck.web.json'),
      },
    },
    reactDocgen: isDevelopment ? false : 'react-docgen-typescript',
  },

  refs: {
    '@storybook/design-system': { disable: true },
  },

  stories: [
    '../../docs/**/*.mdx',
    '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.mdx',
    '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.internal.stories.@(ts|tsx|js|jsx)',
  ],

  addons: [
    getAbsolutePath('@storybook/addon-docs'),
    getAbsolutePath('@storybook/addon-a11y'),
  ],

  framework: {
    name: getAbsolutePath('@storybook/react-vite'),
    options: {},
  },

  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
  }),

  staticDirs: ['../../public'],

  viteFinal: async (config) => {
    const { mergeConfig } = await import('vite');
    const tsconfigPaths = (await import('vite-tsconfig-paths')).default;
    const react = (await import('@vitejs/plugin-react')).default;

    return mergeConfig(config, {
      plugins: [
        react(),
        tsconfigPaths({
          root: bladeRoot,
        }),
      ],
      define: {
        __DEV__: true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      },
      resolve: {
        extensions: [
          '.web.tsx',
          '.web.ts',
          '.tsx',
          '.ts',
          '.web.js',
          '.mjs',
          '.js',
          '.jsx',
          '.json',
        ],
        alias: {
          '~utils': resolve(bladeRoot, 'src/utils'),
          '~components': resolve(bladeRoot, 'src/components'),
          '~tokens': resolve(bladeRoot, 'src/tokens'),
          '~src': resolve(bladeRoot, 'src'),
        },
      },
    });
  },
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')));
}
