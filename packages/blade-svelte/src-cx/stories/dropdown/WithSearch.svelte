<script lang="ts">
  import { ActionList, Dropdown, DropdownHeader, ActionListItem, ActionListSection, LayerHost } from '../../index';

  const BANKS = {
    Popular: ['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'],
    'All banks': ['Bank of Baroda', 'Canara Bank', 'IDFC First Bank', 'Kotak Mahindra Bank', 'Punjab National Bank', 'Yes Bank'],
  };

  let value = $state<string | readonly string[] | null>(null);
</script>

<div class="relative h-[30rem] max-w-sm p-2">
  <Dropdown bind:value label="Bank" placeholder="Choose your bank" testID="dropdown">
    {#snippet header()}
      <DropdownHeader hasSearch searchPlaceholder="Search banks" />
    {/snippet}
    {#snippet content()}
      <ActionList>
        {#each Object.entries(BANKS) as [section, banks] (section)}
          <ActionListSection title={section}>
            {#each banks as bank (bank)}
              <ActionListItem value={bank} title={bank} />
            {/each}
          </ActionListSection>
        {/each}
      </ActionList>
    {/snippet}
  </Dropdown>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
