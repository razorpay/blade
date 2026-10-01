import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themeCssPath = path.resolve(__dirname, '../theme.css');
const themeLightCssPath = path.resolve(__dirname, '../theme-light.css');
const themeDarkCssPath = path.resolve(__dirname, '../theme-dark.css');

const UTILITY_MARKER = '/* ===== UTILITY CLASSES ===== */';
// The utility-class tail opens with an indented section comment (see the committed theme.css).
const UTILITY_BLOCK_START = `@layer blade {\n  ${UTILITY_MARKER}`;

describe.each([
  { name: 'theme.css', cssPath: themeCssPath },
  { name: 'theme-light.css', cssPath: themeLightCssPath },
])('$name cascade layers', ({ cssPath }) => {
  const css = fs.readFileSync(cssPath, 'utf8');

  it('declares @layer blade before utilities', () => {
    const layerDeclarationIndex = css.indexOf('@layer blade;');
    const utilitySectionIndex = css.indexOf(UTILITY_MARKER);

    expect(layerDeclarationIndex).toBeGreaterThan(-1);
    expect(utilitySectionIndex).toBeGreaterThan(layerDeclarationIndex);
  });

  it('wraps utility classes in @layer blade so Tailwind utilities win', () => {
    const utilityBlockStart = css.indexOf(UTILITY_BLOCK_START);
    const utilityBlockEnd = css.lastIndexOf('\n}\n');

    expect(utilityBlockStart).toBeGreaterThan(-1);
    expect(utilityBlockEnd).toBeGreaterThan(utilityBlockStart);
    expect(css.slice(utilityBlockStart, utilityBlockEnd)).toContain('.items-center');
    expect(css.slice(utilityBlockStart, utilityBlockEnd)).toContain('.flex-row');
  });

  it('keeps CSS variables unlayered for global token availability', () => {
    const rootBlockEnd = css.indexOf(UTILITY_BLOCK_START);
    const tokenSection = css.slice(0, rootBlockEnd);

    expect(tokenSection).toContain(':root {');
    expect(tokenSection).toContain('--spacing-3:');
    expect(tokenSection).not.toMatch(/@layer blade\s*\{[^}]*--spacing-3/);
  });
});

describe('theme-dark.css override-only contract', () => {
  const darkCss = fs.readFileSync(themeDarkCssPath, 'utf8');

  it('ships both dark selectors (legacy and scoped)', () => {
    expect(darkCss).toContain(":root body[data-theme='dark']");
    expect(darkCss).toContain(":root[data-blade-color-scheme='dark']");
  });

  it('carries no globals or utility classes — it only overrides theme-light.css', () => {
    expect(darkCss).not.toContain('--spacing-');
    expect(darkCss).not.toContain('--font-size-');
    expect(darkCss).not.toContain(UTILITY_MARKER);
    expect(darkCss).not.toContain('.items-center');
  });

  it('only overrides variables that theme-light.css defines', () => {
    const lightCss = fs.readFileSync(themeLightCssPath, 'utf8');
    const varNames = (css: string): Set<string> =>
      new Set(
        css
          .split('\n')
          .map((line) => line.trim().match(/^--[\w-]+(?=:)/)?.[0])
          .filter((name): name is string => Boolean(name)),
      );

    const lightVars = varNames(lightCss);
    for (const name of varNames(darkCss)) {
      expect(lightVars.has(name)).toBe(true);
    }
  });
});
