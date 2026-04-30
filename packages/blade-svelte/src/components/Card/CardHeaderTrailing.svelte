<script lang="ts">
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import { useCardContext } from './CardContext';
  import type { CardHeaderTrailingProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getCardTemplateClasses();

  // Verify inside Card
  useCardContext('CardHeaderTrailing');

  let {
    visual,
  }: CardHeaderTrailingProps = $props();
</script>

<div class={templateClasses.cardHeaderTrailing}>
  {#if visual}
    {@render visual()}
  {/if}
</div>
