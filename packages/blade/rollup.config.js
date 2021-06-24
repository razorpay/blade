import fs from 'fs';
import { babel } from '@rollup/plugin-babel';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from '@rollup/plugin-typescript';

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
const componentTypes = ['components', 'tokens', 'utils'];

const getWebConfig = ({ componentType }) => ({
  input: `${inputRootDirectory}/${componentType}/index.ts`,
  output: [
    {
      file: `${outputRootDirectory}/${componentType}/index.web.js`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions: webExtensions }),
    // typescript({
    //   tsconfig: './tsconfig.json',
    //   declaration: true,
    //   noEmit: false,
    //   declarationDir: 'build/types',
    // }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
      envName: 'web-production',
      extensions: webExtensions,
    }),
  ],
});

const getNativeConfig = ({ componentType }) => ({
  input: `${inputRootDirectory}/${componentType}/index.ts`,
  output: [
    {
      file: `${outputRootDirectory}/${componentType}/index.native.js`,
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions: nativeExtensions }),
    // typescript({
    //   tsconfig: './tsconfig.json',
    //   declaration: true,
    //   noEmit: false,
    //   declarationDir: 'build/types',
    // }),
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
fs.rmdirSync(outputRootDirectory, { recursive: true });

const config = componentTypes
  .map((componentType) => [getWebConfig({ componentType }), getNativeConfig({ componentType })])
  .flat();

export default config;
