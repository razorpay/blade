<script lang="ts">
  import BaseAmount from './BaseAmount/BaseAmount.svelte';
  import type { BaseAmountProps } from './BaseAmount/types';

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
</script>

<BaseAmount
  {value}
  {suffix}
  {type}
  {size}
  {weight}
  {isAffixSubtle}
  {isStrikethrough}
  {color}
  {currencyIndicator}
  {currency}
  {fractionDigits}
  {testID}
  {...rest}
/>

