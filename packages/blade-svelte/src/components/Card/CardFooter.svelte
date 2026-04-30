<script lang="ts">
  import { metaAttribute, MetaConstants } from '@razorpay/blade-core/utils';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getCardFooterClasses } from '@razorpay/blade-core/styles';
  import Divider from '../Divider/Divider.svelte';
  import { useCardContext } from './CardContext';
  import type { CardFooterProps } from './types';

  // Verify inside Card
  useCardContext('CardFooter');

  let {
    children: footerContent,
    marginTop = 'spacing.4',
    paddingTop = 'spacing.4',
    showDivider = true,
    testID,
    ...rest
  }: CardFooterProps = $props();

  const footerClasses = $derived(
    getCardFooterClasses({ paddingTop, marginTop })
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.CardFooter, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={footerClasses.wrapper} {...metaAttrs} {...analyticsAttrs}>
  {#if showDivider}
    <Divider />
  {/if}
  <div class={footerClasses.content}>
    {#if footerContent}
      {@render footerContent()}
    {/if}
  </div>
</div>
