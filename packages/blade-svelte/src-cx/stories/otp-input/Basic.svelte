<script lang="ts">
  import { OTPInput, type OTPInputStyleProps } from '../../index';
  import { stamp } from '../helpers';

  interface Props {
    args: OTPInputStyleProps & {
      otpLength?: number;
      label?: string;
      helpText?: string;
      inputMode?: 'numeric' | 'text';
      isMasked?: boolean;
      isDisabled?: boolean;
      isReadOnly?: boolean;
    };
  }

  let { args }: Props = $props();

  let value = $state('');
  let log = $state<string[]>([]);

  function record(line: string) {
    log = [`${stamp()} ${line}`, ...log].slice(0, 12);
  }
</script>

<div class="grid max-w-96 gap-4">
  <!-- otpLength is fixed at mount, so the control remounts the input. -->
  {#key args.otpLength}
    <OTPInput
      bind:value
      size={args.size}
      otpLength={args.otpLength}
      label={args.label}
      helpText={args.helpText || undefined}
      inputMode={args.inputMode}
      isMasked={args.isMasked}
      isDisabled={args.isDisabled}
      isReadOnly={args.isReadOnly}
      onChange={(next) => record(`onChange ${JSON.stringify(next)}`)}
      onOTPFilled={(next) => record(`onOTPFilled ${JSON.stringify(next)}`)}
      testID="otp"
    />
  {/key}
  <p class="text-75 leading-50 text-surface-gray-subtle">value: {JSON.stringify(value)}</p>
  <ul class="font-code grid gap-1 text-25 leading-50 text-surface-gray-subtle">
    {#each log as line (line)}
      <li>{line}</li>
    {:else}
      <li>Type or paste a code to see events.</li>
    {/each}
  </ul>
</div>
