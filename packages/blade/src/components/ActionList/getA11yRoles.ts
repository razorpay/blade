import type { DropdownProps } from '~components/Dropdown';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import type { DropdownContextType } from '~components/Dropdown/useDropdown';
import { isReactNative } from '~utils';

/**
 * is the role supposed to be `menu`
 */
export const isRoleMenu = (
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): boolean => {
  return (
    isReactNative() ||
    (dropdownTriggerer !== dropdownComponentIds.triggers.SelectInput &&
      dropdownTriggerer !== dropdownComponentIds.triggers.AutoComplete)
  );
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
  if (isReactNative()) {
    return 'menu';
  }

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
