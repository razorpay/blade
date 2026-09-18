/**
 * Generates `packages/blade-core/tailwind/preset.cjs` from the token sources.
 *
 * This is the Tailwind counterpart of `scripts/generateThemeCSS.ts`. Both derive from the same
 * token modules (`~tokens/global`, `~tokens/theme/bladeTheme`) via `tokenToCSSVariable`, so the
 * Tailwind preset and `theme.css` can never drift: every utility the preset registers resolves to
 * a `var(--…)` that `theme.css` (and BladeProvider's runtime overrides) defines.
 *
 * The preset is `theme.extend`-only + `corePlugins.preflight: false` so a consumer's own scales and
 * global reset are never clobbered (library best practice). Token keys are namespaced/semantic
 * (`spacing-4`, `interactive-background-primary-default`) so Blade utilities can never collide with a
 * consumer's default Tailwind scale (`p-4`, `bg-red-500`).
 *
 * A drift-guard test (`tailwind/__tests__/preset-drift.test.ts`) fails CI if the committed
 * `preset.cjs` diverges from this output. Run `yarn generate:tailwind-preset` to regenerate.
 *
 * The hard-case Tailwind plugin (Button's `--btn-accent-*` var bundles, radial-highlight `::before`,
 * focus/box-shadow stacks, `@keyframes`) lives in the hand-authored `tailwind/plugin.cjs`; the
 * generated preset `require()`s it. `plugin.cjs` is NOT generated because it is not derivable from
 * tokens — it is authored logic that references the same `var(--…)` names.
 */
import { fileURLToPath } from 'url';
import prettier from 'prettier';

import bladeTheme from '~tokens/theme/bladeTheme';
import { border, breakpoints, spacing, motion } from '~tokens/global';
import { colorsToCSSVariables, typographyToCSSVariables } from '~utils/themeToCSSVariables';

/** Path used only to locate the repo prettier config for formatting the generated output. */
const PRETTIER_FILEPATH = fileURLToPath(import.meta.url);

/** `--spacing-4` → `var(--spacing-4)`; the Tailwind key is the var name minus the `--`. */
const toVarRef = (cssVarName: string): string => `var(${cssVarName})`;

/**
 * Turn a flat `{ '--x-y': value }` CSS-var map into a Tailwind theme map `{ 'x-y': 'var(--x-y)' }`.
 * We intentionally discard the raw value and reference the CSS variable so runtime dark/brand
 * theming (which rewrites the variable, not the class) flows through untouched.
 */
const cssVarMapToThemeMap = (map: Record<string, string>): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const cssVarName of Object.keys(map)) {
    const key = cssVarName.replace(/^--/, '');
    out[key] = toVarRef(cssVarName);
  }
  return out;
};

/**
 * Build a `{ key: 'var(--<prefix>-key)' }` map from a token object's keys.
 * `keyPrefix` (default '') is prepended to the Tailwind utility key itself — used to NAMESPACE the
 * numeric spacing scale (`spacing-4` → `p-spacing-4`) so Blade never clobbers a consumer's `p-4`.
 * The CSS-var name is always `--<cssVarPrefix>-<rawKey>` regardless of `keyPrefix`.
 */
const tokenKeysToVarMap = (
  tokenObject: Record<string | number, unknown>,
  cssVarPrefix: string,
  keyPrefix = '',
): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const key of Object.keys(tokenObject)) {
    out[`${keyPrefix}${key}`] = toVarRef(`--${cssVarPrefix}-${key}`);
  }
  return out;
};

type PresetTheme = {
  colors: Record<string, string>;
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  borderWidth: Record<string, string>;
  opacity: Record<string, string>;
  screens: Record<string, string>;
  fontFamily: Record<string, string[]>;
  fontSize: Record<string, string>;
  fontWeight: Record<string, string>;
  lineHeight: Record<string, string>;
  letterSpacing: Record<string, string>;
  transitionDuration: Record<string, string>;
  transitionDelay: Record<string, string>;
  transitionTimingFunction: Record<string, string>;
};

/**
 * Build the `theme.extend` maps. Colors come from the light-mode slice only — the KEYS (var names)
 * are mode-agnostic; only the VALUES differ per mode, and those live in `theme.css`, not here.
 */
export const buildPresetTheme = (): PresetTheme => {
  const { colors, typography } = bladeTheme;
  const desktopTypography = typography.onDesktop;

  const colorMap = cssVarMapToThemeMap(colorsToCSSVariables(colors.onLight));

  // Spacing keys are NAMESPACED (`spacing-4`) → utilities read `p-spacing-4`, `mx-spacing-2`, so
  // Blade never overrides a consumer's default `p-4`. The non-linear scale (spacing.2 = 4px) also
  // makes reusing Tailwind's `p-2` (8px) unsafe.
  const spacingMap = tokenKeysToVarMap(spacing as Record<string, unknown>, 'spacing', 'spacing-');

  const borderRadiusMap = tokenKeysToVarMap(
    border.radius as Record<string, unknown>,
    'border-radius',
  );
  const borderWidthMap = tokenKeysToVarMap(border.width as Record<string, unknown>, 'border-width');

  // Opacity: the existing `utilities.module.css` opacity classes are LITERAL percentages
  // (`.opacity-50 { opacity: 0.5 }`), deliberately NOT the Blade opacity *tokens* (0.06, 0.09 …).
  // 0/25/50/75/100 already exist in Tailwind's default opacity scale; only 56 and 64 are missing,
  // so we add just those two as literals (additive, no collision, preserves current semantics).
  const opacityMap: Record<string, string> = { '56': '0.56', '64': '0.64' };

  // Screens use the raw px breakpoint values (Tailwind resolves media queries at build time — it
  // cannot key a `@media` off a CSS variable). Breakpoints are mode-agnostic global tokens.
  const screensMap: Record<string, string> = {};
  for (const [key, value] of Object.entries(breakpoints)) {
    screensMap[key] = `${value}px`;
  }

  // Typography var map → split by prefix into the Tailwind theme buckets.
  const typographyVars = typographyToCSSVariables(desktopTypography);
  const fontFamily: Record<string, string[]> = {};
  const fontSize: Record<string, string> = {};
  const fontWeight: Record<string, string> = {};
  const lineHeight: Record<string, string> = {};
  const letterSpacing: Record<string, string> = {};
  for (const cssVarName of Object.keys(typographyVars)) {
    const key = cssVarName.replace(/^--/, '');
    if (key.startsWith('font-family-')) {
      fontFamily[key.replace('font-family-', '')] = [toVarRef(cssVarName)];
    } else if (key.startsWith('font-size-')) {
      fontSize[key.replace('font-size-', '')] = toVarRef(cssVarName);
    } else if (key.startsWith('font-weight-')) {
      fontWeight[key.replace('font-weight-', '')] = toVarRef(cssVarName);
    } else if (key.startsWith('line-height-')) {
      lineHeight[key.replace('line-height-', '')] = toVarRef(cssVarName);
    } else if (key.startsWith('letter-spacing-')) {
      letterSpacing[key.replace('letter-spacing-', '')] = toVarRef(cssVarName);
    }
  }

  const transitionDuration = tokenKeysToVarMap(
    motion.duration as Record<string, unknown>,
    'duration',
  );
  const transitionDelay = tokenKeysToVarMap(motion.delay as Record<string, unknown>, 'delay');
  const transitionTimingFunction = tokenKeysToVarMap(
    motion.easing as Record<string, unknown>,
    'easing',
  );

  return {
    colors: colorMap,
    spacing: spacingMap,
    borderRadius: borderRadiusMap,
    borderWidth: borderWidthMap,
    opacity: opacityMap,
    screens: screensMap,
    fontFamily,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    transitionDuration,
    transitionDelay,
    transitionTimingFunction,
  };
};

/**
 * Emit the full `preset.cjs` file content. Prettier-formatted so the committed file matches
 * byte-for-byte (the drift test compares strings).
 */
export const generatePreset = (): string => {
  const theme = buildPresetTheme();

  const header = `/**
 * Blade Design System — Tailwind v3 preset (GENERATED — do not edit by hand).
 *
 * Regenerate with \`yarn generate:tailwind-preset\` (source: \`tailwind/generatePreset.ts\`).
 * A CI drift test (\`tailwind/__tests__/preset-drift.test.ts\`) fails if this file is edited or stale.
 *
 * Every value here resolves to a \`var(--…)\` defined by \`@razorpay/blade-core/tokens/theme.css\`
 * (light \`:root\` + \`[data-blade-color-scheme='dark']\`) and by BladeProvider's runtime brand
 * overrides — so a consumer's runtime dark/brand theming flows through unchanged.
 *
 * Usage (any Tailwind v3 app):
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('@razorpay/blade-core/tailwind/preset')],
 *     content: [
 *       './src/**\\/*.{js,ts,svelte}',
 *       './node_modules/@razorpay/blade-svelte/dist/**\\/*.js',
 *       './node_modules/@razorpay/blade-core/dist/**\\/*.js',
 *     ],
 *   };
 */
const plugin = require('./plugin.cjs');
const { bladeSafelist } = require('./safelist.cjs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // A library must never inject Tailwind's global reset into a consumer's page.
  corePlugins: { preflight: false },
  // Dark mode keys off the attribute BladeProvider sets (not \`.dark\` or \`prefers-color-scheme\`).
  darkMode: ['selector', "[data-blade-color-scheme='dark']"],
  safelist: bladeSafelist,
  theme: {
    extend: ${JSON.stringify(theme, null, 6)},
  },
  plugins: [plugin],
};
`;

  const prettierConfig = prettier.resolveConfig.sync(PRETTIER_FILEPATH) ?? {};
  return prettier.format(header, {
    ...prettierConfig,
    parser: 'babel',
  });
};

/**
 * Build the safelist array: every Blade class a consumer's JIT scanner might MISS because it is
 * composed at runtime rather than written as a literal string. The two runtime sources are:
 *   1. `getStyledPropsClasses` — builds `mx-spacing-${n}`, `self-${x}`, `display-${x}` etc. from props.
 *   2. `styleOverride` / dynamic color selection — can reference any semantic color utility.
 * CVA base/variant/compound values are literals (scannable) so they do NOT need safelisting, but the
 * full semantic color set is included for robustness against runtime-composed overrides.
 */
export const buildSafelist = (): string[] => {
  const theme = buildPresetTheme();
  const classes = new Set<string>();

  const spacingKeys = Object.keys(theme.spacing); // 'spacing-0' .. 'spacing-11'
  // Directional spacing utilities the styled-props resolver can emit at runtime.
  const spacingPrefixes = [
    'p',
    'px',
    'py',
    'pt',
    'pb',
    'pl',
    'pr',
    'm',
    'mx',
    'my',
    'mt',
    'mb',
    'ml',
    'mr',
    'gap',
    'gap-x',
    'gap-y',
    'top',
    'right',
    'bottom',
    'left',
  ];
  for (const key of spacingKeys) {
    for (const prefix of spacingPrefixes) {
      classes.add(`${prefix}-${key}`);
    }
  }

  // Flex / alignment self utilities.
  for (const v of ['auto', 'start', 'end', 'center', 'stretch', 'baseline']) {
    classes.add(`self-${v}`);
  }
  for (const v of ['auto', 'start', 'end', 'center', 'stretch']) {
    classes.add(`justify-self-${v}`);
  }
  for (const v of ['auto', 'start', 'end', 'center', 'stretch']) {
    classes.add(`place-self-${v}`);
  }
  classes.add('flex-wrap');
  classes.add('flex-nowrap');
  classes.add('flex-wrap-reverse');

  // Display.
  for (const v of [
    'block',
    'inline-block',
    'inline',
    'flex',
    'inline-flex',
    'grid',
    'hidden',
    'contents',
  ]) {
    classes.add(v);
  }
  // Visibility.
  classes.add('visible');
  classes.add('invisible');
  // Position.
  for (const v of ['static', 'relative', 'absolute', 'fixed', 'sticky']) {
    classes.add(v);
  }

  // Full semantic color set: bg-/text-/border- for every color token.
  for (const colorKey of Object.keys(theme.colors)) {
    classes.add(`bg-${colorKey}`);
    classes.add(`text-${colorKey}`);
    classes.add(`border-${colorKey}`);
  }

  return Array.from(classes).sort();
};

/**
 * Emit `safelist.cjs` content (generated, prettier-formatted, drift-guarded like the preset).
 */
export const generateSafelist = (): string => {
  const safelist = buildSafelist();
  const content = `/**
 * Blade Design System — Tailwind safelist (GENERATED — do not edit by hand).
 *
 * Regenerate with \`yarn generate:tailwind-preset\` (source: \`tailwind/generatePreset.ts\`).
 * Enumerates every Blade class composed at RUNTIME (styled-props, dynamic color selection) that a
 * JIT scanner cannot see as a literal. Re-exported by the preset so any consumer inherits it.
 */
module.exports = { bladeSafelist: ${JSON.stringify(safelist, null, 2)} };
`;
  const prettierConfig = prettier.resolveConfig.sync(PRETTIER_FILEPATH) ?? {};
  return prettier.format(content, {
    ...prettierConfig,
    parser: 'babel',
  });
};
