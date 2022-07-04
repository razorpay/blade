/* eslint-disable import/extensions */
import fs from 'fs';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import pluginPeerDepsExternal from 'rollup-plugin-peer-deps-external';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginDeclarations from 'rollup-plugin-dts';
import pluginAlias from '@rollup/plugin-alias';
// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript';

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

const inputRootDirectory = 'src';
const outputRootDirectory = 'build';
const exportCategories = ['components', 'tokens', 'utils'];

const aliases = pluginAlias({
  entries: [
    { find: '~src', replacement: `${__dirname}/${inputRootDirectory}` },
    { find: '~components', replacement: `${__dirname}/${inputRootDirectory}/components` },
    { find: '~utils', replacement: `${__dirname}/${inputRootDirectory}/utils` },
    { find: '~tokens', replacement: `${__dirname}/${inputRootDirectory}/tokens` },
  ],
});

const getWebConfig = ({ exportCategory }) => ({
  input: `${inputRootDirectory}/${exportCategory}/index.ts`,
  output: [
    {
      file: `${outputRootDirectory}/${exportCategory}/index.web.js`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: [/@babel\/runtime/],
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

const getNativeConfig = ({ exportCategory }) => ({
  input: `${inputRootDirectory}/${exportCategory}/index.ts`,
  output: [
    {
      file: `${outputRootDirectory}/${exportCategory}/index.native.js`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  external: [/@babel\/runtime/],
  plugins: [
    pluginPeerDepsExternal(),
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
});

const getDeclarationsConfig = ({ exportCategory }) => ({
  input: `${outputRootDirectory}/types/${exportCategory}/index.d.ts`,
  output: [
    {
      file: `${outputRootDirectory}/${exportCategory}/index.d.ts`,
      format: 'esm',
    },
  ],
  plugins: [
    pluginDeclarations({
      // Need to resolve paths in d.ts files
      // https://github.com/Swatinem/rollup-plugin-dts/issues/169
      compilerOptions: ts.readConfigFile(`${__dirname}/tsconfig.json`, (p) =>
        fs.readFileSync(p, 'utf8'),
      ).config.compilerOptions,
    }),
  ],
});

const config = () => {
  const framework = process.env.FRAMEWORK;

  if (framework === 'REACT') {
    return exportCategories.map((exportCategory) => [getWebConfig({ exportCategory })]).flat();
  }

  if (framework === 'REACT_NATIVE') {
    return exportCategories.map((exportCategory) => [getNativeConfig({ exportCategory })]).flat();
  }

  return exportCategories
    .map((exportCategory) => [
      // bundle our declarations for each category `components`, `tokens` and `utils` and place it next to each category under `build`
      getDeclarationsConfig({ exportCategory }),
    ])
    .flat();
};

export default config();
