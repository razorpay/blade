import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const typesOutDir = join(packageRoot, 'dist/types');
const componentBarrelPath = join(typesOutDir, 'components/index.d.ts');

if (!existsSync(typesOutDir)) {
  throw new Error(
    'dist/types does not exist. Run build:generate-svelte-types and build:generate-types before build:validate-types.',
  );
}

const componentBarrel = readFileSync(componentBarrelPath, 'utf8');
if (!componentBarrel.trim()) {
  throw new Error(
    'dist/types/components/index.d.ts is empty. tsc should emit the components barrel after sveld runs.',
  );
}

const missingStubs = findMissingSvelteStubs(typesOutDir);
if (missingStubs.length > 0) {
  throw new Error(
    `Missing .svelte.d.ts stubs for ${missingStubs.length} import(s):\n${missingStubs
      .slice(0, 10)
      .join('\n')}${missingStubs.length > 10 ? '\n...' : ''}`,
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
