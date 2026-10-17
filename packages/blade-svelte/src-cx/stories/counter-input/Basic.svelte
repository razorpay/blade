<script lang="ts">
  import { CounterInput, Text, type CounterInputStyleProps } from '../../index';

  interface Props {
    args: CounterInputStyleProps & {
      label?: string;
      min?: number;
      max?: number;
      isLoading?: boolean;
      isDisabled?: boolean;
    };
  }

  let { args }: Props = $props();

  // Blade's Basic Usage story starts at 5.
  let value = $state(5);
</script>

<div class="flex flex-col gap-3">
  <CounterInput
    label={args.label}
    bind:value
    min={args.min}
    max={args.max}
    size={args.size}
    emphasis={args.emphasis}
    isLoading={args.isLoading}
    isDisabled={args.isDisabled}
  />
  <Text size="small" color="muted">value: {value}</Text>
</div>
