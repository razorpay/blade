<script lang="ts">
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';

  interface Props {
    value?: string | null;
    /** The rows mounted, as indices into the items (a virtual window's slice). */
    mounted?: readonly number[];
    /** Renders the mounted rows last first: their order must come from the data. */
    isReversed?: boolean;
    /** Keeps only the items starting with it, as a search would. */
    query?: string;
  }

  let { value = $bindable(null), mounted, isReversed = false, query = '' }: Props = $props();

  const items = $derived(['hdfc', 'icici', 'sbi', 'axis'].filter((item) => item.startsWith(query)));
  const rows = $derived.by(() => {
    const shown = (mounted ?? items.map((_, index) => index)).map((index) => items[index]);
    return isReversed ? [...shown].reverse() : shown;
  });
</script>

<CardGroup
  bind:value
  {items}
  itemText={(item) => item.toUpperCase()}
  isItemDisabled={(item) => item === 'sbi'}
  accessibilityLabel="Bank"
  testID="banks"
>
  {#snippet children({ activeIndex, tabStop })}
    <p data-testid="view">{activeIndex}:{tabStop}</p>
    {#each rows as item (item)}
      {#if item === 'sbi'}<h3>Others</h3>{/if}
      <CardGroupItem value={item} title={item.toUpperCase()} />
    {/each}
  {/snippet}
</CardGroup>
<p data-testid="bound">{value}</p>
