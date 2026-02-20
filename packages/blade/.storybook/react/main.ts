import { StorybookConfig } from '@storybook/react-webpack5';
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { DefinePlugin } = require('webpack');
const path = require('path');

// TEMPORARY CHANGE
const isDevelopment = process.env.NODE_ENV !== 'production';

const config: StorybookConfig = {
  typescript: {
    // Disable type checking in development for faster startup
    // Run `yarn typecheck` separately to check types
    check: !isDevelopment,
    checkOptions: {
      typescript: {
        configFile: path.resolve('./tsconfig-typecheck.web.json'),
      },
    },
    // Use react-docgen instead of react-docgen-typescript for faster builds
    // react-docgen-typescript is slower but more accurate
    reactDocgen: isDevelopment ? false : 'react-docgen-typescript',
  },
  refs: {
    '@storybook/design-system': { disable: true },
  },
  stories: [
    '../../docs/**/*.stories.mdx',
    '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.stories.mdx',
    '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.internal.stories.mdx',
    '../../src/**/*.internal.stories.@(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    // '@storybook/preset-create-react-app',
    '@storybook/addon-interactions',
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
    autodocs: 'tag',
  },
  staticDirs: ['../../public'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Enable filesystem caching for faster rebuilds
    if (configType === 'DEVELOPMENT') {
      config.cache = {
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };

      // Use faster source maps in development
      config.devtool = 'eval-cheap-module-source-map';
    }

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

    // config.module.rules[0].exclude = new RegExp('/node_modules/(?!(@stackblitz)).*/');

    config.module.rules.push({
      test: /@stackblitz\/sdk[\\/].*\.m?js$/,
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-proposal-optional-chaining'],
      },
    });

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
