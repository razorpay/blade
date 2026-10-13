import type { PopoverClasses } from '../popover/styles';
import { MENU_DIVIDER, MENU_ROWS, MENU_SURFACE, POPUP_GAP, POPUP_ITEM } from '../shared/popup-list';
import type { PopupItemClasses } from '../shared/popup-list';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/**
 * The popover's parts, plus the items inside the panel: the shared popup
 * list look (`shared/popup-list`), which Dropdown wears too. The active row
 * carries `data-active` (focus stays on the menu); disabled is keyed from JS.
 */
export interface MenuClasses extends PopoverClasses, PopupItemClasses {
  /** MenuDivider: Figma's separator row, a hairline 1px in from the panel's edges. */
  divider: string;
}

export type MenuStyleResolver<P> = (props: P) => MenuClasses;

/** What a Menu hands its MenuItems. */
export interface MenuShared {
  classes: MenuClasses;
  /** The Menu's `onSelect`, for an item with a `value`. */
  onSelect: (value: unknown) => void;
}

/** One look: no style axes yet. */
export type MenuStyleProps = Record<never, never>;
export const MENU_AXES = {} as const;

// Blade's DropdownOverlay + ActionList menu and Blade DSL's Menu: Figma's
// Menu panel (12px round), which is also the list — the rows sit straight
// in it, 2px apart.
export const resolveMenu: MenuStyleResolver<MenuStyleProps> = () => ({
  root: 'relative inline-flex',
  panel: `${MENU_SURFACE} ${MENU_ROWS}`,
  ...POPUP_ITEM,
  divider: MENU_DIVIDER,
  nativePlacement: NATIVE_PLACEMENT,
  gap: POPUP_GAP,
});
