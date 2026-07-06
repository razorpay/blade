<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getRTBBadgeTemplateClasses,
    getRTBBadgeTextColorToken,
    getRTBBadgePillVariantClass,
  } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { RTBShieldIcon } from '../Icons';
  import type { RTBBadgeProps } from './types';

  const RTB_LABEL = 'Razorpay Trusted Business';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getRTBBadgeTemplateClasses();

  let { type = 'full', variant = 'neutral', testID, ...rest }: RTBBadgeProps = $props();

  const isIconOnly = $derived(type === 'icon');
  const textColor = $derived(getRTBBadgeTextColorToken(variant));
  const pillClasses = $derived(
    [templateClasses.rtbBadgePill, getRTBBadgePillVariantClass(variant)].join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.RTBBadge, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const styledProps = $derived(getStyledPropsClasses(rest));

  const rootClasses = $derived(
    [templateClasses.rtbBadge, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );

  // In the full form the pill text announces the badge, so the shield is decorative.
  // In the icon-only form there is no visible text, so the shield wrapper carries the label.
  const shieldClasses = $derived(
    [templateClasses.rtbBadgeShield, isIconOnly ? '' : templateClasses.rtbBadgeShieldOverlap]
      .filter(Boolean)
      .join(' '),
  );
  const iconA11yAttrs = $derived(
    isIconOnly ? makeAccessible({ role: 'img', label: RTB_LABEL }) : { 'aria-hidden': 'true' },
  );
</script>

<div class={rootClasses} {...metaAttrs} {...analyticsAttrs}>
  <span class={shieldClasses} {...iconA11yAttrs}>
    <RTBShieldIcon size="medium" />
  </span>
  {#if !isIconOnly}
    <div class={pillClasses}>
      <Text size="xsmall" weight="regular" color={textColor}>
        {RTB_LABEL}
      </Text>
    </div>
  {/if}
</div>
