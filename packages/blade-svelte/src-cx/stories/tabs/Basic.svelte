<script lang="ts">
  import { Tabs, Text, type TabsStyleProps } from '../../index';

  interface Props {
    args: TabsStyleProps & { activation?: 'automatic' | 'manual' };
  }

  let { args }: Props = $props();

  const METHODS = [
    { id: 'upi', label: 'UPI', note: 'Pay with any UPI app.' },
    { id: 'card', label: 'Card', note: 'Credit and debit cards.' },
    { id: 'emi', label: 'EMI', note: 'Not available for this order.' },
    { id: 'wallet', label: 'Wallet', note: 'Pick a wallet to continue.' },
  ];

  let value = $state('upi');
</script>

<div class="w-96 max-w-full">
  {#key args.activation}
    <Tabs
      items={METHODS}
      itemKey={(method) => method.id}
      itemLabel={(method) => method.label}
      isItemDisabled={(method) => method.id === 'emi'}
      bind:value
      layout={args.layout}
      size={args.size}
      activation={args.activation}
      accessibilityLabel="Payment methods"
    >
      {#snippet children(method)}
        <Text>{method.note}</Text>
      {/snippet}
    </Tabs>
  {/key}
  <Text size="small" color="muted" class="mt-3">value: {value}</Text>
</div>
