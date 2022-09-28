import type { KeyboardEvent } from 'react';
import React, { useState } from 'react';
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

const otpToArray = (code?: string): string[] => code?.split('') ?? [];

const OTPInput = ({ otpLength = 4 }: OTPInputProps): React.ReactElement => {
  const inputs = [];
  const inputRefs: React.RefObject<HTMLInputElement>[] = [];
  const [otpValue, setOtpValue] = useState<string[]>(otpToArray(''));

  const setOtpValueByIndex = ({ value, index }: { value: string; index: number }): void => {
    const newOtpValue = Array.from(otpValue);
    newOtpValue[index] = value;
    setOtpValue(newOtpValue);
  };

  const focusOnOtpByIndex = ({ index }: { index: number }): void => {
    inputRefs[index]?.current?.focus();
    if (inputRefs[index]?.current?.select) inputRefs[index]?.current?.select();
  };

  const handleOnChange = (
    { value }: { value?: string; name?: string },
    currentOtpIndex: number,
  ): void => {
    if (value && value === ' ') {
      return;
    }
    setOtpValueByIndex({ value: value?.trim() ?? '', index: currentOtpIndex });
    if (value && value.trim().length === 1) {
      focusOnOtpByIndex({ index: currentOtpIndex + 1 });
    }
  };

  const handleOnKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    currentOtpIndex: number,
  ): void => {
    const { key, code } = event;
    if (key === 'Backspace' || code === 'Backspace' || code === 'Delete' || key === 'Delete') {
      console.log('IN');
      if (event.preventDefault) {
        event.preventDefault();
      }
      setOtpValueByIndex({ value: '', index: currentOtpIndex });
      focusOnOtpByIndex({ index: currentOtpIndex - 1 });
    } else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
      if (event.preventDefault) {
        event.preventDefault();
      }
      focusOnOtpByIndex({ index: currentOtpIndex - 1 });
    } else if (key === 'ArrowRight' || code === 'ArrowRight') {
      if (event.preventDefault) {
        event.preventDefault();
      }
      focusOnOtpByIndex({ index: currentOtpIndex + 1 });
    } else if (key === ' ' || code === 'Space') {
      if (event.preventDefault) {
        event.preventDefault();
      }
    }
  };

  for (let currentOtpIndex = 0; currentOtpIndex < otpLength; currentOtpIndex++) {
    const ref = React.createRef<HTMLInputElement>();
    inputRefs.push(ref);
    inputs.push(
      <Box
        flex={1}
        paddingLeft={currentOtpIndex == 0 ? 'spacing.0' : 'spacing.3'}
        key={`otp-input-${currentOtpIndex}`}
      >
        <BaseInput
          label=""
          id={`otp-input-${currentOtpIndex}`}
          textAlign="center"
          ref={ref}
          value={otpValue[currentOtpIndex]}
          maxCharacters={1}
          onChange={(formEvent) => handleOnChange(formEvent, currentOtpIndex)}
          onKeyDown={(keyboardEvent) => handleOnKeyDown(keyboardEvent, currentOtpIndex)}
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
