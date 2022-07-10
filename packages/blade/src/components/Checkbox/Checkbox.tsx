/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
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
  isRequired?: boolean;
  hasError?: boolean;
};

const Checkbox = ({
  defaultChecked,
  hasError,
  isChecked,
  isDisabled,
  isIndeterminate,
  isRequired,
  name,
  onChange,
  value,
  children,
  helpText,
}: CheckboxProps): React.ReactElement => {
  const { state, inputProps } = useCheckbox({
    defaultChecked,
    hasError,
    isChecked,
    isDisabled,
    isIndeterminate,
    isRequired,
    name,
    onChange,
    value,
  });

  return (
    <CheckboxLabel inputProps={state.isReactNative ? inputProps : {}}>
      <CheckboxInput inputProps={inputProps} />
      <CheckboxIcon isDisabled={isDisabled} isNegative={hasError} state={state.isChecked} />
      {/* TODO: Replace Wrapper with Box */}
      <Wrapper>
        <CheckboxLabelText>{children}</CheckboxLabelText>
        {helpText ? <CheckboxHelpText>{helpText}</CheckboxHelpText> : null}
      </Wrapper>
    </CheckboxLabel>
  );
};

export { Checkbox, CheckboxProps };
