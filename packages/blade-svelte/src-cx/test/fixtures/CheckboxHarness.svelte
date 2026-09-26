<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import Checkbox from '../../components/checkbox/Checkbox.svelte';
  import Form from '../../components/form/Form.svelte';

  interface Props {
    inForm?: boolean;
    onSubmit?: (data: FormData) => unknown;
    isChecked?: boolean;
    onChange?: (isChecked: boolean) => void;
    isDisabled?: boolean;
    isRequired?: boolean;
    validationState?: 'none' | 'error';
    helpText?: string;
    errorText?: string;
    parse?: (isChecked: boolean) => unknown;
    accessibilityLabel?: string;
    withLabel?: boolean;
    className?: string;
  }

  let {
    inForm = false,
    onSubmit,
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
  }: Props = $props();
</script>

{#snippet label()}
  I agree
{/snippet}

{#snippet checkbox()}
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
    class={className}
    testID="solo"
    children={withLabel ? label : undefined}
  />
{/snippet}

{#if inForm}
  <Form name="terms" {onSubmit}>
    {@render checkbox()}
    <Button testID="go">Go</Button>
  </Form>
{:else}
  {@render checkbox()}
{/if}
