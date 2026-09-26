<script lang="ts">
  import { cx } from '../../cx';
  import { formatAmount } from '../../runes/amount/amount';
  import { resolveAmount, type AmountStyleProps } from './styles';

  interface BehaviourProps {
    value: number;
    /** ISO 4217. */
    currency: string;
    /** `minor` for paise or cents: scaled by the currency's own exponent. */
    unit?: 'major' | 'minor';
    /** Pins the decimals (0 for none); the currency's own count otherwise. */
    fractionDigits?: number;
    /** Grouping and the side the currency sits on; the platform's by default. */
    locale?: string;
    /** `symbol` is the narrow one: `$`, not `US$`. */
    currencyDisplay?: 'symbol' | 'code';
    /** Replaces the platform's symbol with the app's own. */
    symbol?: string;
    /** An old price: rendered as `<del>`, which also says so to a reader. */
    isStrikethrough?: boolean;
    testID?: string;
    class?: string;
  }

  type Props = BehaviourProps & AmountStyleProps;

  let {
    value,
    currency,
    unit,
    fractionDigits,
    locale,
    currencyDisplay,
    symbol,
    isStrikethrough = false,
    testID,
    class: className = '',
    ...styleProps
  }: Props = $props();

  const classes = $derived(resolveAmount(styleProps));
  const amount = $derived(
    formatAmount(value, {
      currency,
      unit,
      fractionDigits,
      locale,
      currencyDisplay,
      symbol,
    })
  );
</script>

<!--
  The parts are visual only: split spans are read piecewise by some screen
  readers, so the whole text is the name and the spans are hidden.
-->
<svelte:element
  this={isStrikethrough ? 'del' : 'span'}
  class={cx(classes.root, isStrikethrough && classes.struck, className)}
  data-testid={testID}
>
  <span class={classes.text}>{amount.text}</span>
  <span class={classes.parts} aria-hidden="true">
    {#each amount.parts as part, index (index)}<span
        class={classes.part[part.kind]}>{part.text}</span
      >{/each}
  </span>
</svelte:element>
