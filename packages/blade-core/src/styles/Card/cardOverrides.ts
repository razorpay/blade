import { deriveColorStates, isOverrideColorValue } from '../../utils/colorOverrides';

/**
 * ## Option B extended to internal parts (axis E) — Card
 *
 * Card is the *composite* counterpart to Button: its visible surface lives on a
 * **child** element (`.cardSurface`), and v1 demonstrates the "seam audit"
 * (instance-level-styling-proposal §4.5). Before any part can be overridden, that
 * part's target property must be expressed as a CSS variable on the right element.
 * `card.module.css` was given additive, backward-compatible seams:
 *
 *   --card-surface-bg        (gradient stop → flat fill when set)
 *   --card-surface-border-color
 *
 * `resolveCardOverrides` proves the "bounded, per-component **parts** vocabulary"
 * that is the slice of Option D we keep — addressing parts via *nested keys*
 * (`surface: { ... }`) rather than a centralized cross-repo slot taxonomy.
 *
 * The carrier is identical to Button's: a pure `Record<cssVarName, value>` that the
 * framework layer spreads as inline CSS vars. The only difference is *which element*
 * the vars must land on — here, the surface child (handled by the component).
 */

/** Overrides for the Card's surface part (the `.cardSurface` child element). */
export type CardSurfaceOverrides = Partial<{
  backgroundColor: string;
  borderColor: string;
}>;

/**
 * Card's bounded, typed override object. Keys are *named parts*, each exposing only
 * the properties whose CSS seam exists. Growth = add a part key + the matching
 * `var(--part-prop, <default>)` seam in the CSS module (proposal §4.5
 * "Extensibility contract").
 */
export type CardStyleOverrides = Partial<{
  surface: CardSurfaceOverrides;
}>;

export const CARD_OVERRIDE_VARS = {
  surfaceBg: '--card-surface-bg',
  surfaceBorderColor: '--card-surface-border-color',
} as const;

/**
 * Resolve the Card override object into CSS variables destined for the surface
 * child element.
 *
 * @example
 * resolveCardOverrides({ surface: { backgroundColor: '#ffffff', borderColor: '#1a59ff' } })
 * // { '--card-surface-bg': '#ffffff', '--card-surface-border-color': '#1a59ff' }
 */
export function resolveCardOverrides(
  overrides: CardStyleOverrides | undefined,
): Record<string, string> {
  if (!overrides) return {};
  const vars: Record<string, string> = {};

  const surface = overrides.surface;
  if (surface) {
    if (isOverrideColorValue(surface.backgroundColor)) {
      vars[CARD_OVERRIDE_VARS.surfaceBg] = surface.backgroundColor;
    }
    if (isOverrideColorValue(surface.borderColor)) {
      // Derive a slightly darker selected/hover border for parity with Button,
      // even though Card only consumes `default` today — keeps the resolver shape
      // consistent and ready for state-aware parts later.
      const states = deriveColorStates(surface.borderColor);
      vars[CARD_OVERRIDE_VARS.surfaceBorderColor] = states.default;
    }
  }

  return vars;
}
