<script lang="ts">
  import { Button, Form, TextInput } from '../../index';
  import type { FormData, FormErrors } from '../../runes';
  import { delay, describeConstraint } from '../helpers';

  interface Props {
    args: { submitDelay?: number };
  }

  let { args }: Props = $props();

  let submitted = $state<FormData | null>(null);

  function validator(data: FormData): FormErrors {
    const errors: FormErrors = {};
    if (String(data.vpa ?? '').endsWith('@fail')) {
      errors.vpa = 'That handle is not reachable';
    }
    return errors;
  }

  function onSubmit(data: FormData) {
    submitted = null;
    return delay(args.submitDelay ?? 0).then(() => {
      submitted = data;
    });
  }
</script>

<Form
  name="payment"
  {validator}
  {onSubmit}
  formatConstraintError={describeConstraint}
  class="grid max-w-96 gap-4"
>
  {#snippet children(state)}
    <TextInput name="name" label="Name" isRequired />
    <TextInput
      name="vpa"
      label="UPI ID"
      isRequired
      pattern="[^@\s]+@[^@\s]+"
      helpText="Try one ending in @fail for a validator error"
    />
    <Button type="submit" loadingAnnouncement="Paying">Pay</Button>
    <dl class="grid [grid-template-columns:auto_1fr] gap-x-3 gap-y-1 text-25 leading-50">
      <dt class="text-surface-gray-subtle">submitting</dt>
      <dd>{String(state.submitting)}</dd>
      <dt class="text-surface-gray-subtle">submitted</dt>
      <dd>{String(state.submitted)}</dd>
      <dt class="text-surface-gray-subtle">errors</dt>
      <dd class="font-mono">{JSON.stringify(state.errors)}</dd>
      <dt class="text-surface-gray-subtle">data</dt>
      <dd class="font-mono">{JSON.stringify(state.data)}</dd>
      <dt class="text-surface-gray-subtle">last submit</dt>
      <dd class="font-mono">{submitted ? JSON.stringify(submitted) : '—'}</dd>
    </dl>
  {/snippet}
</Form>
