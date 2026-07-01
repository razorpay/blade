<script lang="ts">
  import { untrack } from 'svelte';
  import {
    formatPhoneNumber,
    getDialCodeByCountryCode,
    getFlagsForAllCountries,
  } from '@razorpay/i18nify-js';
  import type { CountryCodeType } from '@razorpay/i18nify-js';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import BaseInput from '../BaseInput/BaseInput.svelte';
  import IconButton from '../../Button/IconButton/IconButton.svelte';
  import { CloseIcon } from '../../Icons';
  import CountrySelector from './CountrySelector.svelte';
  import type { PhoneNumberInputProps } from './types';

  const countryNameFormatter = new Intl.DisplayNames(['en'], { type: 'region' });

  let {
    defaultCountry = 'IN',
    country,
    onCountryChange,
    label,
    labelPosition,
    labelSuffix,
    labelTrailing,
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
    ...rest
  }: PhoneNumberInputProps = $props();

  let baseInput = $state<{ focus: () => void; getInput: () => HTMLInputElement | null } | null>(
    null,
  );

  // Controllable country state: seed from defaultCountry; `country` prop makes it controlled.
  const isCountryControlled = untrack(() => country !== undefined);
  let internalCountry = $state<CountryCodeType>(untrack(() => defaultCountry as CountryCodeType));
  const selectedCountry = $derived(
    isCountryControlled ? (country as CountryCodeType) : internalCountry,
  );

  let shouldShowClearButton = $state(untrack(() => Boolean(defaultValue ?? value)));

  const flags = untrack(() => getFlagsForAllCountries()) as Record<string, { '4X3': string }>;

  const countryData = $derived.by(() => {
    if (allowedCountries) {
      return allowedCountries.map((countryCode) => ({
        code: countryCode,
        name: countryNameFormatter.of(countryCode) ?? countryCode,
      }));
    }
    return (Object.keys(flags) as CountryCodeType[])
      .filter((countryCode) => !countryCode.includes('-'))
      .map((countryCode) => ({
        code: countryCode,
        name: countryNameFormatter.of(countryCode) ?? countryCode,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  const dialCode = $derived(getDialCodeByCountryCode(selectedCountry));
  const resolvedPrefix = $derived(showDialCode ? dialCode : undefined);
  const resolvedPlaceholder = $derived(
    placeholder ?? formatPhoneNumber('1234567890', selectedCountry),
  );

  const emitChange = ({
    changeName,
    changeValue,
    changeCountry,
  }: {
    changeName?: string;
    changeValue?: string;
    changeCountry: CountryCodeType;
  }): void => {
    onChange?.({
      name: changeName,
      value: changeValue,
      phoneNumber: changeValue ? formatPhoneNumber(changeValue, changeCountry) : undefined,
      dialCode: getDialCodeByCountryCode(changeCountry),
      country: changeCountry,
    });
  };

  const handleInputChange = ({ name: n, value: v }: { name?: string; value?: string }): void => {
    if (v?.length) {
      shouldShowClearButton = true;
    }
    if (shouldShowClearButton && !v?.length) {
      shouldShowClearButton = false;
    }
    emitChange({ changeName: n, changeValue: v, changeCountry: selectedCountry });
  };

  const handleCountrySelect = ({ name: countryCode }: { name: string }): void => {
    const nextCountry = countryCode as CountryCodeType;
    if (!isCountryControlled) {
      internalCountry = nextCountry;
    }
    onCountryChange?.({ country: nextCountry });
    const el = baseInput?.getInput();
    emitChange({ changeName: el?.name, changeValue: el?.value, changeCountry: nextCountry });
    baseInput?.focus();
  };

  const clearInput = (): void => {
    const el = baseInput?.getInput();
    if (!value && el) {
      el.value = '';
      el.focus();
    }
    onClearButtonClick?.();
    baseInput?.focus();
    shouldShowClearButton = false;
  };

  export function focus(): void {
    baseInput?.focus();
  }
  export function getInput(): HTMLInputElement | null {
    return baseInput?.getInput() ?? null;
  }

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

{#snippet countrySelectorSlot()}
  {#if showCountrySelector}
    <CountrySelector
      {size}
      {countryData}
      {flags}
      {isDisabled}
      {selectedCountry}
      onItemClick={handleCountrySelect}
    />
  {/if}
{/snippet}

{#snippet clearButtonSlot()}
  {#if shouldShowClearButton}
    <IconButton
      size="medium"
      icon={CloseIcon}
      {isDisabled}
      accessibilityLabel="Clear Input Content"
      onClick={clearInput}
    />
  {/if}
{/snippet}

<BaseInput
  bind:this={baseInput}
  id="phone-number-input"
  componentName="phone-number-input"
  label={label ?? ''}
  hideLabelText={!label}
  {labelPosition}
  {labelSuffix}
  {labelTrailing}
  {defaultValue}
  {value}
  {name}
  placeholder={resolvedPlaceholder}
  {leadingIcon}
  {trailingIcon}
  prefix={resolvedPrefix}
  leadingInteractionElement={showCountrySelector ? countrySelectorSlot : undefined}
  trailingInteractionElement={shouldShowClearButton ? clearButtonSlot : undefined}
  onChange={handleInputChange}
  {onClick}
  {onFocus}
  {onBlur}
  {isDisabled}
  {accessibilityLabel}
  {necessityIndicator}
  {isRequired}
  {validationState}
  {errorText}
  {helpText}
  {successText}
  {autoFocus}
  {testID}
  {size}
  {keyboardReturnKeyType}
  {autoCompleteSuggestionType}
  type="telephone"
  {...analyticsAttrs}
  {...rest}
/>
