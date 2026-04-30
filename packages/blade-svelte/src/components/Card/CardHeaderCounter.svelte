<script lang="ts">
  import Counter from '../Counter/Counter.svelte';
  import { useCardContext } from './CardContext';
  import type { CounterProps } from '../Counter/types';

  // Verify inside Card
  useCardContext('CardHeaderCounter');

  let { ...props }: CounterProps = $props();
</script>

<Counter {...props} />
