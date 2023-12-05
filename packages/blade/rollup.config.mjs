/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
/* eslint-disable prefer-template */
import fs from 'fs';
import { fileURLToPath } from 'node:url';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import pluginPeerDepsExternal from 'rollup-plugin-peer-deps-external';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginDeclarations from 'rollup-plugin-dts';
import pluginAlias from '@rollup/plugin-alias';
import pluginReplace from '@rollup/plugin-replace';
import ts from 'typescript';
import { glob } from 'glob';
import { depsExternalPlugin } from './dependencies-external-plugin.mjs';

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

const externalDependencies = [
  '@babel/runtime',
  '@gorhom/bottom-sheet',
  '@gorhom/portal',
  '@use-gesture/react',
  '@floating-ui/react',
  '@floating-ui/react-native',
  '@emotion/react',
  '@table-library/react-table-library',
  'tinycolor2',
  'react-native-reanimated',
  'react-native-tab-view',
  'react-native-pager-view',
  'react-native-svg',
  'react-native-gesture-handler',
  'use-presence',
  'ts-deepmerge',
  'body-scroll-lock',
];

const inputRootDirectory = 'src';
const outputRootDirectory = 'build';
const libDirectory = 'lib';
const typesDirectory = 'types';
const themeBundleCategories = ['tokens', 'utils'];

const aliases = pluginAlias({
  entries: [
    { find: '~src', replacement: fileURLToPath(new URL(inputRootDirectory, import.meta.url)) },
    {
      find: '~components',
      replacement: fileURLToPath(new URL(`${inputRootDirectory}/components`, import.meta.url)),
    },
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

/*
Build structure: 

- build
  - lib
    - web
      - production
      - development
    - native
  - types
    - components
    - tokens
    - utils
*/
const getWebConfig = (inputs) => {
  const platform = 'web';
  const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';

  return {
    input: inputs,
    // Since we individually bundle each export category (components, tokens, utils)
    // it is possible that some function of `utils` is used in `components` but
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
      pluginBabel({
        exclude: 'node_modules/**',
        babelHelpers: 'runtime',
        envName: 'production',
        extensions: webExtensions,
      }),
      aliases,
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

const getCSSVariablesConfig = ({ exportCategory }) => ({
  input: `src/${exportCategory}/index.ts`,
  output: {
    file: `${outputRootDirectory}/js-bundle-for-css/${exportCategory}Bundle.js`,
    format: 'cjs',
  },
  plugins: [
    pluginPeerDepsExternal(),
    pluginResolve({ extensions: webExtensions }),
    pluginCommonjs(),
    pluginBabel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      envName: 'production',
      extensions: webExtensions,
    }),
    aliases,
  ],
});

const config = () => {
  const framework = process.env.FRAMEWORK;
  const generateCSSVariables = process.env.GENERATE_CSS_VARIABLES;

  if (generateCSSVariables == 'true' && framework === 'REACT') {
    return themeBundleCategories
      .map((exportCategory) => [getCSSVariablesConfig({ exportCategory })])
      .flat();
  }

  const components = glob.sync(`src/components/**/index.ts`);
  const tokens = glob.sync(`src/tokens/index.ts`);
  const utils = glob.sync(`src/utils/index.ts`);
  if (framework === 'REACT') {
    return [
      getWebConfig(components),
      getWebConfig(tokens),
      getWebConfig(utils),
      // Unfortunately we cannot just simply copy the tsc emited declarations and put it on build dir,
      // because moduleSuffixes will cause typescript to resolve the d.ts files based on the user's tsconfig.json
      // which will cause the build to fail because the user's tsconfig.json does not have the moduleSuffixes
      // So we opt for the older approach of bundling the d.ts files as index.d.ts and index.native.d.ts and place it on build dir.
      getDeclarationsConfig({ exportCategory: 'components', isNative: false }),
      getDeclarationsConfig({ exportCategory: 'tokens', isNative: false }),
      getDeclarationsConfig({ exportCategory: 'utils', isNative: false }),
    ].flat();
  }

  if (framework === 'REACT_NATIVE') {
    return [
      getNativeConfig(components),
      getNativeConfig(tokens),
      getNativeConfig(utils),
      getDeclarationsConfig({ exportCategory: 'components', isNative: true }),
      getDeclarationsConfig({ exportCategory: 'tokens', isNative: true }),
      getDeclarationsConfig({ exportCategory: 'utils', isNative: true }),
    ].flat();
  }
};

export default config();
