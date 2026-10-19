<script lang="ts">
  import {
    SegmentedControl,
    SegmentedControlItem,
    type SegmentedControlStyleProps,
  } from '../../components/segmented-control';
  import { WalletIcon } from '../../icons';

  interface Props {
    value?: string;
    name?: string;
    onChange?: (change: { name: string | undefined; value: string }) => void;
    isDisabled?: boolean;
    disabledValue?: string;
    helpText?: string;
    errorText?: string;
    size?: SegmentedControlStyleProps['size'];
    color?: SegmentedControlStyleProps['color'];
    iconOnly?: boolean;
  }

  let {
    value = $bindable(),
    name,
    onChange,
    isDisabled,
    disabledValue,
    helpText,
    errorText,
    size,
    color,
    iconOnly = false,
  }: Props = $props();

  const GLYPH = WalletIcon;
</script>

<SegmentedControl
  label="Pay via"
  bind:value
  {name}
  {onChange}
  {isDisabled}
  {helpText}
  {errorText}
  {size}
  {color}
  testID="group"
  class="mt-2"
  data-analytics-section="pay-via"
>
  <SegmentedControlItem
    value="upi"
    isDisabled={disabledValue === 'upi'}
    testID="upi"
  >
    UPI
  </SegmentedControlItem>
  <SegmentedControlItem
    value="card"
    isDisabled={disabledValue === 'card'}
    testID="card"
  >
    Card
  </SegmentedControlItem>
  {#if iconOnly}
    <SegmentedControlItem
      value="wallet"
      leading={GLYPH}
      accessibilityLabel="Wallet"
      testID="wallet"
    />
  {:else}
    <SegmentedControlItem value="wallet" leading={GLYPH} testID="wallet">
      Wallet
    </SegmentedControlItem>
  {/if}
</SegmentedControl>
<p data-testid="bound">{value ?? 'none'}</p>
