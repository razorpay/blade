import React from 'react';
import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
import { DropdownContext } from '~components/Dropdown/Dropdown';
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
    <BaseInput
      {...baseInputProps}
      /**
       * @TODO
       * this will come from Dropdown component
       */
      id="input-123"
      leadingIcon={icon}
      hasPopup
      isPopupExpanded={isOpen}
      onKeyDown={(e) => {
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
      isReadOnly
      trailingIcon={isOpen ? ChevronUpIcon : ChevronDownIcon}
    />
  );
};

export { SelectInput, SelectInputProps };
