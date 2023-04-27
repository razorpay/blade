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

import type { FormInputHandleOnKeyDownEvent } from '~components/Form/FormTypes';
import { isReactNative } from '~utils';
import type { SelectInputProps } from '~components/Input/SelectInput';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

type OptionsType = { title: string; value: string; href?: string }[];

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
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
  /** Currently active (focussed) index  */
  activeIndex: number;
  setActiveIndex: (value: number) => void;
  /** Used to ignore blur on certains events. E.g. to ignore blur of dropdown when click is inside the dropdown */
  shouldIgnoreBlur: boolean;
  setShouldIgnoreBlur: (value: boolean) => void;
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
  dropdownTriggerer?: 'SelectInput';
  /** ref of triggerer. Used to call focus in certain places */
  triggererRef: React.RefObject<HTMLButtonElement | null>;
  actionListItemRef: React.RefObject<HTMLDivElement | null>;
  selectionType?: DropdownProps['selectionType'];
  /** whether footer has an action item.
   * certain a11y behaviour changes happen here
   * E.g. tabbing moves focus to that action instead of outside
   */
  hasFooterAction: boolean;
  setHasFooterAction: (value: boolean) => void;
  /**
   * We need to know the label's position because when it is on left, the overlay takes the width of input.
   * Rest of the times, we can set 100% width
   */
  hasLabelOnLeft: boolean;
  setHasLabelOnLeft: (value: boolean) => void;

  changeCallbackTriggerer: number;
  setChangeCallbackTriggerer: (changeCallbackTriggerer: number) => void;

  isControlled: boolean;
  setIsControlled: (isControlled: boolean) => void;
};

const DropdownContext = React.createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: noop,
  selectedIndices: [],
  setSelectedIndices: noop,
  controlledValueIndices: [],
  setControlledValueIndices: noop,
  options: [],
  setOptions: noop,
  activeIndex: -1,
  setActiveIndex: noop,
  shouldIgnoreBlur: false,
  setShouldIgnoreBlur: noop,
  shouldIgnoreBlurAnimation: false,
  setShouldIgnoreBlurAnimation: noop,
  hasFooterAction: false,
  setHasFooterAction: noop,
  hasLabelOnLeft: false,
  setHasLabelOnLeft: noop,
  isKeydownPressed: false,
  setIsKeydownPressed: noop,
  changeCallbackTriggerer: 0,
  setChangeCallbackTriggerer: noop,
  isControlled: false,
  setIsControlled: noop,
  dropdownBaseId: '',
  actionListItemRef: {
    current: null,
  },
  triggererRef: {
    current: null,
  },
});

let searchTimeout: number;
let searchString = '';

type OnTriggerBlurEvent = (options: {
  name?: string;
  value?: string;
  onBlurCallback?: SelectInputProps['onBlur'];
}) => void;

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
   * Handles blur events like
   * - closing the navbar when someone clicks outside
   * - ignoring the blur for certain cases like clicks on footer
   * - selecting the option before closing if Tab is pressed
   * - ..etc
   */
  onTriggerBlur: OnTriggerBlurEvent | undefined;

  /**
   * Handles the click even on option.
   *
   * Contains the logic that selects the option, moves the focus, etc
   */
  onOptionClick: (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => void;

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
    isKeydownPressed,
    setIsKeydownPressed,
    options,
    selectionType,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    setControlledValueIndices,
    ...rest
  } = React.useContext(DropdownContext);

  type SelectOptionType = (
    index: number,
    properties?: {
      closeOnSelection?: boolean;
    },
  ) => void;

  const setIndices = (indices: number[]): void => {
    if (isControlled) {
      setControlledValueIndices(indices);
    } else {
      setSelectedIndices(indices);
    }
  };
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
        setIndices([
          ...selectedIndices.slice(0, existingItemIndex),
          ...selectedIndices.slice(existingItemIndex + 1),
        ]);
      } else {
        setIndices([...selectedIndices, index]);
      }
    } else {
      setIndices([index]);
    }

    // Triggers `onChange` on SelectInput
    setChangeCallbackTriggerer(changeCallbackTriggerer + 1);

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
  const onTriggerClick = (): void => {
    setIsOpen(!isOpen);
  };

  /**
   * Blur handler on combobox. Also handles the selection logic when user moves focus
   */
  const onTriggerBlur: OnTriggerBlurEvent = ({ name, value, onBlurCallback }) => {
    if (rest.hasFooterAction) {
      // When Footer has action buttons, we ignore the blur (by setting shouldIgnoreBlur to true in onTriggerKeyDown)
      // And we remove the active item (by setting it to -1) so that we can shift focus on action buttons
      setActiveIndex(-1);
    }

    if (shouldIgnoreBlur) {
      setShouldIgnoreBlur(false);
      return;
    }

    onBlurCallback?.({ name, value });

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
    ensureScrollVisiblity(newIndex, rest.actionListItemRef.current, optionValues);
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
      rest.triggererRef.current?.focus();
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
  const onTriggerKeydown = (e: { event: React.KeyboardEvent<HTMLInputElement> }): void => {
    if (e.event.key === 'Tab' && rest.hasFooterAction) {
      // When footer has Action Buttons, we ignore the blur event so that we can move focus to action item than bluring out of dropdown
      setShouldIgnoreBlur(true);
    }

    if (!isKeydownPressed && ![' ', 'Enter', 'Escape', 'Meta'].includes(e.event.key)) {
      // When keydown is not already pressed and its not Enter, Space, Command, or Escape key (those are generic keys and we only want to handle arrow keys or home buttons etc)
      setIsKeydownPressed(true);
    }

    const actionType = getActionFromKey(e.event, isOpen);

    if (actionType) {
      performAction(actionType, e, {
        setIsOpen,
        onOptionChange,
        onComboType,
        selectCurrentOption: () => {
          selectOption(activeIndex);
          if (rest.hasFooterAction && !isReactNative()) {
            rest.triggererRef.current?.focus();
          }

          const anchorLink = options[activeIndex]?.href;
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
    setControlledValueIndices,
    onTriggerClick,
    onTriggerKeydown,
    onTriggerBlur,
    onOptionClick,
    activeIndex,
    setActiveIndex,
    shouldIgnoreBlur,
    setShouldIgnoreBlur,
    isKeydownPressed,
    setIsKeydownPressed,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    options,
    value: makeInputValue(selectedIndices, options),
    displayValue: makeInputDisplayValue(selectedIndices, options),
    selectionType,
    ...rest,
  };
};

export { useDropdown, DropdownContext, DropdownContextType, OptionsType };
