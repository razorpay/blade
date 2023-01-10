import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import Box from '~components/Box';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { getPlatformType } from '~utils';
type SelectInputProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'name'
  | 'isDisabled'
  | 'isRequired'
  | 'prefix'
  | 'suffix'
  | 'autoFocus'
> & {
  icon?: IconComponent;
};

const SelectInput = (props: SelectInputProps): JSX.Element => {
  const {
    isOpen,
    value,
    displayValue,
    onSelectClick,
    onSelectKeydown,
    onSelectBlur,
    dropdownBaseId,
    activeIndex,
    selectInputRef,
  } = useDropdown();

  const { icon, ...baseInputProps } = props;

  const platform = getPlatformType();

  return (
    <Box position="relative">
      {platform !== 'react-native' ? (
        <VisuallyHidden>
          <input
            tabIndex={-1}
            required={props.isRequired}
            name={props.name}
            value={value}
            // Accessibility is covered in the select input itself so we hide this field from a11y tree
            aria-hidden={true}
          />
        </VisuallyHidden>
      ) : null}
      <BaseInput
        {...baseInputProps}
        as="button"
        ref={selectInputRef as React.MutableRefObject<HTMLInputElement>}
        textAlign="left"
        value={displayValue ? displayValue : 'Select Option'}
        id={`${dropdownBaseId}-trigger`}
        leadingIcon={icon}
        hasPopup
        isPopupExpanded={isOpen}
        onClick={onSelectClick}
        onKeyDown={onSelectKeydown}
        onBlur={onSelectBlur}
        activeDescendant={activeIndex >= 0 ? `${dropdownBaseId}-${activeIndex}` : undefined}
        popupId={`${dropdownBaseId}-listbox`}
        trailingIcon={isOpen ? ChevronUpIcon : ChevronDownIcon}
      />
    </Box>
  );
};

export { SelectInput, SelectInputProps };
