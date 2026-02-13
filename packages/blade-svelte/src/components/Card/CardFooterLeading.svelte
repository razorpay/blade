<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { useCardContext } from './CardContext';
  import type { CardFooterLeadingProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getCardTemplateClasses();

  // Verify inside Card
  useCardContext('CardFooterLeading');

  let {
    title,
    subtitle,
    ...rest
  }: CardFooterLeadingProps = $props();

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={templateClasses.cardFooterLeading} {...analyticsAttrs}>
  {#if title}
    <Text color="surface.text.gray.normal" size="medium" weight="semibold">
      {title}
    </Text>
  {/if}
  {#if subtitle}
    <Text color="surface.text.gray.subtle" size="small" weight="regular">
      {subtitle}
    </Text>
  {/if}
</div>
