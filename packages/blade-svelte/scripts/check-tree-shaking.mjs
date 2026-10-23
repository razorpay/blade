// Builds tiny apps that import one thing from `@razorpay/blade-svelte/components`
// and checks what lands in the bundle: a component that renders its parts
// as children (Card, Modal, BottomSheet, Drawer) must not bring them along,
// and toasts ship only with a ToastContainer.
// Run: `yarn check:tree-shaking` (a few seconds per case).
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const core = resolve(root, '../blade-core/src');
const entry = resolve(root, 'src/components-entry.ts');

/** [what an app imports, compiled components that must be in, and must not be]. */
const CASES = [
  [['Card'], ['Card'], ['CardHeader', 'CardBody', 'CardFooter', 'Button']],
  [
    ['Card', 'CardHeader'],
    ['Card', 'CardHeader'],
    ['CardFooter', 'Button'],
  ],
  [['Modal'], ['Modal'], ['CardHeader', 'ModalHeader', 'OverlaySections']],
  [
    ['BottomSheet', 'Drawer'],
    ['BottomSheet', 'Drawer'],
    ['CardHeader', 'BottomSheetHeader', 'DrawerHeader', 'OverlaySections'],
  ],
  [
    ['Modal', 'ModalHeader'],
    ['ModalHeader', 'CardHeader'],
    ['OverlaySections', 'BottomSheetHeader'],
  ],
  [['BladeProvider'], ['BladeProvider'], ['ToastContainer', 'Toast', 'createToastsModel']],
  [['showToast'], ['showToast'], ['ToastContainer', 'Toast', 'BladeProvider']],
  [['BladeProvider', 'ToastContainer'], ['ToastContainer', 'Toast'], []],
];

const work = mkdtempSync(join(tmpdir(), 'blade-tree-shaking-'));
let failed = 0;
try {
  for (const [imports, mustHave, mustNot] of CASES) {
    const app = join(work, `${imports.join('-')}.js`);
    writeFileSync(
      app,
      `import { ${imports.join(', ')} } from '${entry}';\nconsole.log(${imports.join(', ')});\n`,
    );
    const outDir = join(work, `out-${imports.join('-')}`);
    // eslint-disable-next-line no-await-in-loop -- one build at a time, so each case's output and timing stay its own
    await build({
      configFile: false,
      logLevel: 'error',
      plugins: [svelte({ preprocess: vitePreprocess(), onwarn: () => {} })],
      resolve: {
        conditions: ['svelte', 'browser'],
        alias: [
          { find: /^@razorpay\/blade-core\/utils$/, replacement: resolve(core, 'utils/index.ts') },
          {
            find: /^@razorpay\/blade-core\/styles$/,
            replacement: resolve(core, 'styles/index.ts'),
          },
          {
            find: /^@razorpay\/blade-core\/tokens$/,
            replacement: resolve(core, 'tokens/index.ts'),
          },
          { find: /^~utils(\/.*)?$/, replacement: resolve(core, 'utils$1') },
          { find: /^~tokens(\/.*)?$/, replacement: resolve(core, 'tokens$1') },
          { find: /^~src(\/.*)?$/, replacement: resolve(core, '$1') },
        ],
      },
      build: {
        minify: false,
        outDir,
        lib: { entry: app, formats: ['es'], fileName: 'out' },
        rollupOptions: { external: [/^svelte(\/.*)?$/], output: { inlineDynamicImports: true } },
      },
    });
    // `out.js` or `out.mjs`, as the package's module type decides.
    const file = readdirSync(outDir).find((name) => /^out\.m?js$/.test(name));
    const code = readFileSync(join(outDir, file), 'utf8');
    // Rollup suffixes a function whose name an import already took (`Drawer$1`).
    const has = (name) => new RegExp(`function ${name}(?:\\$\\d+)?\\(`).test(code);
    const missing = mustHave.filter((name) => !has(name));
    const leaked = mustNot.filter(has);
    const ok = !missing.length && !leaked.length;
    failed += ok ? 0 : 1;
    const size = (code.length / 1024).toFixed(1);
    const missed = missing.length ? `; missing ${missing.join(', ')}` : '';
    const leaks = leaked.length ? `; leaked ${leaked.join(', ')}` : '';
    console.log(
      `${ok ? 'ok  ' : 'FAIL'} import { ${imports.join(', ')} }: ${size} KB${missed}${leaks}`,
    );
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
process.exit(failed ? 1 : 0);
