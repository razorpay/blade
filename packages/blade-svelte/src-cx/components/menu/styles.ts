import type { PopoverClasses } from '../popover/styles';
import { NATIVE_PLACEMENT } from '../tooltip/styles';

/**
 * The popover's parts, plus the items inside the panel. The active item is
 * the focused one, so `focus:` styles it; disabled is keyed from JS.
 */
export interface MenuClasses extends PopoverClasses {
  item: string;
  /** The item's title: one line, 8px clear of the item's end. */
  itemTitle: string;
  itemState: Record<'enabled' | 'disabled', string>;
  itemIcon: string;
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

// Blade's DropdownOverlay + ActionList menu (Dropdown/DropdownOverlay.web.tsx,
// ActionList/styles, BaseMenu/BaseMenuItem): the overlay 240 to 400px wide, 8px
// from its trigger, on the popup surface — 12px radius, the medium blur, the
// 1px rim drawn inside over the raised shadow — with 8px round the rows. A
// row: 8px radius, 8px padding (4px below 768px), 2px above and below, the
// leading icon 8px before the title and the title 8px clear of the end;
// transparent at rest, `interactive.background.gray.default` under the
// pointer (here: focus, as the active row is the focused one), no pressed
// fill; the title `interactive.text.gray.normal`, `…disabled` when disabled.
// Focus from the keys: Blade's 4px `surface.border.primary.muted` ring, 1px out.
// It opens sliding 8px down as it fades in, over `quick`.
export const resolveMenu: MenuStyleResolver<MenuStyleProps> = () => ({
  root: 'relative inline-flex',
  panel:
    'pointer-events-auto absolute z-50 flex min-w-[240px] max-w-[400px] flex-col rounded-medium bg-popup-gray-moderate p-2 text-surface-gray-normal shadow-dropdown backdrop-blur-medium outline-none transition-all duration-quick ease-entrance data-[state=closed]:-translate-y-2 data-[state=closed]:opacity-0 motion-reduce:transition-none',
  item:
    'my-0.5 flex w-full items-center gap-2 rounded-small border-none bg-transparent p-1 m:p-2 text-left font-text text-100 leading-100 outline-none',
  itemState: {
    enabled:
      'cursor-pointer text-interactive-gray-normal focus:bg-interactive-gray-default focus-visible:outline-solid focus-visible:outline-4 focus-visible:outline-offset-1 focus-visible:outline-surface-primary-muted',
    disabled: 'cursor-not-allowed text-interactive-gray-disabled',
  },
  itemTitle: 'min-w-0 flex-1 truncate pr-2',
  // No colour of its own: Blade's item icon is `interactive.icon.gray.normal`
  // (`…disabled` when disabled), the same values as the item's text.
  itemIcon: 'flex shrink-0 items-center',
  nativePlacement: NATIVE_PLACEMENT,
  gap: 8,
});
