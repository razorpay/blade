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
    setFilteredValues,
    activeTagIndex,
    setActiveTagIndex,
    setActiveIndex,
    filteredValues: globalFilteredValues,
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

  React.useEffect(() => {
    if (props.filteredValues) {
      setFilteredValues(props.filteredValues);
    }
  }, [props.filteredValues, setFilteredValues]);

  const onInputValueChangeCallback: BaseInputProps['onChange'] = ({ name, value }) => {
    setInputValue(value ?? '');
    setFirstItemActive();
    props.onInputValueChange?.({ name, value });
    setActiveTagIndex(-1);

    const optionValues = options.map((option) => option.value);

    if (!isOpen) {
      setIsOpen(true);
    }

    if (!props.filteredValues) {
      // eslint-disable-next-line no-lonely-if
      if (value && options && options.length > 0) {
        const filteredOptions = optionValues.filter((optionValue) =>
          optionValue.toLowerCase().startsWith(value.toLowerCase()),
        );
        setFilteredValues(filteredOptions);
      } else {
        setFilteredValues(optionValues);
      }
    }
  };

  const onKeydownCallback: BaseInputProps['onKeyDown'] = (e) => {
    if (e.key === 'Enter') {
      setInputValue('');
      props.onInputValueChange?.({ name: props.name, value: '' });
      setActiveTagIndex(-1);
      setFilteredValues([]);
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
        inputValue={inputValue}
        onTriggerKeydown={onKeydownCallback}
        onInputValueChange={onInputValueChangeCallback}
      />
    </BaseBox>
  );
};

const AutoComplete = assignWithoutSideEffects(_AutoComplete, {
  componentId: componentIds.triggers.AutoComplete,
});

export { AutoComplete };
