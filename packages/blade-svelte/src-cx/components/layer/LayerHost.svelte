<script lang="ts">
  import { createLayerHost } from '../../runes/layer/host.svelte';
  import { resolveLayerHost } from './styles';

  interface Props {
    testID?: string;
    /** Position the host over the frame surfaces must stay inside. */
    class?: string;
  }

  let { testID, class: className = '' }: Props = $props();

  // The web half of the host: the one scrim under every open modal and the
  // box their panels mount in, both stacked in the frame the host is given.
  // Non-modal overlays (tooltips, popovers, toasts) append to the host
  // itself, after the box, so they paint above it. The native twin renders
  // the element alone: the platform's sheet host owns scrim and stacking.
  const classes = resolveLayerHost();
  const layerHost = createLayerHost({ isolates: true });
</script>

<div class={className} data-testid={testID} {@attach layerHost.host}>
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <div
    class={classes.backdrop}
    data-state={layerHost.occupied ? 'open' : 'closed'}
    aria-hidden="true"
    data-testid={testID ? `${testID}-backdrop` : undefined}
    onclick={layerHost.dismissTop}
    {@attach layerHost.scrim}
  ></div>
  <div
    class={classes.surfaces}
    data-testid={testID ? `${testID}-surfaces` : undefined}
    {@attach layerHost.surfaces}
  ></div>
</div>
