const path = require('path');

module.exports = {
  refs: {
    '@storybook/design-system': { disable: true },
  },
  stories: [
    '../../docs/**/*.stories.mdx',
    '../../docs/**/*.stories.@(ts|tsx|js|jsx)',
    '../../src/**/*.stories.mdx',
    '../../src/**/*.stories.@(ts|tsx|js|jsx)',
    ...(process.env.NODE_ENV == 'development'
      ? ['../../src/**/*.stories.internal.mdx', '../../src/**/*.stories.internal.@(ts|tsx|js|jsx)']
      : []),
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
  ],
  staticDirs: ['../../public/storybook-site'],
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

    const root = path.resolve(__dirname, '..', '..');
    config.resolve.alias = {
      ...config.resolve.alias,
      '~src': path.resolve(root, 'src'),
      '~components': path.resolve(root, 'src', 'components'),
      '~utils': path.resolve(root, 'src', 'utils'),
      '~tokens': path.resolve(root, 'src', 'tokens'),
    };

    // Return the altered config
    return config;
  },
};
