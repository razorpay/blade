<script lang="ts">
  import { ActionList, Button, Dropdown, ActionListItem, LayerHost, Text } from '../../index';
  import { ChevronDownIcon } from '../../icons';

  const RANGES = [
    { id: 'today', label: 'Today' },
    { id: '7d', label: 'Last 7 days' },
    { id: '30d', label: 'Last 30 days' },
    { id: 'all', label: 'All time' },
  ];

  let value = $state<string | readonly string[] | null>('7d');
</script>

<div class="relative flex h-72 flex-col items-start gap-3 p-2">
  <Dropdown bind:value accessibilityLabel="Date range" testID="dropdown">
    {#snippet trigger({ selected })}
      <Button variant="secondary" trailingIcon={ChevronDownIcon}>{selected[0] ?? 'Date range'}</Button>
    {/snippet}
    <ActionList>
      {#each RANGES as range (range.id)}
        <ActionListItem value={range.id} title={range.label} />
      {/each}
    </ActionList>
  </Dropdown>
  <Text size="small" color="muted">value: {JSON.stringify(value)}</Text>
  <LayerHost class="pointer-events-none absolute inset-0" />
</div>
