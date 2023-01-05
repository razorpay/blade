import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
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
  /**
   * @TODO handle expanded state with Dropdown
   */
  const isPopupExpanded = false;
  const value = '';

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
        isPopupExpanded={isPopupExpanded}
        onClick={() => {
          console.log('clickkk');
        }}
        /**
         * @TODO Pass the popup id by taking it from Dropdown
         */
        popupId="123"
        trailingIcon={isPopupExpanded ? ChevronUpIcon : ChevronDownIcon}
      />
    </Box>
  );
};

export default SelectInput;
