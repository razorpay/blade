const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
console.log(
  '🚀 ~ file: metro.config.js:4 ~ defaultConfig:',
  defaultConfig.resolver.resolverMainFields,
);

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

// eslint-disable-next-line import/no-extraneous-dependencies

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
    // resolverMainFields: ['sbmodern', 'browser', 'module', 'main'],
    resolverMainFields: ['browser', 'main'],
  },
};

module.exports = mergeConfig(defaultConfig, config);
