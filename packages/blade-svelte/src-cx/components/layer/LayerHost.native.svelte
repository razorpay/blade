<script lang="ts">
  import { createLayerHost } from '../../runes/layer/host.svelte';

  interface Props {
    testID?: string;
    class?: string;
  }

  let { testID, class: className = '' }: Props = $props();

  // The native half of the host: an element the stack knows, and nothing
  // else. The platform's sheet host draws the scrim and stacks the sheets,
  // so there is no shared backdrop and no surfaces box to render here.
  const layerHost = createLayerHost({ isolates: false });
</script>

<div class={className} data-testid={testID} {@attach layerHost.host}></div>
