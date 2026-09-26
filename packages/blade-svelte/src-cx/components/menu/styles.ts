import { POPOVER_PANEL, type PopoverClasses } from '../popover/styles';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/**
 * The popover's parts, plus the items inside the panel. The active item is
 * the focused one, so `focus:` styles it; disabled is keyed from JS.
 */
export interface MenuClasses extends PopoverClasses {
  item: string;
  itemState: Record<'enabled' | 'disabled', string>;
  itemIcon: string;
}

export type MenuStyleResolver<P> = (props: P) => MenuClasses;

/** One look: no style axes yet. */
export type MenuStyleProps = Record<never, never>;
export const MENU_AXES = {} as const;

// Ported from account-management's AccountPopover menu. The active item is
// the focused one (roving focus), so `focus:` is its look, mouse or keys.
export const resolveMenu: MenuStyleResolver<MenuStyleProps> = () => ({
  root: 'relative inline-flex',
  panel: `${POPOVER_PANEL} flex min-w-40 max-w-80 flex-col p-1`,
  // Blade's menu item (BaseMenu StyledMenuItemContainer + BaseMenuItem):
  // transparent at rest, `interactive.background.gray.default` under the
  // pointer (here: focus), the focus ring from the keyboard, no pressed
  // fill; title `interactive.text.gray.normal`, `…disabled` when disabled.
  item: 'flex w-full items-center gap-2 rounded-small border-none bg-transparent px-3 py-2 text-left font-text text-100 leading-100 outline-none',
  itemState: {
    enabled:
      'cursor-pointer text-interactive-gray-normal focus:bg-interactive-gray-default focus-visible:shadow-focus',
    disabled: 'cursor-not-allowed text-interactive-gray-disabled',
  },
  // No colour of its own: Blade's item icon is `interactive.icon.gray.normal`
  // (`…disabled` when disabled), the same values as the item's text.
  itemIcon: 'flex shrink-0 items-center',
  nativePlacement: NATIVE_PLACEMENT,
  gap: 4,
});
