<script lang="ts">
  import OverlayStack from '../../components/layer/OverlayStack.svelte';
  import {
    provideOverlays,
    type Overlays,
  } from '../../components/modal/overlays';
  import { provideAdapters } from '../../adapters';

  interface Props {
    onReady: (overlays: Overlays) => void;
    captureError?: (error: unknown) => void;
  }

  let { onReady, captureError }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ captureError });
  // An isolated stack per test: nothing leaks through the global one.
  const overlays = provideOverlays();
  // svelte-ignore state_referenced_locally
  onReady(overlays);
</script>

<main data-testid="page">Checkout</main>
<OverlayStack />
