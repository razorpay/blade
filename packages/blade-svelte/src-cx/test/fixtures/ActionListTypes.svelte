<script lang="ts">
  // Type-level checks for ActionList's prop shapes; svelte-check runs them.
  // The accepted shapes render below; the refused ones are typed here, as
  // svelte-check honours `@ts-expect-error` in script, not in markup.
  import type { ComponentProps, Snippet } from 'svelte';
  import ActionList from '../../components/action-list/ActionList.svelte';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';
  import type { OptionState } from '../../components/option-list/styles';

  interface Bank {
    code: string;
    name: string;
  }
  const banks: Bank[] = [];
  type Props = ComponentProps<typeof ActionList<Bank>>;
  const rowOf = null as unknown as Snippet<[Bank, OptionState]>;
  const rowsOf = null as unknown as Snippet;
  const itemKey = (bank: Bank): string => bank.code;

  // @ts-expect-error a searchable data-driven list needs itemText
  const noText: Props = { isSearchable: true, virtualizedItems: banks, itemKey, children: rowOf };
  // @ts-expect-error two row sources
  const twoSources: Props = { virtualizedItems: banks, virtualizedSections: [], itemKey, children: rowOf };
  // @ts-expect-error itemKey without a data source
  const keyAlone: Props = { itemKey, children: rowsOf };
  // @ts-expect-error isSearchable and query together
  const twoSearches: Props = { isSearchable: true, query: 'x', children: rowsOf };
  // Not searchable: itemText is optional.
  const typeaheadOnly: Props = { virtualizedItems: banks, itemKey, children: rowOf };
  void [noText, twoSources, keyAlone, twoSearches, typeaheadOnly];
</script>

{#snippet row(bank: Bank)}
  <ActionListItem value={bank} title={bank.name} />
{/snippet}

<!-- Data-driven and searchable: itemText given. -->
<ActionList isSearchable virtualizedItems={banks} {itemKey} itemText={(b) => b.name} children={row} />

<!-- Data-driven, not searchable: itemText left out. -->
<ActionList virtualizedItems={banks} {itemKey} children={row} />

<!-- Composed and searchable. -->
<ActionList isSearchable>
  <ActionListItem value="a" title="A" />
</ActionList>
