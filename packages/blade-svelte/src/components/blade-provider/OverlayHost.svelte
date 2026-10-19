<script lang="ts">
  import type { LiveRegion } from '../../runes/announce/announce';
  import type { ToastQueue } from '../../runes/toast/toasts.svelte';
  import type { ToastStyleProps } from '../toast/styles';
  import { createOverlayHost } from '../../runes/layer/host.svelte';
  import ToastStack from '../toast/ToastStack.svelte';
  import { resolveOverlayHost } from './styles';

  interface Props {
    /** Localized; names the toasts' region. */
    toastsLabel: string;
    /** BladeProvider's live region: what `announce` says. */
    region: LiveRegion;
    /** The queue this host's toast stack renders, if any. */
    toasts: ToastQueue<ToastStyleProps> | undefined;
    testID?: string;
  }

  let { toastsLabel, region, toasts, testID }: Props = $props();

  // BladeProvider's overlay host, after the app's content: the one scrim
  // under every open modal and the box modal surfaces mount in, stacked in
  // the nearest positioned ancestor; non-modal overlays (tooltips,
  // popovers) and the toasts append to the host after the box, so they
  // paint above it. While a modal is open everything beside the host goes
  // inert. Not exported: the app places it by where it puts the provider,
  // and drives the toasts through `adapters.toasts`.
  const classes = resolveOverlayHost();
  const host = createOverlayHost({ isolates: true });
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
  {#if toasts}
    <ToastStack
      queue={toasts}
      accessibilityLabel={toastsLabel}
      testID={testID ? `${testID}-toasts` : undefined}
    />
  {/if}
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
