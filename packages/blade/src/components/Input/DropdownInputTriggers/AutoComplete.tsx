import React from 'react';
import { useDropdown } from '../../Dropdown/useDropdown';
import type { AutoCompleteProps, BaseDropdownInputTriggerProps } from './types';
import { BaseDropdownInputTrigger } from './BaseDropdownInputTrigger';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { componentIds } from '~components/Dropdown/dropdownUtils';

const useAutoCompleteHandlers = ({
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
    displayValue,
  } = useDropdown();

  const setFirstItemActive = React.useCallback((): void => {
    const firstItemOptionIndex = options.findIndex(
      (option) => option.value === globalFilteredValues[0],
    );

    if (firstItemOptionIndex >= 0) {
      setActiveIndex(firstItemOptionIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilteredValues]);

  const onInputValueChange: BaseDropdownInputTriggerProps['onInputValueChange'] = ({
    name,
    value,
  }) => {
    setInputValue(value ?? '');
    setFirstItemActive();
    props.onInputValueChange?.({ name, value });
    setActiveTagIndex(-1);

    if (!isOpen) {
      setIsOpen(true);
    }

    if (!props.filteredValues) {
      // eslint-disable-next-line no-lonely-if
      if (value && options && options.length > 0) {
        const filteredOptions = getOptionValues().filter((optionValue) =>
          optionValue.toLowerCase().startsWith(value.toLowerCase()),
        );
        setGlobalFilteredValues(filteredOptions);
      } else {
        setGlobalFilteredValues(getOptionValues());
      }
    }
  };

  const onTriggerKeydown: BaseDropdownInputTriggerProps['onTriggerKeydown'] = (e) => {
    if (e.key === 'Enter') {
      // setInputValue('');
      setActiveTagIndex(-1);
      setGlobalFilteredValues(getOptionValues());
    } else if (
      e.key === 'Backspace' &&
      !inputValue &&
      activeTagIndex < 0 &&
      selectedIndices.length > 0
    ) {
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
      setGlobalFilteredValues(getOptionValues());
    } else {
      setInputValue(displayValue);
    }
    props.onChange?.({ name: props.name, values });
  };

  return {
    onSelectionChange,
    onTriggerKeydown,
    onInputValueChange,
  };
};

const _AutoComplete = (props: AutoCompleteProps): React.ReactElement => {
  const [uncontrolledInputValue, setInputValue] = React.useState('');
  const inputValue = props.inputValue ?? uncontrolledInputValue;

  const {
    isOpen,
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

  const { onSelectionChange, onTriggerKeydown, onInputValueChange } = useAutoCompleteHandlers({
    props,
    inputValue,
    setInputValue,
    getOptionValues,
  });

  React.useEffect(() => {
    if (dropdownTriggerer !== 'AutoComplete') {
      // When AutoComplete is mounted but not as trigger,
      // we assume its in header of BottomSheet
      setHasAutoCompleteInBottomSheetHeader(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (isOpen && !inputValue) {
      setGlobalFilteredValues(getOptionValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  React.useEffect(() => {
    if (props.filteredValues) {
      setGlobalFilteredValues(props.filteredValues);
    }
  }, [props.filteredValues, setGlobalFilteredValues]);

  return (
    <BaseBox position="relative">
      <BaseDropdownInputTrigger
        {...props}
        onChange={onSelectionChange}
        isSelectInput={false}
        inputValue={inputValue}
        onTriggerKeydown={onTriggerKeydown}
        onInputValueChange={onInputValueChange}
        onTriggerClick={(e) => {
          if (!hasAutoCompleteInBottomSheetHeader) {
            // we don't want clicking on autocomplete to open / close Dropdown when it is used inside BottomSheet's header
            onTriggerClick();
          }
          props?.onClick?.(e);
        }}
      />
    </BaseBox>
  );
};

const AutoComplete = assignWithoutSideEffects(_AutoComplete, {
  componentId: componentIds.triggers.AutoComplete,
});

export { AutoComplete };
