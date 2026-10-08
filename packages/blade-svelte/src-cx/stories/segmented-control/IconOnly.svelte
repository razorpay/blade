<script lang="ts">
  import {
    Counter,
    Image,
    SegmentedControl,
    SegmentedControlItem,
    Text,
  } from '../../index';
  import { BankIcon, CreditCardIcon, PhoneIcon } from '../../icons';

  let method = $state<string | undefined>('card');
  // Stands in for an app's own logo: an asset, not a glyph, so it goes in
  // `leading`.
  const appLogo =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#5f259f"/><path d="M5 4h4a3 3 0 0 1 0 6H7v2H5z" fill="#fff"/></svg>';
</script>

<div class="grid max-w-80 gap-4">
  <SegmentedControl bind:value={method} accessibilityLabel="Pay with">
    <SegmentedControlItem
      value="card"
      leading={CreditCardIcon}
      accessibilityLabel="Card"
    />
    <SegmentedControlItem
      value="bank"
      leading={BankIcon}
      accessibilityLabel="Netbanking"
    />
    <SegmentedControlItem
      value="phone"
      leading={PhoneIcon}
      accessibilityLabel="UPI"
    />
  </SegmentedControl>
  <SegmentedControl bind:value={method} accessibilityLabel="Pay with">
    <SegmentedControlItem value="card" leading={CreditCardIcon}
      >Card</SegmentedControlItem
    >
    <SegmentedControlItem value="bank" leading={BankIcon}
      >Bank</SegmentedControlItem
    >
    <SegmentedControlItem value="phone" leading={PhoneIcon}
      >UPI</SegmentedControlItem
    >
  </SegmentedControl>
  <!-- An asset in the icon's box, and a Counter after the label: one row,
       8px apart. -->
  <SegmentedControl bind:value={method} accessibilityLabel="Pay with">
    <SegmentedControlItem value="card" leading={CreditCardIcon}>Card</SegmentedControlItem>
    <SegmentedControlItem value="phone">
      {#snippet leading()}<Image src={appLogo} alt="" class="w-4 h-4" />{/snippet}
      UPI
      {#snippet trailing()}<Counter value={3} size="small" />{/snippet}
    </SegmentedControlItem>
  </SegmentedControl>
  <Text size="small" color="muted">value: {JSON.stringify(method)}</Text>
</div>
