<script lang="ts">
  import { EmptyState, EMPTY_STATE_AXES, Icon, icons } from '../../index';
</script>

<div class="flex flex-col gap-10">
  {#each EMPTY_STATE_AXES.size as size (size)}
    <EmptyState
      {size}
      title="No content available"
      description={`A ${size} empty state.`}
    >
      {#snippet asset()}<Icon source={icons.warning} size="xlarge" />{/snippet}
    </EmptyState>
  {/each}
</div>
