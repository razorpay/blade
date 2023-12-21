const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { DefinePlugin } = require('webpack');
const path = require('path');

module.exports = {
  typescript: {
    check: true,
    checkOptions: {
      tsconfig: path.resolve('./tsconfig-typecheck.web.json'),
    },
  },
  refs: {
    '@storybook/design-system': { disable: true },
  },
  stories: [
    '../../src/components/Box/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Badge/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Icons/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Button/IconButton/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Counter/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Tag/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Indicator/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Button/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Divider/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/List/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Link/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Tooltip/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/components/Tabs/**/*.stories.@(ts|tsx|js|jsx)',
    // '../../docs/**/*.stories.mdx',
    // '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    // '../../src/**/*.stories.mdx',
    // '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    // '../../src/**/*.stories.internal.mdx',
    // '../../src/**/*.stories.internal.@(ts|tsx|js|jsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  env: (config) => ({
    ...config,
    GITHUB_SHA: process.env.GITHUB_SHA,
    GITHUB_REF: process.env.GITHUB_REF,
  }),
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
