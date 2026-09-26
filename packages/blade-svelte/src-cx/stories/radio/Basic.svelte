<script lang="ts">
  import {
    Radio,
    RadioGroup,
    type RadioGroupStyleProps,
  } from '../../index';

  interface Props {
    args: RadioGroupStyleProps & {
      label?: string;
      helpText?: string;
      isDisabled?: boolean;
    };
  }

  let { args }: Props = $props();

  let value = $state<string | undefined>('qr');
</script>

<div class="grid max-w-96 gap-4">
  <RadioGroup
    bind:value
    orientation={args.orientation}
    label={args.label}
    helpText={args.helpText || undefined}
    isDisabled={args.isDisabled}
  >
    <Radio value="qr">QR code</Radio>
    <Radio value="web">Bank website</Radio>
    <Radio value="app" isDisabled>Bank app (unavailable)</Radio>
  </RadioGroup>
  <p class="text-75 leading-50 text-surface-gray-subtle">value: {JSON.stringify(value)}</p>
</div>
