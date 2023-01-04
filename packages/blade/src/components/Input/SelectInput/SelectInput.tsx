import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import { HiddenInput } from './HiddenInput';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { DropdownContext } from '~components/Dropdown/Dropdown';
import Box from '~components/Box';
type SelectInputProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'placeholder'
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
  const { isOpen, setIsOpen } = React.useContext(DropdownContext);

  const { icon, ...baseInputProps } = props;

  return (
    <Box position="relative">
      {/* @TODO Use this for form submissions */}
      <HiddenInput
        required={props.isRequired}
        value=""
        // Accessibility is covered in the select input itself so we hide this field from a11y tree
        aria-hidden={true}
      />
      <BaseInput
        {...baseInputProps}
        as="button"
        textAlign="left"
        /**
         * @TODO
         * this will come from Dropdown component
         */
        id="input-123"
        leadingIcon={icon}
        hasPopup
        isPopupExpanded={isOpen}
        onClick={() => {
          console.log('clickkk');
          setIsOpen(true);
        }}
        onKeyDown={(e) => {
          console.log(e.code);
          if (e.code === 'Escape') {
            setIsOpen(false);
          }

          if (e.code) {
            if (['ArrowDown', 'ArrowUp', 'Space'].includes(e.code)) {
              setIsOpen(!isOpen);
            }
          }
        }}
        /**
         * @TODO Pass the popup id by taking it from Dropdown
         */
        popupId="123"
        trailingIcon={isOpen ? ChevronUpIcon : ChevronDownIcon}
      />
    </Box>
  );
};

export { SelectInput, SelectInputProps };
