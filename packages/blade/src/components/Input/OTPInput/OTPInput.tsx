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
>;

const OTPInput = (props: OTPInputProps): React.ReactElement => {
  console.log('🚀 ~ file: OTPInput.tsx ~ line 28 ~ OTPInput ~ props', props);
  return (
    // TODO: Use proper maxWidth for the component
    <Box display="flex" flexDirection="row" maxWidth={400}>
      <Box flex={1}>
        <BaseInput label="" id="otp-input-1" textAlign="center" maxCharacters={1} />
      </Box>
      <Box paddingLeft="spacing.3" />
      <Box flex={1}>
        <BaseInput label="" id="otp-input-2" textAlign="center" maxCharacters={1} />
      </Box>
      <Box paddingLeft="spacing.3" />
      <Box flex={1}>
        <BaseInput label="" id="otp-input-3" textAlign="center" maxCharacters={1} />
      </Box>
      <Box paddingLeft="spacing.3" />
      <Box flex={1}>
        <BaseInput label="" id="otp-input-4" textAlign="center" maxCharacters={1} />
      </Box>
      <Box paddingLeft="spacing.3" />
    </Box>
  );
};

export { OTPInput };
