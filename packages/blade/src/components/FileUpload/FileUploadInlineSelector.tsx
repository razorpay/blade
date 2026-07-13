import React from 'react';
import styled from 'styled-components';
import type { BladeFile, InlineSelectorProps } from './types';
import { Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { ChevronDownIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { BaseBox } from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils';
import { getFocusRingStyles } from '~utils/getFocusRingStyles';
import { useControlledDropdownInput } from '~utils/useControlledDropdownInput';

const StyledInlineSelectorTrigger = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  maxWidth: '120px',
  minHeight: '32px',
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: makeSize(theme.spacing[3]),
  paddingRight: makeSize(theme.spacing[3]),
  borderRadius: makeSize(theme.border.radius.small),
  border: 'none',
  cursor: 'pointer',
  backgroundColor: theme.colors.interactive.background.gray.faded,
  transition: 'background-color 0.15s ease',
  '&:hover': {
    backgroundColor: theme.colors.interactive.background.gray.fadedHighlighted,
  },
  '&:focus': {
    ...getFocusRingStyles({ theme }),
    backgroundColor: theme.colors.interactive.background.gray.faded,
  },
  '&:focus-visible': {
    outlineOffset: makeSize(theme.spacing[0]),
  },
}));

type InlineSelectorTriggerProps = {
  displayLabel: string;
  file: BladeFile;
  value: InlineSelectorProps['value'];
  onChange: InlineSelectorProps['onChange'];
};

const _InlineSelectorTrigger = ({
  displayLabel,
  file,
  value,
  onChange,
}: InlineSelectorTriggerProps): React.ReactElement => {
  const {
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
    options,
    setActiveIndex,
  } = useDropdown();

  useControlledDropdownInput({
    value: value ?? '',
    onChange: ({ name, values }) => onChange({ name, values, file }),
    name: file.id ?? file.name,
    triggererRef,
    isSelectInput: true,
  });

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveIndex(options.findIndex((option) => option.value === value));
  }, [isOpen, options, setActiveIndex, value]);

  return (
    <StyledInlineSelectorTrigger
      ref={triggererRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={`Select category for ${file.name}`}
      aria-haspopup={getActionListContainerRole(hasFooterAction, 'DropdownButton')}
      aria-expanded={isOpen}
      aria-controls={`${dropdownBaseId}-actionlist`}
      aria-activedescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
      onClick={() => onTriggerClick()}
      onKeyDown={(e) => onTriggerKeydown?.({ event: e })}
    >
      <BaseBox overflow="hidden" maxWidth="100%" marginX="spacing.2">
        <Text
          size="small"
          weight="medium"
          color="interactive.text.gray.subtle"
          truncateAfterLines={1}
        >
          {displayLabel}
        </Text>
      </BaseBox>
      <ChevronDownIcon size="medium" color="interactive.icon.gray.subtle" />
    </StyledInlineSelectorTrigger>
  );
};

const InlineSelectorTrigger = assignWithoutSideEffects(_InlineSelectorTrigger, {
  componentId: dropdownComponentIds.triggers.DropdownButton,
});

type FileUploadInlineSelectorProps = InlineSelectorProps & {
  file: BladeFile;
};

const FileUploadInlineSelector = ({
  options,
  value,
  onChange,
  placeholder = 'Type',
  file,
}: FileUploadInlineSelectorProps): React.ReactElement => {
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.title ?? placeholder;

  return (
    <Dropdown selectionType="single">
      <InlineSelectorTrigger
        displayLabel={displayLabel}
        file={file}
        value={value}
        onChange={onChange}
      />
      <DropdownOverlay>
        <ActionList>
          {options.map((option) => (
            <ActionListItem
              key={option.value}
              title={option.title}
              value={option.value}
              isSelected={option.value === value}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export { FileUploadInlineSelector };
