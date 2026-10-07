<script lang="ts">
  import { ActionList, Dropdown, DropdownHeader, ActionListItem, LayerHost } from '../../index';
</script>

<div class="relative flex h-72 max-w-2xl flex-row gap-4 p-2">
  <div class="flex-1">
    <Dropdown label="Loading" placeholder="Fetching options" isLoading testID="loading">
      <ActionList>
        <ActionListItem value="x" title="Never shown" />
      </ActionList>
    </Dropdown>
  </div>
  <div class="flex-1">
    <Dropdown label="Search finds nothing" placeholder="Type “zzz” in the search" testID="empty">
      {#snippet header()}
        <DropdownHeader hasSearch />
      {/snippet}
      <ActionList>
        <ActionListItem value="upi" title="UPI" />
        <ActionListItem value="cards" title="Cards" />
      </ActionList>
    </Dropdown>
  </div>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
