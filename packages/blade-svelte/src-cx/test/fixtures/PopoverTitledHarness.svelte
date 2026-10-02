<script lang="ts">
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { provideLayers } from '../../runes/layer/layers';
  import Popover from '../../components/popover/Popover.svelte';

  interface Props {
    openInteraction?: 'click' | 'hover';
    /** The title as a snippet in place of the string. */
    richTitle?: boolean;
    onOpenChange?: (change: { isOpen: boolean }) => void;
  }

  let { openInteraction = 'click', richTitle = false, onOpenChange }: Props = $props();

  provideLayers();
</script>

{#snippet titleSnippet()}<em data-testid="rich-title">Settlement</em> breakup{/snippet}

<Popover title={richTitle ? titleSnippet : 'Settlement breakup'} testID="panel" {openInteraction} {onOpenChange}>
  {#snippet trigger()}<button type="button">Settlement</button>{/snippet}
  {#snippet titleLeading({ close })}<button type="button" data-testid="leading" onclick={close}>i</button>{/snippet}
  {#snippet children()}<p>Gross ₹100</p>{/snippet}
  {#snippet footer({ close })}<button type="button" onclick={close}>Settle</button>{/snippet}
</Popover>
<LayerHost />
