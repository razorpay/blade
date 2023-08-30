import React from 'react';
// import BaseButton from '../Button/BaseButton';
// import { getActionListContainerRole } from '../ActionList/getA11yRoles';
import { useDropdown } from '../../Dropdown/useDropdown';
// import { componentIds } from './dropdownUtils';
// import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
// import { makeAccessible } from '~utils/makeAccessible';
import type { AutoCompleteProps } from './types';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { BaseInput } from '~components/Input/BaseInput';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getTagsGroup } from '~components/Tag/getTagsGroup';

const _AutoComplete = ({
  label,
  name,
  validationState,
  onInputValueChange,
}: AutoCompleteProps): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);

  const {
    // onTriggerClick,
    // dropdownBaseId,
    onTriggerKeydown,
    isOpen,
    setIsOpen,
    // activeIndex,
    // hasFooterAction,
    triggererWrapperRef,
    triggererRef,
    selectedIndices,
    setSelectedIndices,
    setControlledValueIndices,
    isControlled,
    isTagDismissedRef,
    options,
    selectionType,
    removeOption,
    setChangeCallbackTriggerer,
    changeCallbackTriggerer,
    setFilteredValues,
    dropdownBaseId,
  } = useDropdown();

  const getTags = React.useMemo(
    () => () => {
      if (selectionType === 'single') {
        return undefined;
      }

      return getTagsGroup({
        tags: selectedIndices.map((selectedIndex) => options[selectedIndex].title),
        activeTagIndex,
        onDismiss: ({ tagIndex }) => {
          if (isTagDismissedRef.current) {
            isTagDismissedRef.current.value = true;
          }

          removeOption(selectedIndices[tagIndex]);
          setChangeCallbackTriggerer(Number(changeCallbackTriggerer) + 1);
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedIndices,
      selectionType,
      activeTagIndex,
      changeCallbackTriggerer,
      options,
      removeOption,
    ],
  );

  const onInputValueChangeCallback: BaseInputProps['onChange'] = ({ name, value }) => {
    setInputValue(value ?? '');

    if (!isOpen) {
      setIsOpen(true);
    }

    if (value && options && options.length > 0) {
      const filteredOptions = options
        .map((option) => option.value)
        .filter((optionValue) => optionValue.startsWith(value));
      setFilteredValues(filteredOptions);
    } else {
      setFilteredValues([]);
    }

    onInputValueChange?.({ name, value });
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
    <BaseInput
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={triggererRef as any}
      id={`${dropdownBaseId}-trigger`}
      // @TODO: remove non-null by fixing label / a11y label types for baseinput
      label={label as string}
      value={inputValue}
      autoCompleteSuggestionType="none"
      tags={getTags()}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      name={name}
      validationState={validationState}
      setInputWrapperRef={(wrapperNode) => {
        triggererWrapperRef.current = wrapperNode;
      }}
      onChange={onInputValueChangeCallback}
      onKeyDown={onKeydownCallback}
    />
  );
};

const AutoComplete = assignWithoutSideEffects(_AutoComplete, {
  componentId: 'AutoComplete',
});

export { AutoComplete };
