<script lang="ts">
  import { EmptyState, EMPTY_STATE_AXES, Icon } from '../../index';
  import { AlertTriangleIcon } from '../../icons';
</script>

<div class="flex flex-col gap-10">
  {#each EMPTY_STATE_AXES.size as size (size)}
    <EmptyState
      {size}
      title="No content available"
      description={`A ${size} empty state.`}
    >
      {#snippet asset()}<Icon source={AlertTriangleIcon} size="xlarge" />{/snippet}
    </EmptyState>
  {/each}
</div>
