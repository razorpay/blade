<script lang="ts">
  import type { PhoneCountry, PhoneParts } from '../../runes';
  import { provideAdapters } from '../../adapters';
  import ModalStack from '../../components/modal/ModalStack.svelte';
  import { provideOverlays } from '../../components/modal/overlays';
  import Form from '../../components/form/Form.svelte';
  import PhoneNumberInput from '../../components/phone-number-input/PhoneNumberInput.svelte';

  interface Props {
    value?: string;
    country?: string;
    allowedCountries?: string[];
    isCountryFixed?: boolean;
    showDialCode?: boolean;
    isRequired?: boolean;
    searchLabel?: string;
    onChange?: (change: PhoneParts) => void;
    onCountryChange?: (country: string) => void;
    onSubmit?: (values: Record<string, unknown>) => void;
    withStack?: boolean;
    captureError?: (error: unknown) => void;
  }

  let {
    value = $bindable(''),
    country = $bindable('IN'),
    allowedCountries,
    isCountryFixed,
    showDialCode,
    isRequired,
    searchLabel,
    onChange,
    onCountryChange,
    onSubmit,
    withStack = true,
    captureError,
  }: Props = $props();

  // An isolated stack per test: nothing leaks through the global one.
  provideOverlays();
  // svelte-ignore state_referenced_locally
  provideAdapters({ captureError });

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
  ];
</script>

<Form onSubmit={(values) => onSubmit?.(values)}>
  <PhoneNumberInput
    bind:this={phone}
    {countries}
    {allowedCountries}
    bind:value
    bind:country
    {isCountryFixed}
    {showDialCode}
    {isRequired}
    {searchLabel}
    {onChange}
    {onCountryChange}
    name="contact"
    label="Phone"
    countryLabel="Country"
    closeLabel="Close"
    emptyText="No country found"
    testID="phone"
  />
  <button type="submit" data-testid="submit">Pay</button>
</Form>
{#if withStack}
  <ModalStack />
{/if}
<button type="button" data-testid="focus" onclick={() => phone?.focus()}>
  Focus
</button>
<output data-testid="value">{value}</output>
<output data-testid="country">{country}</output>
