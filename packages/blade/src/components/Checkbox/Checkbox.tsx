/* eslint-disable @typescript-eslint/no-shadow */
import React from 'react';
import { isUndefined } from 'lodash';
import { useCheckboxGroupContext } from './CheckboxGroup/CheckboxGroupContext';
import { CheckboxIcon } from './CheckboxIcon';
import { CheckboxInput } from './CheckboxInput';
import { CheckboxLabel } from './CheckboxLabel';
import { CheckboxLabelText } from './CheckboxLabelText';
import { useCheckbox } from './useCheckbox';
import { isEmpty } from '~utils';
import { FormHintText } from '~components/FormField/FormHintText';
import Box from '~components/Box';

type OnChange = ({
  isChecked,
  event,
  value,
}: {
  isChecked: boolean;
  event?: React.ChangeEvent;
  value?: string;
}) => void;

type CheckboxProps = {
  /**
   * If `true`, The checkbox will be checked. This also makes the checkbox controlled
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked. This also makes the checkbox uncontrolled
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: OnChange;
  /**
   * Sets the label text of the checkbox
   */
  children: string;
  /**
   * Help text for the checkbox
   */
  helpText?: string;
  /**
   * Error text for the checkbox
   *
   * Renders when `validationState` is set to 'error'
   */
  errorText?: string;
  /**
   * If `true`, the checkbox will be indeterminate.
   * This does not modify the isChecked property.
   *
   * @default false
   */
  isIndeterminate?: boolean;
  /**
   * The name of the input field in a checkbox
   * (Useful for form submission).
   */
  name?: string;
  /**
   * The value to be used in the checkbox input.
   * This is the value that will be returned on form submission.
   */
  value?: string;
  /**
   * If `true`, the checkbox will be disabled
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * If `true`, the checkbox input is marked as required,
   * and `required` attribute will be added
   *
   * @default false
   */
  isRequired?: boolean;
  /**
   * If `error`, the checkbox input is marked as invalid,
   * and `invalid` attribute will be added
   */
  validationState?: 'error' | 'none';
};

const Checkbox = ({
  defaultChecked,
  validationState,
  isChecked,
  isDisabled,
  isIndeterminate,
  isRequired,
  name,
  onChange,
  value,
  children,
  helpText,
  errorText,
}: CheckboxProps): React.ReactElement => {
  const groupProps = useCheckboxGroupContext();

  // ban certain props in checkbox while inside group
  const hasValidationState = !isUndefined(validationState);
  const hasDefaultChecked = !isUndefined(defaultChecked);
  const hasIsChecked = !isUndefined(isChecked);
  const hasOnChange = !isUndefined(onChange);
  if (
    (hasValidationState || hasDefaultChecked || hasIsChecked || hasOnChange) &&
    !isEmpty(groupProps)
  ) {
    const props = [
      hasValidationState ? 'validationState' : undefined,
      hasDefaultChecked ? 'defaultChecked' : undefined,
      hasIsChecked ? 'isChecked' : undefined,
      hasOnChange ? 'onChange' : undefined,
    ]
      .filter(Boolean)
      .join(',');

    throw new Error(
      `[Blade Checkbox]: Cannot set \`${props}\` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself`,
    );
  }

  // mandate value prop when using inside group
  if (!value && !isEmpty(groupProps)) {
    throw new Error(
      `[Blade Checkbox]: <CheckboxGroup /> requires that you pass unique "value" prop to each <Checkbox />
      <CheckboxGroup>
        <Checkbox value="apple">Apple</Checkbox>
        <Checkbox value="mango">Mango</Checkbox>
      </CheckboxGroup>
      `,
    );
  }

  const _validationState = validationState ?? groupProps?.validationState;
  const _hasError = _validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps?.isDisabled;
  const _name = name ?? groupProps?.name;
  const _isChecked = isChecked ?? groupProps?.state?.isChecked(value!);

  // only show error when the self validation is set to error
  // Since we don't want to show errorText inside the group
  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;

  const handleChange: OnChange = ({ isChecked, event, value }) => {
    if (isChecked) {
      groupProps?.state?.addValue(value!);
    } else {
      groupProps?.state?.removeValue(value!);
    }

    onChange?.({ isChecked, event, value });
  };

  const { state, ids, inputProps } = useCheckbox({
    defaultChecked,
    isChecked: _isChecked,
    isIndeterminate,
    hasError: _hasError,
    isDisabled: _isDisabled,
    isRequired,
    name: _name,
    value,
    onChange: handleChange,
  });

  return (
    <CheckboxLabel inputProps={state.isReactNative ? inputProps : {}}>
      <CheckboxInput
        isChecked={state.isChecked || !!isIndeterminate}
        isDisabled={_isDisabled}
        isNegative={_hasError}
        inputProps={inputProps}
      />
      <CheckboxIcon
        isChecked={state.isChecked}
        isIndeterminate={isIndeterminate}
        isDisabled={_isDisabled}
        isNegative={_hasError}
      />
      <Box>
        <CheckboxLabelText>{children}</CheckboxLabelText>
        {showError && (
          <FormHintText id={ids?.errorTextId} variant="error">
            {errorText}
          </FormHintText>
        )}
        {showHelpText && (
          <FormHintText id={ids?.helpTextId} variant="help">
            {helpText}
          </FormHintText>
        )}
      </Box>
    </CheckboxLabel>
  );
};

export { Checkbox, CheckboxProps };
