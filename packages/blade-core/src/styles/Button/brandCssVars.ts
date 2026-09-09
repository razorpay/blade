export type BrandCssVarsOptions = {
  /** Brand fill color — hex, rgb/hsl, or `var(--merchant-*)` reference */
  bg: string;
  /** Hover / active / focus fill. Default: `color-mix(in srgb, bg 80%, black)` */
  highlighted?: string;
  /** Disabled fill. Default: `color-mix(in srgb, bg 18%, transparent)` */
  disabled?: string;
};

export type AccentBrand = 'primary' | 'positive' | 'negative';

const defaultHighlighted = (bg: string): string => `color-mix(in srgb, ${bg} 80%, black)`;

const defaultDisabled = (bg: string): string => `color-mix(in srgb, ${bg} 18%, transparent)`;

const resolveBrandCssVarValues = ({
  bg,
  highlighted,
  disabled,
}: BrandCssVarsOptions): { bg: string; highlighted: string; disabled: string } => ({
  bg,
  highlighted: highlighted ?? defaultHighlighted(bg),
  disabled: disabled ?? defaultDisabled(bg),
});

const getInteractiveAccentCssVars = (
  accent: AccentBrand,
  opts: BrandCssVarsOptions,
): Record<string, string> => {
  const { bg, highlighted, disabled } = resolveBrandCssVarValues(opts);

  return {
    [`--interactive-background-${accent}-default`]: bg,
    [`--interactive-background-${accent}-highlighted`]: highlighted,
    [`--interactive-background-${accent}-disabled`]: disabled,
    [`--interactive-border-${accent}-default`]: bg,
    [`--interactive-border-${accent}-highlighted`]: highlighted,
  };
};

/**
 * CSS custom properties safe to set on `Button` `styleOverride.root` for filled primary CTAs.
 * Override these — not painted `background-color` — so Blade layered `:hover` / `:focus-visible` /
 * `[disabled]` rules keep working.
 *
 * **Stroke / border width:** filled primary uses inset `box-shadow`, not `border-width`.
 * Checkout "stroke" on a filled CTA cannot be expressed as a simple border override; use
 * `variant="secondary"` for an outlined CTA, or accept the inset shadow frame.
 */
export const SAFE_FILLED_BUTTON_ROOT_TOKEN_OVERRIDES = [
  '--interactive-background-primary-default',
  '--interactive-background-primary-highlighted',
  '--interactive-background-primary-disabled',
  '--interactive-border-primary-default',
  '--interactive-border-primary-highlighted',
  '--interactive-background-positive-default',
  '--interactive-background-positive-highlighted',
  '--interactive-background-positive-disabled',
  '--interactive-border-positive-default',
  '--interactive-border-positive-highlighted',
  '--interactive-background-negative-default',
  '--interactive-background-negative-highlighted',
  '--interactive-background-negative-disabled',
  '--interactive-border-negative-default',
  '--interactive-border-negative-highlighted',
  '--btn-progress-surface-backing',
] as const;

/**
 * Token bundle for a merchant-branded filled primary CTA (`color="primary"` +
 * `variant="primary"`). Maps to the same cluster as `Button.stories.svelte` brand playground
 * and `createTheme({ brandColor })` primary interactive tokens.
 *
 * Pair with `background-image: none` on the same node to drop the radial highlight without
 * painting over stateful `background-color`.
 *
 * @example
 * ```ts
 * const tokens = getPrimaryBrandCssVars({ bg: 'var(--merchant-cta-bg)' });
 * // Apply tokens on styleOverride.root class or ancestor inline style, plus:
 * // background-image: none;
 * ```
 */
export const getPrimaryBrandCssVars = (opts: BrandCssVarsOptions): Record<string, string> =>
  getInteractiveAccentCssVars('primary', opts);

/**
 * Accent-aware token bundle for filled primary-variant buttons (`primary`, `positive`, `negative`).
 * For `primary`, delegates to {@link getPrimaryBrandCssVars}.
 */
export const getAccentBrandCssVars = (
  accent: AccentBrand,
  opts: BrandCssVarsOptions,
): Record<string, string> => {
  if (accent === 'primary') {
    return getPrimaryBrandCssVars(opts);
  }

  return getInteractiveAccentCssVars(accent, opts);
};
