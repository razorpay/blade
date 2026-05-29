const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const mocksDir = path.resolve(__dirname, '.storybook/react-native/mocks');

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
    resolverMainFields: ['react-native', 'browser', 'main'],
    unstable_enablePackageExports: true,
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName.endsWith('.css')) {
        return { type: 'empty' };
      }
      if (moduleName === 'react-pdf' || moduleName.startsWith('react-pdf/')) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'react-pdf.js'),
        };
      }
      if (moduleName === 'pdfjs-dist' || moduleName.startsWith('pdfjs-dist/')) {
        return { type: 'empty' };
      }
      if (moduleName === 'storybook-react-router') {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-react-router.js'),
        };
      }
      if (moduleName === '@storybook/design-system' || moduleName.startsWith('@storybook/design-system/')) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-design-system.js'),
        };
      }
      if (moduleName === '@storybook/addon-actions' || moduleName.startsWith('@storybook/addon-actions/')) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-addon-actions.js'),
        };
      }
      if (moduleName === '@storybook/addon-docs' || moduleName.startsWith('@storybook/addon-docs/')) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-addon-docs.js'),
        };
      }
      if (moduleName === '@storybook/jest' || moduleName.startsWith('@storybook/jest/')) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-jest.js'),
        };
      }
      if (moduleName === '@storybook/testing-library' || moduleName.startsWith('@storybook/testing-library/')) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-testing-library.js'),
        };
      }
      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
