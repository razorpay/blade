<script lang="ts">
  import { Text, VirtualWindow } from '../../index';

  // Ten thousand rows; only the ones in view (and a few beyond) are mounted.
  const rows = Array.from({ length: 10_000 }, (_, i) => ({
    key: `row-${i}`,
    label: `Payment #${i + 1}`,
    // Rows needn't share a height: each is measured once mounted.
    note: i % 7 === 0 ? 'Refunded, with a longer note that wraps onto a second line in a narrow window.' : '',
  }));
  const keys = rows.map((row) => row.key);
</script>

<VirtualWindow
  {keys}
  class="h-80 max-w-sm rounded-small border-thin border-solid border-surface-gray-muted"
  contentClass="flex flex-col"
  testID="window"
>
  {#snippet children({ start, end })}
    {#each rows.slice(start, end) as row (row.key)}
      <div class="flex flex-col gap-0.5 border-b-thin border-t-none border-x-none border-solid border-surface-gray-muted px-4 py-3">
        <Text size="small">{row.label}</Text>
        {#if row.note}<Text size="xsmall" color="muted">{row.note}</Text>{/if}
      </div>
    {/each}
  {/snippet}
</VirtualWindow>
