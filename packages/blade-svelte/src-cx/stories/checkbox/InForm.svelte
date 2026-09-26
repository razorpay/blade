<script lang="ts">
  import { Button, Checkbox, Form, TextInput } from '../../index';
  import type { FormData } from '../../runes';
  import { delay, describeConstraint } from '../helpers';

  let submitted = $state<FormData | null>(null);

  function onSubmit(data: FormData) {
    submitted = null;
    return delay(600).then(() => {
      submitted = data;
    });
  }
</script>

<Form
  name="consent"
  {onSubmit}
  formatConstraintError={describeConstraint}
  class="grid max-w-96 gap-4"
>
  {#snippet children(state)}
    <TextInput name="email" label="Email" type="email" isRequired />
    <Checkbox name="marketing" parse={Number}>Send me offers</Checkbox>
    <Checkbox
      name="terms"
      isRequired
      parse={(checked) => (checked ? 'accepted' : '')}
      helpText="Required"
    >
      I agree to the terms
    </Checkbox>
    <Button loadingAnnouncement="Placing order">Place order</Button>
    <dl class="grid [grid-template-columns:auto_1fr] gap-x-3 gap-y-1 text-25 leading-50">
      <dt class="text-surface-gray-subtle">errors</dt>
      <dd class="font-code">{JSON.stringify(state.errors)}</dd>
      <dt class="text-surface-gray-subtle">data</dt>
      <dd class="font-code">{JSON.stringify(state.data)}</dd>
      <dt class="text-surface-gray-subtle">last submit</dt>
      <dd class="font-code">{submitted ? JSON.stringify(submitted) : '—'}</dd>
    </dl>
  {/snippet}
</Form>
