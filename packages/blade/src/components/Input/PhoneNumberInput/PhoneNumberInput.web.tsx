/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { CountryCodeType } from '@razorpay/i18nify-js';
import {
  formatPhoneNumber,
  getDialCodeByCountryCode,
  getFlagsForAllCountries,
} from '@razorpay/i18nify-js';
import React from 'react';
import type { PhoneNumberInputProps } from './types';
import { countryNameFormatter, CountrySelector } from './CountrySelector';
import { BaseInput } from '~components/Input/BaseInput';
import { IconButton } from '~components/Button/IconButton';
import isEmpty from '~utils/lodashButBetter/isEmpty';
import { getKeyboardAndAutocompleteProps } from '~components/Input/BaseInput/utils';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useMergeRefs } from '~utils/useMergeRefs';
import type { BladeElementRef } from '~utils/types';
import { CloseIcon } from '~components/Icons';
import { MetaConstants } from '~utils/metaAttribute';
import { useControllableState } from '~utils/useControllable';
import type { FormInputOnKeyDownEvent, FormInputOnPasteEvent } from '~components/Form/FormTypes';

const NUMBERS_ONLY_REGEX = /^\d+$/;

export const isNumericInput = (input: string): boolean => {
  return NUMBERS_ONLY_REGEX.test(input);
};

export function validateNumericInput(event: FormInputOnKeyDownEvent['event']): void {
  const { key, ctrlKey, metaKey } = event;

  // Check if the entered key is a number; if not, prevent the default action
  const isCharacterKey = key.length === 1;

  // return for non-character keys
  if (ctrlKey || metaKey || !isCharacterKey) {
    return;
  }

  if (!isNumericInput(key)) {
    event.preventDefault();
  }
}

const _PhoneNumberInput: React.ForwardRefRenderFunction<BladeElementRef, PhoneNumberInputProps> = (
  {
    defaultCountry = 'IN',
    country,
    onCountryChange,
    label,
    labelPosition,
    defaultValue,
    value,
    name,
    onChange,
    necessityIndicator,
    isRequired,
    isDisabled,
    leadingIcon,
    trailingIcon,
    validationState,
    errorText,
    helpText,
    successText,
    size = 'medium',
    onClearButtonClick,
    showCountrySelector = true,
    showDialCode = true,
    onClick,
    onBlur,
    onFocus,
    accessibilityLabel = 'Enter phone number',
    autoFocus,
    testID,
    keyboardReturnKeyType = 'done',
    autoCompleteSuggestionType,
    allowedCountries,
    placeholder,
    labelSuffix,
    labelTrailing,
    ...rest
  },
  ref,
): React.ReactElement => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const mergedRef = useMergeRefs(ref, inputRef);

  const inputWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [shouldShowClearButton, setShouldShowClearButton] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = useControllableState<CountryCodeType>({
    defaultValue: defaultCountry as CountryCodeType,
    value: country,
    onChange: (country) => onCountryChange?.({ country }),
  });

  React.useEffect(() => {
    setShouldShowClearButton(Boolean(defaultValue ?? value));
  }, [defaultValue, value]);

  const renderTrailingInteractionElement = (): React.ReactNode => {
    if (!shouldShowClearButton) return null;
    return (
      <IconButton
        size="medium"
        icon={CloseIcon}
        onClick={() => {
          if (isEmpty(value) && inputRef.current) {
            // when the input field is uncontrolled take the ref and clear the input and then call the onClearButtonClick function
            if (inputRef.current instanceof HTMLInputElement) {
              inputRef.current.value = '';
              inputRef.current.focus();
            }
          }
          // if the input field is controlled just call the click handler and the value change shall be left upto the consumer
          onClearButtonClick?.();
          inputRef?.current?.focus();
          setShouldShowClearButton(false);
        }}
        isDisabled={isDisabled}
        accessibilityLabel="Clear Input Content"
      />
    );
  };

  const flags = React.useMemo(() => getFlagsForAllCountries(), []);
  const countryData = React.useMemo(() => {
    if (allowedCountries) {
      return allowedCountries.map((countryCode) => {
        return {
          code: countryCode,
          name: countryNameFormatter.of(countryCode)!,
        };
      });
    }

    return (Object.keys(flags) as CountryCodeType[])
      .filter((countryCode) => !countryCode.includes('-')) // remove the non ISO 3166-1 alpha-2 country codes
      .map((countryCode) => {
        return {
          code: countryCode,
          name: countryNameFormatter.of(countryCode)!,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allowedCountries, flags]);

  const handleKeyDown = (keyboardEvent: FormInputOnKeyDownEvent): void => {
    validateNumericInput(keyboardEvent.event);
  };

  const handlePaste = (pasteEvent: FormInputOnPasteEvent): void => {
    const pastedText = pasteEvent.value?.clipboardData?.getData('text') ?? '';

    // Only allow pastedText if it only has numeric characters
    if (!NUMBERS_ONLY_REGEX.test(pastedText)) {
      pasteEvent?.value?.preventDefault();
    }
  };

  const handleOnChange = ({
    name,
    value,
    selectedCountry,
  }: {
    name?: string;
    value?: string;
    selectedCountry: CountryCodeType;
  }): void => {
    onChange?.({
      name: name!,
      value: value!,
      phoneNumber: value ? formatPhoneNumber(value, selectedCountry) : undefined!,
      dialCode: getDialCodeByCountryCode(selectedCountry),
      country: selectedCountry,
    });
  };

  const onItemClick = ({ name }: { name: string }): void => {
    const selectedCountry = name as CountryCodeType;
    setSelectedCountry(() => selectedCountry);
    handleOnChange({
      selectedCountry,
      name: inputRef.current?.name,
      value: inputRef.current?.value,
    });
    inputRef.current?.focus();
  };

  return (
    <BaseInput
      setInputWrapperRef={(node) => {
        inputWrapperRef.current = node as HTMLInputElement;
      }}
      ref={mergedRef}
      id="phone-number-input"
      componentName={MetaConstants.PhoneNumberInput}
      label={label as string}
      hideLabelText={!Boolean(label)}
      labelPosition={labelPosition}
      defaultValue={defaultValue}
      value={value}
      name={name}
      placeholder={placeholder ?? formatPhoneNumber('1234567890', selectedCountry)}
      trailingIcon={trailingIcon}
      leadingIcon={leadingIcon}
      prefix={showDialCode ? getDialCodeByCountryCode(selectedCountry) : undefined}
      labelSuffix={labelSuffix}
      labelTrailing={labelTrailing}
      trailingInteractionElement={renderTrailingInteractionElement()}
      leadingInteractionElement={
        showCountrySelector ? (
          <CountrySelector
            size={size}
            countryData={countryData}
            flags={flags}
            inputWrapperRef={inputWrapperRef}
            isDisabled={isDisabled}
            selectedCountry={selectedCountry}
            onItemClick={onItemClick}
          />
        ) : null
      }
      onChange={({ name, value }) => {
        if (value?.length) {
          // show the clear button when the user starts typing in
          setShouldShowClearButton(true);
        }
        if (shouldShowClearButton && !value?.length) {
          // hide the clear button when the input field is empty
          setShouldShowClearButton(false);
        }
        handleOnChange({ name, value, selectedCountry });
      }}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      isDisabled={isDisabled}
      accessibilityLabel={accessibilityLabel}
      necessityIndicator={necessityIndicator}
      isRequired={isRequired}
      validationState={validationState}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      testID={testID}
      size={size}
      {...getKeyboardAndAutocompleteProps({
        type: 'number',
        keyboardReturnKeyType,
        autoCompleteSuggestionType,
        autoCapitalize: 'none',
      })}
      type="telephone"
      {...rest}
    />
  );
};

/**
 * PhoneNumberInput is a component that allows users to input phone numbers.
 * It provides a country selector dropdown to select the country code.
 *
 * @example
 *
 * ```ts
 * <PhoneNumberInput />
 * ```
 */
const PhoneNumberInput = assignWithoutSideEffects(React.forwardRef(_PhoneNumberInput), {
  displayName: 'PhoneNumberInput',
});

export { PhoneNumberInput };
