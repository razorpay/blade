import { babel as pluginBabel } from '@rollup/plugin-babel';
import pluginPeerDepsExternal from 'rollup-plugin-peer-deps-external';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';

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

export default {
  input: 'src/tokens/index.ts',
  output: {
    file: 'generated/themeBundle.js',
    // dir: 'generated',
    format: 'cjs',
    // preserveModules: true,
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
  ],
};
