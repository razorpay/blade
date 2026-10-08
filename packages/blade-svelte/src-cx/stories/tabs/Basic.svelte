<script lang="ts">
  import { Badge, Image, TabItem, TabPanel, Tabs, Text, type TabsStyleProps } from '../../index';
  import { InfoIcon } from '../../icons';

  interface Props {
    args: TabsStyleProps & { activation?: 'automatic' | 'manual'; isLazy?: boolean };
  }

  let { args }: Props = $props();

  let value = $state('upi');
  // Stands in for a wallet's logo: an asset, so it goes in `leading`.
  const walletLogo =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><circle cx="8" cy="8" r="8" fill="#5f259f"/><path d="M5 4h4a3 3 0 0 1 0 6H7v2H5z" fill="#fff"/></svg>';
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
      {#snippet tabList()}
        <TabItem value="upi">UPI</TabItem>
        <TabItem value="card" leading={InfoIcon}>
          Card
          {#snippet trailing()}<Badge size="small">New</Badge>{/snippet}
        </TabItem>
        <TabItem value="emi" isDisabled>EMI</TabItem>
        <TabItem value="wallet">
          {#snippet leading()}<Image src={walletLogo} alt="" class="w-full h-full" />{/snippet}
          Wallet
        </TabItem>
      {/snippet}
      <TabPanel value="upi" class="p-4"><Text>Pay with any UPI app.</Text></TabPanel>
      <TabPanel value="card" class="p-4"><Text>Credit and debit cards.</Text></TabPanel>
      <TabPanel value="emi" class="p-4"><Text>Not available for this order.</Text></TabPanel>
      <TabPanel value="wallet" class="p-4"><Text>Pick a wallet to continue.</Text></TabPanel>
    </Tabs>
  {/key}
  <Text size="small" color="muted" class="mt-3">value: {value}</Text>
</div>
