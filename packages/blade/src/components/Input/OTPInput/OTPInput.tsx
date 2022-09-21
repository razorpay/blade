import React from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import Box from '~components/Box';

export type OTPInputProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'necessityIndicator'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'onBlur'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
> & {
  otpLength: 4 | 6;
};

const OTPInput = ({ otpLength = 4 }: OTPInputProps): React.ReactElement => {
  const inputs = [];

  for (let i = 0; i < otpLength; i++) {
    inputs.push(
      <Box flex={1} paddingLeft={i == 0 ? 'spacing.0' : 'spacing.3'}>
        <BaseInput label="" id="otp-input-1" textAlign="center" maxCharacters={1} />
      </Box>,
    );
  }
  return (
    // TODO: Use proper maxWidth for the component
    <Box display="flex" flexDirection="row" maxWidth={400}>
      {inputs}
    </Box>
  );
};

export { OTPInput };
