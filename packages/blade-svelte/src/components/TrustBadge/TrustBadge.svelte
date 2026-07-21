<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getTrustBadgeTemplateClasses,
    getTrustBadgeTextColorToken,
    getTrustBadgeVariantClass,
  } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { RazorpayTrustIcon } from '../Icons';
  import type { TrustBadgeProps } from './types';

  const DEFAULT_LABEL = 'Razorpay Trusted Business';

  const templateClasses = getTrustBadgeTemplateClasses();

  let {
    variant = 'default',
    label = DEFAULT_LABEL,
    testID,
    ...rest
  }: TrustBadgeProps = $props();

  const isIconOnly = $derived(variant === 'icon-only');
  const textColor = $derived(getTrustBadgeTextColorToken());

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.TrustBadge, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const styledProps = $derived(getStyledPropsClasses(rest));

  const rootClasses = $derived(
    [
      templateClasses.trustBadge,
      getTrustBadgeVariantClass(variant),
      ...(styledProps.classes ?? []),
    ]
      .filter(Boolean)
      .join(' '),
  );

  const iconA11yAttrs = $derived(
    isIconOnly ? makeAccessible({ role: 'img', label }) : { 'aria-hidden': 'true' },
  );
</script>

<div class={rootClasses} {...metaAttrs} {...analyticsAttrs}>
  <span class={templateClasses.trustBadgeIcon} {...iconA11yAttrs}>
    <RazorpayTrustIcon size="medium" />
  </span>
  {#if !isIconOnly}
    <Text size="xsmall" weight="regular" color={textColor}>
      {label}
    </Text>
  {/if}
</div>
