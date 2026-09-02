/**
 * Generates `packages/blade-core/src/tokens/theme.css` from the token sources.
 *
 * A Figma token push rewrites the token TS files (`colors.ts`, `bladeTheme.ts`) but historically
 * left `theme.css` — which hard-codes the same values as CSS custom properties for the Svelte /
 * CSS-only / SSR consumers — to drift. This regenerates it from the same tokens, so the auto-opened
 * token PR carries an updated `theme.css`, and a drift-guard test fails CI if the committed file
 * diverges from this output.
 *
 * Scope: bladeTheme only. `theme.css` encodes a single theme (light `:root` + dark block + mobile
 * `@media`). Theme choice (blade vs neutral) is a JS prop with no DOM attribute, so a static neutral
 * block would be inert — the runtime provider already covers neutral via inline vars.
 *
 * This owns only the token-derived HEAD. The hand-authored UTILITY CLASSES tail is spliced back
 * verbatim from the existing file (it is not derivable from tokens).
 *
 * Run via `yarn generate:tokens-css` (vite-node with the vitest config for `~tokens`/`~utils`).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prettier from 'prettier';

import bladeTheme from '~tokens/theme/bladeTheme';
import { border, breakpoints, spacing, motion, opacity, elevation } from '~tokens/global';
import type { Typography } from '~tokens/global/typography';
import {
  colorsToCSSVariables,
  elevationToCSSVariables,
  typographyToCSSVariables,
} from '~utils/themeToCSSVariables';
import { tokenToCSSVariable } from '~utils/tokenToCSSVariable';

const CURRENT_DIR = path.dirname(fileURLToPath(import.meta.url));
const THEME_CSS_PATH = path.resolve(CURRENT_DIR, '../src/tokens/theme.css');

/**
 * Stable marker where the token-derived head ends and the hand-authored utility-class tail begins.
 * `@layer blade;` (line 4, no brace) is intentionally NOT this — the tail is the braced `@layer`.
 */
const TAIL_MARKER = '@layer blade {';

const DARK_SELECTOR_BLOCK = `/* Dark Mode
 * Transition period: both \`body[data-theme='dark']\` (legacy) and
 * \`[data-blade-color-scheme='dark']\` (new scoped attribute) are supported.
 * \`:root[data-blade-color-scheme]\` is a compound selector (no space) so it
 * matches \`<html>\` itself — where BladeProvider sets the attribute — and
 * cascades to portaled content (tooltips, toasts) rendered outside the
 * provider wrapper div.
 * TODO: deprecate and remove \`body[data-theme]\` selector once all consumers
 * migrate to \`data-blade-color-scheme\`. */
:root body[data-theme='dark'],
:root[data-blade-color-scheme='dark'] {`;

/** Top-level color categories that get a section comment, in emission order. */
const COLOR_CATEGORY_LABELS: Record<string, string> = {
  surface: 'Surface',
  feedback: 'Feedback',
  interactive: 'Interactive',
  overlay: 'Overlay',
  popup: 'Popup',
  data: 'Data',
};

const declaration = (name: string, value: string): string => `  ${name}: ${value};`;

const borderValueToCss = (value: number | string): string =>
  typeof value === 'string' ? value : `${value}px`;

/** Emit a flat CSS-var map as declaration lines, preserving map insertion order. */
const emitMap = (map: Record<string, string>): string[] =>
  Object.entries(map).map(([name, value]) => declaration(name, value));

/** Emit color declarations, injecting a labeled section comment per color category. */
const emitColors = (map: Record<string, string>, commentSuffix = ''): string[] => {
  const lines: string[] = [];
  let lastCategory: string | null = null;
  for (const [name, value] of Object.entries(map)) {
    const category = name.replace(/^--/, '').split('-')[0];
    const label = COLOR_CATEGORY_LABELS[category];
    if (label && category !== lastCategory) {
      if (lines.length) lines.push('');
      lines.push(`  /* ${label} Colors${commentSuffix} */`);
      lastCategory = category;
    }
    lines.push(declaration(name, value));
  }
  return lines;
};

const emitBorder = (): string[] => {
  const lines: string[] = ['  /* Border */'];
  for (const [key, value] of Object.entries(border.radius)) {
    lines.push(declaration(tokenToCSSVariable(`border.radius.${key}`), borderValueToCss(value)));
  }
  lines.push('');
  for (const [key, value] of Object.entries(border.width)) {
    lines.push(declaration(tokenToCSSVariable(`border.width.${key}`), borderValueToCss(value)));
  }
  return lines;
};

const emitMotion = (): string[] => {
  const lines: string[] = ['  /* Motion */'];
  for (const [key, value] of Object.entries(motion.duration)) {
    lines.push(declaration(`--duration-${key}`, `${value}ms`));
  }
  lines.push('');
  for (const [key, value] of Object.entries(motion.delay)) {
    lines.push(declaration(`--delay-${key}`, `${value}ms`));
  }
  lines.push('');
  for (const [key, value] of Object.entries(motion.easing)) {
    lines.push(declaration(`--easing-${key}`, String(value)));
  }
  return lines;
};

/** Mobile `@media` only carries the font-size / line-height keys where mobile differs from desktop. */
const emitMobileDiffs = (
  group: 'size' | 'lineHeights',
  prefix: string,
  desktop: Typography,
  mobile: Typography,
): string[] => {
  const desktopValues = group === 'size' ? desktop.fonts.size : desktop.lineHeights;
  const mobileValues = group === 'size' ? mobile.fonts.size : mobile.lineHeights;
  const lines: string[] = [];
  for (const key of Object.keys(desktopValues)) {
    const mobileValue = (mobileValues as Record<string, number>)[key];
    if (mobileValue !== (desktopValues as Record<string, number>)[key]) {
      lines.push(`    ${prefix}-${key}: ${mobileValue}px;`);
    }
  }
  return lines;
};

/**
 * Build `theme.css` from the token sources and prettier-format it so the output matches the
 * committed (formatted) file byte-for-byte.
 */
export const generateThemeCSS = (): string => {
  const { colors, typography } = bladeTheme;

  const head: string[] = [
    '/* Blade Design System CSS Variables */',
    '/* Generated from theme and global tokens */',
    '',
    '@layer blade;',
    '',
    ':root {',
    '  /* ===== GLOBAL TOKENS ===== */',
    '',
    '  /* Spacing */',
    ...Object.entries(spacing).map(([key, value]) => declaration(`--spacing-${key}`, `${value}px`)),
    '',
    ...emitBorder(),
    '',
    '  /* Breakpoints */',
    ...Object.entries(breakpoints).map(([key, value]) =>
      declaration(`--breakpoint-${key}`, `${value}px`),
    ),
    '',
    '  /* Typography - Desktop */',
    ...emitMap(typographyToCSSVariables(typography.onDesktop)),
    '',
    ...emitMotion(),
    '',
    '  /* Opacity */',
    ...Object.entries(opacity).map(([key, value]) =>
      declaration(`--opacity-${key}`, String(value)),
    ),
    '',
    '  /* Elevation */',
    ...emitMap(elevationToCSSVariables(elevation.onLight)),
    '',
    '  /* ===== THEME TOKENS - LIGHT MODE ===== */',
    '',
    ...emitColors(colorsToCSSVariables(colors.onLight)),
    '}',
    '',
    DARK_SELECTOR_BLOCK,
    '',
    ...emitColors(colorsToCSSVariables(colors.onDark), ' - Dark'),
    '',
    '  /* Elevation - Dark */',
    ...emitMap(elevationToCSSVariables(elevation.onDark)),
    '}',
    '',
    '/* Mobile Typography Overrides */',
    '@media (max-width: 767px) {',
    '  :root {',
    ...emitMobileDiffs('size', '--font-size', typography.onDesktop, typography.onMobile),
    '',
    ...emitMobileDiffs('lineHeights', '--line-height', typography.onDesktop, typography.onMobile),
    '  }',
    '}',
    '',
  ];

  // Splice the hand-authored utility-class tail back verbatim — it is not derivable from tokens.
  const existing = fs.readFileSync(THEME_CSS_PATH, 'utf8');
  const tailIndex = existing.indexOf(TAIL_MARKER);
  if (tailIndex === -1) {
    throw new Error(
      `Could not find the utility-class tail marker "${TAIL_MARKER}" in ${THEME_CSS_PATH}. ` +
        `The generator only owns the token-derived head; the tail must be preserved verbatim.`,
    );
  }
  const tail = existing.slice(tailIndex);

  // Format only the token-derived head. The tail is spliced in verbatim afterward — running it
  // through prettier would reformat the utility classes' indentation, which
  // `theme-css-layers.test.ts` asserts on exactly (e.g. unindented `@layer blade {\n/* ... */`).
  const prettierConfig = prettier.resolveConfig.sync(THEME_CSS_PATH) ?? {};
  const formattedHead = prettier.format(head.join('\n'), {
    ...prettierConfig,
    parser: 'css',
    filepath: THEME_CSS_PATH,
  });

  return `${formattedHead.replace(/\n+$/, '\n')}${tail}`;
};
