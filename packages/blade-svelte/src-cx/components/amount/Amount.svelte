<script lang="ts">
  import { useComponentDefaults } from '../defaults';
  import { cx } from '../../cx';
  import {
    amountText,
    getAmountByParts,
    type AmountSuffix,
  } from '../../runes/amount/amount';
  import { resolveAmount, type AmountStyleProps } from './styles';

  interface BehaviourProps {
    value: number;
    /**
     * ISO 4217.
     * @default 'INR'
     */
    currency?: string;
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
    /** An old price: a `<del>`, whose line follows the text; it also tells a reader. @default false */
    isStrikethrough?: boolean;
    /** `minor` for paise or cents: scaled by the currency's own exponent. @default 'major' */
    unit?: 'major' | 'minor';
    /** Grouping and the side the currency sits on; i18nify's by default. */
    locale?: string;
    /** Replaces the currency symbol with the app's own. */
    symbol?: string;
    testID?: string;
    class?: string;
  }

  type Props = BehaviourProps & AmountStyleProps;

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

  const classes = $derived(resolveAmount(style.current, suffix === 'decimals'));
  const parts = $derived(
    getAmountByParts(value, { currency, suffix, fractionDigits, unit, locale })
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
  class={cx(classes.root, className)}
  data-testid={testID}
>
  <span class={classes.text}>{amountText(parts, shown)}</span>
  <span class={classes.parts} aria-hidden="true">
    {#if parts.minusSign}<span class={classes.sign}>{parts.minusSign}</span>{/if}
    {#if parts.isPrefixSymbol}<span class={classes.currency.prefix}>{shown}</span>{/if}
    <span class={classes.value}>{number}</span>
    {#if decimals}<span class={classes.decimals}>{decimals}</span>{/if}
    {#if !parts.isPrefixSymbol}<span class={classes.currency.suffix}>{shown}</span>{/if}
  </span>
</svelte:element>
