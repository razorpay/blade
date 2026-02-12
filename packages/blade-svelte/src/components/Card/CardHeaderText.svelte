<script lang="ts">
  import type { Snippet } from 'svelte';
  import Text from '../Typography/Text/Text.svelte';
  import { useCardContext } from './CardContext';

  // Verify inside Card
  useCardContext('CardHeaderText');

  let { children, ...props }: {
    children: Snippet | string;
    [key: string]: unknown;
  } = $props();
</script>

<Text textAlign="left" {...props}>
  {#if typeof children === 'string'}
    {children}
  {:else if children}
    {@render children()}
  {/if}
</Text>
