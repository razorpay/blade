<script lang="ts">
  import { ModalStack, LayerHost, PhoneNumberInput } from '../../index';
  import { buildCountries } from './countries';

  const countries = buildCountries();
  let gulf = $state('');
  let single = $state('');
</script>

<div class="flex max-w-96 flex-col gap-4">
  <PhoneNumberInput
    {countries}
    allowedCountries={['AE', 'SA', 'KW', 'BH', 'QA']}
    country="AE"
    bind:value={gulf}
    label="Three or more allowed"
    countryLabel="Country"
    closeLabel="Close"
  />
  <PhoneNumberInput
    {countries}
    allowedCountries={['IN']}
    bind:value={single}
    label="One allowed: no picker"
    countryLabel="Country"
  />
</div>
<ModalStack />
<LayerHost />
