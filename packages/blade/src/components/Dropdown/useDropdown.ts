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
type SelectOptionType = (
  index: number,
  properties?: {
    closeOnSelection?: boolean;
    callOnChange?: boolean;
    isControlledSelection?: boolean;
  },
) => void;

type DropdownContextType = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  /**
   * contains the indexes of selected items
   */
  selectedIndices: number[];
  setSelectedIndices: (value: number[]) => void;
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

  changeHandlerDependencyProp: number;
  setChangeHandlerDependencyProp: (value: number) => void;
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
  shouldIgnoreBlurAnimation: false,
  setShouldIgnoreBlurAnimation: noop,
  hasFooterAction: false,
  setHasFooterAction: noop,
  hasLabelOnLeft: false,
  setHasLabelOnLeft: noop,
  isKeydownPressed: false,
  setIsKeydownPressed: noop,
  changeHandlerDependencyProp: 0,
  setChangeHandlerDependencyProp: noop,
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

  /**
   * Selects the passed option
   */
  selectOption: SelectOptionType;
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
    changeHandlerDependencyProp,
    setChangeHandlerDependencyProp,
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
  const selectOption: SelectOptionType = (
    index,
    { closeOnSelection = true, callOnChange = true } = {
      closeOnSelection: true,
      callOnChange: true,
      isControlledSelection: false,
    },
  ) => {
    if (index < 0 || index > options.length - 1) {
      return;
    }

    if (selectionType === 'multiple') {
      if (selectedIndices.includes(index)) {
        // remove existing item
        console.log('deselecting ', options[index]);
        const existingItemIndex = selectedIndices.indexOf(index);
        setSelectedIndices([
          ...selectedIndices.slice(0, existingItemIndex),
          ...selectedIndices.slice(existingItemIndex + 1),
        ]);
      } else {
        console.log('selecting ', options[index]);
        setSelectedIndices([...selectedIndices, index]);
      }
    } else {
      setSelectedIndices([index]);
    }

    if (activeIndex !== index) {
      setActiveIndex(index);
    }

    if (callOnChange) {
      setChangeHandlerDependencyProp(changeHandlerDependencyProp + 1);
    }

    if (closeOnSelection && selectionType !== 'multiple') {
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
    selectOption,
    changeHandlerDependencyProp,
    setChangeHandlerDependencyProp,
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
    options,
    value: makeInputValue(selectedIndices, options),
    displayValue: makeInputDisplayValue(selectedIndices, options),
    selectionType,
    ...rest,
  };
};

export { useDropdown, DropdownContext, DropdownContextType, OptionsType };

/***
 * https://mui.com/material-ui/react-autocomplete/#controlled-states
 * https://mui.com/material-ui/react-autocomplete/#creatable
 *
 * In AutoComplete users can write anything irrespective of whether it exists in options or not.
 *
 * Having `value={['Maharashtra', 'India']}`, might suggest that select Maharashtra and India from Dropdown
 * but maybe they just wanted to write "Maharashtra, India"
 *
 * <AutoComplete value="x, y, z" />
 *
 *
 *
 */
