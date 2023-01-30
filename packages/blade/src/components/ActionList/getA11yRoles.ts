import type { DropdownProps } from '~components/Dropdown';
import type { DropdownContextType } from '~components/Dropdown/useDropdown';
import { isReactNative } from '~utils';

/**
 * is the role supposed to be `menu`
 */
export const isRoleMenu = (
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): boolean => {
  // @TODO: check this logic once we introduce new triggerer. This may not stand true.
  return isReactNative() || dropdownTriggerer !== 'SelectInput';
};

/**
 * We switch between accessibility of `dialog` with `listbox` and buttons as a child and just `listbox` when there are action items on footer
 *
 * Not announcing `dialog` helps not throw users off for simple dropdowns.
 *
 * and having `dialog` is neccessary when there are buttons on footer
 *
 * `menu` role is required for react native.
 */
export const getActionListContainerRole = (
  hasFooterAction: boolean,
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): 'dialog' | 'listbox' | 'menu' => {
  if (hasFooterAction) {
    return 'dialog';
  }

  if (isRoleMenu(dropdownTriggerer)) {
    return 'menu';
  }

  return 'listbox';
};

export const getActionListItemWrapperRole = (
  hasFooterAction: boolean,
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): 'listbox' | 'menu' | undefined => {
  if (isRoleMenu(dropdownTriggerer)) {
    return 'menu';
  }

  if (hasFooterAction) {
    return 'listbox';
  }

  return undefined;
};

export const getActionListItemRole = (
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
  href?: string,
  selectionType?: DropdownProps['selectionType'],
): 'menuitem' | 'menuitemcheckbox' | 'option' | 'link' => {
  if (href) {
    return 'link';
  }

  if (isRoleMenu(dropdownTriggerer)) {
    if (selectionType === 'multiple') {
      return 'menuitemcheckbox';
    }

    return 'menuitem';
  }

  return 'option';
};
