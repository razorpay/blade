<script lang="ts">
  /**
   * Toggle every `styleOverride` off to see the baseline underneath — the before/after
   * comparison, held in state so the preview can be inspected while comparing.
   */
  import Switch from '../../../Switch/Switch.svelte';
  import Text from '../../../Typography/Text/Text.svelte';

  let {
    isComparing = $bindable(false),
    label = 'Compare with baseline',
    id = 'style-override-compare',
  }: { isComparing?: boolean; label?: string; id?: string } = $props();
</script>

<div class="compare">
  <Switch
    {id}
    size="small"
    isChecked={isComparing}
    accessibilityLabel={label}
    onChange={({ isChecked }) => (isComparing = isChecked)}
  />
  <label for={id} class="compare-label">
    <Text size="small" color="surface.text.gray.muted">
      {isComparing ? 'Showing baseline' : label}
    </Text>
  </label>
</div>

<style>
  .compare {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-3);
  }

  .compare-label {
    cursor: pointer;
    user-select: none;
  }
</style>
