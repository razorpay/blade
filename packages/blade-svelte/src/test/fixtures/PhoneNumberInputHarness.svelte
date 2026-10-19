<script lang="ts">
  import type { PhoneCountry, PhoneParts } from '../../runes/phone/parts';
  import { provideAdapters } from '../../adapters';
  import PhoneNumberInput from '../../components/phone-number-input/PhoneNumberInput.svelte';
  import BladeProvider from '../../components/blade-provider/BladeProvider.svelte';
  import TestHost from '../host/TestHost.svelte';
  import type { ComponentDefaults } from '../../components/defaults';

  interface Props {
    value?: string;
    country?: string;
    allowedCountries?: string[];
    isCountryFixed?: boolean;
    showDialCode?: boolean;
    onChange?: (change: PhoneParts) => void;
    onCountryChange?: (change: { country: string }) => void;
    /** The test host presents the country list as a sheet, as an app's presenter. */
    presenter?: boolean;
    reportError?: (error: unknown) => void;
    /** The app's own presenter (`adapters.presentDropdown`). */
    presentDropdown?: import('../../adapters').PresentDropdownAdapter;
    /** The app's defaults: the picker's Modal follows them. */
    defaults?: ComponentDefaults;
    trailing?: import('../../runes/icon/source').IconSource;
    size?: 'medium' | 'large';
    /** The app's form around the field. */
    form?: import('../../runes/form/types').FormAdapter;
    placeholder?: string;
    /** Countries added after the three, for a long list. @default 0 */
    extraCountries?: number;
  }

  let {
    value = $bindable(''),
    country = $bindable('IN'),
    allowedCountries,
    isCountryFixed,
    showDialCode,
    onChange,
    onCountryChange,
    presenter = false,
    reportError,
    presentDropdown,
    defaults,
    trailing,
    size,
    form,
    placeholder,
    extraCountries = 0,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ reportError, presentDropdown, form });

  let phone = $state<ReturnType<typeof PhoneNumberInput>>();

  const countries: PhoneCountry[] = [
    {
      code: 'IN',
      name: 'India',
      dialCode: '+91',
      flag: '/flags/in.svg',
      pattern: '[6-9]\\d{9}',
      maxLength: 10,
    },
    { code: 'MY', name: 'Malaysia', dialCode: '+60', flag: '/flags/my.svg' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    // svelte-ignore state_referenced_locally
    ...Array.from({ length: extraCountries }, (_, index) => ({
      code: `X${index}`,
      name: `Country ${index}`,
      dialCode: `+${900 + index}`,
    })),
  ];
</script>

{#snippet field()}
  <PhoneNumberInput
    bind:this={phone}
    {countries}
    {allowedCountries}
    bind:value
    bind:country
    {isCountryFixed}
    {showDialCode}
    {onChange}
    {onCountryChange}
    name="contact"
    label="Phone"
    countryLabel="Country"
    closeLabel="Close"
    testID="phone"
    {trailing}
    {size}
    {placeholder}
  />
{/snippet}

<!-- Blade's dropdown under the field; with `presenter`, the test host's sheet. -->
{#if presenter}
  <TestHost {defaults} presentsDropdowns>{@render field()}</TestHost>
{:else}
  <BladeProvider {defaults}>{@render field()}</BladeProvider>
{/if}
<button type="button" data-testid="focus" onclick={() => phone?.focus()}>
  Focus
</button>
<output data-testid="value">{value}</output>
<output data-testid="country">{country}</output>
