<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
  } from '@razorpay/blade-core/utils';
  import {
    getTrustedMarkerTemplateClasses,
    getTrustedMarkerTextColorToken,
    getTrustedMarkerPillVariantClass,
  } from '@razorpay/blade-core/styles';
  import Text from '../Typography/Text/Text.svelte';
  import { RTBShieldIcon } from '../Icons';
  import type { TrustedMarkerProps } from './types';

  const DEFAULT_LABEL = 'Razorpay Trusted Business';

  // Prevent CSS-module tree-shaking of structural classes.
  const templateClasses = getTrustedMarkerTemplateClasses();

  let {
    type = 'full',
    variant = 'neutral',
    label = DEFAULT_LABEL,
    testID,
    ...rest
  }: TrustedMarkerProps = $props();

  const isIconOnly = $derived(type === 'icon');
  const textColor = $derived(getTrustedMarkerTextColorToken(variant));
  const pillClasses = $derived(
    [templateClasses.trustedMarkerPill, getTrustedMarkerPillVariantClass(variant)].join(' '),
  );

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.TrustedMarker, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const styledProps = $derived(getStyledPropsClasses(rest));

  const rootClasses = $derived(
    [templateClasses.trustedMarker, ...(styledProps.classes ?? [])].filter(Boolean).join(' '),
  );

  // In the full form the pill text announces the marker, so the shield is decorative.
  // In the icon-only form there is no visible text, so the shield wrapper carries the label.
  const shieldClasses = $derived(
    [
      templateClasses.trustedMarkerShield,
      isIconOnly ? '' : templateClasses.trustedMarkerShieldOverlap,
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
    <RTBShieldIcon size="medium" />
  </span>
  {#if !isIconOnly}
    <div class={pillClasses}>
      <Text size="xsmall" weight="regular" color={textColor}>
        {label}
      </Text>
    </div>
  {/if}
</div>
