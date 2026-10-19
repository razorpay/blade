<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { analyticsAttributes, type AnalyticsAttributes } from '../../runes/dom/analytics';
  import { cx } from '../../cx';
  import {
    amountText,
    getAmountByParts,
    getLocale,
    type AmountSuffix,
  } from '../../runes/amount/amount';
  import type { CurrencyCodeType } from '@razorpay/i18nify-js/currency';
  import { resolveAmount, type AmountStyleProps } from './styles';

  interface BehaviourProps {
    value: number;
    /**
     * ISO 4217.
     * @default 'INR'
     */
    currency?: CurrencyCodeType;
    /**
     * `decimals`: fixed decimals; `none`: floored to the integer; `humanize`:
     * compact (1.5K, 2L, 1Cr — by locale).
     * @default 'decimals'
     */
    suffix?: AmountSuffix;
    /**
     * With `suffix="decimals"`: how many; `auto` takes the currency's own.
     * @default 2
     */
    fractionDigits?: number | 'auto';
    /**
     * The symbol (`₹`) or the code (`INR`).
     * @default 'currency-symbol'
     */
    currencyIndicator?: 'currency-symbol' | 'currency-code';
    /**
     * An old price: one line across the whole amount, currency included, as
     * Blade draws it; a `<del>`, so it also tells a reader.
     * @default false
     */
    isStrikethrough?: boolean;
    /** `minor` for paise or cents: scaled by the currency's own exponent. @default 'major' */
    unit?: 'major' | 'minor';
    /**
     * Grouping and the side the currency sits on, for this amount alone.
     * @default BladeProvider's `adapters.locale`, else i18nify's
     */
    locale?: string;
    /** Replaces the currency symbol with the app's own. */
    symbol?: string;
    testID?: string;
    class?: string;
  }

  type Props = BehaviourProps & AmountStyleProps & Partial<AnalyticsAttributes>;

  let {
    value,
    currency = 'INR',
    suffix = 'decimals',
    fractionDigits,
    currencyIndicator = 'currency-symbol',
    isStrikethrough = false,
    unit,
    locale,
    symbol,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const style = useComponentDefaults('Amount', () => styleProps);
  const analytics = $derived(analyticsAttributes(styleProps));
  const appLocale = getLocale();

  const classes = $derived(resolveAmount(style.current, suffix === 'decimals'));
  const parts = $derived(
    getAmountByParts(value, {
      currency,
      suffix,
      fractionDigits,
      unit,
      locale: locale ?? appLocale(),
    })
  );
  const shown = $derived(
    currencyIndicator === 'currency-code' ? currency : (symbol ?? parts.currency)
  );
  // Subtle decimals are their own part; otherwise they stay with the integer.
  const splitDecimals = $derived(
    suffix === 'decimals' && (style.current.isAffixSubtle ?? true)
  );
  const number = $derived(
    `${parts.integer}${splitDecimals ? '' : `${parts.decimal ?? ''}${parts.fraction ?? ''}`}${parts.compact ?? ''}`
  );
  const decimals = $derived(
    splitDecimals ? `${parts.decimal ?? ''}${parts.fraction ?? ''}` : ''
  );
</script>

<!--
  The parts are visual only: split spans are read piecewise by some screen
  readers, so the whole text is the name and the spans are hidden.
-->
<svelte:element
  this={isStrikethrough ? 'del' : 'span'}
  class={cx(classes.root, isStrikethrough && 'no-underline', className)}
  data-testid={testID}
  {...analytics}
>
  <span class={classes.text}>{amountText(parts, shown)}</span>
  <span class={classes.parts} aria-hidden="true">
    {#if parts.minusSign}<span class={classes.sign}>{parts.minusSign}</span>{/if}
    {#if parts.isPrefixSymbol}<span class={classes.currency.prefix}>{shown}</span>{/if}
    <span class={classes.value}>{number}</span>
    {#if decimals}<span class={classes.decimals}>{decimals}</span>{/if}
    {#if !parts.isPrefixSymbol}<span class={classes.currency.suffix}>{shown}</span>{/if}
    {#if isStrikethrough}<span class={classes.strike}></span>{/if}
  </span>
</svelte:element>
