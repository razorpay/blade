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
import { isReactNative } from '~utils';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

type OptionsType = { title: string; value: string; href?: string }[];

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
  hasFooterAction: boolean;
  setHasFooterAction: (value: boolean) => void;
  recalculateOptions: () => void;
  optionsRecalculateToggle: boolean;
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
  hasFooterAction: false,
  setHasFooterAction: noop,
  optionsRecalculateToggle: false,
  recalculateOptions: noop,
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
  onSelectClick: React.MouseEventHandler<HTMLInputElement>;
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

  type SelectOptionType = (
    index: number,
    properties?: {
      closeOnSelection?: boolean;
    },
  ) => void;
  /**
   * Marks the given index as selected.
   *
   * In single select, it also closes the menu.
   * In multiselect, it keeps the menu open for more selections
   */
  const selectOption: SelectOptionType = (
    index,
    properties = {
      closeOnSelection: true,
    },
  ) => {
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
  const onSelectClick: React.MouseEventHandler<HTMLInputElement> = (_e) => {
    setIsOpen(!isOpen);
  };

  /**
   * Blur handler on combobox. Also handles the selection logic when user moves focus
   */
  const onSelectBlur = (): void => {
    if (rest.hasFooterAction) {
      // When Footer has action buttons, we ignore the blur (by setting shouldIgnoreBlur to true in onSelectKeyDown)
      // And we remove the active item (by setting it to -1) so that we can shift focus on action buttons
      setActiveIndex(-1);
    }

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
    if (!isReactNative()) {
      rest.selectInputRef.current?.focus();
    }
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
  const onSelectKeydown = (e: { event: React.KeyboardEvent<HTMLInputElement> }): void => {
    if (e.event.key === 'Tab' && rest.hasFooterAction) {
      // When footer has Action Buttons, we ignore the blur event so that we can move focus to action item than bluring out of dropdown
      setShouldIgnoreBlur(true);
    }

    const actionType = getActionFromKey(e.event, isOpen);

    if (actionType) {
      performAction(actionType, e, {
        setIsOpen,
        onOptionChange,
        onComboType,
        selectCurrentOption: () => {
          selectOption(activeIndex);
          if (rest.hasFooterAction) {
            rest.selectInputRef.current?.focus();
          }

          const anchorLink = options[activeIndex].href;
          if (anchorLink) {
            window.location.href = anchorLink;
            if (window.top) {
              window.top.location.href = anchorLink;
            }
          }
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
