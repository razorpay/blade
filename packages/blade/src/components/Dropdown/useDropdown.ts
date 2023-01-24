import React from 'react';

import {
  ensureScrollVisiblity,
  getActionFromKey,
  getIndexByLetter,
  getUpdatedIndex,
  makeInputDisplayValue,
  makeInputValue,
  performAction,
} from './dropdownUtils';
import type { SelectActionsType } from './dropdownUtils';
import type { DropdownProps } from './Dropdown';

import type {
  FormInputHandleOnEvent,
  FormInputHandleOnKeyDownEvent,
} from '~components/Form/FormTypes';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

type OptionsType = { title: string; value: string }[];

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  selectedIndices: number[];
  setSelectedIndices: (value: number[]) => void;
  options: OptionsType;
  setOptions: (value: OptionsType) => void;
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  shouldIgnoreBlur: boolean;
  setShouldIgnoreBlur: (value: boolean) => void;
  dropdownBaseId: string;
  selectInputRef: React.RefObject<HTMLButtonElement | null>;
  actionListRef: React.RefObject<HTMLDivElement | null>;
  selectionType?: DropdownProps['selectionType'];
};

const DropdownContext = React.createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: noop,
  selectedIndices: [],
  setSelectedIndices: noop,
  options: [],
  setOptions: noop,
  activeIndex: -1,
  setActiveIndex: noop,
  shouldIgnoreBlur: false,
  setShouldIgnoreBlur: noop,
  dropdownBaseId: '',
  actionListRef: {
    current: null,
  },
  selectInputRef: {
    current: null,
  },
});

let searchTimeout: number;
// eslint-disable-next-line one-var
let searchString = '';

type UseDropdownReturnValue = DropdownContextType & {
  onSelectClick: () => void;
  onSelectKeydown: FormInputHandleOnKeyDownEvent | undefined;
  onSelectBlur: FormInputHandleOnEvent | undefined;
  onOptionClick: (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => void;
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
const useDropdown = (): UseDropdownReturnValue => {
  const {
    isOpen,
    setIsOpen,
    selectedIndices,
    setSelectedIndices,
    activeIndex,
    setActiveIndex,
    shouldIgnoreBlur,
    setShouldIgnoreBlur,
    options,
    selectionType,
    ...rest
  } = React.useContext(DropdownContext);

  /**
   * Marks the given index as selected.
   *
   * In single select, it also closes the menu.
   * In multiselect, it keeps the menu open for more selections
   */
  const selectOption = (
    index: number,
    properties: {
      closeOnSelection?: boolean;
    } = {
      closeOnSelection: true,
    },
  ): void => {
    if (index < 0 || index > options.length - 1) {
      return;
    }

    if (selectionType === 'multiple') {
      if (selectedIndices.includes(index)) {
        // remove existing item
        const existingItemIndex = selectedIndices.indexOf(index);
        setSelectedIndices([
          ...selectedIndices.slice(0, existingItemIndex),
          ...selectedIndices.slice(existingItemIndex + 1),
        ]);
      } else {
        setSelectedIndices([...selectedIndices, index]);
      }
    } else {
      setSelectedIndices([index]);
    }

    if (activeIndex !== index) {
      setActiveIndex(index);
    }

    if (properties?.closeOnSelection && selectionType !== 'multiple') {
      setIsOpen(false);
    }
  };

  /**
   * Click listener for combobox (or any triggerer of the dropdown)
   */
  const onSelectClick = (): void => {
    setIsOpen(!isOpen);
  };

  /**
   * Blur handler on combobox. Also handles the selection logic when user moves focus
   */
  const onSelectBlur = (): void => {
    if (shouldIgnoreBlur) {
      setShouldIgnoreBlur(false);
      return;
    }

    if (isOpen) {
      if (selectionType !== 'multiple') {
        selectOption(activeIndex);
      }
      setIsOpen(false);
    }
  };

  /**
   * Function that we call when we want to move focus from one option to other
   */
  const onOptionChange = (actionType: SelectActionsType, index?: number): void => {
    const max = options.length - 1;
    const newIndex = index ?? activeIndex;
    setActiveIndex(getUpdatedIndex(newIndex, max, actionType));
    const optionValues = options.map((option) => option.value);
    ensureScrollVisiblity(newIndex, rest.actionListRef.current, optionValues);
  };

  /**
   * Click handler when user clicks on any particular option.
   *
   * It
   * - changes the option focus
   * - selects that option
   * - moves focus to combobox
   */
  const onOptionClick = (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ): void => {
    const actionType = getActionFromKey(e, isOpen);
    if (typeof actionType === 'number') {
      onOptionChange(actionType, index);
    }
    selectOption(index);
    rest.selectInputRef.current?.focus();
  };

  /**
   * Function we call to handle the typeahead.
   *
   * It takes a letter, stores that letter in searchString (and clears it after timeout) to maintain a word
   *
   * Then searches for that word in options and moves focus there.
   */
  const onComboType = (letter: string, actionType: SelectActionsType): void => {
    // open the listbox if it is closed
    setIsOpen(true);

    if (typeof searchTimeout === 'number') {
      window.clearTimeout(searchTimeout);
    }

    searchTimeout = window.setTimeout(() => {
      searchString = '';
    }, 500);
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    searchString = searchString + letter;
    const optionTitles = options.map((option) => option.title);
    const searchIndex = getIndexByLetter(optionTitles, searchString, activeIndex + 1);

    // if a match was found, go to it
    if (searchIndex >= 0) {
      onOptionChange(actionType, searchIndex);
    }
    // if no matches, clear the timeout and search string
    else {
      window.clearTimeout(searchTimeout);
      searchString = '';
    }
  };

  /**
   * Keydown event of combobox. Handles most of the keyboard accessibility of dropdown
   */
  const onSelectKeydown: FormInputHandleOnKeyDownEvent = (e) => {
    const actionType = getActionFromKey(e.event, isOpen);
    if (actionType) {
      performAction(actionType, e, {
        setIsOpen,
        onOptionChange,
        onComboType,
        selectCurrentOption: () => {
          selectOption(activeIndex);
        },
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    selectedIndices,
    setSelectedIndices,
    onSelectClick,
    onSelectKeydown,
    onSelectBlur,
    onOptionClick,
    activeIndex,
    setActiveIndex,
    shouldIgnoreBlur,
    setShouldIgnoreBlur,
    options,
    value: makeInputValue(selectedIndices, options),
    displayValue: makeInputDisplayValue(selectedIndices, options),
    selectionType,
    ...rest,
  };
};

export { useDropdown, DropdownContext, DropdownContextType, OptionsType };
