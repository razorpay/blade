<script lang="ts">
  import CardGroup from '../CardGroup.svelte';
  import CardGroupItem from '../CardGroupItem.svelte';
  import CardGroupCollapsibleItem from '../CardGroupCollapsibleItem.svelte';
  import CardGroupCollapsibleItemBody from '../CardGroupCollapsibleItemBody.svelte';

  let {
    onSelect = () => {},
    defaultIsExpanded = false,
  }: { onSelect?: () => void; defaultIsExpanded?: boolean } = $props();
</script>

<CardGroup accessibilityLabel="Payment methods">
  <CardGroupItem href="/cards">
    {#snippet children()}Cards{/snippet}
  </CardGroupItem>

  <CardGroupItem onClick={onSelect}>
    {#snippet children()}Wallet{/snippet}
  </CardGroupItem>

  <CardGroupCollapsibleItem {defaultIsExpanded}>
    <CardGroupItem>
      {#snippet children()}UPI{/snippet}
    </CardGroupItem>
    <CardGroupCollapsibleItemBody>
      {#snippet children()}Google Pay{/snippet}
    </CardGroupCollapsibleItemBody>
  </CardGroupCollapsibleItem>
</CardGroup>
