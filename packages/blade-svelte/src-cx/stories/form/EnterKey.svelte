<script lang="ts">
  import { Button, Form, TextInput } from '../../index';
  import { delay, stamp } from '../helpers';

  let submissions = $state<string[]>([]);

  function onSubmit() {
    return delay(1000).then(() => {
      submissions = [stamp(), ...submissions];
    });
  }
</script>

<Form name="otp" {onSubmit} class="grid max-w-96 gap-4">
  <TextInput
    name="otp"
    label="OTP"
    inputMode="numeric"
    maxCharacters={6}
    helpText="Focus the field and press Enter"
    autoFocus
  />
  <Button type="submit" loadingAnnouncement="Verifying">Verify</Button>
  <ul class="text-25 leading-50 text-surface-gray-subtle">
    {#each submissions as at (at)}
      <li>submitted at {at}</li>
    {/each}
  </ul>
</Form>
