import { StorybookConfig } from '@storybook/react-webpack5';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { DefinePlugin } = require('webpack');
const path = require('path');

const config: StorybookConfig = {
  typescript: {
    check: true,
    checkOptions: {
      typescript: {
        configFile: path.resolve('./tsconfig-typecheck.web.json'),
      },
    },
  },
  refs: {
    '@storybook/design-system': { disable: true },
  },
  stories: [
    '../../docs/**/*.stories.mdx',
    '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.stories.mdx',
    '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.stories.internal.mdx',
    '../../src/**/*.stories.internal.@(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/preset-create-react-app',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
  }),
  docs: {
    autodocs: true,
  },
  staticDirs: ['../../public'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.tsx',
      '.ts',
      '.tsx',
      '.web.js',
      '.mjs',
      '.js',
      '.jsx',
      '.json',
    ];

    config.resolve.plugins = [
      ...(config.resolve.plugins || []),
      new TsconfigPathsPlugin({
        extensions: config.resolve.extensions,
      }),
    ];

    config.plugins = [
      ...(config.plugins || []),
      new DefinePlugin({
        __DEV__: true,
      }),
    ];

    // Return the altered config
    return {
      ...config,
      // While developing components storybook throws error
      // if there are eslint errors which is annoying
      // thus disabled it.
      plugins: config.plugins.filter((plugin) => {
        if (plugin.constructor.name === 'ESLintWebpackPlugin') {
          return false;
        }
        return true;
      }),
    };
  },
};
export default config;
