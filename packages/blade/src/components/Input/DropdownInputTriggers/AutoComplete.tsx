import React from 'react';
import { useDropdown } from '../../Dropdown/useDropdown';
import type { AutoCompleteProps } from './types';
import { BaseDropdownInputTrigger } from './BaseDropdownInputTrigger';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { componentIds } from '~components/Dropdown/dropdownUtils';

const _AutoComplete = (props: AutoCompleteProps): React.ReactElement => {
  const [uncontrolledInputValue, setInputValue] = React.useState('');
  const inputValue = props.inputValue ?? uncontrolledInputValue;

  const {
    onTriggerKeydown,
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
    hasAutoCompleteInBottomSheetHeader,
    setHasAutoCompleteInBottomSheetHeader,
    filteredValues: globalFilteredValues,
    onTriggerClick,
    dropdownTriggerer,
  } = useDropdown();

  const getOptionValues = React.useCallback(() => {
    return options.map((option) => option.value);
  }, [options]);

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

  const setFirstItemActive = React.useCallback((): void => {
    const firstItemOptionIndex = options.findIndex(
      (option) => option.value === globalFilteredValues[0],
    );

    if (firstItemOptionIndex >= 0) {
      setActiveIndex(firstItemOptionIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilteredValues]);

  React.useEffect(() => {
    if (props.filteredValues) {
      setGlobalFilteredValues(props.filteredValues);
    }
  }, [props.filteredValues, setGlobalFilteredValues]);

  const onInputValueChangeCallback: BaseInputProps['onChange'] = ({ name, value }) => {
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

  const onKeydownCallback: BaseInputProps['onKeyDown'] = (e) => {
    if (e.key === 'Enter') {
      setInputValue('');
      props.onInputValueChange?.({ name: props.name, value: '' });
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
    onTriggerKeydown?.(e);
  };

  return (
    <BaseBox position="relative">
      <BaseDropdownInputTrigger
        {...props}
        isSelectInput={false}
        inputValue={inputValue}
        onTriggerKeydown={onKeydownCallback}
        onInputValueChange={onInputValueChangeCallback}
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
