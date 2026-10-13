<script lang="ts">
  import {
    ActionListItem,
    Icon,
    SearchInput,
    Text,
    VirtualOptionList,
    actionListClasses,
  } from '../../index';
  import { ChevronRightIcon } from '../../icons';

  interface Bank {
    code: string;
    name: string;
    note?: string;
  }

  const suggested: Bank[] = [
    { code: 'sbi', name: 'State Bank of India' },
    { code: 'icici-corp', name: 'ICICI Bank - Corporate Banking', note: 'For Businesses' },
    { code: 'kotak', name: 'Kotak Mahindra Bank' },
  ];
  // A long list: only the rows in view are mounted.
  const all: Bank[] = Array.from({ length: 400 }, (_, i) => ({
    code: `bank-${i}`,
    name: `Cooperative Bank ${i + 1}`,
  }));

  let query = $state('');
  let picked = $state('');
</script>

<div class="flex max-w-[30rem] flex-col gap-6">
  <SearchInput bind:value={query} placeholder="Search for Banks" accessibilityLabel="Search for banks" size="large" />
  <VirtualOptionList
    classes={actionListClasses('card')}
    selectionType="none"
    {query}
    sections={[
      { key: 'suggested', title: 'Suggested Banks', options: suggested },
      { key: 'all', title: 'All Banks', options: all },
    ]}
    optionKey={(bank) => bank.code}
    optionText={(bank) => bank.name}
    onChange={({ value }) => (picked = (value as Bank).name)}
    accessibilityLabel="Banks"
    class="h-[28rem]"
  >
    {#snippet children(bank)}
      <ActionListItem value={bank} title={bank.name} description={bank.note}>
        {#snippet trailing()}<Icon source={ChevronRightIcon} size="medium" />{/snippet}
      </ActionListItem>
    {/snippet}
    {#snippet empty({ query: typed })}
      <Text color="muted">No banks match “{typed}”</Text>
    {/snippet}
  </VirtualOptionList>
  <Text size="small" color="muted">Last pressed: {picked || '—'}</Text>
</div>
