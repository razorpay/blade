/**
 * Generates the Blade token CSS files in `packages/blade-core/src/tokens/`:
 *
 * - `theme-light.css` — base stylesheet: global tokens (`:root`), light theme tokens,
 *   mobile typography overrides and the hand-authored utility classes.
 * - `theme-dark.css` — additive dark-mode override block only. Must be imported
 *   *alongside* `theme-light.css`; it holds no globals or utilities of its own.
 * - `theme.css` — combined light + dark in one file, kept for backwards compatibility
 *   so existing `@razorpay/blade-core/tokens/theme.css` imports keep working. Consumers
 *   that only ship light mode can import `theme-light.css` alone and skip the dark block.
 *
 * A Figma token push rewrites the token TS files (`colors.ts`, `bladeTheme.ts`) but historically
 * left the generated CSS — which hard-codes the same values as CSS custom properties for the
 * Svelte / CSS-only / SSR consumers — to drift. This regenerates them from the same tokens, so
 * the auto-opened token PR carries updated CSS, and a drift-guard test fails CI if a committed
 * file diverges from this output.
 *
 * Scope: bladeTheme only. These files encode a single theme (light `:root` + dark block + mobile
 * `@media`). Theme choice (blade vs neutral) is a JS prop with no DOM attribute, so a static neutral
 * block would be inert — the runtime provider already covers neutral via inline vars.
 *
 * This owns only the token-derived HEAD of each file. The hand-authored UTILITY CLASSES tail is
 * spliced back verbatim from the existing `theme.css` (it is not derivable from tokens) into
 * `theme.css` and `theme-light.css`.
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
const THEME_LIGHT_CSS_PATH = path.resolve(CURRENT_DIR, '../src/tokens/theme-light.css');
const THEME_DARK_CSS_PATH = path.resolve(CURRENT_DIR, '../src/tokens/theme-dark.css');

/**
 * Stable marker where the token-derived head ends and the hand-authored utility-class tail begins.
 * `@layer blade;` (line 4, no brace) is intentionally NOT this — the tail is the braced `@layer`.
 * The tail's source of truth is `theme.css`; `theme-light.css` receives the same tail verbatim.
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

/** `:root { … }` — global tokens + light theme tokens. Shared by `theme.css` and `theme-light.css`. */
const buildRootBlock = (): string[] => {
  const { colors, typography } = bladeTheme;

  return [
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
  ];
};

/** Dark-mode override block (colors + elevation). Shared by `theme.css` and `theme-dark.css`. */
const buildDarkBlock = (): string[] => {
  const { colors } = bladeTheme;

  return [
    DARK_SELECTOR_BLOCK,
    '',
    ...emitColors(colorsToCSSVariables(colors.onDark), ' - Dark'),
    '',
    '  /* Elevation - Dark */',
    ...emitMap(elevationToCSSVariables(elevation.onDark)),
    '}',
  ];
};

/** Mobile typography `@media` override. Theme-agnostic — lives with the light/base stylesheet. */
const buildMobileBlock = (): string[] => {
  const { typography } = bladeTheme;

  return [
    '/* Mobile Typography Overrides */',
    '@media (max-width: 767px) {',
    '  :root {',
    ...emitMobileDiffs('size', '--font-size', typography.onDesktop, typography.onMobile),
    '',
    ...emitMobileDiffs('lineHeights', '--line-height', typography.onDesktop, typography.onMobile),
    '  }',
    '}',
  ];
};

/** Header + `@layer blade;` preamble for the split files. `theme.css` keeps its historical header. */
const buildPreamble = (title: string, extraNotes: string[] = []): string[] => [
  `/* Blade Design System CSS Variables — ${title} */`,
  '/* Generated from theme and global tokens */',
  ...extraNotes,
  '',
  '@layer blade;',
  '',
];

/** Read the hand-authored utility-class tail verbatim from `theme.css` (its source of truth). */
const readUtilityTail = (): string => {
  const existing = fs.readFileSync(THEME_CSS_PATH, 'utf8');
  const tailIndex = existing.indexOf(TAIL_MARKER);
  if (tailIndex === -1) {
    throw new Error(
      `Could not find the utility-class tail marker "${TAIL_MARKER}" in ${THEME_CSS_PATH}. ` +
        `The generator only owns the token-derived head; the tail must be preserved verbatim.`,
    );
  }
  return existing.slice(tailIndex);
};

/**
 * Prettier-format a token-derived head so the output matches the committed (formatted) files
 * byte-for-byte.
 */
const formatHead = (head: string[], filepath: string): string => {
  // Format only the token-derived head. The tail is spliced in verbatim afterward — running it
  // through prettier would reformat the utility classes' indentation, which
  // `theme-css-layers.test.ts` asserts on exactly (e.g. unindented `@layer blade {\n/* ... */`).
  const prettierConfig = prettier.resolveConfig.sync(filepath) ?? {};
  const formatted = prettier.format(head.join('\n'), {
    ...prettierConfig,
    parser: 'css',
    filepath,
  });
  return formatted.replace(/\n+$/, '\n');
};

/**
 * Build `theme.css` (combined light + dark) from the token sources. Output is byte-identical to
 * the historical single-file layout so existing consumers see no churn.
 */
export const generateThemeCSS = (): string => {
  const head: string[] = [
    '/* Blade Design System CSS Variables */',
    '/* Generated from theme and global tokens */',
    '',
    '@layer blade;',
    '',
    ...buildRootBlock(),
    '',
    ...buildDarkBlock(),
    '',
    ...buildMobileBlock(),
    '',
  ];

  return `${formatHead(head, THEME_CSS_PATH)}${readUtilityTail()}`;
};

/**
 * Build `theme-light.css` — everything except the dark block: globals, light theme tokens,
 * mobile typography overrides and the utility classes. Light-only consumers import just this
 * file and skip the dark override payload entirely.
 */
export const generateThemeLightCSS = (): string => {
  const head: string[] = [
    ...buildPreamble('Light (base)', [
      '/* Base stylesheet: global tokens, light theme, utility classes. */',
      '/* Import theme-dark.css alongside this file to support dark mode. */',
    ]),
    ...buildRootBlock(),
    '',
    ...buildMobileBlock(),
    '',
  ];

  return `${formatHead(head, THEME_LIGHT_CSS_PATH)}${readUtilityTail()}`;
};

/**
 * Build `theme-dark.css` — the additive dark-mode override block only (dark colors + elevation).
 * It carries no globals or utility classes; it must be imported after/with `theme-light.css`.
 */
export const generateThemeDarkCSS = (): string => {
  const head: string[] = [
    ...buildPreamble('Dark (additive override)', [
      '/* Override block only — import theme-light.css first for globals and utilities. */',
    ]),
    ...buildDarkBlock(),
    '',
  ];

  return formatHead(head, THEME_DARK_CSS_PATH);
};

export const THEME_CSS_PATHS = {
  combined: THEME_CSS_PATH,
  light: THEME_LIGHT_CSS_PATH,
  dark: THEME_DARK_CSS_PATH,
} as const;
