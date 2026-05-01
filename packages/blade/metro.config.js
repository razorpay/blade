const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  resetCache: true,
  transformer: {
    unstable_allowRequireContext: true,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolverMainFields: ['browser', 'main'],
  },
};

module.exports = withStorybook(mergeConfig(getDefaultConfig(__dirname), config), {
  enabled: process.env.FRAMEWORK === 'REACT_NATIVE',
  configPath: './.storybook/react-native',
});
