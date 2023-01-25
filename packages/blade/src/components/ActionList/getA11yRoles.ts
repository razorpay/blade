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

export const getActionListRole = (
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): 'menu' | 'listbox' => {
  if (isRoleMenu(dropdownTriggerer)) {
    return 'menu';
  }

  return 'listbox';
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
