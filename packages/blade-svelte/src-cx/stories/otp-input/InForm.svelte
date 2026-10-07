<script lang="ts">
  import { Button, Form, OTPInput } from '../../index';
  import type { FormData } from '../../runes';
  import { delay } from '../helpers';

  let submitted = $state<FormData | null>(null);

  function onSubmit(data: FormData) {
    submitted = null;
    return delay(1000).then(() => {
      submitted = data;
    });
  }

  function formatConstraintError(code: string): string {
    return code === 'pattern' ? 'Enter all 6 digits' : 'Enter the OTP';
  }
</script>

<Form
  name="verify"
  {onSubmit}
  {formatConstraintError}
  class="grid max-w-96 gap-4"
>
  {#snippet children(state)}
    <OTPInput
      name="otp"
      label="Enter OTP"
      isRequired
      autoFocus
      helpText="Enter fires the submit from any cell"
    />
    <Button type="submit" loadingAnnouncement="Verifying">Verify</Button>
    <dl class="grid [grid-template-columns:auto_1fr] gap-x-3 gap-y-1 text-25 leading-50">
      <dt class="text-surface-gray-subtle">errors</dt>
      <dd class="font-blade-code">{JSON.stringify(state.errors)}</dd>
      <dt class="text-surface-gray-subtle">last submit</dt>
      <dd class="font-blade-code">{submitted ? JSON.stringify(submitted) : '—'}</dd>
    </dl>
  {/snippet}
</Form>
