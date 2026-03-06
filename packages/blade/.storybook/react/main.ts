import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { StorybookConfig } from '@storybook/react-webpack5';
const require = createRequire(import.meta.url);
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
    '../../docs/**/*.mdx',
    '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.mdx',
    '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.internal.stories.@(ts|tsx|js|jsx)',
  ],

  addons: [
    getAbsolutePath("@storybook/addon-webpack5-compiler-babel"),
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-a11y")
  ],

  framework: {
    name: getAbsolutePath("@storybook/react-webpack5"),
    options: {},
  },

  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA || '',
    GITHUB_REF: process.env.GITHUB_REF || '',
  }),

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

    config.resolve.alias = {
      ...config.resolve.alias,
      '@storybook/addon-actions': require.resolve('storybook/actions'),
    };

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
  }
};
export default config;

function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, "package.json")));
}
