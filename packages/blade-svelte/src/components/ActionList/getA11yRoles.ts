/**
 * Accessibility roles for the ActionList family (web-only).
 *
 * Standalone / BottomSheet usage emits list/option roles. When rendered inside a
 * `Dropdown`, callers pass `isInsideDropdown = true` so the container/item roles
 * widen to React parity (`menu`/`dialog`/`listbox` + `menuitem`/
 * `menuitemcheckbox`/`option`/`link`). No-arg callers keep the original
 * `listbox`/`option` defaults so existing standalone usage is unchanged.
 */
import type { DropdownTriggerer } from '../Dropdown/dropdownComponentIds';
import type { DropdownSelectionType } from '../Dropdown/types';

/**
 * Whether the container should behave as a `menu`. Menu triggers (Button /
 * IconButton / Link / undefined) are menus; select-style triggers
 * (`InputDropdownButton`) are listboxes.
 */
const isRoleMenu = (dropdownTriggerer: DropdownTriggerer): boolean => {
  return dropdownTriggerer !== 'InputDropdownButton';
};

/**
 * Container role. Standalone → `listbox`. Inside a Dropdown: `dialog` when the
 * overlay has footer actions, `menu` for menu triggers, else `listbox`.
 */
export function getActionListContainerRole(
  hasFooterAction: boolean = false,
  dropdownTriggerer: DropdownTriggerer = undefined,
  isInsideDropdown: boolean = false,
): 'dialog' | 'listbox' | 'menu' {
  if (!isInsideDropdown) {
    return 'listbox';
  }
  if (hasFooterAction) {
    return 'dialog';
  }
  if (isRoleMenu(dropdownTriggerer)) {
    return 'menu';
  }
  return 'listbox';
}

/**
 * Row role. `link` when navigating (`href`). Standalone → `option`. Inside a
 * Dropdown menu: `menuitemcheckbox` (multiple) / `menuitem` (single); select
 * triggers → `option`.
 */
export function getActionListItemRole(
  dropdownTriggerer: DropdownTriggerer = undefined,
  href?: string,
  selectionType?: DropdownSelectionType,
  isInsideDropdown: boolean = false,
): 'menuitem' | 'menuitemcheckbox' | 'option' | 'link' {
  if (href) {
    return 'link';
  }
  if (!isInsideDropdown) {
    return 'option';
  }
  if (isRoleMenu(dropdownTriggerer)) {
    return selectionType === 'multiple' ? 'menuitemcheckbox' : 'menuitem';
  }
  return 'option';
}

/** Section wrapper role — `group` (announces the section title as its label). */
export function getActionListSectionRole(): 'group' {
  return 'group';
}

/**
 * Section items wrapper role — `listbox` on web (mirrors React's inner listbox
 * so screen readers announce the per-group item count).
 */
export function getActionListSectionItemsRole(): 'listbox' {
  return 'listbox';
}
