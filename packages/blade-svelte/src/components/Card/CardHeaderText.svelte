<script lang="ts">
  import Text from '../Typography/Text/Text.svelte';
  import type { TextBodyVariant, TextCaptionVariant } from '../Typography/Text/types';
  import { useCardContext } from './CardContext';

  type CardHeaderTextProps = TextBodyVariant | TextCaptionVariant;

  // Verify inside Card
  useCardContext('CardHeaderText');

  let { children, ...props }: CardHeaderTextProps = $props();
</script>

<Text textAlign="left" {...props}>
  {#if typeof children === 'string'}
    {children}
  {:else if children}
    {@render children()}
  {/if}
</Text>
