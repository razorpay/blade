<script lang="ts">
  import { Amount, Heading, type AmountStyleProps } from '../../index';

  interface Props {
    args: {
      value: number;
      currency: string;
      suffix?: 'decimals' | 'none' | 'humanize';
      currencyIndicator?: 'currency-symbol' | 'currency-code';
      type?: 'body' | 'heading' | 'display';
      size?: string;
      weight?: string;
      color?: string;
      isAffixSubtle?: boolean;
      unit?: 'major' | 'minor';
      locale?: string;
      isStrikethrough?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<!-- With size, weight and colour on inherit the amount takes the surrounding
     text's; pick a type and size to style it as Figma's variants. -->
<Heading size="large">
  <Amount
    value={args.value}
    currency={args.currency}
    suffix={args.suffix}
    currencyIndicator={args.currencyIndicator}
    {...({ type: args.type, size: args.size, weight: args.weight, color: args.color } as AmountStyleProps)}
    isAffixSubtle={args.isAffixSubtle}
    unit={args.unit}
    locale={args.locale || undefined}
    isStrikethrough={args.isStrikethrough}
  />
</Heading>
