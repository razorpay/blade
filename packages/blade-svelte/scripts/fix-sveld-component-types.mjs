import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** sveld marks unset $props() defaults as literal `undefined`, optional or required. */
const UNDEFINED_PROP_BLOCK =
  /\n\s+\/\*\*\n(?:\s+\*[^\n]*\n)+\s+\*\/\n\s+[A-Za-z_$][\w$]*\??: undefined;/g;

/** Conflicts with hand-written `children: Snippet | string` in shared prop types. */
const CHILDREN_SNIPPET_OVERRIDE = /\n\s+children\?: \(this: void\) => void;/g;

const EMPTY_INTERSECTION = / & \{\s*\};/g;

const BROKEN_UNDEFINED_PROP = /\n\s+[A-Za-z_$][\w$]*\??: undefined;/m;
const BROKEN_CHILDREN_OVERRIDE = /\n\s+children\?: \(this: void\) => void;/m;

function fixSveldComponentTypeDefinitions(content) {
  return content
    .replace(UNDEFINED_PROP_BLOCK, '')
    .replace(CHILDREN_SNIPPET_OVERRIDE, '')
    .replace(EMPTY_INTERSECTION, ';');
}

function walkSvelteDeclarationFiles(dir, results = []) {
  if (!existsSync(dir)) return results;

  for (const entry of readdirSync(dir)) {
    const filePath = join(dir, entry);
    if (statSync(filePath).isDirectory()) {
      walkSvelteDeclarationFiles(filePath, results);
      continue;
    }

    if (filePath.endsWith('.svelte.d.ts')) {
      results.push(filePath);
    }
  }

  return results;
}

export function fixSveldComponentTypesInDirectory(dir) {
  for (const filePath of walkSvelteDeclarationFiles(dir)) {
    const original = readFileSync(filePath, 'utf8');
    const fixed = fixSveldComponentTypeDefinitions(original);

    if (fixed !== original) {
      writeFileSync(filePath, fixed);
    }

    if (BROKEN_UNDEFINED_PROP.test(fixed) || BROKEN_CHILDREN_OVERRIDE.test(fixed)) {
      throw new Error(`Broken sveld prop types remain after post-processing: ${filePath}`);
    }
  }
}
