<script lang="ts">
  import type { FormData } from '../../runes';
  import Button from '../../components/button/Button.svelte';
  import CounterInput from '../../components/counter-input/CounterInput.svelte';
  import Form from '../../components/form/Form.svelte';

  interface Props {
    value?: number;
    min?: number;
    max?: number;
    isDisabled?: boolean;
    isLoading?: boolean;
    onChange?: (change: { name: string | undefined; value: number }) => void;
    inForm?: boolean;
    onSubmit?: (data: FormData) => void;
  }

  let {
    value: initialValue,
    min,
    max,
    isDisabled,
    isLoading,
    onChange,
    inForm = false,
    onSubmit,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let value = $state(initialValue);
</script>

{#snippet counter()}
  <CounterInput
    label="Quantity"
    name="quantity"
    bind:value
    {min}
    {max}
    {isDisabled}
    {isLoading}
    {onChange}
    testID="counter"
  />
{/snippet}

{#if inForm}
  <Form name="cart" {onSubmit}>
    {@render counter()}
    <Button type="submit" testID="submit">Add</Button>
  </Form>
{:else}
  {@render counter()}
{/if}
<p data-testid="bound">{value ?? 'unset'}</p>
