import React from 'react';
import type { BaseDropdownInputTriggerProps } from '~components/Input/DropdownInputTriggers/types';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import { isBrowser } from '~utils';
import { useFirstRender } from '~utils/useFirstRender';
import { fireNativeEvent } from '~utils/fireNativeEvent';
import { useDropdown } from '~components/Dropdown/useDropdown';

export type useControlledDropdownInputProps = Pick<
  BaseDropdownInputTriggerProps,
  | 'onChange'
  | 'name'
  | 'value'
  | 'defaultValue'
  | 'onInputValueChange'
  | 'syncInputValueWithSelection'
  | 'isSelectInput'
> & {
  triggererRef: React.RefObject<HTMLElement>;
};

const useControlledDropdownInput = (props: useControlledDropdownInputProps): void => {
  const isFirstRender = useFirstRender();
  const {
    changeCallbackTriggerer,
    isControlled,
    options,
    selectedIndices,
    controlledValueIndices,
    setSelectedIndices,
    selectionType,
    setIsControlled,
  } = useDropdown();

  const getValuesArrayFromIndices = (): string[] => {
    let indices: number[] = [];
    if (isControlled) {
      indices = controlledValueIndices;
    } else {
      indices = selectedIndices;
    }

    return indices.map((selectionIndex) => options[selectionIndex].value);
  };

  const selectValues = (valuesToSelect: string | string[]): void => {
    if (options.length > 0) {
      // we use empty `''` for clearing the input
      if (isEmpty(valuesToSelect)) {
        setSelectedIndices([]);
      } else if (typeof valuesToSelect === 'string') {
        // single select control
        const selectedItemIndex = options.findIndex((option) => option.value === valuesToSelect);
        if (selectedItemIndex >= 0) {
          setSelectedIndices([selectedItemIndex]);
        }
      } else {
        // multiselect control

        // Handles repeated values in user state
        const uniqueValues = Array.from(new Set(valuesToSelect));
        // Handle selectionType single with multiselect values
        const userValues = selectionType === 'single' ? [valuesToSelect?.[0]] : uniqueValues;

        const selectedItemIndices = userValues
          .map((optionValue) => options.findIndex((option) => option.value === optionValue))
          .filter((value) => value >= 0);

        setSelectedIndices(selectedItemIndices);
      }
    }
  };

  // Handles `defaultValue` prop
  React.useEffect(() => {
    if (options.length > 0 && props.defaultValue) {
      selectValues(props.defaultValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.length]);

  // Handles `value` prop
  React.useEffect(() => {
    if (options.length > 0 && props.value !== undefined) {
      if (!isControlled) {
        setIsControlled(true);
      }

      selectValues(props.value);

      // in single select AutoComplete, we have to set inputValue of autocomplete according to the new selection.
      if (selectionType === 'single' && !Array.isArray(props.value) && !props.isSelectInput) {
        props.syncInputValueWithSelection?.(props.value);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, options]);

  // onChange behaviour
  React.useEffect(() => {
    // Ignore calling onChange on mount

    if (!isFirstRender) {
      props.onChange?.({
        name: props.name,
        values: getValuesArrayFromIndices(),
      });
      if (isBrowser()) {
        fireNativeEvent(props.triggererRef, ['change', 'input']);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changeCallbackTriggerer]);
};

export { useControlledDropdownInput };
