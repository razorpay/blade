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
  const inputRefs: React.RefObject<HTMLInputElement>[] = [];
  for (let i = 0; i < otpLength; i++) {
    const ref = React.createRef<HTMLInputElement>();
    inputRefs.push(ref);
    inputs.push(
      <Box flex={1} paddingLeft={i == 0 ? 'spacing.0' : 'spacing.3'} key={`otp-input-${i}`}>
        <BaseInput
          label=""
          id={`otp-input-${i}`}
          textAlign="center"
          maxCharacters={1}
          ref={ref}
          onChange={({ value }) => {
            if (value && value.length === 1) {
              inputRefs[i + 1]?.current?.focus();
            }
          }}
        />
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
