<script lang="ts">
  import { Radio, RadioGroup } from '../../index';

  interface Props {
    args: {
      validationState?: 'none' | 'error';
      helpText?: string;
      errorText?: string;
    };
  }

  let { args }: Props = $props();
</script>

<div class="max-w-96">
  <RadioGroup
    label="Pay via"
    validationState={args.validationState}
    helpText={args.helpText || undefined}
    errorText={args.errorText || undefined}
  >
    <Radio value="qr">QR code</Radio>
    <Radio value="web">Bank website</Radio>
  </RadioGroup>
</div>
