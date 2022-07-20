/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isUndefined } from 'lodash';
import React from 'react';
import { isEmpty } from '../../utils';
import { useCheckboxGroupContext } from './CheckboxGroup/CheckboxGroupContext';
import { CheckboxHintText } from './CheckboxHintText';
import { CheckboxIcon } from './CheckboxIcon';
import { CheckboxInput } from './CheckboxInput';
import { CheckboxLabel } from './CheckboxLabel';
import { CheckboxLabelText } from './CheckboxLabelText';
import { useCheckbox } from './useCheckbox';
import { Wrapper } from './Wrapper';

type CheckboxProps = {
  /**
   * If `true`, sets the checkbox will be checked.
   * Use `onChange` to update its value
   *
   * @default false
   */
  isChecked?: boolean;
  /**
   * If `true`, the checkbox will be initially checked.
   *
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * The callback invoked when the checked state of the `Checkbox` changes.
   */
  onChange?: (isChecked: boolean) => void;
  /**
   * Sets the label text of the checkbox
   */
  children: string;
  /**
   * Help text of the checkbox
   */
  helpText?: string;
  /**
   * Error text of the checkbox
   *
   * Renders when `validationState` is set to 'error'
   *
   * Overrides helpText
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
   *
   * @default undefined
   */
  validationState?: 'error' | undefined;
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

  // ban controlling checkbox manually while inside group
  const hasDefaultChecked = !isUndefined(defaultChecked);
  const hasIsChecked = !isUndefined(isChecked);
  const hasOnChange = !isUndefined(onChange);
  if ((hasDefaultChecked || hasIsChecked || hasOnChange) && !isEmpty(groupProps)) {
    const props = [
      hasDefaultChecked ? 'defaultChecked' : undefined,
      hasIsChecked ? 'isChecked' : undefined,
      hasOnChange ? 'onChange' : undefined,
    ].filter(Boolean);

    throw new Error(
      `[Blade Checkbox]: Cannot set \`${props.join(
        ',',
      )}\` on <Checkbox /> when it's inside <CheckboxGroup />, Please set it on the <CheckboxGroup /> itself`,
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
  // If validationState is used while inside group
  if (validationState && !isEmpty(groupProps)) {
    throw new Error(
      "[Blade Checkbox]: Can't use validationState of individual Checkboxes inside <CheckboxGroup />, please set validtionState on the <CheckboxGroup /> itself.",
    );
  }

  const _validationState = validationState ?? groupProps.validationState;
  const _hasError = _validationState === 'error';
  const _isDisabled = isDisabled ?? groupProps.isDisabled;
  const _name = name ?? groupProps.name;
  const _isChecked = isChecked ?? groupProps.state?.isChecked(value!);

  const showError = validationState === 'error' && errorText;
  const showHelpText = !showError && helpText;

  const handleChange = (checked: boolean) => {
    if (checked) {
      groupProps?.state?.addValue(value!);
    } else {
      groupProps?.state?.removeValue(value!);
    }

    onChange?.(checked);
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
      {/* TODO: Replace Wrapper with Box */}
      <Wrapper>
        <CheckboxLabelText>{children}</CheckboxLabelText>
        {showError && (
          <CheckboxHintText id={ids?.errorTextId} variant="error">
            {errorText}
          </CheckboxHintText>
        )}
        {showHelpText && (
          <CheckboxHintText id={ids?.helpTextId} variant="help">
            {helpText}
          </CheckboxHintText>
        )}
      </Wrapper>
    </CheckboxLabel>
  );
};

export { Checkbox, CheckboxProps };
