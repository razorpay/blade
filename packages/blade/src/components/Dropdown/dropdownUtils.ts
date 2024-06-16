/*
 * This content is licensed according to the W3C Software License at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * This software or document includes material copied from or derived from
 * https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html.
 * Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang)
 */

import type { DropdownContextType, OptionsType } from './useDropdown';
import { dropdownComponentIds } from './dropdownComponentIds';
import type { SpacingValueType } from '~components/Box/BaseBox';

export type SelectActionsType =
  | 'Close'
  | 'CloseSelect'
  | 'First'
  | 'Last'
  | 'Next'
  | 'Open'
  | 'PageDown'
  | 'PageUp'
  | 'Previous'
  | 'Select'
  | 'Type';

// Save a list of named combobox actions, for future readability
const SelectActions: Record<SelectActionsType, SelectActionsType> = {
  Close: 'Close',
  CloseSelect: 'CloseSelect',
  First: 'First',
  Last: 'Last',
  Next: 'Next',
  Open: 'Open',
  PageDown: 'PageDown',
  PageUp: 'PageUp',
  Previous: 'Previous',
  Select: 'Select',
  Type: 'Type',
};

/**
 * Filter an array of options against an input string
 * returns an array of options that begin with the filter string, case-independent
 *
 */
export function filterOptions(
  options: string[] = [],
  filter: string,
  exclude: string[] = [],
): string[] {
  return options.filter((option) => {
    const matches = option.toLowerCase().startsWith(filter.toLowerCase());
    return matches && !exclude.includes(option);
  });
}

/**
 * Map a keypress to action
 */
export function getActionFromKey(
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  isOpen: boolean,
  dropdownTriggerer: DropdownContextType['dropdownTriggerer'],
): SelectActionsType | undefined {
  if (!e) {
    return undefined;
  }

  const { altKey, ctrlKey, metaKey } = e;
  let key = '';
  if ('key' in e) {
    key = e.key;
  }
  const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' ']; // all keys that will do the default open action
  if (!key) return undefined;
  // handle opening when closed
  if (!isOpen && key && openKeys.includes(key)) {
    return SelectActions.Open;
  }

  // home and end move the selected option when open or closed
  if (key === 'Home') {
    return SelectActions.First;
  }
  if (key === 'End') {
    return SelectActions.Last;
  }

  // handle typing characters when open or closed
  if (
    key === 'Backspace' ||
    key === 'Clear' ||
    (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
  ) {
    return SelectActions.Type;
  }

  // handle keys when open
  if (isOpen) {
    if (key === 'ArrowUp' && altKey) {
      return SelectActions.CloseSelect;
    } else if (key === 'ArrowDown' && !altKey) {
      return SelectActions.Next;
    } else if (key === 'ArrowUp') {
      return SelectActions.Previous;
    } else if (key === 'PageUp') {
      return SelectActions.PageUp;
    } else if (key === 'PageDown') {
      return SelectActions.PageDown;
    } else if (key === 'Escape') {
      return SelectActions.Close;
    } else if (
      key === 'Enter' ||
      // we ignore the spacebar select in autocomplete since hitting spacebar might be expected while typing
      (dropdownTriggerer !== dropdownComponentIds.triggers.AutoComplete &&
        dropdownTriggerer !== dropdownComponentIds.triggers.SearchInput &&
        key === ' ')
    ) {
      return SelectActions.CloseSelect;
    }
  }

  return undefined;
}

/**
 * Return the index of an option from an array of options, based on a search string
 *
 * if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
 **/
export function getIndexByLetter(options: string[], filter: string, startIndex = 0): number {
  const orderedOptions = [...options.slice(startIndex), ...options.slice(0, startIndex)];
  const firstMatch = filterOptions(orderedOptions, filter)[0];
  const allSameLetter = (array: string[]): boolean => array.every((letter) => letter === array[0]);

  // first check if there is an exact match for the typed string
  if (firstMatch) {
    return options.indexOf(firstMatch);
  }

  // if the same letter is being repeated, cycle through first-letter matches
  else if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(orderedOptions, filter[0]);
    return options.indexOf(matches[0]);
  }

  // if no matches, return -1
  else {
    return -1;
  }
}

/**
 * This functions makes sure the optionsIndex is not going out of possible options
 */
export function getUpdatedIndex({
  currentIndex,
  maxIndex,
  actionType,
}: {
  currentIndex: number;
  maxIndex: number;
  actionType: SelectActionsType;
}): number {
  // On PageUP or PageDown, we jump focus by 10 items or to the first or last element
  // Details: https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html#:~:text=PageUp,to%20last%20option).
  const pageSize = 10;

  switch (actionType) {
    case SelectActions.First:
      return 0;
    case SelectActions.Last:
      return maxIndex;
    case SelectActions.Previous:
      return Math.max(0, currentIndex - 1);
    case SelectActions.Next:
      return Math.min(maxIndex, currentIndex + 1);
    case SelectActions.PageUp:
      return Math.max(0, currentIndex - pageSize);
    case SelectActions.PageDown:
      return Math.min(maxIndex, currentIndex + pageSize);
    default:
      return currentIndex;
  }
}

/**
 * Checks if the given HTML element is visible on screen
 */
export function isElementVisibleOnScreen(element: HTMLElement): boolean {
  const bounding = element.getBoundingClientRect();

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Checks if element is visible inside the given container
 */
function isElementVisible(container: HTMLElement, element: HTMLElement): boolean {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  const isVerticalVisible =
    elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom;

  return isVerticalVisible;
}

/**
 * Checks if the dropdown is scrollable
 */
export function isScrollable(element: HTMLElement): boolean {
  return element && element.clientHeight < element.scrollHeight;
}

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
export const performAction = (
  action: SelectActionsType,
  payload: {
    event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>;
  },
  actions: ActionsType,
): boolean => {
  const { event } = payload;

  switch (action) {
    case SelectActions.Last:
    // @ts-expect-error: intentional fallthrough, ignoring the warning
    case SelectActions.First:
      actions.setIsOpen(true);
    // intentional fallthrough
    case SelectActions.Next:
    case SelectActions.Previous:
    case SelectActions.PageUp:
    case SelectActions.PageDown:
      event.preventDefault();
      actions.onOptionChange(action);
      return true;
    case SelectActions.CloseSelect:
      event.preventDefault();
      actions.selectCurrentOption();
      return true;
    case SelectActions.Close:
      event.preventDefault();
      actions.close();
      return true;
    case SelectActions.Type:
      actions.onComboType(event.key, action);
      return true;
    case SelectActions.Open:
      event.preventDefault();
      actions.setIsOpen(true);
      return true;

    default:
      break;
  }

  return false;
};

/**
 * When options list is large, it can have a scrollbar.
 *
 * This function ensures the active option is always in the viewport
 */
export const ensureScrollVisiblity = (
  newActiveIndex: number,
  containerElement: HTMLElement | null,
  options: string[],
): void => {
  // ensure the new option is in view
  if (containerElement) {
    if (isScrollable(containerElement)) {
      const optionEl = containerElement.querySelectorAll<HTMLElement>(
        '[role="option"], [role="menuitem"]',
      );
      // Making sure its the same element as the one from options state
      if (
        newActiveIndex >= 0 &&
        optionEl[newActiveIndex].dataset.value === options[newActiveIndex]
      ) {
        const activeElement = optionEl[newActiveIndex];

        if (!isElementVisible(containerElement, activeElement)) {
          activeElement.scrollIntoView({ inline: 'nearest' });
        }

        if (!isElementVisibleOnScreen(optionEl[newActiveIndex])) {
          activeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }
};

/**
 * value that is set in the actual form input
 */
export const makeInputValue = (selectedIndices: number[], options: OptionsType): string => {
  if (options.length === 0) {
    return '';
  }
  return selectedIndices.map((selectedIndex) => options[selectedIndex]?.value).join(', ');
};

/**
 * Value that is displayed inside the select field
 */
export const makeInputDisplayValue = (selectedIndices: number[], options: OptionsType): string => {
  // When no item is selected or no item is present
  if (options.length === 0 || selectedIndices.length === 0) {
    return '';
  }

  // When one item is selected, we display that item's title in input
  if (selectedIndices.length === 1) {
    return options[selectedIndices[0]]?.title;
  }

  // When more than one item is selected, we display the count of items
  return `${selectedIndices.length} items selected`;
};

export type DropdownPosition = {
  top?: SpacingValueType;
  bottom?: SpacingValueType;
  left?: SpacingValueType;
  right?: SpacingValueType;
};
