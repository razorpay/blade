<script lang="ts">
  import { Badge, BADGE_AXES } from '../../index';
</script>

<div class="grid gap-3">
  {#each BADGE_AXES.emphasis as emphasis (emphasis)}
    <div class="flex flex-wrap items-center gap-2">
      {#each BADGE_AXES.color as color (color)}
        <Badge {color} {emphasis}>{color}</Badge>
      {/each}
    </div>
  {/each}
</div>
