import React from 'react';
import { useDropdown } from '../../Dropdown/useDropdown';
import type { AutoCompleteProps } from './types';
import { BaseDropdownInputTrigger } from './BaseDropdownInputTrigger';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import BaseBox from '~components/Box/BaseBox';
import { componentIds } from '~components/Dropdown/dropdownUtils';

const _AutoComplete = (props: AutoCompleteProps): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);

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
  } = useDropdown();

  const onInputValueChangeCallback: BaseInputProps['onChange'] = ({ name, value }) => {
    setInputValue(value ?? '');
    setActiveTagIndex(-1);

    if (!isOpen) {
      setIsOpen(true);
    }

    if (value && options && options.length > 0) {
      const filteredOptions = options
        .map((option) => option.value)
        .filter((optionValue) => optionValue.toLowerCase().startsWith(value.toLowerCase()));
      setFilteredValues(filteredOptions);
    } else {
      setFilteredValues([]);
    }

    props.onInputValueChange?.({ name, value });
  };

  const onKeydownCallback: BaseInputProps['onKeyDown'] = (e) => {
    if (e.key === 'Enter') {
      setInputValue('');
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
