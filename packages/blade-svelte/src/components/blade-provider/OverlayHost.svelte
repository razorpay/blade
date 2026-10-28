<script lang="ts">
  import type { LiveRegion } from '../../runes/announce/announce';
  import { createOverlayHost } from '../../runes/layer/host.svelte';
  import { resolveOverlayHost } from './styles';

  interface Props {
    /** BladeProvider's live region: what `announce` says. */
    region: LiveRegion;
    /** Whether the page beside the host goes inert while a modal is open. */
    isolates: boolean;
    testID?: string;
  }

  let { region, isolates, testID }: Props = $props();

  // BladeProvider's overlay host, after the app's content: the one scrim
  // under every open modal and the box modal surfaces mount in, stacked in
  // the nearest positioned ancestor; non-modal overlays (tooltips,
  // popovers) and a ToastContainer's toasts append to the host after the
  // box, so they paint above it. While a modal is open everything beside
  // the host goes inert, unless the provider keeps the page live. Not
  // exported: the app places it by where it puts the provider.
  const classes = resolveOverlayHost();
  const host = createOverlayHost({
    get isolates() {
      return isolates;
    },
  });
</script>

<div data-testid={testID} {@attach host.host}>
  <div
    class={classes.backdrop}
    data-state={host.occupied ? 'open' : 'closed'}
    aria-hidden="true"
    data-testid={testID ? `${testID}-backdrop` : undefined}
    onclick={host.dismissTop}
    {@attach host.scrim}
  ></div>
  <div
    class={classes.surfaces}
    data-testid={testID ? `${testID}-surfaces` : undefined}
    {@attach host.surfaces}
  ></div>
  <!--
    The one polite live region, as Blade React's LiveAnnouncer: each message
    a node of its own, so a repeated one is said again. In the host, so a
    modal's inert page never silences it.
  -->
  <div
    class={classes.live}
    role="log"
    aria-live="polite"
    aria-relevant="additions"
    data-testid={testID ? `${testID}-live` : undefined}
  >
    {#each region.messages as message (message.id)}
      <div>{message.text}</div>
    {/each}
  </div>
</div>
