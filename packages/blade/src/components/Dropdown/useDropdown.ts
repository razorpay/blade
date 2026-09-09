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
import type { DropdownProps } from './types';

import { dropdownComponentIds } from './dropdownComponentIds';
import type { FormInputHandleOnKeyDownEvent } from '~components/Form/FormTypes';
import { isReactNative, isBrowser } from '~utils';
import type { ContainerElementType } from '~utils/types';
import { fireNativeEvent } from '~utils/fireNativeEvent';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

type OptionsType = {
  title: string;
  value: string;
  onClickTrigger?: (isSelected: boolean) => void;
}[];

/**
 * Controller published by TreeView when it is rendered as Dropdown overlay content.
 *
 * All tree-specific behaviour inside Dropdown is gated on this being present, so
 * ActionList (and any other overlay content) paths stay behaviourally identical
 */
type TreeViewDropdownControllerType = {
  /**
   * Option indices of rows that are currently traversable (not hidden under a collapsed branch).
   * Used for visibility-aware keyboard traversal (same idea as AutoComplete's filteredValues)
   */
  getVisibleOptionIndices: () => number[];
  /**
   * ArrowRight: expand the active collapsed branch, or move to its first child
   */
  onArrowRightKeydown: (activeIndex: number) => void;
  /**
   * ArrowLeft: collapse the active expanded branch, or move to its parent
   */
  onArrowLeftKeydown: (activeIndex: number) => void;
  /**
   * Returns true when the tree handled the selection itself
   * (branch cascade toggle in multiple selection / load-more activation).
   * Returning false falls through to the default selectOption path
   */
  handleOptionSelect: (index: number, properties?: { key?: string }) => boolean;
  /**
   * Values of the topmost fully-selected branches, included in the trigger's onChange payload
   */
  getSelectedGroups: (selectedIndices: number[]) => string[];
  /**
   * Smallest describing set for the trigger display (D5)
   */
  getDisplayOverride: (selectedIndices: number[]) => { label: string; count: number } | undefined;
};

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
  dropdownTriggerer?:
    | 'SelectInput'
    | 'DropdownButton'
    | 'DropdownIconButton'
    | 'AutoComplete'
    | 'DropdownLink'
    | 'SearchInput'
    | 'FilterChipSelectInput'
    | 'InputDropdownButton';

  /** ref of triggerer. Used to call focus in certain places */
  triggererRef: React.MutableRefObject<HTMLButtonElement | null>;
  headerAutoCompleteRef: React.MutableRefObject<HTMLButtonElement | null>;
  triggererWrapperRef: React.MutableRefObject<ContainerElementType | null>;
  actionListItemRef: React.RefObject<HTMLDivElement | null>;
  isTagDismissedRef: React.RefObject<{ value: boolean } | null>;
  visibleTagsCountRef: React.RefObject<{ value: number } | null>;

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

  /**
   * Set by TreeView when it is rendered as the overlay content. null for every other
   * overlay content (ActionList, Menu, custom slots)
   */
  treeViewControllerRef: React.MutableRefObject<TreeViewDropdownControllerType | null>;
};

const DropdownContext = React.createContext<DropdownContextType>({
  isOpen: false,
  setIsOpen: noop,
  close: noop,
  selectedIndices: [],
  setSelectedIndices: noop,
  controlledValueIndices: [],
  setControlledValueIndices: noop,
  options: [],
  setOptions: noop,
  filteredValues: [],
  setFilteredValues: noop,
  activeIndex: -1,
  setActiveIndex: noop,
  activeTagIndex: -1,
  setActiveTagIndex: noop,
  shouldIgnoreBlurAnimation: false,
  setShouldIgnoreBlurAnimation: noop,
  hasFooterAction: false,
  setHasFooterAction: noop,
  hasAutoCompleteInHeader: false,
  setHasAutoCompleteInHeader: noop,
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
  headerAutoCompleteRef: {
    current: null,
  },
  isTagDismissedRef: {
    current: null,
  },
  visibleTagsCountRef: {
    current: null,
  },
  triggererWrapperRef: {
    current: null,
  },
  treeViewControllerRef: {
    current: null,
  },
});

let searchTimeout: number;
let searchString = '';

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
  onOptionClick: (
    e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => void;

  /**
   * Removes the option with given optionsIndex
   */
  removeOption: (index: number) => void;

  /**
   * Selects / deselects multiple options in one state update with a single onChange.
   * Used by TreeView branch cascade toggles
   */
  selectOptionsBatch: (indices: number[], action: 'select' | 'deselect') => void;

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
    close,
    selectedIndices,
    setSelectedIndices,
    activeIndex,
    setActiveIndex,
    activeTagIndex,
    setActiveTagIndex,
    visibleTagsCountRef,
    isKeydownPressed,
    setIsKeydownPressed,
    options,
    selectionType,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    setControlledValueIndices,
    filteredValues,
    dropdownTriggerer,
    ...rest
  } = React.useContext(DropdownContext);

  type SelectOptionType = (
    index: number,
    properties?: {
      closeOnSelection?: boolean;
    },
  ) => boolean;

  const setIndices = (indices: number[]): void => {
    if (isControlled) {
      setControlledValueIndices(indices);
    } else {
      setSelectedIndices(indices);
    }
  };

  const removeOption = (index: number): void => {
    // remove existing item
    const existingItemIndex = selectedIndices.indexOf(index);
    if (existingItemIndex < 0) {
      return;
    }

    setIndices([
      ...selectedIndices.slice(0, existingItemIndex),
      ...selectedIndices.slice(existingItemIndex + 1),
    ]);
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
    let isSelected = false;

    if (index < 0 || index > options.length - 1) {
      return isSelected;
    }

    if (selectionType === 'multiple') {
      if (selectedIndices.includes(index)) {
        removeOption(index);
        isSelected = false;
      } else {
        setIndices([...selectedIndices, index]);
        isSelected = true;
      }
    } else {
      setIndices([index]);
      isSelected = true;
    }

    // Triggers `onChange` on SelectInput
    setChangeCallbackTriggerer(changeCallbackTriggerer + 1);

    if (activeIndex !== index) {
      setActiveIndex(index);
    }

    if (properties?.closeOnSelection && selectionType !== 'multiple') {
      close();
    }

    return isSelected;
  };

  /**
   * Marks multiple indices as selected / deselected in a single state update and
   * bumps the change callback triggerer exactly once.
   *
   * Used by TreeView for branch cascade toggles (one branch toggle mutates many leaf
   * indices but must fire a single `onChange`). Routes through the same controlled /
   * uncontrolled fork as `selectOption`. ActionList does not use this
   */
  const selectOptionsBatch = (indices: number[], action: 'select' | 'deselect'): void => {
    if (indices.length === 0) {
      return;
    }

    let updatedIndices: number[];
    if (action === 'select') {
      updatedIndices = [...selectedIndices];
      for (const index of indices) {
        if (index >= 0 && index <= options.length - 1 && !updatedIndices.includes(index)) {
          updatedIndices.push(index);
        }
      }
    } else {
      updatedIndices = selectedIndices.filter((selectedIndex) => !indices.includes(selectedIndex));
    }

    setIndices(updatedIndices);
    setChangeCallbackTriggerer(changeCallbackTriggerer + 1);
  };

  /**
   * Click listener for combobox (or any triggerer of the dropdown)
   */
  const onTriggerClick = (): void => {
    if (isOpen) {
      close();
    } else {
      setIsOpen(true);
    }
  };

  /**
   * Function that we call when we want to move focus from one option to other
   */
  const onOptionChange = (actionType: SelectActionsType, index?: number): void => {
    setActiveTagIndex(-1);
    const newIndex = index ?? activeIndex;
    let updatedIndex: number;
    const hasAutoComplete =
      rest.hasAutoCompleteInHeader ||
      dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete;
    const treeViewController = rest.treeViewControllerRef?.current;
    if (treeViewController) {
      // When overlay content is a TreeView, traversal skips rows hidden under collapsed
      // branches (indices stay stable across expand / collapse, only traversal changes)
      const visibleIndexes = treeViewController.getVisibleOptionIndices();
      updatedIndex =
        visibleIndexes[
          getUpdatedIndex({
            currentIndex: visibleIndexes.indexOf(newIndex),
            maxIndex: visibleIndexes.length - 1,
            actionType,
          })
        ] ?? newIndex;
    } else if (hasAutoComplete && filteredValues.length > 0) {
      // When its autocomplete, we don't loop over all options. We only loop on filtered options

      const filteredIndexes = filteredValues
        .map((filteredValue) => options.findIndex((option) => option.value === filteredValue))
        .sort((a, b) => a - b);

      updatedIndex =
        filteredIndexes[
          getUpdatedIndex({
            currentIndex: filteredIndexes.indexOf(newIndex),
            maxIndex: filteredIndexes.length - 1,
            actionType,
          })
        ];
    } else {
      updatedIndex = getUpdatedIndex({
        currentIndex: newIndex,
        maxIndex: options.length - 1,
        actionType,
      });
    }
    setActiveIndex(updatedIndex);

    const optionValues = options.map((option) => option.value);
    ensureScrollVisiblity(updatedIndex, rest.actionListItemRef.current, optionValues);
    if (isBrowser()) {
      fireNativeEvent(rest.actionListItemRef as React.RefObject<HTMLElement>, ['change', 'input']);
    }
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
    setIsKeydownPressed(false);
    const actionType = getActionFromKey(e, isOpen, dropdownTriggerer);
    if (typeof actionType === 'number') {
      onOptionChange(actionType, index);
    }
    selectOption(index);

    if (!isReactNative()) {
      if (rest.hasAutoCompleteInHeader) {
        // move focus to autocomplete
        rest.headerAutoCompleteRef.current?.focus();
      } else {
        rest.triggererRef.current?.focus();
      }
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

    if (
      rest.hasAutoCompleteInHeader ||
      dropdownTriggerer === dropdownComponentIds.triggers.AutoComplete
    ) {
      return;
    }

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
  const onTriggerKeydown = (e: {
    event: React.KeyboardEvent<HTMLInputElement | HTMLButtonElement>;
  }): void => {
    if (!isKeydownPressed && ![' ', 'Enter', 'Escape', 'Meta'].includes(e.event.key)) {
      // When keydown is not already pressed and its not Enter, Space, Command, or Escape key (those are generic keys and we only want to handle arrow keys or home buttons etc)
      setIsKeydownPressed(true);
    }

    const actionType = getActionFromKey(e.event, isOpen, dropdownTriggerer);

    if (actionType) {
      performAction(actionType, e, {
        setIsOpen,
        close,
        onOptionChange,
        onComboType,
        selectCurrentOption: (event) => {
          if (activeIndex < 0) {
            return;
          }

          // TreeView handles branch cascade toggles and load-more rows itself
          const treeViewController = rest.treeViewControllerRef?.current;
          if (treeViewController?.handleOptionSelect(activeIndex, { key: event?.key })) {
            return;
          }

          const isSelected = selectOption(activeIndex);
          if (rest.hasFooterAction && !isReactNative()) {
            rest.triggererRef.current?.focus();
          }

          options[activeIndex].onClickTrigger?.(isSelected);
        },
        // present only when overlay content is a TreeView; undefined keeps
        // ArrowLeft / ArrowRight behaviour unchanged for every other content
        onTreeExpandCollapse: rest.treeViewControllerRef?.current
          ? (action) => {
              if (action === 'Expand') {
                rest.treeViewControllerRef.current?.onArrowRightKeydown(activeIndex);
              } else {
                rest.treeViewControllerRef.current?.onArrowLeftKeydown(activeIndex);
              }
            }
          : undefined,
      });
    }
  };

  return {
    isOpen,
    setIsOpen,
    close,
    selectedIndices,
    setSelectedIndices,
    filteredValues,
    removeOption,
    selectOptionsBatch,
    setControlledValueIndices,
    onTriggerClick,
    onTriggerKeydown,
    onOptionClick,
    activeIndex,
    setActiveIndex,
    activeTagIndex,
    setActiveTagIndex,
    visibleTagsCountRef,
    isKeydownPressed,
    setIsKeydownPressed,
    changeCallbackTriggerer,
    setChangeCallbackTriggerer,
    isControlled,
    options,
    value: makeInputValue(selectedIndices, options),
    displayValue: makeInputDisplayValue(
      selectedIndices,
      options,
      rest.treeViewControllerRef?.current?.getDisplayOverride(selectedIndices),
    ),
    selectionType,
    dropdownTriggerer,
    ...rest,
  };
};

export type { DropdownContextType, OptionsType, TreeViewDropdownControllerType };
export { useDropdown, DropdownContext };
