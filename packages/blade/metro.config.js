const path = require('path');
const fs = require('fs');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const mocksDir = path.resolve(__dirname, '.storybook/react-native/mocks');

// Metro doesn't support the `exports` field in package.json. This helper
// resolves subpath exports for any package under node_modules.
function resolvePackageExports(moduleName) {
  const nodeModulesDir = path.resolve(__dirname, 'node_modules');
  const parts = moduleName.startsWith('@')
    ? moduleName.split('/').slice(0, 2)
    : moduleName.split('/').slice(0, 1);
  const pkgName = parts.join('/');
  const subpath = './' + moduleName.slice(pkgName.length + 1) || '.';
  const pkgJsonPath = path.join(nodeModulesDir, pkgName, 'package.json');

  try {
    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    const exportEntry = pkgJson.exports && pkgJson.exports[subpath === './' ? '.' : subpath];
    if (!exportEntry) return null;
    const target = typeof exportEntry === 'string' ? exportEntry : exportEntry.default;
    if (!target) return null;
    const resolved = path.join(nodeModulesDir, pkgName, target);
    if (fs.existsSync(resolved)) return resolved;
  } catch {}
  return null;
}

const webOnlyStorybookPackages = [
  '@storybook/addon-docs',
  '@storybook/addon-actions',
  '@storybook/design-system',
  '@storybook/jest',
  '@storybook/testing-library',
];

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
      if (
        webOnlyStorybookPackages.some(
          (pkg) => moduleName === pkg || moduleName.startsWith(pkg + '/'),
        )
      ) {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-addon-docs.js'),
        };
      }
      if (moduleName === 'storybook-react-router') {
        return {
          type: 'sourceFile',
          filePath: path.resolve(mocksDir, 'storybook-react-router.js'),
        };
      }
      // Fallback: try resolving via package.json `exports` when default fails
      try {
        return context.resolveRequest(context, moduleName, platform);
      } catch (e) {
        const resolved = resolvePackageExports(moduleName);
        if (resolved) {
          return { type: 'sourceFile', filePath: resolved };
        }
        throw e;
      }
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
