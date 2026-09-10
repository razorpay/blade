/**
 * Framework-agnostic Dropdown controller. Mirrors the interaction slice of
 * React's `useDropdown` hook (select / keyboard-nav / typeahead) but is a plain
 * factory: `Dropdown.svelte` wires its `$state` in via accessor callbacks so the
 * logic stays outside the component and reusable.
 *
 * TreeView / AutoComplete / controlled-SelectInput branches are out of scope.
 */
import {
  ensureScrollVisiblity,
  getActionFromKey,
  getIndexByLetter,
  getUpdatedIndex,
  performAction,
} from './dropdownUtils';
import type { SelectActionsType } from './dropdownUtils';
import type { DropdownOption } from './types';
import type { DropdownTriggerer } from './dropdownComponentIds';

export type DropdownControllerState = {
  getIsOpen: () => boolean;
  setIsOpen: (isOpen: boolean) => void;
  close: () => void;
  getSelectionType: () => 'single' | 'multiple';
  getOptions: () => DropdownOption[];
  getSelectedIndices: () => number[];
  setSelectedIndices: (indices: number[]) => void;
  getActiveIndex: () => number;
  setActiveIndex: (index: number) => void;
  getFilteredValues: () => string[];
  getDropdownTriggerer: () => DropdownTriggerer;
  getActionListContainerEl: () => HTMLElement | null;
  getTriggererEl: () => HTMLElement | null;
  getHasFooterAction: () => boolean;
  getIsKeydownPressed: () => boolean;
  setIsKeydownPressed: (value: boolean) => void;
};

export type DropdownController = {
  onTriggerClick: () => void;
  onTriggerKeydown: (payload: { event: KeyboardEvent }) => void;
  onOptionClick: (event: MouseEvent | KeyboardEvent, index: number) => void;
};

let searchTimeout: ReturnType<typeof setTimeout> | undefined;
let searchString = '';

export function createDropdownController(state: DropdownControllerState): DropdownController {
  /**
   * Marks the given index selected. Single-select closes the menu; multi-select
   * toggles and keeps it open. Returns the item's resulting selected state.
   */
  const selectOption = (index: number, closeOnSelection = true): boolean => {
    const options = state.getOptions();
    let isSelected = false;

    if (index < 0 || index > options.length - 1) {
      return isSelected;
    }

    const selectionType = state.getSelectionType();
    const selectedIndices = state.getSelectedIndices();

    if (selectionType === 'multiple') {
      if (selectedIndices.includes(index)) {
        state.setSelectedIndices(selectedIndices.filter((i) => i !== index));
        isSelected = false;
      } else {
        state.setSelectedIndices([...selectedIndices, index]);
        isSelected = true;
      }
    } else {
      state.setSelectedIndices([index]);
      isSelected = true;
    }

    if (state.getActiveIndex() !== index) {
      state.setActiveIndex(index);
    }

    if (closeOnSelection && selectionType !== 'multiple') {
      state.close();
    }

    return isSelected;
  };

  const onOptionChange = (actionType: SelectActionsType, index?: number): void => {
    const options = state.getOptions();
    const newIndex = index ?? state.getActiveIndex();
    const filteredValues = state.getFilteredValues();
    let updatedIndex: number;

    if (filteredValues.length > 0) {
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

    state.setActiveIndex(updatedIndex);
    const optionValues = options.map((option) => option.value);
    ensureScrollVisiblity(updatedIndex, state.getActionListContainerEl(), optionValues);
  };

  const onComboType = (letter: string, actionType: SelectActionsType): void => {
    state.setIsOpen(true);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    searchTimeout = setTimeout(() => {
      searchString = '';
    }, 500);
    searchString += letter;

    const options = state.getOptions();
    const optionTitles = options.map((option) => option.title);
    const searchIndex = getIndexByLetter(optionTitles, searchString, state.getActiveIndex() + 1);

    if (searchIndex >= 0) {
      onOptionChange(actionType, searchIndex);
    } else {
      clearTimeout(searchTimeout);
      searchString = '';
    }
  };

  const onTriggerClick = (): void => {
    if (state.getIsOpen()) {
      state.close();
    } else {
      state.setIsOpen(true);
    }
  };

  const onTriggerKeydown = (payload: { event: KeyboardEvent }): void => {
    const { event } = payload;
    if (
      !state.getIsKeydownPressed() &&
      ![' ', 'Enter', 'Escape', 'Meta'].includes(event.key)
    ) {
      state.setIsKeydownPressed(true);
    }

    const actionType = getActionFromKey(event, state.getIsOpen(), state.getDropdownTriggerer());

    if (actionType) {
      performAction(actionType, { event }, {
        setIsOpen: state.setIsOpen,
        close: state.close,
        onOptionChange,
        onComboType,
        selectCurrentOption: () => {
          const activeIndex = state.getActiveIndex();
          if (activeIndex < 0) {
            return;
          }
          const isSelected = selectOption(activeIndex);
          if (state.getHasFooterAction()) {
            state.getTriggererEl()?.focus();
          }
          state.getOptions()[activeIndex]?.onClickTrigger?.(isSelected);
        },
      });
    }
  };

  const onOptionClick = (event: MouseEvent | KeyboardEvent, index: number): void => {
    state.setIsKeydownPressed(false);
    const actionType = getActionFromKey(event, state.getIsOpen(), state.getDropdownTriggerer());
    if (typeof actionType === 'string') {
      onOptionChange(actionType, index);
    }
    selectOption(index);
    state.getTriggererEl()?.focus();
  };

  return { onTriggerClick, onTriggerKeydown, onOptionClick };
}
