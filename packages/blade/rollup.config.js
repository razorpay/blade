import { babel as pluginBabel } from '@rollup/plugin-babel';
import pluginPeerDepsExternal from 'rollup-plugin-peer-deps-external';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginDeclarations from 'rollup-plugin-dts';

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
    pluginPeerDepsExternal(),
    pluginResolve({ extensions: webExtensions }),
    pluginCommonjs(),
    pluginBabel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      envName: 'production',
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
    pluginPeerDepsExternal(),
    pluginResolve({ extensions: nativeExtensions }),
    pluginCommonjs(),
    pluginBabel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      envName: 'production',
      extensions: nativeExtensions,
    }),
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
  plugins: [pluginDeclarations()],
});

const config = () => {
  const framework = process.env.FRAMEWORK;

  if (framework === 'REACT') {
    return exportCategories.map((exportCategory) => [getWebConfig({ exportCategory })]).flat();
  }

  if (framework === 'REACT_NATIVe') {
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
