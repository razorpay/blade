import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { useDropdown } from '~components/Dropdown/useDropdown';
import Box from '~components/Box';
import { VisuallyHidden } from '~components/VisuallyHidden';
import { getPlatformType, isReactNative } from '~utils';
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
  onChange?: ({ name, values }: { name?: string; values: string[] }) => void;
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

  const { icon, onChange, ...baseInputProps } = props;

  const platform = getPlatformType();

  React.useEffect(() => {
    onChange?.({ name: props.name, values: value.split(', ') });
  }, [value, onChange, props.name]);

  return (
    <Box position="relative">
      {platform !== 'react-native' ? (
        <VisuallyHidden>
          <input
            tabIndex={-1}
            required={props.isRequired}
            name={props.name}
            value={value}
            // Adding onChange to surpass no onChange on controlled component warning
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onChange={() => {}}
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
        labelId={`${dropdownBaseId}-label`}
        leadingIcon={icon}
        hasPopup={isReactNative() ? 'menu' : 'listbox'}
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
