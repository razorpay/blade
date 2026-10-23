<script lang="ts">
  import CounterInput from '../../components/counter-input/CounterInput.svelte';

  interface Props {
    value?: number;
    min?: number;
    max?: number;
    isDisabled?: boolean;
    isLoading?: boolean;
    onChange?: (change: { name: string | undefined; value: number }) => void;
  }

  let {
    value: initialValue,
    min,
    max,
    isDisabled,
    isLoading,
    onChange,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  let value = $state(initialValue);
</script>

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
<p data-testid="bound">{value ?? 'unset'}</p>
