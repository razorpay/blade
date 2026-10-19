<script lang="ts">
  import {
    TextInput,
    type TextInputStyleProps,
    type TextInputValidationState,
  } from '../../index';

  interface Props {
    args: TextInputStyleProps & {
      validationState?: TextInputValidationState;
      helpText?: string;
      errorText?: string;
      successText?: string;
    };
  }

  let { args }: Props = $props();
</script>

<div class="grid max-w-96 gap-4">
  <TextInput
    label="UPI ID"
    placeholder="name@bank"
    value="name@bank"
    validationState={args.validationState}
    helpText={args.helpText || undefined}
    errorText={args.errorText || undefined}
    successText={args.successText || undefined}
  />
</div>
