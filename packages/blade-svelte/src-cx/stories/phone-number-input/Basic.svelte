<script lang="ts">
  import {
    BladeProvider,
    ModalStack,
    LayerHost,
    PhoneNumberInput,
    Text,
  } from '../../index';
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
      withSearch?: boolean;
    };
  }

  let { args }: Props = $props();

  const countries = buildCountries();
  let value = $state('');
  let country = $state('IN');
</script>

<!-- The app sets how modals look: the picker is a sheet. -->
<BladeProvider defaults={{ Modal: { variant: 'sheet' } }}>
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
    searchLabel={args.withSearch ? 'Search country or code' : undefined}
    emptyText="No country found"
    closeLabel="Close"
    testID="phone"
  />
  <Text size="small" color="muted"
    >value: <span data-testid="value">{value || '—'}</span> · country: <span data-testid="country">{country}</span></Text
  >
</div>
<ModalStack />
<LayerHost />
</BladeProvider>
