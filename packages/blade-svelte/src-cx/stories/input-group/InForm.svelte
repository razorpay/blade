<script lang="ts">
  import { Button, Form, InputGroup, PasswordInput, TextInput } from '../../index';
  import type { FormData } from '../../runes';
  import { describeConstraint } from '../helpers';

  let submitted = $state<FormData | null>(null);
</script>

<Form
  name="card"
  formatConstraintError={describeConstraint}
  onSubmit={(data) => {
    submitted = data;
  }}
  class="grid max-w-96 gap-4"
>
  <InputGroup label="Card details" helpText="As printed on the card">
    <TextInput
      name="number"
      label="Card number"
      placeholder="Card number"
      inputMode="numeric"
      isRequired
    />
    <TextInput
      name="expiry"
      label="Expiry"
      placeholder="MM / YY"
      inputMode="numeric"
      span="2/3"
      isRequired
    />
    <PasswordInput
      name="cvv"
      label="CVV"
      placeholder="CVV"
      showRevealButton={false}
      maxCharacters={4}
      span="1/3"
      isRequired
    />
  </InputGroup>
  <Button>Pay</Button>
  {#if submitted}
    <pre class="text-25 leading-50 text-surface-gray-subtle">{JSON.stringify(
        submitted,
        null,
        2
      )}</pre>
  {/if}
</Form>
