import React from 'react';
import styled from 'styled-components';
import type { BladeFile, FileCategoryProps } from './types';
import { Dropdown } from '~components/Dropdown';
import { DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { useDropdown } from '~components/Dropdown/useDropdown';
import { dropdownComponentIds } from '~components/Dropdown/dropdownComponentIds';
import { getActionListContainerRole } from '~components/ActionList/getA11yRoles';
import { ChevronDownIcon } from '~components/Icons';
import { Text } from '~components/Typography';
import { BaseBox } from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeSize } from '~utils';

const StyledCategoryTrigger = styled.button(({ theme }) => ({
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
}));

type CategoryTriggerProps = {
  displayLabel: string;
  fileName: string;
};

const _CategoryTrigger = ({
  displayLabel,
  fileName,
}: CategoryTriggerProps): React.ReactElement => {
  const {
    onTriggerClick,
    onTriggerKeydown,
    dropdownBaseId,
    isOpen,
    activeIndex,
    hasFooterAction,
    triggererRef,
  } = useDropdown();

  return (
    <StyledCategoryTrigger
      ref={triggererRef as React.Ref<HTMLButtonElement>}
      type="button"
      aria-label={`Select file category for ${fileName}`}
      aria-haspopup={getActionListContainerRole(hasFooterAction, 'DropdownButton')}
      aria-expanded={isOpen}
      aria-controls={`${dropdownBaseId}-actionlist`}
      aria-activedescendant={
        activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined
      }
      onClick={() => onTriggerClick()}
      onKeyDown={(e) => onTriggerKeydown?.({ event: e as unknown as React.KeyboardEvent<HTMLInputElement> })}
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

    </StyledCategoryTrigger>
  );
};

const CategoryTrigger = assignWithoutSideEffects(_CategoryTrigger, {
  componentId: dropdownComponentIds.triggers.DropdownButton,
});

type FileUploadCategorySelectorProps = FileCategoryProps & {
  file: BladeFile;
};

const FileUploadCategorySelector = ({
  options,
  value,
  onChange,
  placeholder = 'Type',
  file,
}: FileUploadCategorySelectorProps): React.ReactElement => {
  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.title ?? placeholder;

  return (
    <Dropdown selectionType="single">
      <CategoryTrigger displayLabel={displayLabel} fileName={file.name} />
      <DropdownOverlay>
        <ActionList>
          {options.map((option) => (
            <ActionListItem
              key={option.value}
              title={option.title}
              value={option.value}
              isSelected={option.value === value}
              onClick={() => onChange({ value: option.value, file })}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export { FileUploadCategorySelector };
