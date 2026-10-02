import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { createGenerator } from 'unocss';
import unoConfig from '../../uno.config';

/**
 * Every class is Blade's: `uno.config.ts` (package root) generates one CSS
 * property per class, with a static value from Blade's tokens. A class it
 * does not generate is a typo or a leftover of another vocabulary, and a
 * literal colour escapes the tokens, so both fail here.
 */
const COMPONENTS_DIR = join(__dirname, '../components');

const FORBIDDEN = [
  {
    pattern: /\[[^\]\s]*(?:#[0-9a-fA-F]{3}|\b(?:rgba?|hsla?)\()/,
    reason: 'a literal color in an arbitrary value',
  },
  {
    pattern: /\b(?:bg|text|border|outline|ring)-[\w-]+\/(?:\d|\[)/,
    reason: 'an opacity modifier',
  },
  { pattern: /\btheme\(/, reason: 'a theme() lookup' },
];

function violationsIn(source: string): string[] {
  return FORBIDDEN.filter(({ pattern }) => pattern.test(source)).map(
    ({ reason }) => reason
  );
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory()
      ? sourceFiles(join(dir, entry.name))
      : entry.name.endsWith('.ts') || entry.name.endsWith('.svelte')
        ? [join(dir, entry.name)]
        : []
  );
}

/** Markers that select nothing themselves: `group-*:` and `peer-*:` read them. */
const MARKERS = new Set(['group', 'group/item', 'peer']);

/**
 * The class-shaped tokens of a style map's string literals. Object keys
 * (`'data-radius': '0'`) and axis values (`variant: ['default', 'icon-only']`)
 * are names, not classes.
 */
function classTokensIn(source: string): string[] {
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    // Imports and re-exports only: `export const x = …;` is a style map.
    .replace(/^\s*import\b[^;]*;/gm, '')
    .replace(/^\s*export\s+(?:type\s+)?(?:\{[^}]*\}|\*)\s*(?:from\s*'[^']*')?;/gm, '');
  const names = new Set(
    (code.match(/\[(?:\s*'[^'\n]*'\s*,?)+\s*\]/g) ?? []).flatMap((list) =>
      (list.match(/'[^'\n]*'/g) ?? []).map((name) => name.slice(1, -1))
    )
  );
  const literals = code.match(/'[^'\n]*'(?!\s*:)|`[^`]*`/g) ?? [];
  return literals
    .map((literal) => literal.slice(1, -1).replace(/\$\{[^}]*\}/g, ' '))
    .filter((literal) => /[a-z]-|:/.test(literal))
    .flatMap((literal) => literal.split(/\s+/))
    .filter(
      (token) =>
        /^[!*[a-z-]/.test(token) && !MARKERS.has(token) && !names.has(token)
    );
}

describe('token contract', () => {
  it('no component hardcodes a color or reaches past the tokens', () => {
    const violations: string[] = [];
    for (const file of sourceFiles(COMPONENTS_DIR)) {
      for (const reason of violationsIn(readFileSync(file, 'utf8'))) {
        violations.push(`${relative(COMPONENTS_DIR, file)}: ${reason}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it('flags literal colors, opacity modifiers and theme()', () => {
    expect(violationsIn("root: 'text-surface-static-white-normal'")).toEqual(
      []
    );
    expect(violationsIn("root: 'text-[#fff]'")).toHaveLength(1);
    expect(violationsIn("root: '[accent-color:hsla(0,_0%,_0%,_1)]'")).toHaveLength(1);
    expect(violationsIn("root: 'bg-interactive-gray-default/50'")).toHaveLength(1);
    expect(violationsIn("root: '[--rim:theme(colors.cta)]'")).toHaveLength(1);
  });

  it('uno.config.ts generates every class the style maps use', async () => {
    const uno = await createGenerator(unoConfig);
    const files = sourceFiles(COMPONENTS_DIR).filter((file) =>
      /\/(?:styles|shared\/(?!breakpoint)\w+)\.ts$/.test(file)
    );
    const unknown: string[] = [];
    for (const file of files) {
      const tokens = [...new Set(classTokensIn(readFileSync(file, 'utf8')))];
      const { matched } = await uno.generate(tokens.join(' '), {
        preflights: false,
      });
      for (const token of tokens) {
        if (!matched.has(token)) {
          unknown.push(`${relative(COMPONENTS_DIR, file)}: ${token}`);
        }
      }
    }
    expect(unknown).toEqual([]);
  });
});

/**
 * The layout contract. `runes/` is the Svelte runes layer: every
 * component's behaviour, state, effects and DOM writes live there, in two
 * tiers — atoms (one concern each: the state cores under `base/`, the DOM
 * helpers under `dom/`, every plain `.ts` module, and the listed
 * `.svelte.ts` shared by composites) and composites (one behaviour each,
 * built from atoms). A rune holds no markup and no class literal and
 * imports nothing from `components/`, so the layer can be reused or
 * extracted as a folder. Class maps live in
 * `components/<name>/styles.ts`, which a React binding could import — so no
 * `svelte` value import there. A `.svelte` under `components/` is markup
 * over a rune: no state, effects, lifecycle or context of its own; it reads
 * a rune's getters in its template.
 */
const RUNES_DIR = join(__dirname, '../runes');

/** `.svelte.ts` atoms outside `base/` and `dom/`, relative to `runes/`. */
const SHARED_RUNE_ATOMS = [
  'form/form.svelte.ts',
  'form/field.svelte.ts',
  'form/field-line.svelte.ts',
  'modal/overlays.svelte.ts',
  'toast/toasts.svelte.ts',
  'defaults/defaults.svelte.ts',
  'defaults/breakpoints.svelte.ts',
];

/**
 * Atoms hold no effect, lifecycle or context: they are callable anywhere,
 * which is what lets the page-wide stacks (`globalLayers`, `globalNav`,
 * `globalOverlays`, `globalToasts`) exist at module scope. `setupField`
 * (`form/field.svelte.ts`) is the one atom with a lifecycle: it registers
 * a field for as long as its component lives.
 */
const CONTEXT_FREE = [
  /\$effect(?:\.pre|\.root)?\(/,
  /\bonMount\(/,
  /\bonDestroy\(/,
  /\bgetContext\(/,
  /\bsetContext\(/,
];
const EFFECT_ONLY = [/\$effect(?:\.pre|\.root)?\(/];

const COMPONENT_STATE = [
  /\$state(?:\.raw)?[(<]/,
  /\$effect(?:\.pre|\.root)?\(/,
  /\bonMount\(/,
  /\bonDestroy\(/,
  /\bgetContext\(/,
  /\bsetContext\(/,
  /\.subscribe\(/,
  /\buntrack\(/,
  /\btick\(/,
  /\bbind:this\b/,
];

// A class's shape: a token a class map would hold. Checked per token of
// every string literal, with comments and import specifiers stripped.
const CLASS_TOKEN =
  /^(?:!?-?(?:[a-z]+:)*)(?:flex|inline-flex|grid|block|hidden|absolute|relative|fixed|sticky|sr-only|pointer-events-none|rounded(?:-[\w/.[\]]+)?|bg-[\w/.[\]-]+|border(?:-[\w/.[\]-]+)?|ring(?:-[\w/.[\]-]+)?|[pm][xytrbl]?-[\w/.[\]-]+|gap(?:-[xy])?-[\w/.[\]-]+|size-[\w/.[\]-]+|[wh]-[\w/.[\]-]+|text-(?:\d+|surface|feedback|interactive|popup)[\w/.[\]-]*|font-(?:medium|semibold|bold)|opacity-\d+|transition(?:-\w+)?|duration-[\w[\]]+|ease-[\w[\]().,-]+|translate-[\w[\]().,%/-]+|shrink-0|items-\w+|justify-\w+)$/;

function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '')
    // Imports and re-exports only: `export const x = …;` is a style map.
    .replace(/^\s*import\b[^;]*;/gm, '')
    .replace(/^\s*export\s+(?:type\s+)?(?:\{[^}]*\}|\*)\s*(?:from\s*'[^']*')?;/gm, '');
}

// A lone token that is also an HTML input type (`type === 'hidden'`) is a
// comparison, not a class map.
const INPUT_TYPES = new Set(['hidden']);

function classLiteralsIn(source: string): string[] {
  // A native animation spec names CSS values (`position: 'absolute'`),
  // not classes.
  const code = stripComments(source).replace(/\bposition:\s*'[a-z]+'/g, '');
  const literals = code.match(/'[^'\n]*'|"[^"\n]*"|`[^`]*`/g);
  return (literals ?? []).filter((literal) => {
    const tokens = literal.slice(1, -1).split(/\s+/);
    if (tokens.length === 1 && INPUT_TYPES.has(tokens[0])) {
      return false;
    }
    return tokens.some((token) => CLASS_TOKEN.test(token));
  });
}

function isAtom(file: string): boolean {
  const rel = relative(RUNES_DIR, file);
  return (
    rel.startsWith('base/') ||
    rel.startsWith('dom/') ||
    !rel.endsWith('.svelte.ts') ||
    SHARED_RUNE_ATOMS.includes(rel)
  );
}

function relativeImportsOf(source: string): string[] {
  const imports: string[] = [];
  const pattern = /from\s+'(\.[^']*)'/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(source))) {
    imports.push(match[1]);
  }
  return imports;
}

function resolveImport(file: string, specifier: string): string {
  return resolve(dirname(file), specifier).replace(/\.svelte$/, '.svelte.ts');
}

describe('layout contract', () => {
  it('runes/ holds no markup', () => {
    const svelte = sourceFiles(RUNES_DIR).filter((file) =>
      file.endsWith('.svelte')
    );
    expect(svelte).toEqual([]);
  });

  it('runes/ imports nothing from components/, not even a type', () => {
    const offenders = sourceFiles(RUNES_DIR).flatMap((file) =>
      relativeImportsOf(readFileSync(file, 'utf8'))
        .filter((specifier) =>
          resolveImport(file, specifier).startsWith(COMPONENTS_DIR)
        )
        .map((specifier) => `${relative(RUNES_DIR, file)}: ${specifier}`)
    );
    expect(offenders).toEqual([]);
  });

  it('a composite rune imports atoms only, never another composite', () => {
    const offenders = sourceFiles(RUNES_DIR)
      .filter(
        (file) =>
          !file.endsWith('.test.ts') &&
          file !== join(RUNES_DIR, 'index.ts') &&
          !isAtom(file)
      )
      .flatMap((file) =>
        relativeImportsOf(readFileSync(file, 'utf8'))
          .map((specifier) => resolveImport(file, specifier))
          .filter(
            (target) =>
              target.startsWith(RUNES_DIR) &&
              !isAtom(target) &&
              !isAtom(`${target}.ts`)
          )
          .map(
            (target) =>
              `${relative(RUNES_DIR, file)} -> ${relative(RUNES_DIR, target)}`
          )
      );
    expect(offenders).toEqual([]);
  });

  it('a state core under base/ is callable anywhere: no effect, lifecycle or context', () => {
    const offenders = sourceFiles(RUNES_DIR)
      .filter((file) => !file.endsWith('.test.ts') && isAtom(file))
      .flatMap((file) => {
        const rel = relative(RUNES_DIR, file);
        const rules = rel.startsWith('base/')
          ? CONTEXT_FREE
          : SHARED_RUNE_ATOMS.includes(rel)
            ? EFFECT_ONLY
            : [];
        const source = readFileSync(file, 'utf8');
        return rules
          .filter((pattern) => pattern.test(source))
          .map((pattern) => `${rel}: ${pattern.source}`);
      });
    expect(offenders).toEqual([]);
  });

  it('runes/ holds no class literal', () => {
    const offenders = sourceFiles(RUNES_DIR)
      .filter((file) => !file.endsWith('.test.ts'))
      .flatMap((file) =>
        classLiteralsIn(readFileSync(file, 'utf8')).map(
          (literal) => `${relative(RUNES_DIR, file)}: ${literal}`
        )
      );
    expect(offenders).toEqual([]);
  });

  it('flags a class literal and passes a state key', () => {
    expect(
      classLiteralsIn("const a = 'flex items-center gap-2';")
    ).toHaveLength(1);
    expect(classLiteralsIn("const b = 'rounded-small';")).toHaveLength(1);
    expect(
      classLiteralsIn(
        "const c = 'picked'; const d = 'svelte/transition'; const e = 'maxLength';"
      )
    ).toEqual([]);
    expect(
      classLiteralsIn(
        "// 'flex' in a comment\nimport x from 'svelte/transition';"
      )
    ).toEqual([]);
  });

  it('a component holds no state, effects, lifecycle or context', () => {
    const offenders = sourceFiles(COMPONENTS_DIR)
      .filter((file) => file.endsWith('.svelte'))
      .flatMap((file) => {
        const source = readFileSync(file, 'utf8');
        return COMPONENT_STATE.filter((pattern) => pattern.test(source)).map(
          (pattern) => `${relative(COMPONENTS_DIR, file)}: ${pattern.source}`
        );
      });
    expect(offenders).toEqual([]);
  });

  it('styles.ts imports no svelte runtime', () => {
    const offenders = sourceFiles(COMPONENTS_DIR).filter((file) => {
      if (!file.endsWith('/styles.ts')) {
        return false;
      }
      const source = readFileSync(file, 'utf8');
      return /^import\s+(?!type\b)[^;]*from\s+'svelte/m.test(source);
    });
    expect(offenders).toEqual([]);
  });
});
