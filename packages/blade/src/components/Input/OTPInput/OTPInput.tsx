import type { KeyboardEvent } from 'react';
import React, { useEffect, useState } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { getHintType } from '../BaseInput/BaseInput';
import Box from '~components/Box';
import { getPlatformType } from '~utils';
import { FormHint, FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';

export type OTPInputProps = Pick<
  BaseInputProps,
  | 'label'
  | 'labelPosition'
  | 'validationState'
  | 'helpText'
  | 'errorText'
  | 'successText'
  | 'name'
  | 'onChange'
  | 'value'
  | 'isDisabled'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
  | 'keyboardType'
  | 'placeholder'
  | 'id'
> & {
  otpLength: 4 | 6;
};

const isReactNative = getPlatformType() === 'react-native';

const otpToArray = (code?: string): string[] => code?.split('') ?? [];

const OTPInput = ({
  otpLength = 4,
  value: inputValue,
  onChange,
  placeholder,
  isDisabled,
  autoFocus,
  label,
  labelPosition,
  validationState,
  helpText,
  errorText,
  successText,
  id,
  keyboardType = 'decimal',
}: OTPInputProps): React.ReactElement => {
  const inputs = [];
  const inputRefs: React.RefObject<HTMLInputElement>[] = [];
  const [otpValue, setOtpValue] = useState<string[]>(otpToArray(inputValue));
  console.log('🚀 ~ file: OTPInput.tsx ~ line 54 ~ otpValue', otpValue);
  const isLabelLeftPositioned = labelPosition === 'left';
  const { inputId, helpTextId, errorTextId, successTextId } = useFormId(id);

  const setOtpValueByIndex = ({ value, index }: { value: string; index: number }): string => {
    const newOtpValue = Array.from(otpValue);
    newOtpValue[index] = value;
    setOtpValue(newOtpValue);
    return newOtpValue.join('');
  };

  const focusOnOtpByIndex = ({ index }: { index: number }): void => {
    inputRefs[index]?.current?.focus();
    if (!isReactNative) {
      inputRefs[index]?.current?.select();
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange({ name: '', value: otpValue.join('') });
    }
  }, [otpValue, onChange]);

  const handleOnChange = ({
    value,
    currentOtpIndex,
  }: {
    value?: string;
    name?: string;
    currentOtpIndex: number;
  }): void => {
    if (value && value === ' ') {
      return;
    }

    if (inputValue && inputValue.length > 0) {
      const newOtpValue = Array.from(inputValue);
      newOtpValue[currentOtpIndex] = value ?? '';
      setOtpValue(newOtpValue);
    } else if (value && value.trim().length > 1) {
      setOtpValue(Array.from(value));
    } else {
      setOtpValueByIndex({
        value: value?.trim() ?? '',
        index: currentOtpIndex,
      });
    }

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
      if (!isReactNative) {
        event.preventDefault();
      }
      handleOnChange({ value: '', currentOtpIndex });

      focusOnOtpByIndex({ index: currentOtpIndex - 1 });
    } else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
      if (!isReactNative) {
        event.preventDefault();
      }

      focusOnOtpByIndex({ index: currentOtpIndex - 1 });
    } else if (key === 'ArrowRight' || code === 'ArrowRight') {
      if (!isReactNative) {
        event.preventDefault();
      }
      focusOnOtpByIndex({ index: currentOtpIndex + 1 });
    } else if (key === ' ' || code === 'Space') {
      if (!isReactNative) {
        event.preventDefault();
      }
    }
  };

  for (let currentOtpIndex = 0; currentOtpIndex < otpLength; currentOtpIndex++) {
    const currentValue = inputValue
      ? otpToArray(inputValue)[currentOtpIndex] || ''
      : otpValue[currentOtpIndex] || '';
    const ref = React.createRef<HTMLInputElement>();
    inputRefs.push(ref);
    inputs.push(
      <Box
        flex={1}
        paddingLeft={currentOtpIndex == 0 ? 'spacing.0' : 'spacing.3'}
        key={`${inputId}-${currentOtpIndex}`}
      >
        <BaseInput
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus && currentOtpIndex === 0}
          label=""
          id={`${inputId}-${currentOtpIndex}`}
          textAlign="center"
          ref={ref}
          value={currentValue}
          maxCharacters={otpValue[currentOtpIndex]?.length > 0 ? 1 : undefined}
          onChange={(formEvent) => handleOnChange({ ...formEvent, currentOtpIndex })}
          onKeyDown={(keyboardEvent) => handleOnKeyDown(keyboardEvent, currentOtpIndex)}
          isDisabled={isDisabled}
          placeholder={Array.from(placeholder ?? '')[currentOtpIndex] ?? ''}
          isRequired
          autoCompleteSuggestionType="oneTimeCode"
          keyboardType={keyboardType}
        />
      </Box>,
    );
  }
  return (
    // TODO: Use proper maxWidth for the component
    <Box>
      <Box
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
        position="relative"
      >
        <FormLabel as="label" position={labelPosition} htmlFor="otp-input-0">
          {label}
        </FormLabel>
        <Box display="flex" flexDirection="row" maxWidth={400}>
          {inputs}
        </Box>
      </Box>
      <Box marginLeft={isLabelLeftPositioned ? 136 : 0}>
        <FormHint
          type={getHintType({ validationState, hasHelpText: Boolean(helpText) })}
          helpText={helpText}
          errorText={errorText}
          successText={successText}
          helpTextId={helpTextId}
          errorTextId={errorTextId}
          successTextId={successTextId}
        />
      </Box>
    </Box>
  );
};

export { OTPInput };
