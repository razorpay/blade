<script lang="ts">
  import {
    Checkbox,
    type CheckboxStyleProps,
    type CheckboxValidationState,
  } from '../../index';

  interface Props {
    args: CheckboxStyleProps & {
      validationState?: CheckboxValidationState;
      helpText?: string;
      errorText?: string;
    };
  }

  let { args }: Props = $props();
</script>

<div class="grid max-w-96 gap-4">
  <Checkbox
    validationState={args.validationState}
    helpText={args.helpText || undefined}
    errorText={args.errorText || undefined}
  >
    I accept the terms and conditions
  </Checkbox>
</div>
