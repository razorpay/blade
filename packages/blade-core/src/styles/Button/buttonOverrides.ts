import { deriveColorStates, isOverrideColorValue } from '../../utils/colorOverrides';

/**
 * ## Option B — `styleOverrides` → element-scoped CSS variables (recommended core)
 *
 * The Button CSS module is already parameterized by element-scoped custom
 * properties (`--btn-accent-bg-default/highlighted/disabled`, `--btn-content-color`,
 * `--btn-radius`). `resolveButtonOverrides` maps a bounded, typed override object
 * onto exactly those variables and *derives* the interaction states the consumer
 * never sends (the centerpiece of v1 — see instance-level-styling-proposal §4
 * Option B and §7).
 *
 * Because the override feeds the *same* variables the `:hover` / `:active` /
 * `:focus-visible` / `[disabled]` rules already read, state variants keep working —
 * making this a strict improvement over the flat-inline-style Option A.
 *
 * `blade-core` stays framework-agnostic: this is a pure function returning a
 * `Record<cssVarName, value>`. The Svelte (or future React) layer just spreads
 * the result onto the element's `style`.
 *
 * **v1 vocabulary is an opaque hex passthrough.** Values are emitted to CSS as-is;
 * no token validation happens here (sanitization stays in the consumer). Token
 * support / explicit per-state keys are a later-phase extension of this same
 * resolver (proposal §7 "Later phases").
 */
export type ButtonStyleOverrides = Partial<{
  /**
   * Base background color (an opaque CSS color string, e.g. a 6-digit hex from
   * checkout's `getUIConfigColor`). Hover/active/focus and disabled backgrounds
   * are derived from this automatically.
   */
  backgroundColor: string;
  /**
   * Text + icon color (opaque CSS color string).
   */
  textColor: string;
  /**
   * Base border color. Highlighted border is derived from this.
   */
  borderColor: string;
  /**
   * Border radius (any CSS length, e.g. `24px`). Maps to the `--btn-radius` seam.
   */
  borderRadius: string;
}>;

/**
 * Element-scoped CSS variable names the Button module consumes. Centralized here
 * so the CSS seam and the resolver never drift.
 */
export const BUTTON_OVERRIDE_VARS = {
  bgDefault: '--btn-accent-bg-default',
  bgHighlighted: '--btn-accent-bg-highlighted',
  bgDisabled: '--btn-accent-bg-disabled',
  borderDefault: '--btn-accent-border-default',
  borderHighlighted: '--btn-accent-border-highlighted',
  contentColor: '--btn-content-color',
  radius: '--btn-radius',
} as const;

/**
 * Resolve a Button override object into element-scoped CSS variables, synthesizing
 * the hover/active/focus and disabled states from the single base color.
 *
 * @example
 * resolveButtonOverrides({ backgroundColor: '#1a59ff', textColor: '#ffffff' })
 * // {
 * //   '--btn-accent-bg-default':     '#1a59ff',
 * //   '--btn-accent-bg-highlighted': '#0042e6',   // derived (darken)
 * //   '--btn-accent-bg-disabled':    'rgba(26,89,255,0.5)', // derived (alpha)
 * //   '--btn-content-color':         '#ffffff',
 * // }
 */
export function resolveButtonOverrides(
  overrides: ButtonStyleOverrides | undefined,
): Record<string, string> {
  if (!overrides) return {};
  const vars: Record<string, string> = {};

  if (isOverrideColorValue(overrides.backgroundColor)) {
    const states = deriveColorStates(overrides.backgroundColor);
    vars[BUTTON_OVERRIDE_VARS.bgDefault] = states.default;
    vars[BUTTON_OVERRIDE_VARS.bgHighlighted] = states.highlighted;
    vars[BUTTON_OVERRIDE_VARS.bgDisabled] = states.disabled;
  }

  if (isOverrideColorValue(overrides.borderColor)) {
    const states = deriveColorStates(overrides.borderColor);
    vars[BUTTON_OVERRIDE_VARS.borderDefault] = states.default;
    vars[BUTTON_OVERRIDE_VARS.borderHighlighted] = states.highlighted;
  }

  if (isOverrideColorValue(overrides.textColor)) {
    vars[BUTTON_OVERRIDE_VARS.contentColor] = overrides.textColor;
  }

  if (isOverrideColorValue(overrides.borderRadius)) {
    vars[BUTTON_OVERRIDE_VARS.radius] = overrides.borderRadius;
  }

  return vars;
}

/**
 * Serialize a CSS-variable map into an inline `style` string. Shared helper so
 * every component/option emits overrides the same way.
 *
 * @example
 * styleObjectToString({ '--btn-content-color': '#fff' }) // '--btn-content-color:#fff'
 */
export function styleObjectToString(vars: Record<string, string | number>): string {
  return Object.entries(vars)
    .map(([key, value]) => `${key}:${value}`)
    .join(';');
}
