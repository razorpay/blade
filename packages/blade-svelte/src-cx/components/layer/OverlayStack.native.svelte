<script lang="ts">
  import { createOverlayHost } from '../../runes/layer/host.svelte';
  import ModalStack from '../modal/ModalStack.svelte';

  interface Props {
    testID?: string;
    class?: string;
  }

  let { testID, class: className = '' }: Props = $props();

  // The native half of the host: an element the stack knows, and the modals
  // `openModal` asked for (ModalStack). The platform's sheet host draws the
  // scrim and stacks the sheets, so there is no shared backdrop and no
  // surfaces box to render here.
  const overlayStack = createOverlayHost({ isolates: false });
</script>

<div class={className} data-testid={testID} {@attach overlayStack.host}><ModalStack /></div>
