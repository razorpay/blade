import React, { useEffect, useImperativeHandle, useState } from 'react';
import type { BaseInputProps } from '../BaseInput';
import { BaseInput } from '../BaseInput';
import { getHintType } from '../BaseInput/BaseInput';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import type { FormInputOnEvent } from '~components/Form';
import { FormHint, FormLabel } from '~components/Form';
import { useFormId } from '~components/Form/useFormId';
import type { FormInputOnKeyDownEvent } from '~components/Form/FormTypes';
import BaseBox from '~components/Box/BaseBox';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getPlatformType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { makeSize } from '~utils/makeSize';
import type { DataAnalyticsAttribute } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

type FormInputOnEventWithIndex = ({
  name,
  value,
  inputIndex,
}: {
  name?: string;
  value?: string;
  inputIndex: number;
}) => void;

export type OTPInputCommonProps = Pick<
  BaseInputProps,
  | 'label'
  | 'accessibilityLabel'
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
  | 'testID'
  | 'size'
  | keyof DataAnalyticsAttribute
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
  /**
   * Masks input characters in all the fields
   */
  isMasked?: boolean;
  /**
   * Determines what autoComplete suggestion type to show. Defaults to `oneTimeCode`.
   *
   * It's not recommended to turn this off in favor of otp input practices.
   *
   *
   * Internally it'll render platform specific attributes:
   *
   * - web: `autocomplete`
   * - iOS: `textContentType`
   * - android: `autoComplete`
   *
   */
  autoCompleteSuggestionType?: Extract<
    BaseInputProps['autoCompleteSuggestionType'],
    'none' | 'oneTimeCode'
  >;
  /**
   * The callback function to be invoked when one of the input fields gets focus
   */
  onFocus?: FormInputOnEventWithIndex;
  /**
   * The callback function to be invoked when one of the input fields is blurred
   */
  onBlur?: FormInputOnEventWithIndex;
} & StyledPropsBlade;

/*
  Mandatory accessibilityLabel prop when label is not provided
*/
type OTPInputPropsWithA11yLabel = {
  /**
   * Label to be shown for the input field
   */
  label?: undefined;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel: string;
};

/*
  Optional accessibilityLabel prop when label is provided
*/
type OTPInputPropsWithLabel = {
  /**
   * Label to be shown for the input field
   */
  label: string;
  /**
   * Accessibility label for the input
   */
  accessibilityLabel?: string;
};

type OTPInputProps = (OTPInputPropsWithA11yLabel | OTPInputPropsWithLabel) & OTPInputCommonProps;

const isReactNative = getPlatformType() === 'react-native';

/**
 *  Converts a string value of otp to array if passed otherwise returns an array of 6 empty strings
 */
const otpToArray = (code?: string): string[] => code?.split('') ?? Array(6).fill('');

/**
 * OTPInput component can be used for accepting OTPs sent to users for authentication/verification purposes.
 *
 * ## Usage
 *
 * ```tsx
 *   <OTPInput
 *     label="Enter OTP"
 *     name="otpInput"
 *     onChange={({ name, value }): void => console.log({ name, value })}
 *     onOTPFilled={({ name, value }): void => console.log({ name, value })}
 *   />
 * ```
 */
const _OTPInput: React.ForwardRefRenderFunction<HTMLInputElement[], OTPInputProps> = (
  {
    autoFocus,
    errorText,
    helpText,
    isDisabled,
    keyboardReturnKeyType,
    keyboardType = 'decimal',
    label,
    accessibilityLabel,
    labelPosition,
    name,
    onChange,
    onFocus,
    onBlur,
    onOTPFilled,
    otpLength = 6,
    placeholder,
    successText,
    validationState,
    value: inputValue,
    isMasked,
    autoCompleteSuggestionType = 'oneTimeCode',
    testID,
    size = 'medium',
    ...rest
  },
  incomingRef,
) => {
  const inputRefs: React.RefObject<HTMLInputElement>[] = [];
  const [otpValue, setOtpValue] = useState<string[]>(otpToArray(inputValue));
  const [inputType, setInputType] = useState<('password' | undefined)[]>([]);
  const isLabelLeftPositioned = labelPosition === 'left';
  const { inputId, helpTextId, errorTextId, successTextId } = useFormId('otp');

  useImperativeHandle(
    incomingRef,
    () => {
      return inputRefs.map((ref) => ref.current!);
    },
    [inputRefs],
  );

  useEffect(() => {
    // Effect for calling `onOTPFilled` callback
    if (inputValue && inputValue.length >= otpLength) {
      // callback for when the OTPInput is controlled and inputValue reaches the same or greater length as the otpLength
      onOTPFilled?.({ value: inputValue.slice(0, otpLength), name });
    } else if (!inputValue && otpValue.join('').length >= otpLength) {
      // callback for when the OTPInput is uncontrolled and otpValue stored in state reaches the same or greater length as the otpLength
      onOTPFilled?.({ value: otpValue.slice(0, otpLength).join(''), name });
    }
  }, [otpValue, otpLength, name, inputValue, onOTPFilled]);

  useEffect(() => {
    /* We want to disable the password managers for OTPInput when isMasked is set.
       The issue with only setting autocomplete='off' is that its not an enforcement but a suggestion to the browser to follow.
       This workaround unsets type on first render and sets it to `password` only once a value is entered by the user.
    */
    otpValue.forEach((otp, index) => {
      // Set inputType as 'password' only when a value is entered when isMasked is set
      if (!isEmpty(otp) && !inputType[index] && isMasked) {
        const newInputType = Array.from(inputType);
        newInputType[index] = 'password';
        setInputType(newInputType);
      }
      // Cleanup the inputType array whenever the value is empty but inputType[index] is set
      if (isEmpty(otp) && inputType[index]) {
        const newInputType = Array.from(inputType);
        newInputType[index] = undefined;
        setInputType(newInputType);
      }
    });
  }, [otpValue, inputType, isMasked]);

  /**
   * Changes the value of the otp at a given index and updates the otpValue stored in state
   *
   * @param {{ value: string; index: number }} { value, index }
   * @returns {string} updated otpValue
   */
  const setOtpValueByIndex = ({ value, index }: { value: string; index: number }): string => {
    const newOtpValue = Array.from(otpValue);
    newOtpValue[index] = value;
    setOtpValue(newOtpValue);
    return newOtpValue.join('');
  };

  /**
   * Sets focus to the desired otp input by index
   *
   * @param {number} index the index of the otp input to be focused
   */
  const focusOnOtpByIndex = (index: number): void => {
    inputRefs[index]?.current?.focus();
    if (!isReactNative) {
      // React Native doesn't support imperatively selecting the value of input
      inputRefs[index]?.current?.select();
    }
  };

  const handleOnChange = ({
    value,
    currentOtpIndex,
  }: {
    value?: string;
    currentOtpIndex: number;
  }): void => {
    if (value && value === ' ') {
      // React native doesn't support `event.preventDefault()` hence have to add this check to ensure that empty space is not allowed
      return;
    }
    if (inputValue && inputValue.length > 0) {
      // When OTPInput is controlled, set the otpValue as the consumer passed `inputValue` and append the value on current index based on user's input.
      // User's input will not reflect on the otp but will trigger `onChange` callback with the user's input appended so that the consumer can take appropriate action.
      const newOtpValue = Array.from(inputValue);
      newOtpValue[currentOtpIndex] = value ?? '';
      setOtpValue(newOtpValue);
      onChange?.({ name, value: newOtpValue.join('') });
    } else if (value && value.trim().length > 1) {
      // When the entered value is more that 1 character (when value is pasted), set the otpValue to the newly received value.
      // Could have used `onPaste` for web to achieve this but 1. React Native doesn't support onPaste and 2. Safari's autofill on web doesn't trigger onPaste
      setOtpValue(Array.from(value));
      onChange?.({ name, value: value.trim().slice(0, otpLength) });
    } else if (otpValue[currentOtpIndex] !== value?.trim()) {
      // Set the value at the current index to the entered value
      // only as long as its not the same as the already existing value (this prevents `onChange` being triggered unnecessarily)
      const newValue = setOtpValueByIndex({
        value: value?.trim() ?? '',
        index: currentOtpIndex,
      });
      onChange?.({ name, value: newValue });
    }
  };

  const handleOnInput = ({
    value,
    currentOtpIndex,
  }: {
    value?: string;
    currentOtpIndex: number;
  }): void => {
    // Moves focus to next input whenever a value is entered in the current input
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
      event.preventDefault?.();
      handleOnChange({ value: '', currentOtpIndex });
      focusOnOtpByIndex(--currentOtpIndex);
    } else if (key === 'ArrowLeft' || code === 'ArrowLeft') {
      event.preventDefault?.();
      focusOnOtpByIndex(--currentOtpIndex);
    } else if (key === 'ArrowRight' || code === 'ArrowRight') {
      event.preventDefault?.();
      focusOnOtpByIndex(++currentOtpIndex);
    } else if (key === ' ' || code === 'Space') {
      event.preventDefault?.();
    }
  };

  const getHiddenInput = (): React.ReactNode => {
    if (!isReactNative) {
      return (
        <input
          hidden={true}
          id={inputId}
          name={name}
          value={inputValue ?? otpValue.join('') ?? ''}
          readOnly
        />
      );
    }
    return null;
  };

  const getOTPInputFields = (): React.ReactNode => {
    const inputs = [];
    for (let index = 0; index < otpLength; index++) {
      const currentValue = inputValue ? otpToArray(inputValue)[index] || '' : otpValue[index] || '';
      const ref = React.createRef<HTMLInputElement>();
      // if an inputValue is passed (controlled) and isMasked is set, inputType will always be password
      let currentInputType: 'password' | undefined;
      if (isMasked) {
        // if inputValue is passed (controlled component) then the inputType will always be password
        currentInputType = inputValue ? 'password' : inputType[index];
      }
      inputRefs.push(ref);
      inputs.push(
        <BaseBox
          flex={1}
          marginLeft={index == 0 ? 'spacing.0' : 'spacing.3'}
          key={`${inputId}-${index}`}
        >
          <BaseInput
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus={autoFocus && index === 0}
            accessibilityLabel={`${index === 0 ? label || accessibilityLabel : ''} character ${
              index + 1
            }`}
            label={label}
            hideLabelText={true}
            id={`${inputId}-${index}`}
            textAlign="center"
            ref={ref as never}
            name={name}
            value={currentValue}
            maxCharacters={otpValue[index]?.length > 0 ? 1 : undefined}
            onChange={(formEvent) => handleOnChange({ ...formEvent, currentOtpIndex: index })}
            onFocus={(formEvent) => onFocus?.({ ...formEvent, inputIndex: index })}
            onBlur={(formEvent) => onBlur?.({ ...formEvent, inputIndex: index })}
            onInput={(formEvent) => handleOnInput({ ...formEvent, currentOtpIndex: index })}
            onKeyDown={(keyboardEvent) =>
              handleOnKeyDown({ ...keyboardEvent, currentOtpIndex: index })
            }
            isDisabled={isDisabled}
            placeholder={Array.from(placeholder ?? '')[index] ?? ''}
            isRequired={true}
            autoCompleteSuggestionType={autoCompleteSuggestionType}
            keyboardType={keyboardType}
            keyboardReturnKeyType={keyboardReturnKeyType}
            validationState={validationState}
            successText={successText}
            errorText={errorText}
            helpText={helpText}
            hideFormHint={true}
            type={currentInputType}
            size={size}
            valueComponentType="heading"
            {...makeAnalyticsAttribute(rest)}
          />
        </BaseBox>,
      );
    }
    return inputs;
  };

  return (
    <BaseBox {...metaAttribute({ name: MetaConstants.OTPInput, testID })} {...getStyledProps(rest)}>
      <BaseBox
        display="flex"
        flexDirection={isLabelLeftPositioned ? 'row' : 'column'}
        alignItems={isLabelLeftPositioned ? 'center' : undefined}
        position="relative"
      >
        {Boolean(label) && (
          <FormLabel as="label" position={labelPosition} htmlFor={inputId} size={size}>
            {label}
          </FormLabel>
        )}
        <BaseBox display="flex" flexDirection="row">
          {getHiddenInput()}
          {getOTPInputFields()}
        </BaseBox>
      </BaseBox>
      {/* the magic number 136 is basically max-width of label i.e 120 and then right margin i.e 16 which is the spacing between label and input field */}
      {/*Refer `BaseInput`'s implementation of FormHint which uses similar logic */}
      <BaseBox marginLeft={makeSize(isLabelLeftPositioned ? 136 : 0)}>
        <FormHint
          type={getHintType({ validationState, hasHelpText: Boolean(helpText) })}
          helpText={helpText}
          errorText={errorText}
          successText={successText}
          helpTextId={helpTextId}
          errorTextId={errorTextId}
          successTextId={successTextId}
          size={size}
        />
      </BaseBox>
    </BaseBox>
  );
};

const OTPInput = React.forwardRef<HTMLInputElement[], OTPInputProps>(_OTPInput);

export type { OTPInputProps };
export { OTPInput };
