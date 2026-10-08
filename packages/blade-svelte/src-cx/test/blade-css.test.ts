import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createGenerator } from 'unocss';
import { opacity, typography } from '@razorpay/blade-core/tokens';
import defaultUnoConfig, { bladeUnoConfig } from '../../uno.config';

/** src-cx/blade.css is written out by hand; blade-core's tokens are the source. */
const css = readFileSync(join(__dirname, '../blade.css'), 'utf8');

function declarations(className: string): Record<string, string> {
  const body = new RegExp(`^\\.${className} \\{([^}]*)\\}`, 'm').exec(css)?.[1];
  if (body === undefined) throw new Error(`.${className} is missing from blade.css`);
  return Object.fromEntries(
    body
      .replace(/\/\*[^*]*\*\//g, '')
      .split(';')
      .map((declaration) => declaration.trim())
      .filter(Boolean)
      .map((declaration) => {
        const colon = declaration.indexOf(':');
        return [declaration.slice(0, colon).trim(), declaration.slice(colon + 1).trim()];
      }),
  );
}

describe('blade.css', () => {
  it('carries the whole opacity scale', () => {
    for (const [step, value] of Object.entries(opacity)) {
      expect(declarations(`opacity-blade-${step}`)).toEqual({ opacity: String(value) });
    }
  });

  it('defines nothing else', () => {
    const names = [...css.matchAll(/^\.([\w-]+)/gm)].map(([, name]) => name);
    expect(names.sort()).toEqual(
      [
        ...Object.keys(opacity).map((step) => `opacity-blade-${step}`),
      ].sort(),
    );
  });
});

describe('font utilities', () => {
  const { weight, family } = typography.onDesktop.fonts;

  // Tailwind's names, Blade's values (uno.config.ts).
  it.each([
    ['font-normal', { 'font-weight': String(weight.regular) }],
    ['font-medium', { 'font-weight': String(weight.medium) }],
    ['font-semibold', { 'font-weight': String(weight.semibold) }],
    ['font-bold', { 'font-weight': String(weight.bold) }],
    ['font-sans', { 'font-family': `var(--font-family-text, ${family.text})` }],
    ['font-mono', { 'font-family': `var(--font-family-code, ${family.code})` }],
    [
      'font-heading',
      { 'font-family': 'var(--font-family-heading, Tasa, "TASA Orbiter Fallback Arial", Arial)' },
    ],
  ])('%s carries blade-core\'s token', async (name, expected) => {
    const uno = await createGenerator(defaultUnoConfig);
    const { css: out } = await uno.generate(name, { preflights: false });
    const [property, value] = Object.entries(expected)[0];
    expect(out).toContain(`.${name}{${property}:${value};}`);
  });

  async function cssFor(name: string, theme: Parameters<typeof bladeUnoConfig>[0]): Promise<string> {
    const uno = await createGenerator(bladeUnoConfig(theme));
    return (await uno.generate(name, { preflights: false })).css;
  }

  it("gives way to an app theme that sets the key: a merchant's body font", async () => {
    const theme = {
      theme: {
        fontFamily: { sans: ['var(--body-font, Inter)'] },
        extend: { fontWeight: { medium: 'var(--font-weight, 500)' } },
      },
    };
    expect(await cssFor('font-sans', theme)).toContain('font-family:var(--body-font, Inter)');
    expect(await cssFor('font-medium', theme)).toContain('font-weight:var(--font-weight, 500)');
    // Keys the app leaves alone stay Blade's.
    expect(await cssFor('font-mono', theme)).toContain(
      `font-family:var(--font-family-code, ${family.code})`,
    );
  });

  it("keeps Blade's values over Tailwind's defaults when the app theme does not set them", async () => {
    const theme = { theme: { colors: { brand: '#123456' } } };
    expect(await cssFor('font-sans', theme)).toContain(
      `font-family:var(--font-family-text, ${family.text})`,
    );
    expect(await cssFor('font-semibold', theme)).toContain(`font-weight:${weight.semibold}`);
  });
});
