<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getCardTemplateClasses } from '@razorpay/blade-core/styles';
  import {
    buildTicketShellPath,
    CARD_TICKET_OUTLINE_STROKE_WIDTH,
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

  const outlineDimensions = $derived({
    width: dimensions.width,
    height: dimensions.height,
    tearLineY: dimensions.tearLineY,
  });

  const shellPath = $derived(buildTicketShellPath(outlineDimensions));

  const strokeColor = $derived(
    isSelected && !isDisabled
      ? getTokenCSSVariable('surface.border.primary.normal')
      : getTokenCSSVariable('surface.border.gray.subtle'),
  );
  const strokeDasharray = $derived(isDisabled ? '6 4' : undefined);

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
      dimensions = {
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
        tearLineY: topSectionNode.offsetHeight,
      };
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
