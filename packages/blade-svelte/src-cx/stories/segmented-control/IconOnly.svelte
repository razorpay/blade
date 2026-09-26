<script lang="ts">
  import {
    icons,
    SegmentedControl,
    SegmentedControlItem,
    Text,
  } from '../../index';

  let method = $state<string | undefined>('card');
</script>

<div class="grid max-w-80 gap-4">
  <SegmentedControl bind:value={method} accessibilityLabel="Pay with">
    <SegmentedControlItem
      value="card"
      leading={icons.card}
      accessibilityLabel="Card"
    />
    <SegmentedControlItem
      value="bank"
      leading={icons.bank}
      accessibilityLabel="Netbanking"
    />
    <SegmentedControlItem
      value="phone"
      leading={icons.phone}
      accessibilityLabel="UPI"
    />
  </SegmentedControl>
  <SegmentedControl bind:value={method} accessibilityLabel="Pay with">
    <SegmentedControlItem value="card" leading={icons.card}
      >Card</SegmentedControlItem
    >
    <SegmentedControlItem value="bank" leading={icons.bank}
      >Bank</SegmentedControlItem
    >
    <SegmentedControlItem value="phone" leading={icons.phone}
      >UPI</SegmentedControlItem
    >
  </SegmentedControl>
  <Text size="small" color="muted">value: {JSON.stringify(method)}</Text>
</div>
