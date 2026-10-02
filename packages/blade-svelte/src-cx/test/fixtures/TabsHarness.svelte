<script lang="ts">
  import Tabs from '../../components/tabs/Tabs.svelte';
  import TabItem from '../../components/tabs/TabItem.svelte';
  import TabPanel from '../../components/tabs/TabPanel.svelte';
  import { info } from '../../components/icons';

  interface Props {
    value?: string;
    activation?: 'automatic' | 'manual';
    variant?: 'bordered' | 'borderless' | 'filled';
    orientation?: 'horizontal' | 'vertical';
    isLazy?: boolean;
    onChange?: (value: string) => void;
  }

  let { value, activation, variant, orientation, isLazy, onChange }: Props = $props();

  const ITEMS = [
    { id: 'upi', label: 'UPI' },
    { id: 'card', label: 'Card' },
    { id: 'emi', label: 'EMI' },
    { id: 'wallet', label: 'Wallet' },
  ];
</script>

<Tabs
  {value}
  {activation}
  {variant}
  {orientation}
  {isLazy}
  {onChange}
  accessibilityLabel="Payment methods"
  testID="tabs"
>
  {#snippet tabs()}
    {#each ITEMS as item (item.id)}
      <TabItem value={item.id} isDisabled={item.id === 'emi'} icon={item.id === 'card' ? info : undefined}>
        {#snippet children({ isSelected })}{item.label}{#if isSelected}<span data-testid={`picked-${item.id}`}> ✓</span>{/if}{/snippet}
        {#snippet trailing({ isSelected, isDisabled })}<span data-testid={`trailing-${item.id}`} data-selected={isSelected} data-disabled={isDisabled}></span>{/snippet}
      </TabItem>
    {/each}
  {/snippet}
  {#each ITEMS as item (item.id)}
    <TabPanel value={item.id}>
      <p data-testid="panel-text">Pay with {item.label}</p>
    </TabPanel>
  {/each}
</Tabs>
