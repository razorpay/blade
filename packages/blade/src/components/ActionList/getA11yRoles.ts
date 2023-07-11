import type { DropdownProps } from '~components/Dropdown';
import type { DropdownContextType } from '~components/Dropdown/useDropdown';
import { isReactNative } from '~utils';

/**
 * is the role supposed to be `menu`
 */
export const isRoleMenu = (
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): boolean => {
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

export const getActionListSectionRole = (): 'group' | undefined => {
  if (isReactNative()) {
    return undefined;
  }

  return 'group';
};

export const getSeparatorRole = (): 'separator' | undefined => {
  if (isReactNative()) {
    // Its not really announced so ignoring it in native.
    return undefined;
  }

  return 'separator';
};

export const getActionListItemWrapperRole = (
  hasFooterAction: boolean,
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): 'listbox' | undefined => {
  if (isRoleMenu(dropdownTriggerer)) {
    return undefined;
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
