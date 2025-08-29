import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';
import type { PluginOption, LibraryFormats } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));

const inputRootDirectory = 'src';
const outputRootDirectory = 'build';
const libDirectory = 'lib';

const webExtensions = [
  '.web.js',
  '.web.ts',
  '.web.tsx',
  '.desktop.js',
  '.desktop.ts',
  '.desktop.tsx',
  '.mobile.js',
  '.mobile.ts',
  '.mobile.tsx',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.mjs',
];

const nativeExtensions = [
  '.native.js',
  '.native.ts',
  '.native.tsx',
  '.android.js',
  '.android.ts',
  '.android.tsx',
  '.ios.js',
  '.ios.ts',
  '.ios.tsx',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.mjs',
];

const packageJsonDeps = Object.keys(packageJson.dependencies || {}).filter(
  (name) => name !== 'patch-package',
);
const packageJsonPeerDeps = Object.keys(packageJson.peerDependencies || {});
const externalDependencies = new Set([...packageJsonDeps, ...packageJsonPeerDeps]);

function isExternal(id: string): boolean {
  // mark bare imports from dependencies/peerDependencies as external
  if (!id || id.startsWith('.') || path.isAbsolute(id)) return false;
  const pkgName = id.split('/')[0].startsWith('@')
    ? id.split('/').slice(0, 2).join('/')
    : id.split('/')[0];
  return externalDependencies.has(pkgName);
}

// shared aliases
const alias = {
  '~src': path.resolve(__dirname, inputRootDirectory),
  '~components': path.resolve(__dirname, `${inputRootDirectory}/components`),
  '~utils': path.resolve(__dirname, `${inputRootDirectory}/utils`),
  '~tokens': path.resolve(__dirname, `${inputRootDirectory}/tokens`),
};

export default defineConfig(() => {
  const framework = process.env.FRAMEWORK;

  // Entries per export category
  const entries = {
    components: path.resolve(__dirname, 'src/components/index.ts'),
    tokens: path.resolve(__dirname, 'src/tokens/index.ts'),
    utils: path.resolve(__dirname, 'src/utils/index.ts'),
  } as const;

  if (framework === 'REACT') {
    const webMode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
    const dtsPlugin = dts({
      // Use the web types tsconfig so moduleSuffixes and excludes apply
      tsconfigPath: path.resolve(__dirname, 'tsconfig-generate-types.web.json'),
      // Let tsconfig control declarationDir; we only include our source tree
      include: ['src'],
    }) as PluginOption;

    const bundleTypesPlugin: PluginOption = {
      name: 'bundle-types-after-build-web',
      closeBundle() {
        try {
          execSync('node ./scripts/bundleDeclarations.mjs', { stdio: 'inherit' });
        } catch (error: unknown) {
          console.warn('[bundle-types-after-build-web] Failed to bundle declarations:', error);
        }
      },
    };

    return {
      plugins: [react() as PluginOption, dtsPlugin, bundleTypesPlugin],
      resolve: {
        alias,
        extensions: webExtensions,
      },
      define: {
        __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
      },
      build: {
        emptyOutDir: false,
        sourcemap: true,
        lib: {
          entry: (entries as unknown) as string | string[] | Record<string, string>,
          formats: (['es'] as unknown) as LibraryFormats[],
        },
        rollupOptions: {
          external: (id) => isExternal(id),
          output: {
            dir: `${outputRootDirectory}/${libDirectory}/web/${webMode}`,
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: (chunkInfo) => `${chunkInfo.name}.js`,
          },
        },
      },
    };
  }

  if (framework === 'REACT_NATIVE') {
    const dtsPlugin = dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig-generate-types.native.json'),
      include: ['src'],
    }) as PluginOption;

    const bundleTypesPlugin: PluginOption = {
      name: 'bundle-types-after-build-native',
      closeBundle() {
        try {
          execSync('node ./scripts/bundleDeclarations.mjs', { stdio: 'inherit' });
        } catch (error: unknown) {
          console.warn('[bundle-types-after-build-native] Failed to bundle declarations:', error);
        }
      },
    };

    return {
      plugins: [dtsPlugin, bundleTypesPlugin] as PluginOption[],
      resolve: {
        alias,
        extensions: nativeExtensions,
      },
      build: {
        emptyOutDir: false,
        sourcemap: true,
        lib: {
          entry: (entries as unknown) as string | string[] | Record<string, string>,
          formats: (['es'] as unknown) as LibraryFormats[],
        },
        rollupOptions: {
          external: (id) => isExternal(id),
          output: {
            dir: `${outputRootDirectory}/${libDirectory}/native`,
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: (chunkInfo) => `${chunkInfo.name}.js`,
          },
        },
      },
    };
  }

  // Default config (no-op build)
  return {
    plugins: [react() as PluginOption],
  };
});
