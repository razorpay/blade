/**
 * Bundles `uno/config.ts` (and `uno/tailwind/*`) into `uno/config.js`, what
 * `@razorpay/blade-svelte/configs/uno` loads: Node will not strip a `.ts`
 * file's types inside node_modules, so an app's `vite.config.ts` that calls
 * `bladeUnoConfig()` (Vite loads node_modules imports with plain Node) needs
 * JavaScript. UnoCSS's own config loader copes with either. Packages stay
 * imports. The file is committed; `uno-config-build.test.ts` fails when it
 * no longer matches the source.
 *
 * Usage (from packages/blade-svelte): yarn build:uno-config
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';

const here = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE = path.resolve(here, '..');
export const OUTFILE = path.join(PACKAGE, 'uno/config.js');
const HEADER = '// Generated from uno/config.ts by scripts/build-uno-config.mjs: do not edit.';

/** The bundle's text. */
export async function bundleUnoConfig() {
  const result = await build({
    entryPoints: [path.join(PACKAGE, 'uno/config.ts')],
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'node18',
    packages: 'external',
    banner: { js: HEADER },
    legalComments: 'none',
    write: false,
    logLevel: 'silent',
  });
  return result.outputFiles[0].text;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(OUTFILE, await bundleUnoConfig());
  console.log(`wrote ${path.relative(PACKAGE, OUTFILE)}`);
}
