<script lang="ts">
  import { ActionList, Button, Dropdown, DropdownFooter, DropdownHeader, ActionListItem, LayerHost, Text } from '../../index';

  const STATUSES = ['Captured', 'Authorized', 'Refunded', 'Failed', 'Disputed'];

  let value = $state<string | readonly string[] | null>(['captured']);
  let applied = $state<readonly string[]>(['captured']);
</script>

<div class="relative flex h-[26rem] max-w-sm flex-col gap-3 p-2">
  <Dropdown bind:value isMultiple label="Status" placeholder="Any status" testID="dropdown">
    {#snippet header()}
      <DropdownHeader title="Filter by status" />
    {/snippet}
    <ActionList>
      {#each STATUSES as status (status)}
        <ActionListItem value={status.toLowerCase()} title={status} />
      {/each}
    </ActionList>
    {#snippet footer({ close })}
      <DropdownFooter>
        <Button variant="secondary" size="small" onClick={() => (value = [])}>Clear</Button>
        <Button
          size="small"
          onClick={() => {
            applied = Array.isArray(value) ? value : [];
            close();
          }}>Apply</Button
        >
      </DropdownFooter>
    {/snippet}
  </Dropdown>
  <Text size="small" color="muted">Applied: {applied.join(', ') || 'none'}</Text>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
