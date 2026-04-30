<script lang="ts">
  import Amount from '../Amount/Amount.svelte';
  import { useCardContext } from './CardContext';
  import type { BaseAmountProps } from '../Amount/types';

  // Verify inside Card
  useCardContext('CardHeaderAmount');

  let { ...props }: BaseAmountProps = $props();
</script>

<Amount {...props} />
