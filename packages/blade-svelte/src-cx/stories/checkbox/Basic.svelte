<script lang="ts">
  import { Checkbox, type CheckboxStyleProps } from '../../index';

  interface Props {
    args: CheckboxStyleProps & {
      label?: string;
      isChecked?: boolean;
      isIndeterminate?: boolean;
      isDisabled?: boolean;
      helpText?: string;
    };
  }

  let { args }: Props = $props();

  // Writable derived: the control re-seeds it, user toggles write it back.
  let isChecked = $derived(args.isChecked ?? false);
  let changes = $state(0);
</script>

<div class="grid max-w-96 gap-4">
  <Checkbox
    bind:isChecked
    size={args.size}
    isIndeterminate={args.isIndeterminate}
    isDisabled={args.isDisabled}
    helpText={args.helpText || undefined}
    onChange={() => {
      changes += 1;
    }}
    testID="basic-checkbox"
  >
    {args.label}
  </Checkbox>
  <p class="text-75 leading-50 text-surface-gray-subtle">
    isChecked: {String(isChecked)} · onChange fired {changes} times
  </p>
</div>
