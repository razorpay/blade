const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  resolver: {
    unstable_conditionNames: ['react-native', 'require', 'default'],
    extraNodeModules: {
      '@razorpay/blade': path.resolve(__dirname, 'node_modules/@razorpay/blade'),
    },
    blockList: [
      // Block the monorepo workspace symlink so Metro uses the installed npm package
      new RegExp(
        path.resolve(__dirname, '../../../packages/blade').replace(/[/\\]/g, '[/\\\\]') + '/.*',
      ),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
