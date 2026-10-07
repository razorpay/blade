import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { opacity, typography } from '@razorpay/blade-core/tokens';

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
  const { weight, family } = typography.onDesktop.fonts;

  it('carries the whole opacity scale', () => {
    for (const [step, value] of Object.entries(opacity)) {
      expect(declarations(`opacity-blade-${step}`)).toEqual({ opacity: String(value) });
    }
  });

  it('carries every font weight', () => {
    for (const [name, value] of Object.entries(weight)) {
      expect(declarations(`font-blade-${name}`)).toEqual({ 'font-weight': String(value) });
    }
  });

  // The heading face is `font-heading` (uno.config.ts, fonts.css), shared with checkout.
  const families = Object.entries(family).filter(([name]) => name !== 'heading');

  it('carries the text and code families', () => {
    for (const [name, value] of families) {
      expect(declarations(`font-blade-${name}`)).toEqual({ 'font-family': String(value) });
    }
  });

  it('defines nothing else', () => {
    const names = [...css.matchAll(/^\.([\w-]+)/gm)].map(([, name]) => name);
    expect(names.sort()).toEqual(
      [
        ...Object.keys(opacity).map((step) => `opacity-blade-${step}`),
        ...Object.keys(weight).map((name) => `font-blade-${name}`),
        ...families.map(([name]) => `font-blade-${name}`),
      ].sort(),
    );
  });
});
