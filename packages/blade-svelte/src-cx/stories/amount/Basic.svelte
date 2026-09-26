<script lang="ts">
  import { Amount, type AmountStyleProps } from '../../index';

  interface Props {
    args: AmountStyleProps & {
      value: number;
      currency: string;
      unit?: 'major' | 'minor';
      currencyDisplay?: 'symbol' | 'code';
      locale?: string;
      isStrikethrough?: boolean;
    };
  }

  let { args }: Props = $props();
</script>

<Amount
  value={args.value}
  currency={args.currency}
  unit={args.unit}
  currencyDisplay={args.currencyDisplay}
  locale={args.locale || undefined}
  size={args.size}
  weight={args.weight}
  color={args.color}
  affix={args.affix}
  isStrikethrough={args.isStrikethrough}
/>
