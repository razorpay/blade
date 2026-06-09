import { tokenToCSSVariable } from '../../utils/tokenToCSSVariable';

/**
 * ## Option C — Scoped theme via `BladeProvider` + wrapper CSS variables (subtree)
 *
 * Instead of repainting `:root`, a `BladeProvider` re-declares the affected token
 * CSS variables on its **own wrapper element**, establishing a scoped cascade so
 * every Blade component inside inherits the override. This finally gives Svelte the
 * provider parity React has (instance-level-styling-proposal §4 Option C).
 *
 * `flattenThemeOverridesToVars` is the framework-agnostic half: it walks a partial,
 * nested token override (mirroring the `interactive`/`surface`/… token shape) and
 * flattens it into `{ '--interactive-background-primary-default': '#1a59ff', … }`
 * using the same `tokenToCSSVariable` mapping the rest of Blade uses.
 *
 * Verdict (proposal §6): C is **complementary** to B, not a substitute — great for
 * region/brand theming ("make this whole drawer festive"), too coarse for isolating
 * a single sibling instance. Both ship; pick per use case.
 */
export type ThemeOverrideTree = {
  [key: string]: string | number | ThemeOverrideTree;
};

/**
 * Recursively flatten a nested token override tree into a flat CSS-variable map.
 *
 * @example
 * flattenThemeOverridesToVars({
 *   interactive: { background: { primary: { default: '#1a59ff' } } },
 * });
 * // { '--interactive-background-primary-default': '#1a59ff' }
 */
export function flattenThemeOverridesToVars(
  overrides: ThemeOverrideTree | undefined,
  path: string[] = [],
): Record<string, string> {
  if (!overrides) return {};
  const vars: Record<string, string> = {};

  for (const [key, value] of Object.entries(overrides)) {
    const nextPath = [...path, key];
    if (value !== null && typeof value === 'object') {
      Object.assign(vars, flattenThemeOverridesToVars(value, nextPath));
    } else if (value !== undefined && value !== '') {
      const cssVar = tokenToCSSVariable(nextPath.join('.'));
      vars[cssVar] = String(value);
    }
  }

  return vars;
}
