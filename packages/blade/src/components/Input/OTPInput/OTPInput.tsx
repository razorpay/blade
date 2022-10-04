import React, { useEffect, useState } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { getHintType } from '../BaseInput/BaseInput';
import Box from '~components/Box';
import { getPlatformType } from '~utils';
import type { FormInputOnEvent } from '~components/Form';
import { FormHint, FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import type { FormInputOnKeyDownEvent } from '~components/Form/FormTypes';

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
> & {
  /**
   * Determines the number of input fields to show for the OTP
   * @default 6
   */
  otpLength?: 4 | 6;
  /**
   * The callback function to be invoked when all the values of the OTPInput are filled
   */
  onOTPFilled?: FormInputOnEvent;
};

const isReactNative = getPlatformType() === 'react-native';

const otpToArray = (code?: string): string[] => code?.split('') ?? Array(6).fill('');

const OTPInput = ({
  autoFocus,
  errorText,
  helpText,
  isDisabled,
  keyboardReturnKeyType,
  keyboardType = 'decimal',
  label,
  labelPosition,
  name,
  onChange,
  onOTPFilled,
  otpLength = 6,
  placeholder,
  successText,
  validationState,
  value: inputValue,
}: OTPInputProps): React.ReactElement => {
  const inputs = [];
  const inputRefs: React.RefObject<HTMLInputElement>[] = [];
  const [otpValue, setOtpValue] = useState<string[]>(otpToArray(inputValue));
  const isLabelLeftPositioned = labelPosition === 'left';
  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('otp');

  const setOtpValueByIndex = ({ value, index }: { value: string; index: number }): string => {
    const newOtpValue = Array.from(otpValue);
    newOtpValue[index] = value;
    setOtpValue(newOtpValue);
    return newOtpValue.join('');
  };

  const focusOnOtpByIndex = (index: number): void => {
    inputRefs[index]?.current?.focus();
    if (!isReactNative) {
      inputRefs[index]?.current?.select();
    }
  };

  useEffect(() => {
    if (onChange) {
      onChange({ name, value: otpValue.join('') });
    }
  }, [otpValue, onChange, name]);

  useEffect(() => {
    if (inputValue) {
      if (inputValue.length >= otpLength && onOTPFilled) {
        onOTPFilled({ value: inputValue.slice(0, otpLength), name });
      }
    } else if (otpValue.join('').length >= otpLength && onOTPFilled) {
      onOTPFilled({ value: otpValue.slice(0, otpLength).join(''), name });
    }
  }, [otpValue, otpLength, name, inputValue, onOTPFilled]);

  const handleOnChange = ({
    value,
    currentOtpIndex,
  }: {
    value?: string;
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
    } else if (otpValue[currentOtpIndex] !== value?.trim()) {
      setOtpValueByIndex({
        value: value?.trim() ?? '',
        index: currentOtpIndex,
      });
    }
  };

  const handleOnInput = ({
    value,
    currentOtpIndex,
  }: {
    value?: string;
    currentOtpIndex: number;
  }): void => {
    if (value && value.trim().length === 1) {
      focusOnOtpByIndex(++currentOtpIndex);
    }
  };

  const handleOnKeyDown = ({
    key,
    code,
    event,
    currentOtpIndex,
  }: FormInputOnKeyDownEvent & { currentOtpIndex: number }): void => {
    if (key === 'Backspace' || code === 'Backspace' || code === 'Delete' || key === 'Delete') {
      if (!isReactNative) {
        event.preventDefault();
      }
      handleOnChange({ value: '', currentOtpIndex });
      focusOnOtpByIndex(--currentOtpIndex);
    } else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
      if (!isReactNative) {
        event.preventDefault();
      }
      focusOnOtpByIndex(--currentOtpIndex);
    } else if (key === 'ArrowRight' || code === 'ArrowRight') {
      if (!isReactNative) {
        event.preventDefault();
      }
      focusOnOtpByIndex(++currentOtpIndex);
    } else if (key === ' ' || code === 'Space') {
      if (!isReactNative) {
        event.preventDefault();
      }
    }
  };

  for (let index = 0; index < otpLength; index++) {
    const currentValue = inputValue ? otpToArray(inputValue)[index] || '' : otpValue[index] || '';
    const ref = React.createRef<HTMLInputElement>();
    inputRefs.push(ref);
    inputs.push(
      <Box
        flex={1}
        paddingLeft={index == 0 ? 'spacing.0' : 'spacing.3'}
        key={`${inputId}-${index}`}
        maxWidth={100}
      >
        <BaseInput
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={autoFocus && index === 0}
          accessibilityLabel={`${index === 0 ? label : ''} character ${index + 1}`}
          label=""
          id={`${inputId}-${index}`}
          textAlign="center"
          ref={ref}
          value={currentValue}
          maxCharacters={otpValue[index]?.length > 0 ? 1 : undefined}
          onChange={(formEvent) => handleOnChange({ ...formEvent, currentOtpIndex: index })}
          onInput={(formEvent) => handleOnInput({ ...formEvent, currentOtpIndex: index })}
          onKeyDown={(keyboardEvent) =>
            handleOnKeyDown({ ...keyboardEvent, currentOtpIndex: index })
          }
          isDisabled={isDisabled}
          placeholder={Array.from(placeholder ?? '')[index] ?? ''}
          isRequired
          autoCompleteSuggestionType="oneTimeCode"
          keyboardType={keyboardType}
          keyboardReturnKeyType={keyboardReturnKeyType}
          validationState={validationState}
        />
      </Box>,
    );
  }
  return (
    // TODO: Use proper maxWidth for the component
    <>
      <Box
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
        position="relative"
      >
        <FormLabel as="label" position={labelPosition}>
          {label}
        </FormLabel>
        <Box display="flex" flexDirection="row">
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
    </>
  );
};

export { OTPInput };
