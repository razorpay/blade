<script lang="ts">
  import { Amount, Heading } from '../../index';

  interface Props {
    args: {
      value: number;
      currency: string;
      suffix?: 'decimals' | 'none' | 'humanize';
      currencyIndicator?: 'currency-symbol' | 'currency-code';
      isAffixSubtle?: boolean;
      unit?: 'major' | 'minor';
      locale?: string;
      isStrikethrough?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<!-- The amount takes the surrounding text's size, weight, colour and face. -->
<Heading size="large">
  <Amount
    value={args.value}
    currency={args.currency}
    suffix={args.suffix}
    currencyIndicator={args.currencyIndicator}
    isAffixSubtle={args.isAffixSubtle}
    unit={args.unit}
    locale={args.locale || undefined}
    isStrikethrough={args.isStrikethrough}
  />
</Heading>
