import { resolveButtonOverrides, type ButtonStyleOverrides } from '../Button/buttonOverrides';
import { resolveCardOverrides, type CardStyleOverrides } from '../Card/cardOverrides';

/**
 * ## Option D — Slot-keyed theme map (component "parts" theming, à la shadcn/Stitches)
 *
 * A single declarative object keyed by `component → slotKey → overrides`, consumed
 * via context. A component opts into a slot with `themeKey="primaryCta"` and the
 * map is looked up to produce the same CSS variables Option B emits.
 *
 * Included for evaluation. The proposal's verdict (instance-level-styling-proposal
 * §4 Option D, §6): **reject the centralized cross-repo slot taxonomy** (it invents
 * a naming dimension that must be documented and synced across Blade + checkout) but
 * **keep the parts-addressing instinct**, folded into Option B as nested keys.
 *
 * Note this is explicitly a *sugar layer, not a mechanism*: it still needs Option
 * B's carrier underneath — `resolveSlotTheme` just routes a slot's overrides into
 * the per-component resolver, so the var output is byte-identical to calling
 * `resolveButtonOverrides` / `resolveCardOverrides` directly.
 */
export type SlotThemeMap = {
  button?: Record<string, ButtonStyleOverrides>;
  card?: Record<string, CardStyleOverrides>;
};

export type SlotThemeComponent = keyof SlotThemeMap;

/**
 * Look up a component+slot in the theme map and resolve it to CSS variables using
 * the matching per-component resolver (Option B carrier).
 *
 * @example
 * const map = { button: { primaryCta: { backgroundColor: '#1a59ff' } } };
 * resolveSlotTheme(map, 'button', 'primaryCta');
 * // -> same vars as resolveButtonOverrides({ backgroundColor: '#1a59ff' })
 */
export function resolveSlotTheme(
  themeMap: SlotThemeMap | undefined,
  component: SlotThemeComponent,
  slotKey: string | undefined,
): Record<string, string> {
  if (!themeMap || !slotKey) return {};

  if (component === 'button') {
    return resolveButtonOverrides(themeMap.button?.[slotKey]);
  }
  if (component === 'card') {
    return resolveCardOverrides(themeMap.card?.[slotKey]);
  }

  return {};
}
