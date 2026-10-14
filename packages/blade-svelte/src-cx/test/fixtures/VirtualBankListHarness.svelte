<script lang="ts">
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';

  // ActionList over data: `virtualizedSections` renders a VirtualOptionList
  // in the action look, only the rows in view mounted.
  interface Bank {
    code: string;
    name: string;
  }

  interface Props {
    variant?: 'plain' | 'card';
    selectionType?: 'single' | 'multiple' | 'none';
    query?: string;
    isSearchable?: boolean;
    onChange?: (change: { name?: string; value: unknown }) => void;
  }

  let {
    variant = 'card',
    selectionType = 'none',
    query = '',
    isSearchable = false,
    onChange,
  }: Props = $props();

  const suggested: Bank[] = [
    { code: 'sbi', name: 'State Bank of India' },
    { code: 'kotak', name: 'Kotak Mahindra Bank' },
  ];
  const all: Bank[] = Array.from({ length: 6 }, (_, i) => ({ code: `b${i}`, name: `Bank ${i}` }));
  const sections = [
    { key: 'suggested', title: 'Suggested Banks', items: suggested },
    { key: 'all', title: 'All Banks', items: all },
  ];
</script>

{#snippet row(bank: Bank)}
  <ActionListItem value={bank} title={bank.name} testID={bank.code} />
{/snippet}

{#snippet none({ query: typed }: { query: string })}No banks match "{typed}"{/snippet}

{#if isSearchable}
  <ActionList
    {variant}
    {selectionType}
    {onChange}
    isSearchable
    searchPlaceholder="Search for banks"
    virtualizedSections={sections}
    itemKey={(bank) => bank.code}
    itemText={(bank) => bank.name}
    accessibilityLabel="Banks"
    testID="banks"
    class="h-96"
    children={row}
    empty={none}
  />
{:else}
  <ActionList
    {variant}
    {selectionType}
    {query}
    {onChange}
    virtualizedSections={sections}
    itemKey={(bank) => bank.code}
    itemText={(bank) => bank.name}
    accessibilityLabel="Banks"
    testID="banks"
    class="h-96"
    children={row}
    empty={none}
  />
{/if}
