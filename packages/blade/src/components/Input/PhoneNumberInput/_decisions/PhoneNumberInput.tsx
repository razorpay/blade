/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { CountryCodeType } from '@razorpay/i18nify-js';
import {
  formatPhoneNumber,
  getFlagOfCountry,
  getDialCodeByCountryCode,
  getFlagsForAllCountries,
} from '@razorpay/i18nify-js';
import React from 'react';
import type { PhoneNumberInputProps } from './types';
import { BaseInput } from '~components/Input/BaseInput';
import { IconButton } from '~components/Button/IconButton';
import { CloseIcon } from '~components/Icons';
import { Dropdown, DropdownButton, DropdownOverlay } from '~components/Dropdown';
import {
  ActionList,
  ActionListItem,
  ActionListItemAsset,
  ActionListItemText,
} from '~components/ActionList';
import isEmpty from '~utils/lodashButBetter/isEmpty';

const countryNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });

const PhoneNumberInput = ({
  defaultCountryCode = 'IN',
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
  onBlur,
  onFocus,
  accessibilityLabel,
  autoFocus,
  testID,
  ...styledProps
}: PhoneNumberInputProps): React.ReactElement => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [shouldShowClearButton, setShouldShowClearButton] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryCodeType>(defaultCountryCode);

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
    return (Object.keys(flags) as CountryCodeType[])
      .map((countryCode) => {
        return {
          code: countryCode,
          name: countryNameFormatter.of(countryCode)!,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [flags]);

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
      countryCode: selectedCountry,
    });
  };

  return (
    <BaseInput
      setInputWrapperRef={(node) => {
        inputWrapperRef.current = node as HTMLInputElement;
      }}
      ref={inputRef}
      id="textinput"
      componentName="PhoneNumberInput"
      label={label as string}
      hideLabelText={!Boolean(label)}
      labelPosition={labelPosition}
      defaultValue={defaultValue}
      value={value}
      name={name}
      type="number"
      trailingInteractionElement={renderTrailingInteractionElement()}
      prefix={showDialCode ? getDialCodeByCountryCode(selectedCountry) : undefined}
      leadingInteractionElement={
        showCountrySelector ? (
          <Dropdown>
            <DropdownButton
              size="xsmall"
              variant="tertiary"
              icon={() => <img width="24px" src={getFlagOfCountry(selectedCountry)} alt="" />}
            />
            <DropdownOverlay referenceRef={inputWrapperRef}>
              <ActionList>
                {countryData.map((country) => {
                  return (
                    <ActionListItem
                      key={country.code}
                      onClick={({ name }) => {
                        const selectedCountry = name as CountryCodeType;
                        setSelectedCountry(selectedCountry);
                        handleOnChange({
                          selectedCountry,
                          name: inputRef.current?.name,
                          value: inputRef.current?.value,
                        });
                        inputRef.current?.focus();
                      }}
                      leading={<ActionListItemAsset src={flags[country.code]} alt={country.name} />}
                      title={country.name}
                      value={country.code}
                      trailing={
                        <ActionListItemText>
                          {getDialCodeByCountryCode(country.code)}
                        </ActionListItemText>
                      }
                    />
                  );
                })}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
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
      onFocus={onFocus}
      onBlur={onBlur}
      // onSubmit={onSubmit}
      isDisabled={isDisabled}
      trailingIcon={trailingIcon}
      accessibilityLabel={accessibilityLabel}
      placeholder={formatPhoneNumber('1234567890', selectedCountry)}
      necessityIndicator={necessityIndicator}
      isRequired={isRequired}
      leadingIcon={leadingIcon}
      validationState={validationState}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={autoFocus}
      testID={testID}
      // {...getKeyboardAndAutocompleteProps({
      //   type,
      //   keyboardReturnKeyType,
      //   autoCompleteSuggestionType,
      //   autoCapitalize,
      // })}
      size={size}
      {...styledProps}
    />
  );
};

export { PhoneNumberInput };
