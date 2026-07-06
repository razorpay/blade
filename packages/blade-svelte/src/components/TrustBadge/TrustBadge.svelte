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
    getTrustBadgePillEmphasisClass,
  } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { RazorpayTrustIcon } from '../Icons';
  import type { TrustBadgeProps } from './types';

  const DEFAULT_LABEL = 'Razorpay Trusted Business';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getTrustBadgeTemplateClasses();

  let {
    variant = 'full',
    emphasis = 'subtle',
    label = DEFAULT_LABEL,
    testID,
    ...rest
  }: TrustBadgeProps = $props();

  const isIconOnly = $derived(variant === 'icon-only');
  const textColor = $derived(getTrustBadgeTextColorToken(emphasis));
  const pillClasses = $derived(
    [templateClasses.trustBadgePill, getTrustBadgePillEmphasisClass(emphasis)].join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.TrustBadge, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const styledProps = $derived(getStyledPropsClasses(rest));

  const rootClasses = $derived(
    [templateClasses.trustBadge, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );

  // In the full variant the pill text announces the badge, so the shield is decorative.
  // In the icon-only variant there is no visible text, so the shield wrapper carries the label.
  const shieldClasses = $derived(
    [
      templateClasses.trustBadgeShield,
      isIconOnly ? '' : templateClasses.trustBadgeShieldOverlap,
    ]
      .filter(Boolean)
      .join(' '),
  );
  const iconA11yAttrs = $derived(
    isIconOnly ? makeAccessible({ role: 'img', label }) : { 'aria-hidden': 'true' },
  );
</script>

<div class={rootClasses} {...metaAttrs} {...analyticsAttrs}>
  <span class={shieldClasses} {...iconA11yAttrs}>
    <RazorpayTrustIcon size="medium" />
  </span>
  {#if !isIconOnly}
    <div class={pillClasses}>
      <Text size="xsmall" weight="regular" color={textColor}>
        {label}
      </Text>
    </div>
  {/if}
</div>
