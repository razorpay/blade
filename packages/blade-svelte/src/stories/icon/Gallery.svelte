<script lang="ts">
  import { Icon, SearchInput, Text } from '../../index';
  import * as glyphs from '../../icons/glyphs';

  const all = Object.entries(glyphs);
  let query = $state('');
  const shown = $derived(
    all.filter(([name]) => name.toLowerCase().includes(query.trim().toLowerCase())),
  );
</script>

<div class="flex flex-col gap-4">
  <SearchInput label="Filter icons" bind:value={query} placeholder="e.g. arrow" />
  <Text size="small" color="muted">{shown.length} of {all.length}</Text>
  <div class="grid grid-cols-4 gap-4">
    {#each shown as [name, source] (name)}
      <div class="flex flex-col items-center gap-2 text-surface-gray-normal">
        <Icon {source} size="xlarge" />
        <Text size="xsmall" color="muted">{name}</Text>
      </div>
    {/each}
  </div>
</div>
