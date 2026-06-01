/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { CountryCodeType } from '@razorpay/i18nify-js';
import {
  formatPhoneNumber,
  getDialCodeByCountryCode,
  getFlagsForAllCountries,
} from '@razorpay/i18nify-js';
import React from 'react';
import type { TextInput } from 'react-native';
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
  const inputRef = React.useRef<TextInput | null>(null);
  const mergedRef = useMergeRefs(ref, inputRef);

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
            inputRef.current.clear();
            inputRef.current.focus();
          }
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
      .filter((countryCode) => !countryCode.includes('-'))
      .map((countryCode) => {
        return {
          code: countryCode,
          name: countryNameFormatter.of(countryCode)!,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allowedCountries, flags]);

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

  const currentValueRef = React.useRef<string | undefined>(defaultValue ?? value);

  const onItemClick = ({ name: countryCode }: { name: string }): void => {
    const newCountry = countryCode as CountryCodeType;
    setSelectedCountry(() => newCountry);
    handleOnChange({
      selectedCountry: newCountry,
      name,
      value: currentValueRef.current,
    });
    inputRef.current?.focus();
  };

  return (
    <BaseInput
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
            isDisabled={isDisabled}
            selectedCountry={selectedCountry}
            onItemClick={onItemClick}
          />
        ) : null
      }
      onChange={({ name, value }) => {
        currentValueRef.current = value;
        if (value?.length) {
          setShouldShowClearButton(true);
        }
        if (shouldShowClearButton && !value?.length) {
          setShouldShowClearButton(false);
        }
        handleOnChange({ name, value, selectedCountry });
      }}
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

const PhoneNumberInput = assignWithoutSideEffects(React.forwardRef(_PhoneNumberInput), {
  displayName: 'PhoneNumberInput',
});

export { PhoneNumberInput };
