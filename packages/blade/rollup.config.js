import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
    peerDepsExternal(),
    resolve({ extensions: webExtensions }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      envName: 'web-production',
      extensions: webExtensions,
    }),
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
    peerDepsExternal(),
    resolve({ extensions: nativeExtensions }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      envName: 'production',
      extensions: nativeExtensions,
    }),
  ],
});

// clean outputRootDirectory before building
fs.rmSync(outputRootDirectory, { recursive: true, force: true });

const config = exportCategories
  .map((exportCategory) => [getWebConfig({ exportCategory }), getNativeConfig({ exportCategory })])
  .flat();

export default config;
