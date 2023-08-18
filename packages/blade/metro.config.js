const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

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
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    resolverMainFields: ['sbmodern', 'browser', 'module', 'main'],
    // TODO: Remove sourceExts array after upgrading to RN 0.72.3
    sourceExts: ['js', 'jsx', 'json', 'ts', 'tsx', 'mjs', 'cjs'],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
