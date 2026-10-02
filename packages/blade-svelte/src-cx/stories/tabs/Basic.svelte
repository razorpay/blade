<script lang="ts">
  import { Badge, icons, TabItem, TabPanel, Tabs, Text, type TabsStyleProps } from '../../index';

  interface Props {
    args: TabsStyleProps & { activation?: 'automatic' | 'manual'; isLazy?: boolean };
  }

  let { args }: Props = $props();

  let value = $state('upi');
</script>

<div class="w-[40rem] max-w-full">
  {#key `${args.activation}-${args.orientation}`}
    <Tabs
      bind:value
      variant={args.variant}
      size={args.size}
      orientation={args.orientation}
      isFullWidthTabItem={args.isFullWidthTabItem}
      activation={args.activation}
      isLazy={args.isLazy}
      accessibilityLabel="Payment methods"
    >
      {#snippet tabs()}
        <TabItem value="upi">UPI</TabItem>
        <TabItem value="card" icon={icons.info}>
          Card
          {#snippet trailing()}<Badge size="small">New</Badge>{/snippet}
        </TabItem>
        <TabItem value="emi" isDisabled>EMI</TabItem>
        <TabItem value="wallet">Wallet</TabItem>
      {/snippet}
      <TabPanel value="upi" class="p-4"><Text>Pay with any UPI app.</Text></TabPanel>
      <TabPanel value="card" class="p-4"><Text>Credit and debit cards.</Text></TabPanel>
      <TabPanel value="emi" class="p-4"><Text>Not available for this order.</Text></TabPanel>
      <TabPanel value="wallet" class="p-4"><Text>Pick a wallet to continue.</Text></TabPanel>
    </Tabs>
  {/key}
  <Text size="small" color="muted" class="mt-3">value: {value}</Text>
</div>
