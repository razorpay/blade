<script lang="ts">
  import { Badge, BADGE_AXES } from '../../index';
  import { CheckCircleIcon } from '../../icons';
</script>

<div class="grid gap-3">
  {#each BADGE_AXES.emphasis as emphasis (emphasis)}
    <div class="flex flex-wrap items-center gap-2">
      {#each BADGE_AXES.color as color (color)}
        <Badge {color} {emphasis}>{color}</Badge>
      {/each}
    </div>
  {/each}
  <div class="flex flex-wrap items-center gap-2">
    {#each BADGE_AXES.size as size (size)}
      <Badge {size} color="positive" icon={CheckCircleIcon}>{size}</Badge>
    {/each}
  </div>
  <!-- One line: a label cut off by its container carries its full text as a title. -->
  <div class="w-24">
    <Badge color="information">A label longer than its container</Badge>
  </div>
</div>
