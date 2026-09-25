<script lang="ts">
  import { untrack } from 'svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { useFormId } from '../BaseInput/useFormId';
  import BaseInput from '../BaseInput/BaseInput.svelte';
  import IconButton from '../../Button/IconButton/IconButton.svelte';
  import { CloseIcon } from '../../Icons';
  import CountrySelector from './CountrySelector.svelte';
  import {
    formatPhoneNumberSafe,
    getPhoneCountryList,
    normalizeCountry,
    resolvePhoneCountry,
  } from './utils';
  import type { PhoneCountryCode, PhoneNumberInputProps } from './types';

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
    countries,
    placeholder,
    id,
    portalTarget,
    ...rest
  }: PhoneNumberInputProps = $props();

  // `id` is read once on purpose: form ids must stay stable for the component's lifetime.
  const ids = useFormId('phone-number-input', untrack(() => id));

  let baseInput = $state<{ focus: () => void; getInput: () => HTMLInputElement | null } | null>(
    null,
  );

  // Controllable country state: seed from defaultCountry; `country` prop makes it controlled.
  const isCountryControlled = untrack(() => country !== undefined);
  let internalCountry = $state<PhoneCountryCode>(untrack(() => defaultCountry));
  const selectedCountry = $derived(
    isCountryControlled ? (country as PhoneCountryCode) : internalCountry,
  );

  let shouldShowClearButton = $state(untrack(() => Boolean(defaultValue ?? value)));

  // Consumer list is the single data source when given; i18nify otherwise.
  const customCountries = $derived(countries?.map(normalizeCountry));
  const countryData = $derived(
    getPhoneCountryList({ countries: customCountries, allowedCountries }),
  );
  // Look the selection up in the unfiltered list so `allowedCountries` cannot hide
  // the selected country's dial code / flag.
  const lookupList = $derived(customCountries ?? countryData);
  const selectedCountryInfo = $derived(resolvePhoneCountry(selectedCountry, lookupList));

  const resolvedPrefix = $derived(
    showDialCode && selectedCountryInfo.dialCode ? selectedCountryInfo.dialCode : undefined,
  );
  const resolvedPlaceholder = $derived(
    placeholder ?? formatPhoneNumberSafe('1234567890', selectedCountry),
  );

  const emitChange = ({
    changeName,
    changeValue,
    changeCountry,
  }: {
    changeName?: string;
    changeValue?: string;
    changeCountry: PhoneCountryCode;
  }): void => {
    onChange?.({
      name: changeName ?? '',
      value: changeValue ?? '',
      phoneNumber: changeValue ? formatPhoneNumberSafe(changeValue, changeCountry) : undefined,
      dialCode: resolvePhoneCountry(changeCountry, lookupList).dialCode,
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

  const handleCountrySelect = ({ name: nextCountry }: { name: string }): void => {
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
    emitChange({ changeName: el?.name, changeValue: '', changeCountry: selectedCountry });
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
      {isDisabled}
      selectedCountry={selectedCountryInfo}
      {portalTarget}
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
  id={ids.baseId}
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
  onInput={handleInputChange}
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
