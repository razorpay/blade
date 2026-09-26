<script lang="ts">
  import {
    OTPInput,
    type OTPInputStyleProps,
    type OTPInputValidationState,
  } from '../../index';

  interface Props {
    args: OTPInputStyleProps & {
      validationState?: OTPInputValidationState;
      helpText?: string;
      errorText?: string;
      successText?: string;
    };
  }

  let { args }: Props = $props();
</script>

<div class="grid max-w-96 gap-4">
  <OTPInput
    size={args.size}
    labelPosition={args.labelPosition}
    label="Enter OTP"
    value="123456"
    validationState={args.validationState}
    helpText={args.helpText || undefined}
    errorText={args.errorText || undefined}
    successText={args.successText || undefined}
  />
</div>
