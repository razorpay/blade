<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import {
    buildTicketShellPath,
    CARD_TICKET_OUTLINE_STROKE_WIDTH,
    CARD_TICKET_DISABLED_STROKE_DASHARRAY,
    getTokenCSSVariable,
  } from '@razorpay/blade-core/utils';

  // Call in the script block so the class names aren't tree-shaken from the CSS module.
  const tc = getCardTemplateClasses();

  let {
    topSection,
    bottomSection,
    children,
    isSelected = false,
    isDisabled = false,
  }: {
    /** Content of the top section (above the tear line). */
    topSection: Snippet;
    /** Content of the bottom section (below the tear line). */
    bottomSection: Snippet;
    /** Interactive overlay (link/button) that spans the whole ticket. */
    children?: Snippet;
    isSelected?: boolean;
    isDisabled?: boolean;
  } = $props();

  let wrapperEl = $state<HTMLDivElement | undefined>();
  let topSectionEl = $state<HTMLDivElement | undefined>();

  let dimensions = $state({ width: 0, height: 0, tearLineY: 0 });

  const shellPath = $derived(buildTicketShellPath(dimensions));

  const strokeColor = $derived(
    isSelected && !isDisabled
      ? getTokenCSSVariable('surface.border.primary.normal')
      : getTokenCSSVariable('surface.border.gray.subtle'),
  );
  const strokeDasharray = $derived(isDisabled ? CARD_TICKET_DISABLED_STROKE_DASHARRAY : undefined);

  const strokePadding = CARD_TICKET_OUTLINE_STROKE_WIDTH / 2;

  const svgViewBox = $derived(
    shellPath
      ? `${-strokePadding} ${-strokePadding} ${dimensions.width + CARD_TICKET_OUTLINE_STROKE_WIDTH} ${dimensions.height + CARD_TICKET_OUTLINE_STROKE_WIDTH}`
      : '0 0 0 0',
  );

  $effect(() => {
    const wrapper = wrapperEl;
    const topSectionNode = topSectionEl;

    if (!wrapper || !topSectionNode) {
      return;
    }

    const updateDimensions = (): void => {
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      const t = topSectionNode.offsetHeight;

      if (
        dimensions.width === w &&
        dimensions.height === h &&
        dimensions.tearLineY === t
      ) {
        return;
      }

      dimensions = { width: w, height: h, tearLineY: t };
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(wrapper);
    resizeObserver.observe(topSectionNode);

    return () => {
      resizeObserver.disconnect();
    };
  });
</script>

<!--
  Browser support: `clip-path: path()` requires Safari 16.4+ (March 2023),
  Chrome 88+, and Firefox 71+. On unsupported browsers the clip-path is ignored
  and content renders without notch cut-outs, but the SVG outline still draws correctly.
-->
<div class={tc.cardTicketWrapper} bind:this={wrapperEl}>
  <div
    class={tc.cardTicketClipContent}
    style:clip-path={shellPath ? `path('${shellPath}')` : undefined}
  >
    <div class="{tc.cardTicketSection} {tc.cardTicketSectionTop}" bind:this={topSectionEl}>
      {@render topSection()}
    </div>
    <div class="{tc.cardTicketSection} {tc.cardTicketSectionBottom}">
      {@render bottomSection()}
    </div>
  </div>

  {#if shellPath}
    <svg
      class={tc.cardTicketOutline}
      viewBox={svgViewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={shellPath}
        fill="none"
        stroke={strokeColor}
        stroke-width={CARD_TICKET_OUTLINE_STROKE_WIDTH}
        stroke-dasharray={strokeDasharray}
        vector-effect="non-scaling-stroke"
      />
    </svg>
  {/if}

  {#if children}
    {@render children()}
  {/if}
</div>
