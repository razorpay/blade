<script lang="ts">
  import { Button, OTPInput, TextInput } from '../../index';
  import { delay, stamp } from '../helpers';

  let value = $state('');
  let log = $state<string[]>([]);

  function record(line: string) {
    log = [`${stamp()} ${line}`, ...log].slice(0, 8);
  }

  // Stands in for an SMS auto-read landing while the user is elsewhere.
  function autoRead() {
    return delay(1200).then(() => {
      value = '482913';
      record('auto-read set value');
    });
  }
</script>

<div class="grid max-w-96 gap-4">
  <TextInput
    label="Focus me, then trigger the auto-read"
    placeholder="Focus stays here"
  />
  <OTPInput
    bind:value
    label="Enter OTP"
    onChange={(next) => record(`onChange ${JSON.stringify(next)}`)}
    onFilled={(next) => record(`onFilled ${JSON.stringify(next)}`)}
  />
  <div class="flex gap-2">
    <Button variant="secondary" size="small" onClick={autoRead}>
      Auto-read in 1.2s
    </Button>
    <Button
      variant="secondary"
      size="small"
      onClick={() => {
        value = '';
        record('cleared');
      }}
    >
      Clear
    </Button>
  </div>
  <ul class="font-code grid gap-1 text-25 leading-50 text-surface-gray-subtle">
    {#each log as line (line)}
      <li>{line}</li>
    {:else}
      <li>An outside value fires onFilled but not onChange.</li>
    {/each}
  </ul>
</div>
