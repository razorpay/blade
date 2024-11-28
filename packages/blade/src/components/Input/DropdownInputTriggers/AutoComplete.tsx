import React from 'react';
import { useDropdown } from '../../Dropdown/useDropdown';
import type { AutoCompleteProps, BaseDropdownInputTriggerProps } from './types';
import { BaseDropdownInputTrigger } from './BaseDropdownInputTrigger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import type { BladeElementRef } from '~utils/types';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { isReactNative } from '~utils';

const useAutoComplete = ({
  props,
  inputValue,
  setInputValue,
  getOptionValues,
}: {
  props: AutoCompleteProps;
  setInputValue: (inputValue: string) => void;
  inputValue: string;
  getOptionValues: () => string[];
}): {
  onTriggerKeydown: BaseDropdownInputTriggerProps['onTriggerKeydown'];
  onSelectionChange: BaseDropdownInputTriggerProps['onChange'];
  onInputValueChange: BaseDropdownInputTriggerProps['onInputValueChange'];
} => {
  const {
    onTriggerKeydown: onBaseDropdownInputKeydown,
    isOpen,
    setIsOpen,
    selectedIndices,
    setSelectedIndices,
    setControlledValueIndices,
    isControlled,
    options,
    setFilteredValues: setGlobalFilteredValues,
    activeTagIndex,
    setActiveTagIndex,
    setActiveIndex,
    filteredValues: globalFilteredValues,
    selectionType,
    triggererRef,
    hasAutoCompleteInBottomSheetHeader,
  } = useDropdown();

  const resetFilters = (): void => setGlobalFilteredValues(getOptionValues());

  // Makes sure that first item is always in focus
  React.useEffect((): void => {
    const firstItemOptionIndex = options.findIndex(
      (option) => option.value === globalFilteredValues[0],
    );

    if (firstItemOptionIndex >= 0) {
      setActiveIndex(firstItemOptionIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilteredValues.length, options.length]);

  // When input is empty or its single select, we want all items to be shown in filter on open of dropdown
  React.useEffect(() => {
    if (isOpen && !inputValue) {
      resetFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, options]);

  React.useEffect(() => {
    if (isOpen && selectionType === 'single') {
      resetFilters();
    }

    // Just setting autoFocus is setting the input in focus state but its not showing keyboard active.
    // We do this in web to get around that
    if (hasAutoCompleteInBottomSheetHeader && isOpen && !isReactNative()) {
      triggererRef.current?.focus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onInputValueChange: BaseDropdownInputTriggerProps['onInputValueChange'] = ({
    name,
    value,
  }) => {
    setInputValue(value ?? '');
    props.onInputValueChange?.({ name, value });
    setActiveTagIndex(-1);

    if (!isOpen) {
      setIsOpen(true);
    }

    // default filtering when filteredValues is uncontrolled
    if (!props.filteredValues) {
      // eslint-disable-next-line no-lonely-if
      if (value && options && options.length > 0) {
        const filteredOptions = getOptionValues().filter((optionValue) =>
          optionValue.toLowerCase().includes(value.toLowerCase()),
        );
        setGlobalFilteredValues(filteredOptions);
      } else {
        resetFilters();
      }
    }
  };

  const onTriggerKeydown: BaseDropdownInputTriggerProps['onTriggerKeydown'] = (e) => {
    // Pressing backspace on empty input should remove the last tag
    if (e.key === 'Backspace' && !inputValue && activeTagIndex < 0 && selectedIndices.length > 0) {
      if (isControlled) {
        setControlledValueIndices(selectedIndices.slice(0, -1));
      } else {
        setSelectedIndices(selectedIndices.slice(0, -1));
      }
    }
    onBaseDropdownInputKeydown?.(e);
  };

  const onSelectionChange: BaseDropdownInputTriggerProps['onChange'] = ({ values }) => {
    if (selectionType === 'multiple') {
      setInputValue('');
      props.onInputValueChange?.({ name: props.name, value: '' });
      setActiveTagIndex(-1);
      resetFilters();
    } else {
      const displayText = options.find((option) => option.value === values[0])?.title;
      props.onInputValueChange?.({
        name: props.name,
        value: displayText,
      });
      // Use displayText as inputValue only if its not controlled by user
      if (typeof props.value === 'undefined') {
        setInputValue(displayText ?? '');
      }
    }
    props.onChange?.({ name: props.name, values });
  };
  return {
    onSelectionChange,
    onTriggerKeydown,
    onInputValueChange,
  };
};

const _AutoComplete = (
  props: AutoCompleteProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  const [uncontrolledInputValue, setInputValue] = React.useState('');
  const inputValue = props.inputValue ?? uncontrolledInputValue;

  const {
    options,
    setFilteredValues: setGlobalFilteredValues,
    hasAutoCompleteInBottomSheetHeader,
    setHasAutoCompleteInBottomSheetHeader,
    onTriggerClick,
    dropdownTriggerer,
  } = useDropdown();

  const getOptionValues = React.useCallback(() => {
    return options.map((option) => option.value);
  }, [options]);

  const { onSelectionChange, onTriggerKeydown, onInputValueChange } = useAutoComplete({
    props,
    inputValue,
    setInputValue,
    getOptionValues,
  });

  React.useEffect(() => {
    if (dropdownTriggerer !== dropdownComponentIds.triggers.AutoComplete) {
      // When AutoComplete is mounted but not as trigger,
      // it has to be somewhere in the BottomSheet (most likely header based on UI but works in other parts too)
      setHasAutoCompleteInBottomSheetHeader(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handles controlled filteredValues state (syncs it with our global filteredValues)
  React.useEffect(() => {
    if (props.filteredValues) {
      setGlobalFilteredValues(props.filteredValues);
    }
  }, [props.filteredValues, setGlobalFilteredValues]);

  // set autoFocus to true when used inside bottomsheet
  const defaultAutoFocusState = hasAutoCompleteInBottomSheetHeader ? true : undefined;

  return (
    <BaseBox position="relative">
      <BaseDropdownInputTrigger
        {...props}
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus={props.autoFocus ?? defaultAutoFocusState}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        onChange={onSelectionChange}
        isSelectInput={false}
        inputValue={inputValue}
        syncInputValueWithSelection={(value) => {
          if (!value) {
            setInputValue('');
            return;
          }
          const selectedOption = options.find((option) => option.value === value);
          setInputValue(selectedOption?.title ?? '');
        }}
        onTriggerKeydown={onTriggerKeydown}
        onInputValueChange={onInputValueChange}
        onTriggerClick={(triggerEvent) => {
          if (!hasAutoCompleteInBottomSheetHeader) {
            // we don't want clicking on autocomplete to open / close Dropdown when it is used inside BottomSheet's header
            onTriggerClick();
          }
          props?.onClick?.(triggerEvent);
        }}
      />
    </BaseBox>
  );
};

/**
 * ### AutoComplete
 *
 * Extension on top of SelectInput which allows you type and filter between ActionList items
 *
 * To be used in combination of `Dropdown` and `ActionList` component
 *
 * ---
 *
 * #### Usage in Desktop
 *
 * ```diff
 * <Dropdown>
 * + <AutoComplete label="Select Fruits" />
 *   <DropdownOverlay>
 *     <ActionList>
 *       <ActionListItem title="Mango" value="mango" />
 *       <ActionListItem title="Apple" value="apple" />
 *     </ActionList>
 *   </DropdownOverlay>
 * </Dropdown>
 * ```
 *
 * #### Usage in Mobile
 *
 * ```diff
 * <Dropdown>
 * + <SelectInput label="Select Fruits" />
 *   <BottomSheet>
 *      <BottomSheetHeader>
 * +      <AutoComplete label="Select Fruits" />
 *      </BottomSheetHeader>
 *      <BottomSheetBody>
 *       <ActionList>
 *         <ActionListItem title="Mango" value="mango" />
 *         <ActionListItem title="Apple" value="apple" />
 *       </ActionList>
 *      </BottomSheetBody>
 *   </BottomSheet>
 * </Dropdown>
 * ```
 *
 * ---
 *
 * Checkout {@link https://blade.razorpay.com/?path=/docs/components-dropdown-with-autocomplete--with-single-select AutoComplete Documentation}.
 */
const AutoComplete = assignWithoutSideEffects(React.forwardRef(_AutoComplete), {
  componentId: dropdownComponentIds.triggers.AutoComplete,
});

export { AutoComplete };
