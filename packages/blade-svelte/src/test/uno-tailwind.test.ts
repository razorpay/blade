/**
 * Tailwind v3, rebuilt as Blade's rules (uno/tailwind): an app's theme in
 * tailwind.config.js's shape gives the classes Tailwind gave. The fixture
 * (fixtures/tailwind-theme.cjs) went through Tailwind v3.4.1 once; its output
 * is fixtures/tailwind-v3.json. Each class must come out the same, up to
 * spelling: Blade's variable names for composed filters, logical sides.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createGenerator } from 'unocss';
import { describe, expect, it } from 'vitest';
import bladeUnoConfig from '../../uno/config';
import type { ThemeConfig } from '../../uno/tailwind';

type Rules = Record<string, Record<string, string>>;

const require = createRequire(import.meta.url);
const fixture = require('./fixtures/tailwind-theme.cjs') as {
  theme: ThemeConfig;
  presets: { theme: ThemeConfig }[];
  classes: string[];
};
const expected = JSON.parse(
  readFileSync(require.resolve('./fixtures/tailwind-v3.json'), 'utf8'),
) as {
  classes: Record<string, Rules>;
  keyframes: Record<string, string>;
};

/**
 * Classes Blade defines itself: its definition wins, at Tailwind's place in
 * the stylesheet. Listed with what Blade writes instead.
 */
const BLADE_OWNED: Record<string, string> = {
  // Blade's elevation token and card: the shadow alone, not composed with rings
  'shadow-none': 'box-shadow: none',
  'shadow-card': 'box-shadow: 0 6px 32px 4px hsla(205, 8%, 71%, 0.06)',
  // Blade's bounce (Tailwind's steps, an overshooting ease) over the fixture's
  'animate-bounce': 'animation: bounce 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) infinite',
};

const LOGICAL: [string, string, string][] = [
  ['left', 'right', 'inset-inline'],
  ['top', 'bottom', 'inset-block'],
  ['margin-left', 'margin-right', 'margin-inline'],
  ['padding-left', 'padding-right', 'padding-inline'],
];

/** One spelling for equal CSS: Blade's filter variables are Tailwind's under another name. */
function normalize(rules: Rules): Rules {
  return Object.fromEntries(
    Object.entries(rules).map(([selector, declarations]) => {
      const out: Record<string, string> = {};
      for (const [property, value] of Object.entries(declarations)) {
        out[property.replace(/^--blade-/, '--tw-')] = value
          .replace(/var\(--blade-/g, 'var(--tw-')
          .replace(/\s+/g, ' ')
          .trim();
      }
      for (const [a, b, logical] of LOGICAL) {
        if (a in out && out[a] === out[b]) out[logical] = out[a];
      }
      const merged = LOGICAL.filter(([, , logical]) => logical in out).flatMap(([a, b]) => [a, b]);
      return [
        selector,
        Object.fromEntries(Object.entries(out).filter(([property]) => !merged.includes(property))),
      ];
    }),
  );
}

/** Where a block opened at `open` closes, past strings and nested blocks. */
function blockEnd(css: string, open: number): number {
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    const char = css[i];
    if (char === '\\') i++;
    else if (char === '"' || char === "'") i = css.indexOf(char, i + 1);
    else if (char === '{') depth++;
    else if (char === '}' && --depth === 0) return i;
  }
  return css.length;
}

/**
 * The style rules at the top of UnoCSS's output, as selector and body. At-rules
 * (`@keyframes`, `@media`) are skipped whole. A small reader in place of a CSS
 * parser: Uno writes flat, well-formed CSS.
 */
function topLevelRules(css: string): { selector: string; body: string }[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: { selector: string; body: string }[] = [];
  let start = 0;
  while (start < source.length) {
    const open = source.indexOf('{', start);
    if (open === -1) break;
    const end = blockEnd(source, open);
    const selector = source.slice(start, open).trim();
    if (!selector.startsWith('@')) rules.push({ selector, body: source.slice(open + 1, end) });
    start = end + 1;
  }
  return rules;
}

/** A rule's declarations, property to value (`!important` dropped, as PostCSS reads them). */
function declarations(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  let parens = 0;
  let start = 0;
  const add = (text: string): void => {
    const colon = text.indexOf(':');
    if (colon === -1) return;
    out[text.slice(0, colon).trim()] = text
      .slice(colon + 1)
      .replace(/\s*!important\s*$/i, '')
      .trim();
  };
  for (let i = 0; i < body.length; i++) {
    const char = body[i];
    if (char === '\\') i++;
    else if (char === '"' || char === "'") i = body.indexOf(char, i + 1);
    else if (char === '(') parens++;
    else if (char === ')') parens--;
    else if (char === ';' && parens === 0) {
      add(body.slice(start, i));
      start = i + 1;
    }
  }
  add(body.slice(start));
  return out;
}

async function generate(): Promise<{ classes: Record<string, Rules>; css: string }> {
  const uno = await createGenerator(
    bladeUnoConfig({ theme: fixture.theme, presets: fixture.presets, preflight: false }),
  );
  const { css } = await uno.generate(new Set(fixture.classes), { preflights: false });
  const classes: Record<string, Rules> = {};
  for (const { selector, body } of topLevelRules(css)) {
    // `.bg-primary-500\/20 > :not([hidden])` → the class and the rest, as `&`
    const match = /^\.((?:\\.|[\w-])+)(.*)$/s.exec(selector);
    if (!match) continue;
    const name = match[1].replace(/\\(.)/g, '$1');
    (classes[name] ??= {})[`&${match[2]}`] = declarations(body);
  }
  return { classes, css };
}

describe('Tailwind v3 utilities from an app theme', async () => {
  const { classes, css } = await generate();
  const tailwind = expected.classes;

  it.each(fixture.classes.filter((name) => !(name in BLADE_OWNED)))('%s', (name) => {
    expect(tailwind[name]).toBeDefined();
    expect(normalize(classes[name] ?? {})).toEqual(normalize(tailwind[name]));
  });

  it.each(Object.entries(BLADE_OWNED))("%s is Blade's", (name, declaration) => {
    const [property, value] = declaration.split(': ');
    expect(classes[name]?.['&']?.[property]).toBe(value);
  });

  it("writes an animation's keyframes with it, an extended one merged into Tailwind's", () => {
    expect(css).toContain('@keyframes fade-in{0%{opacity:0}100%{opacity:1}}');
    expect(expected.keyframes['fade-in']).toBe('0%{opacity:0}100%{opacity:1}');
  });
});

describe('comma-bearing theme values', () => {
  it('keeps commas inside brackets: grid templates stay valid CSS', async () => {
    const uno = await createGenerator(
      bladeUnoConfig({
        theme: { gridTemplateRows: { layout: 'repeat(3, minmax(0, 1fr))' } } as ThemeConfig,
      }),
    );
    const { css } = await uno.generate(new Set(['grid-rows-layout']), { preflights: false });
    expect(css).toContain('grid-template-rows:repeat(3, minmax(0, 1fr))');
  });
});

describe('theme() in a class', () => {
  it('is not read: a class writes the value itself', async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const { css } = await uno.generate(new Set(['[--rim:theme(colors.primary.500)]']), {
      preflights: false,
    });
    expect(css).not.toContain('--rim');
  });
});

describe('scrollbar-none', () => {
  it('hides the scrollbar in every engine', async () => {
    const uno = await createGenerator(bladeUnoConfig());
    const { css } = await uno.generate(new Set(['scrollbar-none']), { preflights: false });
    expect(css).toContain('.scrollbar-none{scrollbar-width:none;-ms-overflow-style:none;}');
    expect(css).toContain('.scrollbar-none::-webkit-scrollbar{display:none;}');
  });
});

describe('important', () => {
  it('is a trailing `!`, after variants too', async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const { css } = await uno.generate(new Set(['p-4!', 'hover:bg-primary-500!']), {
      preflights: false,
    });
    expect(css).toMatch(/\.p-4\\!\{[^}]*!important/);
    expect(css).toMatch(/\.hover\\:bg-primary-500\\!:hover\{[^}]*background-color:[^;]*!important/);
  });

  it("is Tailwind v3's leading `!` on the utility, after variants too", async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const { css } = await uno.generate(new Set(['!p-4', 'hover:!p-4', '!-mt-2']), {
      preflights: false,
    });
    expect(css).toMatch(/\.\\!p-4\{padding:16px !important;\}/);
    expect(css).toMatch(/\.hover\\:\\!p-4:hover\{padding:16px !important;\}/);
    expect(css).toMatch(/\.\\!-mt-2\{margin-top:-8px !important;\}/);
  });

  it('is not a leading `!` before a variant', async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const { css } = await uno.generate(new Set(['!hover:p-4']), { preflights: false });
    expect(css).toBe('');
  });
});

describe('without a theme', () => {
  it("is Blade's rules alone: no Tailwind classes", async () => {
    const uno = await createGenerator(bladeUnoConfig());
    const { css } = await uno.generate(new Set(['bg-primary-500', 'shadow-lg', 'p-4']), {
      preflights: false,
    });
    expect(css).toContain('.p-4');
    expect(css).not.toContain('bg-primary-500');
    expect(css).not.toContain('shadow-lg');
  });
});

describe("Tailwind's place, Blade's definition", () => {
  it("writes a class both define at its place among Tailwind's, as Blade defines it", async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const { css } = await uno.generate(
      new Set(['rounded-t-lg', 'rounded-none', 'mx-auto', '-ml-2']),
      {
        preflights: false,
      },
    );
    // `rounded-none` (Blade's token) before the side utilities, as in Tailwind,
    // so `rounded-none rounded-t-lg` keeps the top corners.
    expect(css.indexOf('.rounded-none')).toBeLessThan(css.indexOf('.rounded-t-lg'));
    expect(css.indexOf('.mx-auto')).toBeLessThan(css.indexOf('.-ml-2'));
    // Blade's spelling: logical sides
    expect(css).toContain('.mx-auto{margin-inline:auto;}');
  });

  it("orders a rule's classes as Tailwind does: negatives, digits, `[…]`, words", async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const classes = ['h-auto', 'h-[13px]', 'h-4', '-mt-[1px]', 'mt-1', 'mt-[2px]', 'mt-auto'];
    const { css } = await uno.generate(new Set(classes), { preflights: false });
    const at = (name: string): number => css.indexOf(`.${name.replace(/[[\]]/g, '\\$&')}{`);
    // `h-4 h-[13px]` on one element is 13px, as under Tailwind; `h-[20px] h-full` is full.
    expect(at('h-4')).toBeLessThan(at('h-[13px]'));
    expect(at('h-[13px]')).toBeLessThan(at('h-auto'));
    // Tailwind sorts the candidates with `<`: a negative sorts first.
    expect(at('-mt-[1px]')).toBeLessThan(at('mt-1'));
    expect(at('mt-1')).toBeLessThan(at('mt-[2px]'));
    expect(at('mt-[2px]')).toBeLessThan(at('mt-auto'));
    // Blade's body (`p-4` is Blade's) keeps Tailwind's place among them.
    const padded = await uno.generate(new Set(['p-[13px]', 'p-4', 'd:p-[13px]', 'd:p-4']), {
      preflights: false,
    });
    const padAt = (name: string): number =>
      padded.css.indexOf(`.${name.replace(/[[\]:]/g, '\\$&')}{`);
    expect(padAt('p-4')).toBeLessThan(padAt('p-[13px]'));
    expect(padAt('d:p-4')).toBeLessThan(padAt('d:p-[13px]'));
    // Under the identifier: a rule's identifiers keep their name order.
    const corners = await uno.generate(new Set(['rounded-t', 'rounded-b-lg', 'rounded-tl-[3px]']), {
      preflights: false,
    });
    const cornerAt = (name: string): number =>
      corners.css.indexOf(`.${name.replace(/[[\]]/g, '\\$&')}{`);
    expect(cornerAt('rounded-b-lg')).toBeLessThan(cornerAt('rounded-t'));
    expect(cornerAt('rounded-t')).toBeLessThan(cornerAt('rounded-tl-[3px]'));
  });

  it("composes Tailwind's filters with Blade's: `grayscale brightness-0` keep both", async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const { css } = await uno.generate(new Set(['grayscale', 'brightness-0']), {
      preflights: false,
    });
    expect(css).toContain('--blade-grayscale:grayscale(1)');
    expect(css).toContain('--blade-brightness:brightness(0)');
    const filters = css.match(/filter:[^;]+/g) ?? [];
    expect(new Set(filters).size).toBe(1);
  });
});
