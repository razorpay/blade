<script lang="ts">
  import Tabs from '../../components/tabs/Tabs.svelte';

  interface Props {
    value?: string;
    activation?: 'automatic' | 'manual';
    layout?: 'auto' | 'fill';
    onChange?: (value: string) => void;
  }

  let { value, activation, layout, onChange }: Props = $props();

  const ITEMS = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'emi', label: 'EMI' },
    { id: 'wallet', label: 'Wallet' },
  ];
</script>

<Tabs
  items={ITEMS}
  itemKey={(item) => item.id}
  itemLabel={(item) => item.label}
  isItemDisabled={(item) => item.id === 'emi'}
  {value}
  {activation}
  {layout}
  {onChange}
  accessibilityLabel="Payment methods"
  testID="tabs"
>
  {#snippet children(item)}
    <p data-testid="panel-text">Pay with {item.label}</p>
  {/snippet}
</Tabs>
