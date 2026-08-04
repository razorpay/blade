<script lang="ts">
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    cx,
  } from '@razorpay/blade-core/utils';
  import {
    getTrustBadgeTemplateClasses,
    getTrustBadgeTextColorToken,
    getTrustBadgeVariantClass,
    getTextProps,
  } from '@razorpay/blade-core/styles';
  import BaseText from '../Typography/BaseText/BaseText.svelte';
  import { RazorpayTrustIcon } from '../Icons';
  import type { IconColor } from '../Icons/types';
  import type { TextColors } from '../Typography/BaseText/types';
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

  const textColor = $derived(getTrustBadgeTextColorToken() as TextColors);

  const labelTextProps = $derived(
    getTextProps({
      variant: 'body',
      weight: 'regular',
      size: 'xsmall',
    }),
  );

  const iconRenderColor = 'surface.icon.gray.normal' as IconColor;

  const metaAttrs = $derived(metaAttribute({ name: MetaConstants.TrustBadge, testID }));
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
  const styledProps = $derived(getStyledPropsClasses(rest));

  const rootClasses = $derived(
    cx(templateClasses.trustBadge, ...(styledProps.classes ?? [])),
  );

  const pillClasses = $derived(getTrustBadgeVariantClass(variant));

  const iconA11yAttrs = $derived(
    isIconOnly ? makeAccessible({ role: 'img', label }) : { 'aria-hidden': 'true' },
  );
</script>

<div class={rootClasses} {...metaAttrs} {...analyticsAttrs}>
  <div class={pillClasses}>
    <span class={templateClasses.trustBadgeIcon} {...iconA11yAttrs}>
      <RazorpayTrustIcon size="medium" color={iconRenderColor} />
    </span>
    {#if !isIconOnly}
      <span>
        <BaseText as="span" {...labelTextProps} color={textColor}>
          {label}
        </BaseText>
      </span>
    {/if}
  </div>
</div>
