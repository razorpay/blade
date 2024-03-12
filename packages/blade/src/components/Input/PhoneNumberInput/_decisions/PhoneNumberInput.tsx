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
import { ActionList, ActionListItem, ActionListItemAsset } from '~components/ActionList';
import isEmpty from '~utils/lodashButBetter/isEmpty';

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
}: PhoneNumberInputProps): React.ReactElement => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const inputWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const [shouldShowClearButton, setShouldShowClearButton] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState<CountryCodeType>(defaultCountryCode);

  React.useEffect(() => {
    setShouldShowClearButton(Boolean(defaultValue ?? value));
  }, [defaultValue, value]);

  const renderInteractionElement = (): React.ReactNode => {
    if (shouldShowClearButton) {
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
    }

    return null;
  };

  const flags = getFlagsForAllCountries();
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
      type="text"
      trailingInteractionElement={renderInteractionElement()}
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
                {(Object.keys(flags) as CountryCodeType[]).sort().map((countryCode) => {
                  const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(
                    countryCode,
                  )!;
                  return (
                    <ActionListItem
                      key={countryCode}
                      onClick={({ name }) => {
                        setSelectedCountry(name as CountryCodeType);
                        inputRef.current?.focus();
                      }}
                      leading={<ActionListItemAsset src={flags[countryCode]} alt={countryName} />}
                      title={countryName}
                      value={countryCode}
                      // trailing={
                      //   <ActionListItemText>{getDialCodeByCountryCode('AQ')}</ActionListItemText>
                      // }
                    />
                  );
                })}
              </ActionList>
            </DropdownOverlay>
          </Dropdown>
        ) : null
      }
      onChange={({ name, value }) => {
        // if (showClearButton && value?.length) {
        //   // show the clear button when the user starts typing in
        //   setShouldShowClearButton(true);
        // }

        // if (shouldShowClearButton && !value?.length) {
        //   // hide the clear button when the input field is empty
        //   setShouldShowClearButton(false);
        // }

        onChange?.({ name, value });
      }}
      onFocus={onFocus}
      onBlur={onBlur}
      // onSubmit={onSubmit}
      // isDisabled={isDisabled}
      // trailingIcon={InfoIcon}
      // accessibilityLabel={accessibilityLabel}
      placeholder={formatPhoneNumber('1234567890', selectedCountry)}
      necessityIndicator={necessityIndicator}
      isRequired={isRequired}
      leadingIcon={leadingIcon}
      validationState={validationState}
      errorText={errorText}
      helpText={helpText}
      successText={successText}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      // autoFocus={autoFocus}
      // testID={testID}
      // {...getKeyboardAndAutocompleteProps({
      //   type,
      //   keyboardReturnKeyType,
      //   autoCompleteSuggestionType,
      //   autoCapitalize,
      // })}
      size={size}
      // {...styledProps}
    />
  );
};

export { PhoneNumberInput };
