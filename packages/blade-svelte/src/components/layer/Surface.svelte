<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx } from '../../cx';
  import { CloseIcon } from '../../icons';
  import Icon from '../icon/Icon.svelte';
  import { createSurface } from '../../runes/layer/surface.svelte';
  import { provideDragZone } from '../../runes/layer/drag-zone';
  import type { AnalyticsAttributes } from '../../runes/dom/analytics';
  import type { SurfaceClasses } from './styles';

  interface Props {
    /** The panel's id: what the trigger's `aria-controls` points at. */
    id?: string;
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
    /** Takes focus when it opens, in place of the panel. */
    initialFocusRef?: HTMLElement | null;
    /** Lands on the panel, the element that carries the role. */
    testID?: string;
    /** The `data-analytics-*` attributes, on the panel. */
    analytics?: AnalyticsAttributes;
    class?: string;
    /**
     * Blade's empty header — room under the floating close button — while
     * no header is composed: its class. On a draggable surface it is part
     * of the drag zone, together with the handle strip.
     */
    emptyHeader?: string;
    /** The close button, first in the chrome: its name, class and press. */
    closeButton?: { label: string; class: string; onclick: () => void };
    /**
     * What sits in the chrome — the full-width, zero-height box on the
     * panel's top edge that the panel does not clip — after the drag
     * handle and the close button.
     */
    chrome?: Snippet;
    children: Snippet;
  }

  let {
    id,
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
    initialFocusRef,
    testID,
    analytics,
    class: className = '',
    emptyHeader,
    closeButton,
    chrome,
    children,
  }: Props = $props();

  // An overlay surface: everything DOM-bound (presence, portal, focus, Tab
  // trap) is the rune's.
  const surface = createSurface({
    isOpen: () => isOpen,
    isTop: () => isTop,
    isDismissible: () => isDismissible,
    dragAxis: () => classes.drag,
    onDismissRequest: (source) => onDismissRequest(source),
    initialFocus: () => initialFocusRef,
  });
  // A header composed into the content drags the surface too.
  provideDragZone({
    get isEnabled() {
      return classes.drag.isEnabled;
    },
    get className() {
      return classes.drag.zone;
    },
    attach: surface.dragZone,
  });
</script>

{#snippet header()}
  {#if emptyHeader}<div class={emptyHeader}></div>{/if}
{/snippet}

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
      {...analytics}
      {id}
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
        {#if closeButton}
          <button
            type="button"
            class={closeButton.class}
            aria-label={closeButton.label}
            onclick={closeButton.onclick}
          >
            <!-- Decorative: the button carries the name and the colour. -->
            <Icon source={CloseIcon} size="large" />
          </button>
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
            {@render header()}
          </div>
        {:else}
          {@render header()}
        {/if}
        {@render children()}
      </div>
    </div>
  </div>
{/if}
