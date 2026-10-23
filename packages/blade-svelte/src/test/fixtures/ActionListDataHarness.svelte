<script lang="ts">
  import { provideAdapters } from '../../adapters';
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';
  import CardGroup from '../../components/card-group/CardGroup.svelte';
  import CardGroupItem from '../../components/card-group/CardGroupItem.svelte';
  import type {
    CardGroupChange,
    CardGroupDataSection,
    CardGroupItemClick,
  } from '../../components/card-group/styles';

  interface Props {
    /** ActionList's look, or CardGroup's. */
    kind?: 'action-list' | 'card-group';
    count?: number;
    withSections?: boolean;
    isVirtualized?: boolean;
    selectionType?: 'single' | 'multiple';
    onChange?: (change: CardGroupChange<string>) => void;
    onItemClick?: (click: CardGroupItemClick<string>) => void;
    navigate?: (href: string, event: MouseEvent) => boolean;
  }

  let {
    kind = 'action-list',
    count = 5,
    withSections = false,
    isVirtualized = false,
    selectionType = 'single',
    onChange,
    onItemClick,
    navigate,
  }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ navigate });

  const items = $derived(Array.from({ length: count }, (_, i) => `bank-${i}`));
  const sections = $derived<CardGroupDataSection<string>[] | undefined>(
    withSections
      ? [
          { key: 'top', title: 'Popular', items: items.slice(0, 2) },
          { key: 'none', title: 'Empty', items: [] },
          { key: 'rest', title: 'All banks', items: items.slice(2) },
        ]
      : undefined
  );
  let value = $state<string | readonly string[] | null>(null);
</script>

{#snippet actionRow(item: string)}
  <ActionListItem value={item} title={item.toUpperCase()} onClick={onItemClick} data-analytics-row={item} />
{/snippet}
{#snippet cardRow(item: string)}
  <CardGroupItem value={item} title={item.toUpperCase()} />
{/snippet}

{#if kind === 'action-list'}
  <ActionList
    bind:value
    items={sections ? undefined : items}
    {sections}
    row={actionRow}
    {isVirtualized}
    {selectionType}
    {onChange}
    accessibilityLabel="Banks"
    testID="banks"
    data-analytics-list="banks"
  >
    {#snippet children()}
      <ActionListItem value="more" title="More" href="/more" onClick={onItemClick} testID="more" />
    {/snippet}
  </ActionList>
{:else}
  <CardGroup
    bind:value
    items={sections ? undefined : items}
    {sections}
    row={cardRow}
    {isVirtualized}
    {selectionType}
    {onChange}
    accessibilityLabel="Banks"
    testID="banks"
  />
{/if}
<p data-testid="bound">{JSON.stringify(value)}</p>
