<script lang="ts">
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';
  import ActionListSection from '../../components/action-list/ActionListSection.svelte';

  interface Props {
    variant?: 'plain' | 'card';
    selectionType?: 'single' | 'multiple' | 'none';
    withSections?: boolean;
    query?: string;
    filter?: (item: { title: string; value: string }, query: string) => boolean;
    onChange?: (change: { name?: string; value: unknown }) => void;
    onSbiClick?: () => void;
  }

  let {
    variant = 'card',
    selectionType = 'none',
    withSections = true,
    query = '',
    filter,
    onChange,
    onSbiClick,
  }: Props = $props();
</script>

{#snippet logo()}<span data-testid="logo">◎</span>{/snippet}
{#snippet chevron()}<span data-testid="chevron">›</span>{/snippet}

{#snippet suggested()}
  <ActionListItem value="sbi" title="State Bank of India" leading={logo} trailing={chevron} onClick={onSbiClick} testID="sbi" />
  <ActionListItem value="icici-corp" title="ICICI Bank - Corporate Banking" description="For Businesses" testID="icici-corp" />
{/snippet}
{#snippet all()}
  <ActionListItem value="airtel" title="Airtel Payments Bank" testID="airtel" />
  <ActionListItem value="axis" title="Axis Bank" testID="axis" />
  <ActionListItem value="kotak" title="Kotak Mahindra Bank" testID="kotak" />
{/snippet}

<ActionList
  {variant}
  {selectionType}
  {query}
  {filter}
  {onChange}
  accessibilityLabel="Banks"
  testID="banks"
>
  {#if withSections}
    <ActionListSection title="Suggested Banks" testID="suggested">{@render suggested()}</ActionListSection>
    <ActionListSection title="All Banks" testID="all">{@render all()}</ActionListSection>
  {:else}
    {@render suggested()}
    {@render all()}
  {/if}
  {#snippet empty({ query: typed })}No banks match "{typed}"{/snippet}
</ActionList>
