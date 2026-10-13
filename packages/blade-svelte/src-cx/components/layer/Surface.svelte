<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { createSurface } from '../../runes/layer/surface.svelte';
  import type { SurfaceClasses } from './styles';

  interface Props {
    isOpen: boolean;
    /** Lower layers go inert so only the top surface takes focus and input. */
    isTop: boolean;
    role: 'dialog' | 'alertdialog';
    labelledBy?: string;
    describedBy?: string;
    accessibilityLabel?: string;
    classes: SurfaceClasses;
    /** Whether a drag may close it; a sheet that may not resists and settles. */
    isDismissible?: boolean;
    /**
     * The user dragged the sheet away; the owner's model decides. A tap on
     * the shared scrim reaches the owner through the layer stack instead.
     */
    onDismissRequest: (source: 'drag') => void;
    /** The exit finished and the surface left the DOM. */
    onClosed?: () => void;
    /** Lands on the panel, the element that carries the role. */
    testID?: string;
    class?: string;
    /**
     * The top of the surface. On a draggable surface it is part of the drag
     * zone, together with the handle strip.
     */
    header?: Snippet;
    /**
     * What sits in the chrome — the full-width, zero-height box on the
     * panel's top edge that the panel does not clip — after the drag
     * handle.
     */
    chrome?: Snippet;
    children: Snippet;
  }

  let {
    isOpen,
    isTop,
    role,
    labelledBy,
    describedBy,
    accessibilityLabel,
    classes,
    isDismissible = true,
    onDismissRequest,
    onClosed,
    testID,
    class: className = '',
    header,
    chrome,
    children,
  }: Props = $props();

  // The web half of an overlay surface: everything DOM-bound (presence,
  // portal, focus, Tab trap) is the rune's and has a platform twin in
  // Surface.native.svelte, where the native sheet host owns all of it.
  const surface = createSurface({
    isOpen: () => isOpen,
    isTop: () => isTop,
    isDismissible: () => isDismissible,
    dragAxis: () => classes.drag,
    onDismissRequest: (source) => onDismissRequest(source),
  });
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class={classes.root}
    data-state="closed"
    inert={!isTop}
    transition:surface.presence.transition
    onoutroend={() => onClosed?.()}
    onkeydown={surface.handleKeyDown}
    {@attach surface.toHost}
    {@attach surface.presence.mount}
  >
    <div
      {role}
      class={cx(classes.panel, className)}
      tabindex="-1"
      aria-modal="true"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
      aria-label={labelledBy ? undefined : accessibilityLabel}
      data-testid={testID}
      {@attach surface.panel}
    >
      <!-- First, so what it holds (the close button) is early in tab order. -->
      <div class={classes.chrome} data-testid={testID ? `${testID}-chrome` : undefined}>
        {#if classes.drag.isEnabled && classes.drag.handle}
          <!-- Over the drag strip, which takes the press. -->
          <div class={classes.drag.handle} aria-hidden="true">
            <span class={classes.drag.grip}></span>
          </div>
        {/if}
        {@render chrome?.()}
      </div>
      <div class={classes.content} data-testid={testID ? `${testID}-content` : undefined}>
        {#if classes.drag.isEnabled}
          <div
            class={classes.drag.zone}
            data-testid={testID ? `${testID}-drag-zone` : undefined}
            onpointerdown={surface.handleDragStart}
            onpointermove={surface.handleDragMove}
            onpointerup={surface.handleDragEnd}
            onpointercancel={surface.handleDragCancel}
          >
            {#if classes.drag.strip}
              <div class={classes.drag.strip}></div>
            {/if}
            {@render header?.()}
          </div>
        {:else}
          {@render header?.()}
        {/if}
        {@render children()}
      </div>
    </div>
  </div>
{/if}
