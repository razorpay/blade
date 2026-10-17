<script lang="ts">
  import { Counter, type CounterStyleProps } from '../../index';

  interface Props {
    args: CounterStyleProps & { value?: number; max?: number };
  }

  let { args }: Props = $props();
</script>

<Counter
  value={args.value ?? 0}
  max={args.max || undefined}
  color={args.color}
  emphasis={args.emphasis}
  size={args.size}
/>
