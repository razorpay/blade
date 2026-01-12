<script lang="ts">
  import type { CardHeaderProps } from '../types';
  import { useVerifyInsideCard } from '../CardContext';
  import { cardHeaderStyles } from '@razorpay/blade-core/styles';
  import { metaAttribute } from '@razorpay/blade-core/utils';
  import { makeAnalyticsAttribute } from '@razorpay/blade-core/utils';
  import styles from '@razorpay/blade-core/styles/Card/cardHeader.module.css';

  let {
    children,
    testID,
    marginBottom = 'spacing.4',
    paddingBottom = 'spacing.4',
    showDivider = true,
    ...rest
  }: CardHeaderProps = $props();

  useVerifyInsideCard('CardHeader');

  const headerClasses = $derived(
    cardHeaderStyles({
      showDivider,
      paddingBottom,
      marginBottom,
    }),
  );

  const metaAttrs = $derived(metaAttribute({ name: 'CardHeader', testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<div class={styles.header} {...metaAttrs} {...analyticsAttrs}>
  <div class={headerClasses}>
    {@render children()}
  </div>
</div>
