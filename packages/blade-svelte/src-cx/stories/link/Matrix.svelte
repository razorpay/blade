<script lang="ts">
  import { LINK_AXES, Link, Text } from '../../index';
</script>

<div class="flex flex-col gap-3">
  {#each LINK_AXES.color as color (color)}
    <div class="flex items-baseline gap-4">
      <Text size="xsmall" color="muted" class="w-16">{color}</Text>
      {#each LINK_AXES.size as size (size)}
        <Link href="#link" {color} {size}>Link</Link>
      {/each}
    </div>
  {/each}
</div>
