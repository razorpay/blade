module.exports = {
  stories: ['../../src/**/*.stories.mdx', '../../src/**/*.stories.@(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
  ],
  staticDirs: ['../../public/docs'],
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.ts',
      '.web.js',
      '.mjs',
      '.js',
      '.jsx',
      '.json',
    ];

    // Return the altered config
    return config;
  },
};
