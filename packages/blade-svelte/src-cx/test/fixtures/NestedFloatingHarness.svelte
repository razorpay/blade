<script lang="ts">
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { provideLayers } from '../../runes/layer/layers';
  import Popover from '../../components/popover/Popover.svelte';
  import Tooltip from '../../components/tooltip/Tooltip.svelte';

  provideLayers();
</script>

<main>
  <Popover accessibilityLabel="Fee details" testID="panel">
    <button type="button">Fees</button>
    {#snippet content()}
      <Tooltip content="Charged by your bank" testID="tip">
        <button type="button" data-testid="tip-trigger">Why?</button>
      </Tooltip>
    {/snippet}
  </Popover>
</main>
<LayerHost />
