import { DropdownProps } from '../Dropdown';
import { DropdownContextType } from '../Dropdown/useDropdown';
/**
 * is the role supposed to be `menu`
 */
export declare const isRoleMenu: (dropdownTriggerer: DropdownContextType['dropdownTriggerer']) => boolean;
/**
 * We switch between accessibility of `dialog` with `listbox` and buttons as a child and just `listbox` when there are action items on footer
 *
 * Not announcing `dialog` helps not throw users off for simple dropdowns.
 *
 * and having `dialog` is neccessary when there are buttons on footer
 *
 * `menu` role is required for react native.
 */
export declare const getActionListContainerRole: (hasFooterAction: boolean, dropdownTriggerer: DropdownContextType['dropdownTriggerer']) => 'dialog' | 'listbox' | 'menu';
export declare const getActionListSectionRole: () => 'group' | undefined;
export declare const getActionListItemWrapperRole: (hasFooterAction: boolean, dropdownTriggerer: DropdownContextType['dropdownTriggerer']) => 'listbox' | undefined;
export declare const getActionListItemRole: (dropdownTriggerer: DropdownContextType['dropdownTriggerer'], href?: string, selectionType?: DropdownProps['selectionType']) => 'menuitem' | 'menuitemcheckbox' | 'option' | 'link';
