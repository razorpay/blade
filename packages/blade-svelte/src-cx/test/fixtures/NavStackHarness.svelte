<script lang="ts">
  import ModalStack from '../../components/modal/ModalStack.svelte';
  import LayerHost from '../../components/layer/LayerHost.svelte';
  import NavStack from '../../components/nav-stack/NavStack.svelte';
  import {
    provideOverlays,
    type Overlays,
  } from '../../components/modal/overlays';
  import { provideLayers } from '../../runes/layer/layers';
  import {
    provideNav,
    type Nav,
    type NavDirection,
    type NavEntry,
  } from '../../runes/nav-stack/nav';
  import { provideAdapters } from '../../adapters';

  interface Props {
    onReady: (nav: Nav, overlays: Overlays) => void;
    onChange?: (entry: NavEntry | undefined, direction: NavDirection) => void;
    captureError?: (error: unknown) => void;
  }

  let { onReady, onChange, captureError }: Props = $props();

  // svelte-ignore state_referenced_locally
  provideAdapters({ captureError });
  // Isolated stacks per test: nothing leaks through the global ones.
  provideLayers();
  const overlays = provideOverlays();
  const nav = provideNav();
  // svelte-ignore state_referenced_locally
  onReady(nav, overlays);
</script>

<NavStack testID="stack" {onChange} />
<ModalStack />
<LayerHost />
