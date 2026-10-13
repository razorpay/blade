<script lang="ts">
  import VirtualOptionList from '../../components/option-list/VirtualOptionList.svelte';
  import { actionListClasses } from '../../components/action-list/styles';
  import ActionListItem from '../../components/action-list/ActionListItem.svelte';

  interface Bank {
    code: string;
    name: string;
  }

  interface Props {
    variant?: 'plain' | 'card';
    selectionType?: 'single' | 'multiple' | 'none';
    query?: string;
    onChange?: (change: { name?: string; value: unknown }) => void;
  }

  let { variant = 'card', selectionType = 'none', query = '', onChange }: Props = $props();

  const suggested: Bank[] = [
    { code: 'sbi', name: 'State Bank of India' },
    { code: 'kotak', name: 'Kotak Mahindra Bank' },
  ];
  const all: Bank[] = Array.from({ length: 6 }, (_, i) => ({ code: `b${i}`, name: `Bank ${i}` }));
</script>

<VirtualOptionList
  classes={actionListClasses(variant)}
  {selectionType}
  {query}
  {onChange}
  sections={[
    { key: 'suggested', title: 'Suggested Banks', options: suggested },
    { key: 'all', title: 'All Banks', options: all },
  ]}
  optionKey={(bank) => bank.code}
  optionText={(bank) => bank.name}
  accessibilityLabel="Banks"
  testID="banks"
  class="h-96"
>
  {#snippet children(bank)}
    <ActionListItem value={bank} title={bank.name} testID={bank.code} />
  {/snippet}
  {#snippet empty({ query: typed })}No banks match "{typed}"{/snippet}
</VirtualOptionList>
