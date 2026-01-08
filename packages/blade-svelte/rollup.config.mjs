/* eslint-disable no-useless-escape */
/* eslint-disable consistent-return */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import svelte from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import pluginPeerDepsExternal from 'rollup-plugin-peer-deps-external';
import pluginResolve from '@rollup/plugin-node-resolve';
import pluginCommonjs from '@rollup/plugin-commonjs';
import pluginAlias from '@rollup/plugin-alias';
import { babel as pluginBabel } from '@rollup/plugin-babel';
import postcss from 'rollup-plugin-postcss';
import { depsExternalPlugin } from '../blade/dependencies-external-plugin.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagejson = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8'));

const extensions = ['.svelte', '.js', '.ts', '.mjs'];

const packageJsonDeps = Object.keys(packagejson.dependencies || {}).filter(
  (name) => name !== 'patch-package',
);

const externalDependencies = packageJsonDeps;

const inputRootDirectory = 'src';
const outputRootDirectory = 'dist';
const libDirectory = 'lib';

const aliases = pluginAlias({
  entries: [
    { find: '~src', replacement: fileURLToPath(new URL(inputRootDirectory, import.meta.url)) },
    {
      find: '~components',
      replacement: fileURLToPath(new URL(`${inputRootDirectory}/components`, import.meta.url)),
    },
  ],
});

/**
 * Rollup plugin to fix Svelte 5 component import stripping.
 *
 * Problem: Svelte 5 compiler + Rollup's preserveModules strips component imports
 * because the compiler transforms component usage into function calls without
 * preserving the original import statements.
 *
 * Solution: Read original source files to capture imports, re-inject missing ones in generateBundle.
 *
 * TODO: Remove when fixed upstream in rollup-plugin-svelte
 */
function injectSvelteImports() {
  const importsMap = new Map();

  return {
    name: 'inject-svelte-imports',

    // Capture component imports by reading original source (before Svelte compiles it)
    load(id) {
      if (!id.endsWith('.svelte')) return null;

      try {
        const source = fs.readFileSync(id, 'utf-8');
        const imports = [...source.matchAll(/import\s+(\w+)\s+from\s+['"]([^'"]+\.svelte)['"]/g)].map(
          ([, name, importPath]) => ({ name, path: importPath }),
        );

        if (imports.length > 0) {
          importsMap.set(id, imports);
        }
      } catch {
        // File read failed, skip
      }
      return null; // Let other plugins handle the actual loading
    },

    // Re-inject missing imports into output chunks
    generateBundle(_, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.facadeModuleId?.endsWith('.svelte')) continue;

        const imports = importsMap.get(chunk.facadeModuleId);
        if (!imports?.length) continue;

        const missingImports = imports
          .filter(({ name }) => {
            const isUsed = new RegExp(`\\b${name}\\s*[\\(\\[]`).test(chunk.code);
            const isImported = new RegExp(`import\\s+${name}\\b`).test(chunk.code);
            return isUsed && !isImported;
          })
          .map(({ name, path: p }) => `import ${name} from '${p.replace('.svelte', '.js')}';`);

        if (missingImports.length > 0) {
          chunk.code = missingImports.join('\n') + '\n' + chunk.code;
        }
      }
    },
  };
}

/*
Build structure: 

- dist
  - lib
    - components/
    - utils/
  - types
    - components
    - utils
*/
const getConfig = (input, outputDir) => {
  return {
    input,
    treeshake: false,
    // Externalize svelte and all its subpaths to use consumer's svelte
    external: (id) => id === 'svelte' || id.startsWith('svelte/'),
    output: [
      {
        dir: `${outputRootDirectory}/${libDirectory}/${outputDir}`,
        format: 'es',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: `src/${outputDir}`,
        // Output plain .js files to prevent consumer bundlers from re-processing
        entryFileNames: (chunkInfo) => {
          // Replace .svelte with .js for svelte components
          const name = chunkInfo.name.replace('.svelte', '');
          return `${name}.js`;
        },
        chunkFileNames: '[name].js',
      },
    ],
    plugins: [
      pluginPeerDepsExternal(),
      depsExternalPlugin({ externalDependencies }),
      svelte({
        preprocess: sveltePreprocess({
          typescript: true,
        }),
        compilerOptions: {
          dev: process.env.NODE_ENV !== 'production',
        },
        emitCss: false,
      }),
      pluginResolve({
        extensions,
        browser: true,
        dedupe: ['svelte'],
      }),
      pluginCommonjs(),
      pluginBabel({
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        extensions: ['.js', '.ts'],
        presets: ['@babel/preset-typescript'],
      }),
      postcss({
        extract: false,
        modules: false,
        minimize: process.env.NODE_ENV === 'production',
        sourceMap: true,
      }),
      aliases,
      injectSvelteImports(),
    ],
  };
};

const config = () => {
  return [
    getConfig('src/components/index.ts', 'components'),
    getConfig('src/utils/index.ts', 'utils'),
  ];
};

export default config();
