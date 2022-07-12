/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { isEmpty } from '../../utils';
import { useCheckboxGroupContext } from './CheckboxGroup/CheckboxGroupContext';
import { CheckboxHelpText } from './CheckboxHelpText';
import { CheckboxIcon } from './CheckboxIcon';
import { CheckboxInput } from './CheckboxInput';
import { CheckboxLabel } from './CheckboxLabel';
import { CheckboxLabelText } from './CheckboxLabelText';
import { useCheckbox } from './useCheckbox';
import { Wrapper } from './Wrapper';

type CheckboxProps = {
  isChecked?: boolean;
  defaultChecked?: boolean;
  onChange?: (isChecked: boolean) => void;
  children: string;
  helpText?: string;
  isIndeterminate?: boolean;
  name?: string;
  value?: string;
  isDisabled?: boolean;
  isOptional?: boolean;
  hasError?: boolean;
};

const Checkbox = ({
  defaultChecked,
  hasError,
  isChecked,
  isDisabled,
  isIndeterminate,
  isOptional,
  name,
  onChange,
  value,
  children,
  helpText,
}: CheckboxProps): React.ReactElement => {
  const groupProps = useCheckboxGroupContext();

  if ((defaultChecked || isChecked) && !isEmpty(groupProps)) {
    throw new Error(
      "[Blade Checkbox]: Cannot control checkbox component when it's inside CheckboxGroup",
    );
  }
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

  const _hasError = hasError ?? groupProps.hasError;
  const _isDisabled = isDisabled ?? groupProps.isDisabled;
  const _isOptional = isOptional ?? groupProps.isOptional;
  const _name = name ?? groupProps.name;
  const _isChecked = isChecked ?? groupProps.state?.isChecked(value!);

  const handleChange = (checked: boolean) => {
    if (checked) {
      groupProps?.state?.addValue(value!);
    } else {
      groupProps?.state?.removeValue(value!);
    }

    onChange?.(checked);
  };

  const { state, inputProps } = useCheckbox({
    defaultChecked,
    isChecked: _isChecked,
    isIndeterminate,
    hasError: _hasError,
    isDisabled: _isDisabled,
    isOptional: _isOptional,
    name: _name,
    value,
    onChange: handleChange,
  });

  return (
    <CheckboxLabel inputProps={state.isReactNative ? inputProps : {}}>
      <CheckboxInput inputProps={inputProps} />
      <CheckboxIcon
        isIndeterminate={isIndeterminate}
        isDisabled={_isDisabled}
        isNegative={_hasError}
        state={state.isChecked}
      />
      {/* TODO: Replace Wrapper with Box */}
      <Wrapper>
        <CheckboxLabelText>{children}</CheckboxLabelText>
        {helpText ? <CheckboxHelpText>{helpText}</CheckboxHelpText> : null}
      </Wrapper>
    </CheckboxLabel>
  );
};

export { Checkbox, CheckboxProps };
