<script lang="ts">
  import { COUNTER_AXES, Counter } from '../../index';
</script>

<!-- Every colour × emphasis, at each size, with one and two digits. -->
<div class="flex flex-col gap-3">
  {#each COUNTER_AXES.size as size (size)}
    {#each COUNTER_AXES.emphasis as emphasis (emphasis)}
      <div class="flex items-center gap-2">
        {#each COUNTER_AXES.color as color (color)}
          <Counter value={7} {color} {emphasis} {size} />
          <Counter value={42} {color} {emphasis} {size} />
        {/each}
      </div>
    {/each}
  {/each}
</div>
