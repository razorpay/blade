<script lang="ts">
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { useCardContext } from './CardContext';
  import type { CardHeaderLeadingProps } from './types';

  // Prevent tree-shaking
  const templateClasses = getCardTemplateClasses();

  // Verify inside Card and get size
  const cardContext = useCardContext('CardHeaderLeading');

  let {
    title,
    subtitle,
    prefix,
    suffix,
    ...rest
  }: CardHeaderLeadingProps = $props();

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));

  const titleSize = $derived(cardContext.size);
</script>

<div class={templateClasses.cardHeaderLeading} {...analyticsAttrs}>
  <div class={templateClasses.cardHeaderLeadingRow}>
    {#if prefix}
      <div class={templateClasses.cardHeaderLeadingPrefix}>
        {@render prefix()}
      </div>
    {/if}

    <div class={templateClasses.cardHeaderLeadingTitleWrap}>
      <div class={templateClasses.cardHeaderLeadingTitleRow}>
        <Text color="surface.text.gray.normal" size={titleSize} weight="semibold">
          {title}
        </Text>
        {#if suffix}
          <div class={templateClasses.cardHeaderLeadingSuffix}>
            {@render suffix()}
          </div>
        {/if}
      </div>
      {#if subtitle}
        <Text color="surface.text.gray.subtle" textAlign="left" size="small">
          {subtitle}
        </Text>
      {/if}
    </div>
  </div>
</div>
