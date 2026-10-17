<script lang="ts">
  import { createOverlayHost } from '../../runes/layer/host.svelte';
  import ModalStack from '../modal/ModalStack.svelte';
  import { resolveOverlayStack } from './styles';

  interface Props {
    testID?: string;
    /** Position the host over the frame surfaces must stay inside. */
    class?: string;
  }

  let { testID, class: className = '' }: Props = $props();

  // The web half of the host: the one scrim under every open modal and the
  // box their panels mount in, both stacked in the frame the host is given.
  // Non-modal overlays (tooltips, popovers, toasts) append to the host
  // itself, after the box, so they paint above it. The modals `openModal`
  // asked for render here too (ModalStack), into the box. The native twin
  // renders the element alone: the platform's sheet host owns scrim and
  // stacking.
  const classes = resolveOverlayStack();
  const overlayStack = createOverlayHost({ isolates: true });
</script>

<div class={className} data-testid={testID} {@attach overlayStack.host}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class={classes.backdrop}
    data-state={overlayStack.occupied ? 'open' : 'closed'}
    aria-hidden="true"
    data-testid={testID ? `${testID}-backdrop` : undefined}
    onclick={overlayStack.dismissTop}
    {@attach overlayStack.scrim}
  ></div>
  <div
    class={classes.surfaces}
    data-testid={testID ? `${testID}-surfaces` : undefined}
    {@attach overlayStack.surfaces}
  ></div>
  <ModalStack />
</div>
