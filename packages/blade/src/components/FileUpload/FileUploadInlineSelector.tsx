import React from 'react';
import styled from 'styled-components';
import type { BladeFile, FileUploadCategoryOption, FileUploadCategoryChangeHandler } from './types';
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

type FileUploadInlineSelectorTriggerProps = {
  displayLabel: string;
  file: BladeFile;
  value: string | undefined;
  onChange: FileUploadCategoryChangeHandler;
};

type FileUploadInlineSelectorProps = {
  options: FileUploadCategoryOption[];
  value: string | undefined;
  onChange: FileUploadCategoryChangeHandler;
  placeholder?: string;
  file: BladeFile;
};

const StyledInlineSelectorTrigger = styled.button(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  maxWidth: makeSize(120),
  minHeight: makeSize(32),
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
  '&:focus:not(:focus-visible)': {
    outline: 'none',
    backgroundColor: theme.colors.interactive.background.gray.faded,
  },
  '&:focus-visible': {
    ...getFocusRingStyles({ theme }),
    backgroundColor: theme.colors.interactive.background.gray.faded,
  },
}));

const _InlineSelectorTrigger = ({
  displayLabel,
  file,
  value,
  onChange,
}: FileUploadInlineSelectorTriggerProps): React.ReactElement => {
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
    setIsKeydownPressed,
  } = useDropdown();

  useControlledDropdownInput({
    value,
    onChange: ({ values }) => {
      if (values.length > 0) {
        onChange({ value: values[0], file });
      }
    },
    name: file.id ?? file.name ?? 'file',
    triggererRef,
    isSelectInput: true,
  });

  const optionsKey = options.map((o) => o.value).join(',');
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    setActiveIndex(options.findIndex((option) => option.value === value));
    // optionsKey is a stable string derived from options; using it instead of options
    // avoids re-running the effect when the options array reference changes but content is identical.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, optionsKey, setActiveIndex, value]);

  return (
    <StyledInlineSelectorTrigger
      ref={triggererRef}
      type="button"
      aria-label={`Select category for ${file.name}`}
      aria-haspopup={getActionListContainerRole(hasFooterAction, 'DropdownButton')}
      aria-expanded={isOpen}
      aria-controls={`${dropdownBaseId}-actionlist`}
      aria-activedescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
      onMouseDown={() => setIsKeydownPressed(false)}
      onClick={() => onTriggerClick()}
      onKeyDown={(e) =>
        onTriggerKeydown?.({
          // Safe cast: onTriggerKeydown only reads event.key, which exists on all KeyboardEvent types.
          // The type constraint requires HTMLInputElement but the handler never accesses input-specific properties.
          event: (e as unknown) as React.KeyboardEvent<HTMLInputElement>,
        })
      }
    >
      <BaseBox overflow="hidden" maxWidth="100%" marginRight="spacing.2">
        <Text
          size="small"
          weight="medium"
          color="interactive.text.gray.subtle"
          truncateAfterLines={1}
        >
          {displayLabel}
        </Text>
      </BaseBox>
      <BaseBox flexShrink={0}>
        <ChevronDownIcon size="medium" color="surface.icon.gray.muted" />
      </BaseBox>
    </StyledInlineSelectorTrigger>
  );
};

const InlineSelectorTrigger = assignWithoutSideEffects(_InlineSelectorTrigger, {
  componentId: dropdownComponentIds.triggers.DropdownButton,
});

const FileUploadInlineSelector = ({
  options,
  value,
  onChange,
  placeholder = 'Select',
  file,
}: FileUploadInlineSelectorProps): React.ReactElement => {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(value);
  React.useEffect(() => {
    setInternalValue(value);
  }, [value]);
  const currentValue = value ?? internalValue;
  const selectedOption = options.find((opt) => opt.value === currentValue);
  const displayLabel = selectedOption?.title ?? placeholder;

  const handleChange = React.useCallback(
    (args: { value: string; file: File }) => {
      setInternalValue(args.value);
      onChange(args);
    },
    [onChange],
  );

  return (
    <Dropdown selectionType="single">
      <InlineSelectorTrigger
        displayLabel={displayLabel}
        file={file}
        value={currentValue}
        onChange={handleChange}
      />
      <DropdownOverlay>
        <ActionList>
          {options.map((option) => (
            <ActionListItem
              key={option.value}
              title={option.title}
              value={option.value}
              isSelected={option.value === currentValue}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
};

export { FileUploadInlineSelector };
