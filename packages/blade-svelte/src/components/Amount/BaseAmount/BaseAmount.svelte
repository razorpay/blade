<script lang="ts">
  import {
    makeAnalyticsAttribute,
    metaAttribute,
    MetaConstants,
    throwBladeError,
    getTokenCSSVariable,
  } from '@razorpay/blade-core/utils';
  import { getStyledPropsClasses } from '@razorpay/blade-core/utils';
  import { utilityClasses } from '@razorpay/blade-core/styles';
  import type { BaseAmountProps } from './types';
  import { getAmountByParts } from '@razorpay/blade-core/utils';
  import { normalAmountSizes, subtleFontSizes, amountLineHeights } from '@razorpay/blade-core/styles';
  import BaseText from '../../Typography/BaseText/BaseText.svelte';

  let {
    value,
    suffix = 'decimals',
    type = 'body',
    size = 'medium',
    weight = 'regular',
    isAffixSubtle = true,
    isStrikethrough = false,
    color,
    currencyIndicator = 'currency-symbol',
    currency = 'INR',
    fractionDigits = 2,
    testID,
    ...rest
  }: BaseAmountProps = $props();

  // Validation in development mode
  $effect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (typeof value !== 'number') {
        throwBladeError({
          message: '`value` prop must be of type `number` for Amount.',
          moduleName: 'Amount',
        });
      }
      // @ts-expect-error neutral color should throw error
      if (color === 'neutral') {
        throwBladeError({
          message: '`neutral` color is not supported.',
          moduleName: 'Amount',
        });
      }

      // Helper to get keys from an object
      const getObjectKeys = <T extends Record<string, unknown>>(obj: T): (keyof T)[] => {
        return Object.keys(obj) as (keyof T)[];
      };

      const bodySizes = getObjectKeys(normalAmountSizes.body);
      if ((type === 'body' || !type) && size && !bodySizes.includes(size)) {
        throwBladeError({
          message: `size="${size}" is not allowed with type="body"`,
          moduleName: 'Amount',
        });
      }

      const displaySizes = getObjectKeys(normalAmountSizes.display);
      if (type === 'display' && size && !displaySizes.includes(size)) {
        throwBladeError({
          message: `size="${size}" is not allowed with type="display"`,
          moduleName: 'Amount',
        });
      }

      const headingSizes = getObjectKeys(normalAmountSizes.heading);
      if (type === 'heading' && size && !headingSizes.includes(size)) {
        throwBladeError({
          message: `size="${size}" is not allowed with type="heading"`,
          moduleName: 'Amount',
        });
      }
    }
  });

  // Get text color props
  const getTextColorProps = (colorProp: BaseAmountProps['color']) => {
    return {
      amountValueColor: colorProp ?? ('surface.text.gray.normal' as const),
    };
  };

  const { amountValueColor } = $derived(getTextColorProps(color));

  // Get formatted amount parts
  const renderedValue = $derived(getAmountByParts({ suffix, value, currency, fractionDigits }));
  const isPrefixSymbol = $derived(renderedValue.isPrefixSymbol ?? true);
  const currencySymbol = $derived(renderedValue.currency ?? currency);
  const currencyPosition = $derived(isPrefixSymbol ? 'left' : 'right');
  const currencySymbolOrCode = $derived(
    currencyIndicator === 'currency-symbol' ? currencySymbol : currency,
  );

  // Compute the full amount string to avoid spacing issues
  const amountString = $derived(() => {
    const parts = [
      renderedValue.integer,
      renderedValue.decimal,
      renderedValue.fraction,
      renderedValue.compact,
    ].filter(Boolean);
    return parts.join('');
  });

  // Calculate font sizes
  const currencyFontSize = $derived(
    isAffixSubtle ? subtleFontSizes[type][size] : normalAmountSizes[type][size],
  );
  const affixFontSize = $derived(
    isAffixSubtle ? subtleFontSizes[type][size] : normalAmountSizes[type][size],
  );
  const numberFontFamily = $derived(type === 'body' ? 'text' : 'heading');

  // Extract styled props
  const styledProps = $derived(getStyledPropsClasses(rest));

  // Combine classes for outer container
  const outerContainerClasses = $derived(() => {
    const classes = [
      utilityClasses['display-inline-flex'],
      utilityClasses['flex-direction-row'],
    ];
    if (styledProps.classes) {
      classes.push(...styledProps.classes);
    }
    return classes.filter(Boolean).join(' ');
  });

  // Inner container classes - match React implementation exactly
  const innerContainerClasses = $derived(() => {
    return [
      utilityClasses['display-inline-flex'],
      utilityClasses['flex-direction-row'],
      utilityClasses['position-relative'],
    ].join(' ');
  });

  // Inner container style - use baseline alignment like React
  const innerContainerStyle = $derived(() => {
    return 'align-items: baseline;';
  });

  // Meta attributes
  const metaAttrs = metaAttribute({
    name: MetaConstants.Amount,
    testID,
  });

  // Analytics attributes
  const analyticsAttrs = makeAnalyticsAttribute(rest);

  // Strikethrough style - needs to match the text color
  // Convert color token to CSS variable for border color
  const strikethroughStyle = $derived(() => {
    if (!isStrikethrough) return '';
    const borderWidth = type === 'body' ? 'var(--border-width-thin)' : 'var(--border-width-thicker)';
    const borderColor = getTokenCSSVariable(amountValueColor);
    return `border-bottom: ${borderWidth} solid ${borderColor}; width: 100%; top: 50%;`;
  });
</script>

<div class={outerContainerClasses()} {...metaAttrs} {...analyticsAttrs}>
  <div class={innerContainerClasses()} style={innerContainerStyle()}>
    {#if renderedValue.minusSign}
      <BaseText
        fontSize={normalAmountSizes[type][size]}
        fontWeight={weight}
        lineHeight={amountLineHeights[type][size]}
        color={amountValueColor}
        as="span"
        marginX="spacing.2"
      >
        {renderedValue.minusSign}
      </BaseText>
    {/if}

    {#if currencyPosition === 'left'}
      <BaseText
        marginRight="spacing.1"
        fontWeight={weight}
        fontSize={currencyFontSize}
        color={amountValueColor}
        as="span"
        opacity={isAffixSubtle ? 0.64 : undefined}
      >
        {currencySymbolOrCode}
      </BaseText>
    {/if}

    {#if suffix === 'decimals' && isAffixSubtle}
      <!-- Split integer and decimal parts for subtle styling - match React exactly -->
      <BaseText
        fontSize={normalAmountSizes[type][size]}
        fontWeight={weight}
        lineHeight={amountLineHeights[type][size]}
        color={amountValueColor}
        fontFamily={numberFontFamily}
        as="span"
      >
        {renderedValue.integer}
      </BaseText>
      <BaseText
        fontWeight={weight}
        fontSize={affixFontSize}
        fontFamily={numberFontFamily}
        color={amountValueColor}
        as="span"
        opacity={isAffixSubtle ? 0.64 : undefined}
      >
        {renderedValue.decimal}{renderedValue.fraction}
      </BaseText>
    {:else}
      <!-- Default: single BaseText with all parts -->
      <BaseText
        fontSize={normalAmountSizes[type][size]}
        fontWeight={weight}
        fontFamily={numberFontFamily}
        color={amountValueColor}
        lineHeight={amountLineHeights[type][size]}
      >
        {amountString()}
      </BaseText>
    {/if}

    {#if currencyPosition === 'right'}
      <BaseText
        marginLeft="spacing.1"
        fontWeight={weight}
        fontSize={currencyFontSize}
        color={amountValueColor}
        as="span"
        opacity={isAffixSubtle ? 0.64 : undefined}
      >
        {currencySymbolOrCode}
      </BaseText>
    {/if}

    {#if isStrikethrough}
      <div
        class={utilityClasses['position-absolute']}
        style={strikethroughStyle()}
      ></div>
    {/if}
  </div>
</div>

