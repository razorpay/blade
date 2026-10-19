<script lang="ts">
  import { PhoneNumberInput, Text } from '../../index';
  import TestHost from '../../test/host/TestHost.svelte';
  import { buildCountries } from './countries';

  interface Props {
    args: {
      label?: string;
      placeholder?: string;
      helpText?: string;
      isDisabled?: boolean;
      isRequired?: boolean;
      isCountryFixed?: boolean;
      showDialCode?: boolean;
      presentAsSheet?: boolean;
    };
  }

  let { args }: Props = $props();

  const countries = buildCountries();
  let value = $state('');
  let country = $state('IN');
</script>

<!-- Blade's dropdown under the field; with `presentAsSheet`, a stand-in for an
     app's presenter (`adapters.presentDropdown`) shows the list as a sheet. -->
{#key args.presentAsSheet}
<TestHost presentsDropdowns={args.presentAsSheet}>
<div class="flex max-w-96 flex-col gap-3">
  <PhoneNumberInput
    {countries}
    bind:value
    bind:country
    label={args.label || undefined}
    placeholder={args.placeholder || undefined}
    helpText={args.helpText || undefined}
    isDisabled={args.isDisabled}
    isRequired={args.isRequired}
    isCountryFixed={args.isCountryFixed}
    showDialCode={args.showDialCode}
    countryLabel="Country"
    closeLabel="Close"
    testID="phone"
  />
  <Text size="small" color="muted"
    >value: <span data-testid="value">{value || '—'}</span> · country: <span data-testid="country">{country}</span></Text
  >
</div>
</TestHost>
{/key}
