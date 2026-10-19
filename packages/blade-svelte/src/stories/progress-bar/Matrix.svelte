<script lang="ts">
  import { ProgressBar, PROGRESS_BAR_AXES } from '../../index';
</script>

<div class="grid w-80 gap-4">
  <ProgressBar label="primary" value={60} />
  {#each PROGRESS_BAR_AXES.color as color (color)}
    <ProgressBar {color} label={color} value={60} />
  {/each}
  <ProgressBar size="medium" label="medium" value={60} />
  <ProgressBar type="meter" label="meter" value={60} />
  <ProgressBar isIndeterminate accessibilityLabel="Loading" label="indeterminate" />
  <div class="flex items-start gap-6">
    {#each PROGRESS_BAR_AXES.size as size (size)}
      <ProgressBar variant="circular" {size} label={size} value={60} />
    {/each}
  </div>
</div>
