import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import Box from '~components/Box';
import type { FormInputOnEvent } from '~components/Form';

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

const otpToArray = (code?: string): string[] => code?.split('') ?? [];

const OTPInput = ({ otpLength = 4 }: OTPInputProps): React.ReactElement => {
  const inputs = [];
  const inputRefs: React.RefObject<HTMLInputElement>[] = [];
  const [otpValue, setOtpValue] = useState<string[]>(otpToArray(''));
  console.log('🚀 ~ file: OTPInput.tsx ~ line 32 ~ OTPInput ~ otpValue', otpValue);
  const onChangeHandler = ({ value }: { value?: string }, i: number): void => {
    console.log('onChange', value);
    const newOtpValue = otpValue.slice();

    newOtpValue[i] = value?.trim().length === 1 ? value.trim() : '';
    console.log('value set', newOtpValue);
    setOtpValue(newOtpValue);
    if (value && value.trim().length === 1) {
      inputRefs[i + 1]?.current?.focus();
      inputRefs[i + 1]?.current?.select();
    }
  };
  for (let i = 0; i < otpLength; i++) {
    const ref = React.createRef<HTMLInputElement>();
    inputRefs.push(ref);
    inputs.push(
      <Box flex={1} paddingLeft={i == 0 ? 'spacing.0' : 'spacing.3'} key={`otp-input-${i}`}>
        <BaseInput
          label=""
          id={`otp-input-${i}`}
          textAlign="center"
          ref={ref}
          value={otpValue[i]}
          maxCharacters={1}
          onChange={(event) => onChangeHandler(event, i)}
          onKeyDown={(e) => {
            console.log('🚀 Key DOWN', e.code, e.key);
            if (e.code === 'Backspace') {
              e.preventDefault();
              const newOtpValue = otpValue.slice();
              newOtpValue[i] = '';
              setOtpValue(newOtpValue);
              // setOtpValue(otpValue);
              inputRefs[i - 1]?.current?.focus();
              inputRefs[i - 1]?.current?.select();
            } else if (e.code === 'Delete' || e.key === 'Delete') {
              e.preventDefault();
              const newOtpValue = otpValue.slice();
              newOtpValue[i] = '';
              setOtpValue(newOtpValue);
              // setOtpValue(otpValue);
              inputRefs[i - 1]?.current?.focus();
              inputRefs[i - 1]?.current?.select();
            } else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Space') {
              e.preventDefault();
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
