<script lang="ts">
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';

  interface Props {
    value?: string | null;
    isExpanded?: boolean;
    onExpandChange?: (change: { isExpanded: boolean }) => void;
    /** Overrides the picked row's body following the pick. */
    detailsExpanded?: boolean;
    onEmiClick?: () => void;
  }

  let {
    value = $bindable(null),
    isExpanded = $bindable(false),
    onExpandChange,
    detailsExpanded,
    onEmiClick,
  }: Props = $props();
</script>

<CardGroup bind:value accessibilityLabel="Payment methods" testID="methods">
  <CardGroupItem href="/cards" title="Cards" testID="cards" />
  <CardGroupItem href="/emi" title="EMI" isDisabled onClick={onEmiClick} testID="emi" />
  <CardGroupItem value="wallet" title="Wallet" />
  <CardGroupItem value="part" title="Part payment" isExpanded={detailsExpanded}>
    {#snippet content()}<p data-testid="part-body">Amount</p>{/snippet}
  </CardGroupItem>
  <CardGroupItem title="UPI" bind:isExpanded {onExpandChange} testID="upi-trigger">
    {#snippet content()}
      <div data-testid="upi-body"><CardGroupItem title="Google Pay" testID="gpay" /></div>
    {/snippet}
  </CardGroupItem>
  <CardGroupItem title="Secured by Razorpay" testID="note" />
</CardGroup>
