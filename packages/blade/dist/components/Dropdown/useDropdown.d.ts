import { default as React } from 'react';
import { DropdownProps } from './types';
import { FormInputHandleOnKeyDownEvent } from '../Form/FormTypes';
import { ContainerElementType } from '../../utils/types';
type OptionsType = {
    title: string;
    value: string;
    onClickTrigger?: (isSelected: boolean) => void;
}[];
type DropdownContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    close: () => void;
    /**
     * contains the indexes of selected items
     */
    selectedIndices: number[];
    setSelectedIndices: (value: number[]) => void;
    /**
     * contains the indexes of selected items during controlled selection
     */
    controlledValueIndices: number[];
    setControlledValueIndices: (value: number[]) => void;
    /**
     * contains information about all the options inside actionlist
     */
    options: OptionsType;
    setOptions: (value: OptionsType) => void;
    /**
     * Filtered values for AutoComplete Inputs
     */
    filteredValues: string[];
    setFilteredValues: (values: string[]) => void;
    /** Currently active (focussed) index  */
    activeIndex: number;
    setActiveIndex: (value: number) => void;
    /** Currently active (focussed) tag  */
    activeTagIndex: number;
    setActiveTagIndex: (value: number) => void;
    /**
     * Sometimes we want to ignore the blur event to keep dropdown open but not ignore the blur animation from selectinput
     * E.g. When someone clicks on Footer, we just want to ignore the blur event and not the blur animation
     */
    shouldIgnoreBlurAnimation: boolean;
    setShouldIgnoreBlurAnimation: (value: boolean) => void;
    /** Tells you if keyboard was used. Its false by default and turns into true when keydown is called  */
    isKeydownPressed: boolean;
    setIsKeydownPressed: (value: boolean) => void;
    /** common baseId which is prepended to multiple other ids inside this dropdown  */
    dropdownBaseId: string;
    /** Which element has triggered the dropdown */
    dropdownTriggerer?: 'SelectInput' | 'DropdownButton' | 'DropdownIconButton' | 'AutoComplete' | 'DropdownLink' | 'SearchInput' | 'FilterChipSelectInput' | 'InputDropdownButton';
    /** ref of triggerer. Used to call focus in certain places */
    triggererRef: React.MutableRefObject<HTMLButtonElement | null>;
    headerAutoCompleteRef: React.MutableRefObject<HTMLButtonElement | null>;
    triggererWrapperRef: React.MutableRefObject<ContainerElementType | null>;
    actionListItemRef: React.RefObject<HTMLDivElement | null>;
    isTagDismissedRef: React.RefObject<{
        value: boolean;
    } | null>;
    visibleTagsCountRef: React.RefObject<{
        value: number;
    } | null>;
    selectionType?: DropdownProps['selectionType'];
    /** whether footer has an action item.
     * certain a11y behaviour changes happen here
     * E.g. tabbing moves focus to that action instead of outside
     */
    hasFooterAction: boolean;
    setHasFooterAction: (value: boolean) => void;
    /**
     * Apart from dropdownTriggerer prop, we also set this boolean because in BottomSheetHeader and DropdownHeader, the trigger can be Select but they can also have autocomplete inside of header
     */
    hasAutoCompleteInHeader: boolean;
    setHasAutoCompleteInHeader: (value: boolean) => void;
    /**
     * A value that can be used in dependency array to know when Dropdown value is changed.
     *
     * E.g.
     * ```ts
     * useEffect(() => {
     *  console.log('Uncontrolled value change');
     * }, [changeCallbackTriggerer])
     * ```
     */
    changeCallbackTriggerer: number;
    setChangeCallbackTriggerer: (changeCallbackTriggerer: number) => void;
    /**
     * true when SelectInput has `value` prop (when it is controlled)
     */
    isControlled: boolean;
    setIsControlled: (isControlled: boolean) => void;
};
declare const DropdownContext: React.Context<DropdownContextType>;
type UseDropdownReturnValue = DropdownContextType & {
    /**
     * Click event on combobox. Toggles the dropdown
     */
    onTriggerClick: () => void;
    /**
     * Keydown event of combobox. Handles most of the keyboard accessibility of dropdown
     */
    onTriggerKeydown: FormInputHandleOnKeyDownEvent | undefined;
    /**
     * Handles the click even on option.
     *
     * Contains the logic that selects the option, moves the focus, etc
     */
    onOptionClick: (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>, index: number) => void;
    /**
     * Removes the option with given optionsIndex
     */
    removeOption: (index: number) => void;
    /**
     * value that is used during form submissions
     */
    value: string;
    /**
     * This is the value that is displayed inside select after selection
     */
    displayValue: string;
};
/**
 * Handles almost all the functionality of dropdown.
 *
 * Returns the values from DropdownContext along with some helper functions and event handlers
 *
 */
declare const useDropdown: () => UseDropdownReturnValue;
export type { DropdownContextType, OptionsType };
export { useDropdown, DropdownContext };
