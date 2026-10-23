<script lang="ts">
  import { CardGroup, CardGroupItem, Icon, Text } from '@razorpay/blade-svelte/components';
  import { BankIcon, CreditCardIcon, UpiIcon } from '@razorpay/blade-svelte/icons';

  let { value = $bindable() }: { value: string | null } = $props();
</script>

<!-- One raised card of choices; the picked row reveals its `content`. -->
<CardGroup label="Pay with" bind:value>
  <CardGroupItem value="upi" title="UPI" description="Google Pay, PhonePe, Paytm">
    {#snippet leading()}<Icon source={UpiIcon} />{/snippet}
    {#snippet content()}
      <Text size="small" color="muted">You will get a request in your UPI app.</Text>
    {/snippet}
  </CardGroupItem>
  <CardGroupItem value="card" title="Card" description="Visa, Mastercard, RuPay">
    {#snippet leading()}<Icon source={CreditCardIcon} />{/snippet}
  </CardGroupItem>
  <CardGroupItem value="netbanking" title="Netbanking" description="Down for maintenance" isDisabled>
    {#snippet leading()}<Icon source={BankIcon} />{/snippet}
  </CardGroupItem>
</CardGroup>
