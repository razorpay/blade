import React from 'react';
// import BaseButton from '../Button/BaseButton';
// import { getActionListContainerRole } from '../ActionList/getA11yRoles';
import { useDropdown } from './useDropdown';
// import { componentIds } from './dropdownUtils';
// import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
// import { makeAccessible } from '~utils/makeAccessible';
import { Tag } from '~components/Tag';
import { BaseInput, BaseInputProps } from '~components/Input/BaseInput';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

const _AutoComplete = ({
  onChange,
}: {
  onChange?: BaseInputProps['onChange'];
}): React.ReactElement => {
  const [inputValue, setInputValue] = React.useState('');
  const [activeTagIndex, setActiveTagIndex] = React.useState(-1);
  const [currentTags, setCurrentTags] = React.useState<string[]>([]);

  const {
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    setIsOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
  } = useDropdown();

  const getTags = (): React.ReactElement[] => {
    return currentTags.map((currentTag, tagIndex) => {
      return (
        <Tag
          _isVirtuallyFocussed={tagIndex === activeTagIndex}
          _isTagInsideInput={true}
          key={tagIndex}
          marginRight="spacing.3"
          marginY="spacing.2"
          onDismiss={() => {
            setCurrentTags([...currentTags.slice(0, tagIndex), ...currentTags.slice(tagIndex + 1)]);
          }}
        >
          {currentTag}
        </Tag>
      );
    });
  };

  return (
    <BaseInput
      ref={triggererRef}
      label="First Name"
      value={inputValue}
      autoCompleteSuggestionType="none"
      tags={getTags()}
      activeTagIndex={activeTagIndex}
      setActiveTagIndex={setActiveTagIndex}
      name="fullName"
      onChange={({ name, value }): void => {
        console.log(`sending ${name}:${value} to analytics service`);
        setInputValue(value ?? '');

        if (!isOpen) {
          setIsOpen(true);
        }

        onChange?.({ name, value });
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          setCurrentTags([...currentTags, inputValue]);
          setInputValue('');
          setActiveTagIndex(-1);
        }

        if (e.key === 'Backspace' && !inputValue && activeTagIndex < 0) {
          setCurrentTags(currentTags.slice(0, -1));
        }

        onTriggerKeydown?.(e);
      }}
    />
  );
};

const AutoComplete = assignWithoutSideEffects(_AutoComplete, {
  componentId: 'AutoComplete',
});

export { AutoComplete };
