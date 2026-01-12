<script lang="ts">
  import type { CardHeaderLeadingProps } from '../types';
  import { useVerifyInsideCard, getCardContext } from '../CardContext';
  import Text from '../../Typography/Text/Text.svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import styles from '@razorpay/blade-core/styles/Card/cardHeader.module.css';

  let { title, subtitle, prefix, suffix, ...rest }: CardHeaderLeadingProps = $props();

  useVerifyInsideCard('CardHeaderLeading');
  const context = getCardContext();
  const size = $derived(context?.size ?? 'large');

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={styles['header-leading']} {...analyticsAttrs}>
  {#if prefix}
    <div style="margin-right: var(--spacing-3); align-self: center; display: flex;">
      {@render prefix()}
    </div>
  {/if}

  <div class={styles['header-leading-content']}>
    <div class={styles['header-leading-title-row']}>
      <Text color="surface.text.gray.normal" {size} weight="semibold">
        {title}
      </Text>
      {#if suffix}
        <div style="margin-left: var(--spacing-3);">
          {@render suffix()}
        </div>
      {/if}
    </div>
    {#if subtitle}
      <Text color="surface.text.gray.subtle" size="small">
        {subtitle}
      </Text>
    {/if}
  </div>
</div>
