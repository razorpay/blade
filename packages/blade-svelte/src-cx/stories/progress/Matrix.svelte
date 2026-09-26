<script lang="ts">
  import { Progress, PROGRESS_AXES } from '../../index';
</script>

<div class="grid gap-4 text-surface-gray-normal">
  {#each PROGRESS_AXES.type as type (type)}
    <div class="flex items-center gap-6">
      <span class="w-16 text-25 leading-50 text-surface-gray-subtle">{type}</span>
      {#each PROGRESS_AXES.size as size (size)}
        <Progress
          {type}
          {size}
          value={60}
          class={type === 'bar' ? 'w-24' : ''}
        />
      {/each}
    </div>
  {/each}
</div>
