/**
 * Tailwind v3, rebuilt as Blade's rules (uno/tailwind): an app's theme in
 * tailwind.config.js's shape gives the classes Tailwind gave. The fixture
 * (fixtures/tailwind-theme.cjs) went through Tailwind v3.4.1 once; its output
 * is fixtures/tailwind-v3.json. Each class must come out the same, up to
 * spelling: Blade's variable names for composed filters, logical sides.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import postcss from 'postcss';
import { createGenerator } from 'unocss';
import { describe, expect, it } from 'vitest';
import { bladeUnoConfig } from '../../uno.config';
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

async function generate(): Promise<{ classes: Record<string, Rules>; css: string }> {
  const uno = await createGenerator(
    bladeUnoConfig({ theme: fixture.theme, presets: fixture.presets, preflight: false }),
  );
  const { css } = await uno.generate(new Set(fixture.classes), { preflights: false });
  const classes: Record<string, Rules> = {};
  postcss.parse(css).walkRules((rule) => {
    if (rule.parent?.type === 'atrule') return;
    // `.bg-primary-500\/20 > :not([hidden])` → the class and the rest, as `&`
    const match = /^\.((?:\\.|[\w-])+)(.*)$/s.exec(rule.selector);
    if (!match) return;
    const name = match[1].replace(/\\(.)/g, '$1');
    const declarations: Record<string, string> = {};
    rule.walkDecls((declaration) => {
      declarations[declaration.prop] = declaration.value;
    });
    (classes[name] ??= {})[`&${match[2]}`] = declarations;
  });
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

  it('is not a leading `!`', async () => {
    const uno = await createGenerator(bladeUnoConfig({ theme: fixture.theme }));
    const { css } = await uno.generate(new Set(['!p-4', 'hover:!p-4']), { preflights: false });
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
