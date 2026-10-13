<script lang="ts">
  import {
    Button,
    Form,
    ModalStack,
    LayerHost,
    PhoneNumberInput,
    Text,
  } from '../../index';
  import { buildCountries } from './countries';

  const countries = buildCountries();
  let submitted = $state('');
</script>

<div class="max-w-96">
  <Form
    onSubmit={(data) => {
      submitted = JSON.stringify(data);
    }}
  >
    <div class="flex flex-col gap-3">
      <PhoneNumberInput
        {countries}
        name="contact"
        label="Mobile number"
        helpText="India, Malaysia and Singapore carry a pattern here"
        isRequired
        countryLabel="Country"
        searchLabel="Search country or code"
        emptyText="No country found"
        closeLabel="Close"
      />
      <Button type="submit" class="w-full">Continue</Button>
      <Text size="small" color="muted">submitted: {submitted || '—'}</Text>
    </div>
  </Form>
</div>
<ModalStack />
<LayerHost />
