<script lang="ts">
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import { provideLayers } from '../../runes/layer/layers';
  import Popover from '../../components/popover/Popover.svelte';
  import { InfoIcon } from '../../icons';

  interface Props {
    openInteraction?: 'click' | 'hover';
    /** The title as a snippet in place of the string. */
    richTitle?: boolean;
    /** A glyph before the title, in place of the `titleLeading` asset. */
    withIcon?: boolean;
    onOpenChange?: (change: { isOpen: boolean }) => void;
  }

  let { openInteraction = 'click', richTitle = false, withIcon = false, onOpenChange }: Props = $props();

  provideLayers();
</script>

{#snippet leadingAsset({ close }: { close: () => void })}<button type="button" data-testid="leading" onclick={close}>i</button>{/snippet}

{#snippet titleSnippet()}<em data-testid="rich-title">Settlement</em> breakup{/snippet}

<Popover
  title={richTitle ? titleSnippet : 'Settlement breakup'}
  titleLeading={withIcon ? InfoIcon : leadingAsset}
  testID="panel"
  {openInteraction}
  {onOpenChange}
>
  <button type="button">Settlement</button>
  {#snippet content()}<p>Gross ₹100</p>{/snippet}
  {#snippet footer({ close })}<button type="button" onclick={close}>Settle</button>{/snippet}
</Popover>
<LayerHost />
