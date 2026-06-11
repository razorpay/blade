import tinycolor from 'tinycolor2';
import type { ColorInput } from 'tinycolor2';

/**
 * v1 instance-styling vocabulary is an *opaque color passthrough*: checkout's
 * `getUIConfigColor` only ever emits a single 6-digit hex per slot (no per-state
 * values). The centerpiece of v1 is therefore *deriving* the interaction states
 * the consumer never sends — so an overridden component keeps a working
 * hover/active/focus and disabled appearance instead of dead-ending (the bug in
 * checkout's current inline-style CTAs — see instance-level-styling-proposal §1.1).
 *
 * These offsets are intentionally small and are tuned to visually approximate
 * Blade's existing `highlighted` / `disabled` token steps. They are scheme-agnostic
 * by design (checkout runs a single color scheme per session; dark-mode-aware
 * derivation is out of scope for v1 — see proposal §Non-goals).
 */

/** How much to darken the base color for the hover/active/focus state. */
export const HIGHLIGHTED_DARKEN_AMOUNT = 8;
/** Alpha applied to the base color for the disabled state. */
export const DISABLED_ALPHA = 0.5;

/**
 * Returns true when the value is a non-empty string Blade can hand to CSS as-is.
 * v1 does no format validation (security/sanitization stays in the consumer —
 * checkout already hex-validates). Empty string means "merchant did not set it",
 * so we skip it and let the token cascade keep the default.
 */
export const isOverrideColorValue = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

/**
 * Darken a color by a percentage. Falls back to the original string if tinycolor
 * cannot parse it (v1 treats values as opaque — never throw on a merchant value).
 */
export const darkenColor = (
  color: ColorInput,
  amount: number = HIGHLIGHTED_DARKEN_AMOUNT,
): string => {
  const parsed = tinycolor(color);
  if (!parsed.isValid()) {
    return String(color);
  }
  return parsed.darken(amount).toHexString();
};

/**
 * Apply an alpha channel to a color, returning an `rgba()` string. Falls back to
 * the original string if tinycolor cannot parse it.
 */
export const fadeColor = (color: ColorInput, alpha: number = DISABLED_ALPHA): string => {
  const parsed = tinycolor(color);
  if (!parsed.isValid()) {
    return String(color);
  }
  return parsed.setAlpha(alpha).toRgbString();
};

export type DerivedColorStates = {
  /** The base color, unchanged. */
  default: string;
  /** Darkened base — used for hover / active / focus. */
  highlighted: string;
  /** Faded base — used for the disabled state. */
  disabled: string;
};

/**
 * Synthesize the default / highlighted / disabled triplet from a single base
 * color. This is what makes the per-instance override *state-aware* even though
 * the consumer only provides one value.
 *
 * @example
 * deriveColorStates('#1a59ff')
 * // { default: '#1a59ff', highlighted: '#0042e6', disabled: 'rgba(26, 89, 255, 0.5)' }
 */
export const deriveColorStates = (baseColor: string): DerivedColorStates => {
  return {
    default: baseColor,
    highlighted: darkenColor(baseColor),
    disabled: fadeColor(baseColor),
  };
};

/**
 * Pick the most readable foreground (black or white) for a given background.
 * Useful as an a11y guard when a merchant sets a background but not a text color.
 * Returns undefined when the background can't be parsed.
 */
export const getReadableForeground = (
  backgroundColor: string,
  candidates: [string, string] = ['#ffffff', '#0c1117'],
): string | undefined => {
  const parsed = tinycolor(backgroundColor);
  if (!parsed.isValid()) {
    return undefined;
  }
  return tinycolor.mostReadable(backgroundColor, candidates).toHexString();
};
