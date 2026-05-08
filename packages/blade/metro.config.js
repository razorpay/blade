const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

const defaultConfig = getDefaultConfig(__dirname);

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

const merged = withStorybook(mergeConfig(defaultConfig, config), {
  enabled: true,
  configPath: path.resolve(__dirname, '.storybook/react-native'),
});

const originalResolveRequest = merged.resolver.resolveRequest;

merged.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.endsWith('.css')) {
    return { type: 'empty' };
  }
  if (moduleName === 'react-pdf' || moduleName.startsWith('react-pdf/')) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, '.storybook/react-native/mocks/react-pdf.js'),
    };
  }
  if (moduleName === 'pdfjs-dist' || moduleName.startsWith('pdfjs-dist/')) {
    return { type: 'empty' };
  }
  // Fix: @storybook/react-native self-references @storybook/react/entry-preview-docs
  // but withStorybook rewrites it incorrectly. Resolve directly to the actual file.
  if (moduleName.includes('entry-preview-docs')) {
    return {
      type: 'sourceFile',
      filePath: path.resolve(__dirname, 'node_modules/@storybook/react/dist/entry-preview-docs.js'),
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = merged;
