/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
import { promises as fs, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import pluginPeerDepsExternal from 'rollup-plugin-peer-deps-external';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginDeclarations from 'rollup-plugin-dts';
import pluginAlias from '@rollup/plugin-alias';
import pluginReplace from '@rollup/plugin-replace';
import postcss from 'rollup-plugin-postcss';
import ts from 'typescript';
import { depsExternalPlugin } from '../blade/dependencies-external-plugin.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagejson = JSON.parse(readFileSync(path.resolve(__dirname, './package.json'), 'utf8'));

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

const packageJsonDeps = Object.keys(packagejson.dependencies).filter(
  (name) => name !== 'patch-package',
);

const externalDependencies = packageJsonDeps;

const inputRootDirectory = 'src';
const outputRootDirectory = 'dist';
const libDirectory = 'lib';
const typesDirectory = 'types';

const aliases = pluginAlias({
  entries: [
    { find: '~src', replacement: fileURLToPath(new URL(inputRootDirectory, import.meta.url)) },
    {
      find: '~utils',
      replacement: fileURLToPath(new URL(`${inputRootDirectory}/utils`, import.meta.url)),
    },
    {
      find: '~tokens',
      replacement: fileURLToPath(new URL(`${inputRootDirectory}/tokens`, import.meta.url)),
    },
  ],
});

// Plugin to copy CSS files
const copyCssPlugin = {
  name: 'copy-css',
  async generateBundle() {
    const cssContent = await fs.readFile(path.resolve(__dirname, 'src/tokens/theme.css'), 'utf8');
    this.emitFile({
      type: 'asset',
      fileName: 'tokens/theme.css',
      source: cssContent,
    });
  },
};

/*
Build structure: 

- dist
  - lib
    - web
      - production
      - development
    - native
  - types
    - tokens
    - utils
*/
const getWebConfig = (inputs) => {
  const platform = 'web';
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

  return {
    input: inputs,
    // Since we individually bundle each export category (tokens, utils)
    // it is possible that some function of `utils` is used in `tokens` but
    // rollup will have no idea about it and tree shake it away.
    // So we disable tree shaking, this should not cause any issues since consumers will do their own tree shaking.
    treeshake: false,
    output: [
      {
        dir: `${outputRootDirectory}/${libDirectory}/${platform}/${mode}`,
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      pluginReplace({
        __DEV__: process.env.NODE_ENV !== 'production',
        preventAssignment: true,
      }),
      pluginPeerDepsExternal(),
      depsExternalPlugin({ externalDependencies }),
      pluginResolve({ extensions: webExtensions }),
      pluginCommonjs(),
      // PostCSS plugin for processing CSS modules with modern features (nesting, autoprefixer)
      postcss({
        extract: false,
        modules: true,
        minimize: process.env.NODE_ENV === 'production',
        sourceMap: true,
        // Use proper package import instead of relative node_modules path
        inject(cssVariableName) {
          return `
          (function(css) {
            if (typeof document !== 'undefined') {
              var style = document.createElement('style');
              style.textContent = css;
              document.head.appendChild(style);
            }
          })(${cssVariableName});
          `;
        },
      }),
      pluginBabel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        envName: 'production',
        extensions: webExtensions,
      }),
      aliases,
      copyCssPlugin,
    ],
  };
};

const getNativeConfig = (inputs) => {
  const platform = 'native';

  return {
    input: inputs,
    output: [
      {
        dir: `${outputRootDirectory}/${libDirectory}/${platform}`,
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: [
      pluginPeerDepsExternal(),
      depsExternalPlugin({ externalDependencies }),
      pluginResolve({ extensions: nativeExtensions }),
      pluginCommonjs(),
      pluginBabel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        envName: 'production',
        extensions: nativeExtensions,
      }),
      aliases,
    ],
  };
};

const getDeclarationsConfig = ({ exportCategory, isNative }) => {
  const platform = isNative ? 'native' : 'web';

  // Need to resolve paths in d.ts files
  // https://github.com/Swatinem/rollup-plugin-dts/issues/169
  const currentTsConfig = ts.readConfigFile(
    fileURLToPath(new URL(`tsconfig.json`, import.meta.url)),
    (p) => fs.readFileSync(p, 'utf8'),
  ).config.compilerOptions;
  const compilerOptions = {
    ...currentTsConfig,
    // @TODO: remove this after rebranding when all components pass typecheck
    include: ['src'],
    moduleSuffixes: [`.${platform}`, ''],
  };

  return {
    // input will be the platform specific type which is generated by
    // `yarn build:generate-types`
    input: `${outputRootDirectory}/generated-types/${platform}/${exportCategory}/index.d.ts`,
    output: [
      {
        // don't prefix web index export with .web, for backwards compatibility with TS<4.7
        file: `${outputRootDirectory}/${typesDirectory}/${exportCategory}/${
          isNative ? 'index.native.d.ts' : 'index.d.ts'
        }`,
        format: 'esm',
      },
    ],
    plugins: [
      pluginDeclarations({
        compilerOptions,
      }),
    ],
  };
};

const config = () => {
  const framework = process.env.FRAMEWORK;

  const tokens = 'src/tokens/index.ts';
  const utils = 'src/utils/index.ts';
  const styles = 'src/styles/index.ts';

  if (framework === 'REACT') {
    return [
      getWebConfig(tokens),
      getWebConfig(utils),
      getWebConfig(styles),
      // Unfortunately we cannot just simply copy the tsc emitted declarations and put it on build dir,
      // because moduleSuffixes will cause typescript to resolve the d.ts files based on the user's tsconfig.json
      // which will cause the build to fail because the user's tsconfig.json does not have the moduleSuffixes
      // So we opt for the older approach of bundling the d.ts files as index.d.ts and index.native.d.ts and place it on build dir.
      getDeclarationsConfig({ exportCategory: 'tokens', isNative: false }),
      getDeclarationsConfig({ exportCategory: 'utils', isNative: false }),
      // Note: styles declarations are not bundled as they include CSS module exports
      // which are not compatible with rollup-plugin-dts. Use generated-types directly.
    ].flat();
  }

  if (framework === 'REACT_NATIVE') {
    return [
      getNativeConfig(tokens),
      getNativeConfig(utils),
      getDeclarationsConfig({ exportCategory: 'tokens', isNative: true }),
      getDeclarationsConfig({ exportCategory: 'utils', isNative: true }),
    ].flat();
  }

  // Default to REACT if no framework is specified
  return [
    getWebConfig(tokens),
    getWebConfig(utils),
    getWebConfig(styles),
    getDeclarationsConfig({ exportCategory: 'tokens', isNative: false }),
    getDeclarationsConfig({ exportCategory: 'utils', isNative: false }),
    // Note: styles declarations are not bundled as they include CSS module exports
    // which are not compatible with rollup-plugin-dts. Use generated-types directly.
  ].flat();
};

export default config();
