/*
 * This content is licensed according to the W3C Software License at
 * https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 * Derived from
 * https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html.
 *
 * Web-only Svelte port of React `dropdownUtils.ts`. React event types are
 * replaced with DOM events; React Native branches and the TreeView-specific
 * display override are stripped.
 */
import type { DropdownOption } from './types';
import type { DropdownTriggerer } from './dropdownComponentIds';

export type SelectActionsType =
  | 'Close'
  | 'CloseSelect'
  | 'Expand'
  | 'Collapse'
  | 'First'
  | 'Last'
  | 'Next'
  | 'Open'
  | 'PageDown'
  | 'PageUp'
  | 'Previous'
  | 'Select'
  | 'Type';

const SelectActions: Record<SelectActionsType, SelectActionsType> = {
  Close: 'Close',
  CloseSelect: 'CloseSelect',
  Expand: 'Expand',
  Collapse: 'Collapse',
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
 * Filter an array of options against an input string. Returns options that begin
 * with the filter string (case-insensitive), excluding any in `exclude`.
 */
export function filterOptions(
  options: string[] = [],
  filter: string,
  exclude: string[] = [],
): string[] {
  return options.filter((option) => {
    const matches = String(option).toLowerCase().startsWith(filter.toLowerCase());
    return matches && !exclude.includes(option);
  });
}

/**
 * Map a keypress to a combobox action.
 */
export function getActionFromKey(
  e: MouseEvent | KeyboardEvent,
  isOpen: boolean,
  _dropdownTriggerer: DropdownTriggerer,
): SelectActionsType | undefined {
  if (!e) {
    return undefined;
  }

  const { altKey, ctrlKey, metaKey } = e;
  let key = '';
  if ('key' in e) {
    key = e.key;
  }
  const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];
  if (!key) return undefined;
  if (!isOpen && key && openKeys.includes(key)) {
    return SelectActions.Open;
  }

  if (key === 'Home') {
    return SelectActions.First;
  }
  if (key === 'End') {
    return SelectActions.Last;
  }

  if (
    key === 'Backspace' ||
    key === 'Clear' ||
    (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)
  ) {
    return SelectActions.Type;
  }

  if (isOpen) {
    if (key === 'ArrowUp' && altKey) {
      return SelectActions.CloseSelect;
    } else if (key === 'ArrowDown' && !altKey) {
      return SelectActions.Next;
    } else if (key === 'ArrowUp') {
      return SelectActions.Previous;
    } else if (key === 'ArrowRight' && !altKey) {
      return SelectActions.Expand;
    } else if (key === 'ArrowLeft' && !altKey) {
      return SelectActions.Collapse;
    } else if (key === 'PageUp') {
      return SelectActions.PageUp;
    } else if (key === 'PageDown') {
      return SelectActions.PageDown;
    } else if (key === 'Escape') {
      return SelectActions.Close;
    } else if (key === 'Enter' || key === ' ') {
      return SelectActions.CloseSelect;
    }
  }

  return undefined;
}

/**
 * Return the index of an option based on a search string. Cycles through
 * first-letter matches when the same letter is repeated (e.g. "aaa").
 */
export function getIndexByLetter(options: string[], filter: string, startIndex = 0): number {
  const orderedOptions = [...options.slice(startIndex), ...options.slice(0, startIndex)];
  const firstMatch = filterOptions(orderedOptions, filter)[0];
  const allSameLetter = (array: string[]): boolean => array.every((letter) => letter === array[0]);

  if (firstMatch) {
    return options.indexOf(firstMatch);
  } else if (allSameLetter(filter.split(''))) {
    const matches = filterOptions(orderedOptions, filter[0]);
    return options.indexOf(matches[0]);
  }
  return -1;
}

/**
 * Clamp the option index within bounds for the given action.
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

/** Whether the element is fully within the viewport. */
export function isElementVisibleOnScreen(element: HTMLElement): boolean {
  const bounding = element.getBoundingClientRect();
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/** Whether `element` is vertically visible inside `container`. */
function isElementVisible(container: HTMLElement, element: HTMLElement): boolean {
  const containerRect = container.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  return elementRect.top >= containerRect.top && elementRect.bottom <= containerRect.bottom;
}

/** Whether the element has a vertical scrollbar. */
export function isScrollable(element: HTMLElement): boolean {
  return Boolean(element) && element.clientHeight < element.scrollHeight;
}

type ActionsType = {
  setIsOpen: (isOpen: boolean) => void;
  close: () => void;
  selectCurrentOption: (event?: KeyboardEvent) => void;
  onOptionChange: (action: SelectActionsType) => void;
  onComboType: (letter: string, action: SelectActionsType) => void;
  onTreeExpandCollapse?: (action: SelectActionsType) => void;
};

/**
 * Perform the keydown action. Returns `true` when the action was handled.
 */
export const performAction = (
  action: SelectActionsType,
  payload: { event: KeyboardEvent },
  actions: ActionsType,
): boolean => {
  const { event } = payload;

  switch (action) {
    case SelectActions.First:
    case SelectActions.Last:
      actions.setIsOpen(true);
      event.preventDefault();
      actions.onOptionChange(action);
      return true;
    case SelectActions.Next:
    case SelectActions.Previous:
    case SelectActions.PageUp:
    case SelectActions.PageDown:
      event.preventDefault();
      actions.onOptionChange(action);
      return true;
    case SelectActions.CloseSelect:
      event.preventDefault();
      actions.selectCurrentOption(event);
      return true;
    case SelectActions.Expand:
    case SelectActions.Collapse:
      if (actions.onTreeExpandCollapse) {
        event.preventDefault();
        actions.onTreeExpandCollapse(action);
        return true;
      }
      return false;
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
 * Scroll the active option into view within its scroll container.
 */
export const ensureScrollVisiblity = (
  newActiveIndex: number,
  containerElement: HTMLElement | null,
  options: string[],
): void => {
  if (!containerElement) return;
  if (!isScrollable(containerElement)) return;

  const optionEl = containerElement.querySelectorAll<HTMLElement>(
    '[role="option"], [role="menuitem"], [role="menuitemcheckbox"]',
  );
  if (newActiveIndex >= 0 && optionEl[newActiveIndex]?.dataset.value === options[newActiveIndex]) {
    const activeElement = optionEl[newActiveIndex];
    if (!isElementVisible(containerElement, activeElement)) {
      activeElement.scrollIntoView({ inline: 'nearest' });
    }
    if (!isElementVisibleOnScreen(optionEl[newActiveIndex])) {
      activeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

/** Value set in the underlying form input. */
export const makeInputValue = (selectedIndices: number[], options: DropdownOption[]): string => {
  if (options.length === 0) {
    return '';
  }
  return selectedIndices.map((selectedIndex) => options[selectedIndex]?.value).join(', ');
};

/** Value displayed inside the trigger after selection. */
export const makeInputDisplayValue = (
  selectedIndices: number[],
  options: DropdownOption[],
): string => {
  if (options.length === 0 || selectedIndices.length === 0) {
    return '';
  }
  if (selectedIndices.length === 1) {
    return options[selectedIndices[0]]?.title ?? '';
  }
  return `${selectedIndices.length} items selected`;
};
