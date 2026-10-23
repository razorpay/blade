<script lang="ts">
  import Checkbox from '../../components/checkbox/Checkbox.svelte';

  interface Props {
    isChecked?: boolean;
    onChange?: (change: { isChecked: boolean; value: string | undefined }) => void;
    isDisabled?: boolean;
    isRequired?: boolean;
    validationState?: 'none' | 'error';
    helpText?: string;
    errorText?: string;
    parse?: (isChecked: boolean) => unknown;
    accessibilityLabel?: string;
    withLabel?: boolean;
    className?: string;
    isIndeterminate?: boolean;
    size?: 'small' | 'medium' | 'large';
  }

  let {
    isChecked,
    onChange,
    isDisabled,
    isRequired,
    validationState,
    helpText,
    errorText,
    parse,
    accessibilityLabel,
    withLabel = true,
    className,
    isIndeterminate,
    size,
  }: Props = $props();
</script>

{#snippet label()}
  I agree
{/snippet}

<Checkbox
  name="consent"
  {isChecked}
  {onChange}
  {isDisabled}
  {isRequired}
  {validationState}
  {helpText}
  {errorText}
  {parse}
  {accessibilityLabel}
  {isIndeterminate}
  {size}
  class={className}
  testID="solo"
  children={withLabel ? label : undefined}
/>
