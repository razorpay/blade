<script lang="ts">
  import type { CardFooterProps } from '../types';
  import { useVerifyInsideCard } from '../CardContext';
  import { cardFooterStyles } from '@razorpay/blade-core/styles';
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import styles from '@razorpay/blade-core/styles/Card/cardFooter.module.css';

  let {
    children,
    testID,
    marginTop = 'spacing.4',
    paddingTop = 'spacing.4',
    showDivider = true,
    ...rest
  }: CardFooterProps = $props();

  useVerifyInsideCard('CardFooter');

  // Use CSS media query for responsive layout instead of JS
  const footerClasses = $derived(
    cardFooterStyles({
      showDivider,
      paddingTop,
      marginTop,
      layout: 'desktop', // CSS will handle mobile layout via media queries
    }),
  );

  const metaAttrs = $derived(metaAttribute({ name: 'CardFooter', testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={styles.footer} {...metaAttrs} {...analyticsAttrs}>
  <div class={footerClasses}>
    {@render children()}
  </div>
</div>

<style>
  @media screen and (max-width: 767px) {
    .footer {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
