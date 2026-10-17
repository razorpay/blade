<script lang="ts">
  import { ActionList, ActionListItem, ActionListSection, Icon, Text } from '../../index';
  import { BankIcon, ChevronRightIcon } from '../../icons';

  interface Bank {
    code: string;
    name: string;
    note?: string;
  }

  const suggested: Bank[] = [
    { code: 'sbi', name: 'State Bank of India' },
    { code: 'icici-corp', name: 'ICICI Bank - Corporate Banking', note: 'For Businesses' },
    { code: 'kotak', name: 'Kotak Mahindra Bank' },
    { code: 'axis-corp', name: 'Axis Bank - Corporate Banking', note: 'For Businesses' },
    { code: 'axis', name: 'Axis Bank' },
  ];
  const all: Bank[] = [
    { code: 'airtel', name: 'Airtel Payments Bank' },
    { code: 'bob', name: 'Bank of Baroda' },
    { code: 'hdfc', name: 'HDFC Bank' },
    { code: 'idfc', name: 'IDFC FIRST Bank' },
    { code: 'yes', name: 'Yes Bank' },
  ];

  let picked = $state('');
</script>

{#snippet bank(item: Bank)}
  <ActionListItem value={item.code} title={item.name} description={item.note}>
    {#snippet leading()}
      <!-- A bank's logo goes here: an <img>, in the 24px box. -->
      <Icon source={BankIcon} size="large" />
    {/snippet}
    {#snippet trailing()}
      <Icon source={ChevronRightIcon} size="medium" />
    {/snippet}
  </ActionListItem>
{/snippet}

<div class="flex max-w-[30rem] flex-col gap-6">
  <ActionList
    variant="card"
    selectionType="none"
    isSearchable
    searchPlaceholder="Search for Banks"
    onChange={({ value }) => (picked = String(value))}
    accessibilityLabel="Banks"
  >
    <ActionListSection title="Suggested Banks">
      {#each suggested as item (item.code)}{@render bank(item)}{/each}
    </ActionListSection>
    <ActionListSection title="All Banks">
      {#each all as item (item.code)}{@render bank(item)}{/each}
    </ActionListSection>
    {#snippet empty({ query: typed })}
      <Text color="muted">No banks match “{typed}”</Text>
    {/snippet}
  </ActionList>
  <Text size="small" color="muted">Last pressed: {picked || '—'}</Text>
</div>
