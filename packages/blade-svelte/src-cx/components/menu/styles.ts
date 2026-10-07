import type { PopoverClasses } from '../popover/styles';
import { POPUP_GAP, POPUP_ITEM, POPUP_ROWS, POPUP_SURFACE } from '../shared/popup-list';
import type { PopupItemClasses } from '../shared/popup-list';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/**
 * The popover's parts, plus the items inside the panel: the shared popup
 * list look (`shared/popup-list`), which Dropdown wears too. The active row
 * carries `data-active` (focus stays on the menu); disabled is keyed from JS.
 */
export interface MenuClasses extends PopoverClasses, PopupItemClasses {}

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

// Blade's DropdownOverlay + ActionList menu and Blade DSL's Menu: the shared
// popup surface, which is also the list — the rows sit straight in it.
export const resolveMenu: MenuStyleResolver<MenuStyleProps> = () => ({
  root: 'relative inline-flex',
  panel: `${POPUP_SURFACE} ${POPUP_ROWS}`,
  ...POPUP_ITEM,
  nativePlacement: NATIVE_PLACEMENT,
  gap: POPUP_GAP,
});
