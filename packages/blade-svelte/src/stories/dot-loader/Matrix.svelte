<script lang="ts">
  import { DotLoader, DOT_LOADER_AXES } from '../../index';
</script>

<div class="grid gap-3">
  <div class="flex items-center gap-4">
    {#each DOT_LOADER_AXES.size as size (size)}
      <DotLoader {size} />
    {/each}
  </div>
  <div class="flex flex-wrap items-center gap-4">
    {#each DOT_LOADER_AXES.color as color (color)}
      <span class={color === 'white' ? 'rounded-small bg-feedback-neutral-intense' : ''}>
        <DotLoader {color} />
      </span>
    {/each}
  </div>
</div>
