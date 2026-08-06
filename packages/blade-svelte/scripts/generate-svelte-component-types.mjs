import { existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { sveld } from 'sveld';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const typesOutDir = join(packageRoot, 'dist/types');
const componentTypesOutDir = join(typesOutDir, 'components');

const EXCLUDED_STUB_PATTERNS = [
  '.stories.svelte.d.ts',
  '.test.svelte.d.ts',
  '/App.svelte.d.ts',
  '/ThemeSwitcher.svelte.d.ts',
];

if (!existsSync(typesOutDir)) {
  throw new Error(
    'dist/types does not exist. Run build:generate-types (tsc) before build:generate-svelte-types.',
  );
}

const componentBarrelPath = join(componentTypesOutDir, 'index.d.ts');
const componentBarrelFromTsc = readFileSync(componentBarrelPath, 'utf8');
if (!componentBarrelFromTsc.trim()) {
  throw new Error(
    'dist/types/components/index.d.ts is empty. Run build:generate-types (tsc) before build:generate-svelte-types.',
  );
}

await sveld({
  entry: './src/components/sveld-entry.js',
  glob: true,
  types: true,
  typesOptions: {
    format: 'component',
    outDir: 'dist/types/components',
  },
});

// sveld overwrites the tsc barrel with an empty stub derived from sveld-entry.js
writeFileSync(componentBarrelPath, componentBarrelFromTsc);

removeExcludedStubs(componentTypesOutDir);
removeMisplacedStubs(typesOutDir);

const missingStubs = findMissingSvelteStubs(typesOutDir);
if (missingStubs.length > 0) {
  throw new Error(
    `Missing .svelte.d.ts stubs for ${missingStubs.length} import(s):\n${missingStubs
      .slice(0, 10)
      .join('\n')}${missingStubs.length > 10 ? '\n...' : ''}`,
  );
}

if (!readFileSync(componentBarrelPath, 'utf8').trim()) {
  throw new Error(
    'dist/types/components/index.d.ts is empty after svelte type generation. Consumers cannot resolve @razorpay/blade-svelte/components types.',
  );
}

function walkDeclarationFiles(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    if (statSync(filePath).isDirectory()) {
      walkDeclarationFiles(filePath, files);
    } else if (filePath.endsWith('.d.ts') && !filePath.endsWith('.svelte.d.ts')) {
      files.push(filePath);
    }
  }
  return files;
}

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
  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    if (!statSync(filePath).isDirectory()) continue;
    if (entry === 'components' || entry === 'utils') continue;

    // sveld glob output can land directly under dist/types when outDir is misconfigured
    rmSync(filePath, { recursive: true, force: true });
  }
}

function findMissingSvelteStubs(dir) {
  const missing = [];

  for (const declarationFile of walkDeclarationFiles(dir)) {
    const content = readFileSync(declarationFile, 'utf8');
    const declarationDir = dirname(declarationFile);

    for (const match of content.matchAll(/from ['"](\.\/?[^'"]+\.svelte)['"]/g)) {
      const importPath = match[1];
      const stubPath = resolve(declarationDir, `${importPath}.d.ts`);
      if (!existsSync(stubPath)) {
        missing.push(relative(packageRoot, stubPath));
      }
    }
  }

  return [...new Set(missing)];
}
