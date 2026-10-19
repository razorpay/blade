// @vitest-environment node
/// <reference types="vite/client" />
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createGenerator } from 'unocss';
import unoConfig from '../../uno.config';
import { conflictsIn } from '../lint/engine.js';

/**
 * `src/lint/index.json` is what the class lint knows: what each of Blade's
 * classes sets, generated here from `uno.config.ts`. It is committed (the
 * package ships source, with no build step), so this test fails when it no
 * longer matches the config. `BLADE_LINT_WRITE=1 yarn test lint-index`
 * rewrites it.
 */
const INDEX = join(__dirname, '../lint/index.json');
const COMPONENTS = join(__dirname, '../components');

/** Arbitrary-value families (`w-[…]`, `p-[…]`): uno.config.ts's dynamic rules. */
const ARBITRARY_PREFIXES = [
  'w',
  'h',
  'min-w',
  'min-h',
  'max-w',
  'max-h',
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'ms',
  'me',
  'gap',
  'gap-x',
  'gap-y',
  'inset',
  'inset-x',
  'inset-y',
  'top',
  'right',
  'bottom',
  'left',
  'opacity',
  'translate-x',
  'translate-y',
  'rotate',
  'scale',
  'scale-x',
  'scale-y',
  'origin',
  'transition',
  'duration',
  'ease',
  'delay',
];

/**
 * A utility's keys: the custom properties it writes when it composes
 * (`scale-95` writes `--blade-scale-*`, then `transform` from all of them,
 * which every transform class shares), else its first property — the one
 * it is for (`transition-colors` also sets a default duration, which
 * `duration-*` is meant to replace). `display` keeps its value.
 */
function keysOf(body: string): string {
  const declarations = body
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const colon = declaration.indexOf(':');
      return [declaration.slice(0, colon), declaration.slice(colon + 1)] as const;
    });
  const custom = declarations.filter(([name]) => name.startsWith('--')).map(([name]) => name);
  if (custom.length > 0) return custom.join(',');
  const [name, value] = declarations[0];
  return name === 'display' ? `display:${value}` : name;
}

async function buildIndex(): Promise<Record<string, unknown>> {
  const uno = await createGenerator(unoConfig);
  const names = Object.keys(
    ((uno.config as unknown) as { rulesStaticMap: Record<string, unknown> }).rulesStaticMap,
  ).sort();
  const utilities: Record<string, string> = {};
  const colorPrefixes = new Set<string>();
  const colorCategories = new Set<string>();
  const spacing: Record<string, number> = {};
  for (const name of names) {
    // eslint-disable-next-line no-await-in-loop -- one parse per name, in order
    const parsed = await uno.parseToken(name);
    const body = parsed?.find((entry) => entry[2])?.[2];
    if (!body) continue;
    utilities[name] = keysOf(body);
    const color = /^([a-z]+)-([a-z]+)-.*var\(--([a-z]+)-/.exec(`${name}${body}`);
    if (color && color[2] === color[3]) {
      colorPrefixes.add(color[1]);
      colorCategories.add(color[2]);
    }
    const step = /^p-blade-(\d+)$/.exec(name);
    if (step) spacing[/padding:([^;]+)/.exec(body)![1]] = Number(step[1]);
  }
  const arbitrary: Record<string, string> = {};
  for (const prefix of ARBITRARY_PREFIXES) {
    // eslint-disable-next-line no-await-in-loop
    const parsed = await uno.parseToken(`${prefix}-[1px]`);
    const body = parsed?.find((entry) => entry[2])?.[2];
    if (body) arbitrary[prefix] = keysOf(body);
  }
  const bladeCss = [
    ...readFileSync(join(__dirname, '../blade.css'), 'utf8').matchAll(/^\.([\w-]+)/gm),
  ]
    .map(([, name]) => name)
    .sort();
  return {
    utilities,
    arbitrary,
    spacing,
    colorPrefixes: [...colorPrefixes].sort(),
    colorCategories: [...colorCategories].sort(),
    bladeCss: [...new Set(bladeCss)],
  };
}

describe('the class index', () => {
  it('matches uno.config.ts', async () => {
    const built = `${JSON.stringify(await buildIndex(), null, 1)}\n`;
    if (process.env.BLADE_LINT_WRITE) writeFileSync(INDEX, built);
    expect(readFileSync(INDEX, 'utf8')).toBe(built);
  }, 60_000);
});

/** Every combination of a resolver's axes, at most `limit` of them. */
function combinations(
  axes: Record<string, readonly unknown[]>,
  limit = 512,
): Array<Record<string, unknown>> {
  let combos: Array<Record<string, unknown>> = [{}];
  for (const [axis, values] of Object.entries(axes)) {
    combos = combos.flatMap((combo) => values.map((value) => ({ ...combo, [axis]: value })));
    if (combos.length > limit) return combos.slice(0, limit);
  }
  return combos;
}

/** Each class string a resolver returns, with where it sits (`root`, `thumb.on`). */
function leaves(value: unknown, path = ''): Array<[string, string]> {
  if (typeof value === 'string') return [[path || '(string)', value]];
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      leaves(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

const styleModules = import.meta.glob('../components/*/styles.ts', { eager: true });

/**
 * Two classes on one element that set the same property, which `cx` cannot
 * resolve: the stylesheet's order would decide. A deliberate pair is listed
 * here, with why.
 */
const ALLOWED_CONFLICTS: string[] = [];

/** A resolver's conflicting pairs for one combination, by where they sit. */
function conflictsOf(
  resolve: (props: Record<string, unknown>) => unknown,
  combo: Record<string, unknown>,
): string[] {
  let resolved: unknown;
  try {
    resolved = resolve(combo);
  } catch {
    return [];
  }
  return leaves(resolved).flatMap(([path, classes]) =>
    conflictsIn(classes.split(/\s+/)).map(
      ({ first, second, property }) => `${path}: ${first} ↔ ${second} (${property})`,
    ),
  );
}

describe("Blade's own classes", () => {
  it('no resolved class list sets one property twice, in any combination of its axes', () => {
    const found = new Set<string>();
    for (const [file, module] of Object.entries(styleModules)) {
      const exports = module as Record<string, unknown>;
      const component = file.split('/')[2];
      for (const [name, axes] of Object.entries(exports)) {
        if (!name.endsWith('_AXES') || !axes || typeof axes !== 'object') continue;
        const base = name
          .replace(/_AXES$/, '')
          .replace(/_/g, '')
          .toLowerCase();
        const resolve = Object.entries(exports).find(
          ([key, value]) => typeof value === 'function' && key.toLowerCase() === `resolve${base}`,
        )?.[1] as ((props: Record<string, unknown>) => unknown) | undefined;
        if (!resolve) continue;
        for (const combo of combinations(axes as Record<string, readonly unknown[]>)) {
          conflictsOf(resolve, combo).forEach((entry) => found.add(`${component} ${entry}`));
        }
      }
    }
    expect([...found].filter((entry) => !ALLOWED_CONFLICTS.includes(entry)).sort()).toEqual([]);
  });

  it('no class string in a style map sets one property twice', () => {
    const found: string[] = [];
    const files = readdirSync(COMPONENTS, { recursive: true, encoding: 'utf8' }).filter((file) =>
      /(?:^|\/)(?:styles|shared\/\w+)\.ts$/.test(file),
    );
    for (const file of files) {
      const source = readFileSync(join(COMPONENTS, file), 'utf8').replace(
        /\/\*[\s\S]*?\*\/|\/\/.*$/gm,
        '',
      );
      for (const [literal] of source.matchAll(/'[^'\n]*'|`[^`]*`/g)) {
        const classes = literal.slice(1, -1).replace(/\$\{[^}]*\}/g, ' ');
        for (const { first, second, property } of conflictsIn(
          classes.split(/\s+/).filter(Boolean),
        )) {
          const entry = `${file}: ${first} ↔ ${second} (${property})`;
          if (!ALLOWED_CONFLICTS.includes(entry)) found.push(entry);
        }
      }
    }
    expect(found).toEqual([]);
  });
});
