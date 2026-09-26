<script lang="ts">
  import { Icon, icons, Text } from '../../index';

  const glyphs = Object.entries(icons);
</script>

<div class="grid grid-cols-4 gap-4">
  {#each glyphs as [name, source] (name)}
    <div class="flex flex-col items-center gap-2 text-surface-gray-normal">
      <Icon {source} size="xlarge" />
      <Text size="xsmall" color="muted">{name}</Text>
    </div>
  {/each}
</div>
