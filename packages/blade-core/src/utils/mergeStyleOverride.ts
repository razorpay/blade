import type { StyleOverride } from '../styles/shared/styleOverride';

/**
 * Merges styleOverride maps left-to-right; later maps win on slot conflicts.
 *
 * Precedence: instance `styleOverride` > provider `componentConfig.styleOverride` > base styles.
 * Base (internal) classes are applied separately in components — not through this helper.
 */
export function mergeStyleOverride<Slot extends string>(
  ...overrides: Array<StyleOverride<Slot> | undefined>
): StyleOverride<Slot> {
  return Object.assign({}, ...overrides.filter(Boolean));
}
