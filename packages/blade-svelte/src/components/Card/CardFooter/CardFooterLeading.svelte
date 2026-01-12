<script lang="ts">
  import type { CardFooterLeadingProps } from '../types';
  import { useVerifyInsideCard } from '../CardContext';
  import Text from '../../Typography/Text/Text.svelte';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import styles from '@razorpay/blade-core/styles/Card/cardFooter.module.css';

  let { title, subtitle, ...rest }: CardFooterLeadingProps = $props();

  useVerifyInsideCard('CardFooterLeading');

  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={styles['footer-leading']} style="text-align: left;" {...analyticsAttrs}>
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
