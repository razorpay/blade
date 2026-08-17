import { existsSync, readdirSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveld } from 'sveld';
import { fixSveldComponentTypesInDirectory } from './fix-sveld-component-types.mjs';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const typesOutDir = join(packageRoot, 'dist/types');
const componentTypesOutDir = join(typesOutDir, 'components');

const EXCLUDED_STUB_PATTERNS = [
  '.stories.svelte.d.ts',
  '.test.svelte.d.ts',
  '/App.svelte.d.ts',
  '/ThemeSwitcher.svelte.d.ts',
];

await sveld({
  entry: './src/components/sveld-entry.js',
  glob: true,
  types: true,
  typesOptions: {
    format: 'component',
    outDir: 'dist/types/components',
  },
});

// sveld writes an empty index.d.ts from sveld-entry.js; tsc runs next and emits the real barrel.
removeExcludedStubs(componentTypesOutDir);
removeMisplacedStubs(typesOutDir);
fixSveldComponentTypesInDirectory(componentTypesOutDir);

function removeExcludedStubs(dir) {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    if (statSync(filePath).isDirectory()) {
      removeExcludedStubs(filePath);
      continue;
    }

    if (
      filePath.endsWith('.svelte.d.ts') &&
      EXCLUDED_STUB_PATTERNS.some((pattern) => filePath.includes(pattern))
    ) {
      rmSync(filePath);
    }
  }
}

function removeMisplacedStubs(dir) {
  if (!existsSync(dir)) return;

  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    if (!statSync(filePath).isDirectory()) continue;
    if (entry === 'components' || entry === 'utils') continue;

    // sveld glob output can land directly under dist/types when outDir is misconfigured
    rmSync(filePath, { recursive: true, force: true });
  }
}
