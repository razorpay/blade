const path = require('path');
const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withStorybook } = require('@storybook/react-native/metro/withStorybook');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const mocksDir = path.resolve(__dirname, '.storybook/react-native/mocks');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const realNodeModulesDir = fs.realpathSync(nodeModulesDir);

// Metro 0.76 doesn't fully support package.json "exports" for subpath imports.
// Manually resolve subpath exports for storybook packages.
const pkgJsonCache = new Map();

function resolveSubpathExport(moduleName) {
  const parts = moduleName.match(/^(@[^/]+\/[^/]+|[^/]+)(\/.*)?$/);
  if (!parts) return null;

  const pkgName = parts[1];
  const subpath = parts[2] ? `.${parts[2]}` : '.';

  const pkgJsonPath = path.resolve(nodeModulesDir, pkgName, 'package.json');

  let pkgJson;
  if (pkgJsonCache.has(pkgJsonPath)) {
    pkgJson = pkgJsonCache.get(pkgJsonPath);
  } else {
    if (!fs.existsSync(pkgJsonPath)) return null;
    pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    pkgJsonCache.set(pkgJsonPath, pkgJson);
  }

  const exports = pkgJson.exports;
  if (!exports || !exports[subpath]) return null;

  const target = exports[subpath];
  const resolved = typeof target === 'string' ? target : target.default || target.import;
  if (!resolved) return null;

  const filePath = path.resolve(nodeModulesDir, pkgName, resolved);
  if (!fs.existsSync(filePath)) return null;

  return { type: 'sourceFile', filePath };
}

const isWorktreeSymlink = realNodeModulesDir !== nodeModulesDir;

const config = {
  watchFolders: isWorktreeSymlink ? [realNodeModulesDir] : [],
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
    unstable_enableSymlinks: true,
    resolverMainFields: ['react-native', 'browser', 'main'],
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
      if (moduleName === '@storybook/react-vite') {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-react-vite.js'),
        };
      }
      // es-toolkit uses Unicode property escapes (\p{Lu}) unsupported by Hermes in RN 0.72
      if (moduleName === 'es-toolkit' || moduleName.startsWith('es-toolkit/')) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'es-toolkit.js'),
        };
      }

      // Handle storybook subpath exports that Metro 0.76 can't resolve natively
      if (
        (moduleName.startsWith('@storybook/') || moduleName.startsWith('storybook/')) &&
        moduleName.includes('/')
      ) {
        const subpathResult = resolveSubpathExport(moduleName);
        if (subpathResult) return subpathResult;
      }

      return context.resolveRequest(context, moduleName, platform);
    },
  },
};

module.exports = withStorybook(mergeConfig(getDefaultConfig(__dirname), config), {
  configPath: path.resolve(__dirname, '.storybook/react-native'),
  enabled: true,
  docTools: false,
});
