/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 */

import type { DropdownContextType } from './Dropdown';
import type { FormInputOnKeyDownEvent } from '~components/Form/FormTypes';

/**
 * This software or document includes material copied from or derived from
 * https://www.w3.org/WAI/ARIA/apg/example-index/combobox/combobox-select-only.html.
 * Copyright © 2022 W3C® (MIT, ERCIM, Keio, Beihang)
 */

// Save a list of named combobox actions, for future readability
const SelectActions = {
  Close: 0,
  CloseSelect: 1,
  First: 2,
  Last: 3,
  Next: 4,
  Open: 5,
  PageDown: 6,
  PageUp: 7,
  Previous: 8,
  Select: 9,
  Type: 10,
};

/*
 * Helper functions
 */

// filter an array of options against an input string
// returns an array of options that begin with the filter string, case-independent
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

// map a key press to an action
export function getActionFromKey(
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  isOpen: boolean,
): number | undefined {
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
    } else if (key === 'Enter' || key === ' ') {
      return SelectActions.CloseSelect;
    }
  }

  return undefined;
}

// return the index of an option from an array of options, based on a search string
// if the filter is multiple iterations of the same letter (e.g "aaa"), then cycle through first-letter matches
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

// get an updated option index after performing an action
export function getUpdatedIndex(currentIndex: number, maxIndex: number, action: number): number {
  const pageSize = 10; // used for pageup/pagedown

  switch (action) {
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

// check if element is visible in browser view port
export function isElementVisibleOnScreen(element: HTMLElement): boolean {
  const bounding = element.getBoundingClientRect();

  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

// check if an element is currently scrollable
export function isScrollable(element: HTMLElement): boolean {
  return element && element.clientHeight < element.scrollHeight;
}

type ActionsType = {
  setIsOpen: DropdownContextType['setIsOpen'];
  selectCurrentOption: () => void;
  onOptionChange: (action: number) => void;
  onComboType: (letter: string, action: number) => void;
};
export const performAction = (
  action: number,
  e: FormInputOnKeyDownEvent,
  actions: ActionsType,
): boolean => {
  const { event } = e;

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
    // @ts-expect-error: intentional fallthrough, ignoring the warning
    case SelectActions.CloseSelect:
      event.preventDefault();
      actions.selectCurrentOption();
    // intentional fallthrough
    case SelectActions.Close:
      event.preventDefault();
      actions.setIsOpen(false);
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

// /*
//  * Select Component
//  * Accepts a combobox element and an array of string options
//  */

// Select.prototype.createOption = function (optionText, index) {
//   const optionEl = document.createElement('div');
//   optionEl.setAttribute('role', 'option');
//   optionEl.id = `${this.idBase}-${index}`;
//   optionEl.className = index === 0 ? 'combo-option option-current' : 'combo-option';
//   optionEl.setAttribute('aria-selected', `${index === 0}`);
//   optionEl.innerText = optionText;

//   // optionEl.addEventListener("click", (event) => {
//   //   event.stopPropagation();
//   //   this.onOptionClick(index);
//   // });
//   // optionEl.addEventListener("mousedown", this.onOptionMouseDown.bind(this));

//   return optionEl;
// };

// Select.prototype.onComboBlur = function () {
//   console.log('Blurrrr', this.ignoreBlur);
//   // do not do blur action if ignoreBlur flag has been set
//   if (this.ignoreBlur) {
//     this.ignoreBlur = false;
//     return;
//   }

//   // select current option and close
//   if (this.open) {
//     this.selectOption(this.activeIndex);
//     this.updateMenuState(false, false);
//   }
// };

// Select.prototype.onOptionChange = function (index) {
//   // update state
//   this.activeIndex = index;

//   // update aria-activedescendant
//   this.comboEl.setAttribute('aria-activedescendant', `${this.idBase}-${index}`);

//   // update active option styles
//   const options = this.el.querySelectorAll('[role=option]');
//   [...options].forEach((optionEl) => {
//     optionEl.classList.remove('option-current');
//   });
//   options[index].classList.add('option-current');

//   // ensure the new option is in view
//   if (isScrollable(this.listboxEl)) {
//     maintainScrollVisibility(options[index], this.listboxEl);
//   }

//   // ensure the new option is visible on screen
//   // ensure the new option is in view
//   if (!isElementInView(options[index])) {
//     options[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//   }
// };

// Select.prototype.onOptionClick = function (index) {
//   console.log('OPTION CLICKEDD', index);
//   this.onOptionChange(index);
//   this.selectOption(index);
//   this.updateMenuState(false);
// };

// Select.prototype.onOptionMouseDown = function () {
//   // Clicking an option will cause a blur event,
//   // but we don't want to perform the default keyboard blur action
//   this.ignoreBlur = true;
// };

// Select.prototype.selectOption = function (index) {
//   // update state
//   this.activeIndex = index;

//   // update displayed value
//   const selected = this.options[index];
//   this.comboEl.innerHTML = selected;

//   // update aria-selected
//   const options = this.el.querySelectorAll('[role=option]');
//   [...options].forEach((optionEl) => {
//     optionEl.setAttribute('aria-selected', 'false');
//   });
//   options[index].setAttribute('aria-selected', 'true');
// };

// Select.prototype.updateMenuState = function (open, callFocus = true) {
//   if (this.open === open) {
//     return;
//   }

//   // update state
//   this.open = open;

//   // update aria-expanded and styles
//   this.comboEl.setAttribute('aria-expanded', `${open}`);
//   open ? this.el.classList.add('open') : this.el.classList.remove('open');

//   // update activedescendant
//   const activeID = open ? `${this.idBase}-${this.activeIndex}` : '';
//   this.comboEl.setAttribute('aria-activedescendant', activeID);

//   if (activeID === '' && !isElementInView(this.comboEl)) {
//     this.comboEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
//   }

//   // move focus back to the combobox, if needed
//   callFocus && this.comboEl.focus();
// };

// export default Select;

/**
 *
 * TODO:
 *
 * - Implement onOptionClick and other functions (also think of multiselect)
 * - [x] Implement typeahead
 * - Multiselect!!!!!
 */
