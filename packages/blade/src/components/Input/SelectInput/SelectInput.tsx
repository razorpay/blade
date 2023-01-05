import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { DropdownContext } from '~components/Dropdown/Dropdown';
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
  const { isOpen, setIsOpen, value } = React.useContext(DropdownContext);

  const { icon, ...baseInputProps } = props;

  const platform = getPlatformType();

  return (
    <Box position="relative">
      {/* @TODO Use this for form submissions */}
      {platform !== 'react-native' ? (
        <VisuallyHidden>
          <input
            tabIndex={-1}
            required={props.isRequired}
            value={value}
            // Accessibility is covered in the select input itself so we hide this field from a11y tree
            aria-hidden={true}
          />
        </VisuallyHidden>
      ) : null}
      <BaseInput
        {...baseInputProps}
        as="button"
        textAlign="left"
        value={value}
        defaultValue="Select Option"
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
