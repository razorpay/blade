/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
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
