import { DropdownContextType, OptionsType } from './useDropdown';
import { SpacingValueType } from '../Box/BaseBox';
export type SelectActionsType = 'Close' | 'CloseSelect' | 'First' | 'Last' | 'Next' | 'Open' | 'PageDown' | 'PageUp' | 'Previous' | 'Select' | 'Type';
/**
 * Filter an array of options against an input string
 * returns an array of options that begin with the filter string, case-independent
 *
 */
export declare function filterOptions(options: string[] | undefined, filter: string, exclude?: string[]): string[];
/**
 * Map a keypress to action
 */
export declare function getActionFromKey(e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, isOpen: boolean, dropdownTriggerer: DropdownContextType['dropdownTriggerer']): SelectActionsType | undefined;
/**
 * Return the index of an option from an array of options, based on a search string
 *
 * if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
 **/
export declare function getIndexByLetter(options: string[], filter: string, startIndex?: number): number;
/**
 * This functions makes sure the optionsIndex is not going out of possible options
 */
export declare function getUpdatedIndex({ currentIndex, maxIndex, actionType, }: {
    currentIndex: number;
    maxIndex: number;
    actionType: SelectActionsType;
}): number;
/**
 * Checks if the given HTML element is visible on screen
 */
export declare function isElementVisibleOnScreen(element: HTMLElement): boolean;
/**
 * Checks if the dropdown is scrollable
 */
export declare function isScrollable(element: HTMLElement): boolean;
type ActionsType = {
    setIsOpen: DropdownContextType['setIsOpen'];
    close: DropdownContextType['close'];
    selectCurrentOption: () => void;
    onOptionChange: (action: SelectActionsType) => void;
    onComboType: (letter: string, action: SelectActionsType) => void;
};
/**
 * Performs the action when actionType is passed
 *
 * This function handles all the keydown actions.
 */
export declare const performAction: (action: SelectActionsType, payload: {
    event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>;
}, actions: ActionsType) => boolean;
/**
 * When options list is large, it can have a scrollbar.
 *
 * This function ensures the active option is always in the viewport
 */
export declare const ensureScrollVisiblity: (newActiveIndex: number, containerElement: HTMLElement | null, options: string[]) => void;
/**
 * value that is set in the actual form input
 */
export declare const makeInputValue: (selectedIndices: number[], options: OptionsType) => string;
/**
 * Value that is displayed inside the select field
 */
export declare const makeInputDisplayValue: (selectedIndices: number[], options: OptionsType) => string;
export type DropdownPosition = {
    top?: SpacingValueType;
    bottom?: SpacingValueType;
    left?: SpacingValueType;
    right?: SpacingValueType;
};
export {};
