<script lang="ts">
  import { Button, Form, Radio, RadioGroup } from '../../index';
  import type { FormData } from '../../runes';
  import { describeConstraint } from '../helpers';

  let submitted = $state<FormData | null>(null);
</script>

<Form
  name="netbanking"
  formatConstraintError={describeConstraint}
  onSubmit={(data) => {
    submitted = data;
  }}
  class="grid max-w-96 gap-4"
>
  <RadioGroup label="Pay via" name="flow" isRequired>
    <Radio value="qr">QR code</Radio>
    <Radio value="web">Bank website</Radio>
  </RadioGroup>
  <Button>Continue</Button>
  {#if submitted}
    <pre class="text-25 leading-50 text-surface-gray-subtle">{JSON.stringify(
        submitted,
        null,
        2
      )}</pre>
  {/if}
</Form>
