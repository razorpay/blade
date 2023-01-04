import { BaseInput } from '../BaseInput';
import type { BaseInputProps } from '../BaseInput';
import type { IconComponent } from '~components/Icons';
import { ChevronDownIcon, ChevronUpIcon } from '~components/Icons';
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
  /**
   * @TODO handle expanded state with Dropdown
   */
  const isPopupExpanded = false;

  const { icon, ...baseInputProps } = props;

  const platform = getPlatformType();

  return (
    <>
      {platform !== 'react-native' ? (
        // @TODO Use this for form submissions
        <input type="hidden" required={props.isRequired} value="selected-value-from-dropdown" />
      ) : null}
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
    </>
  );
};

export default SelectInput;
