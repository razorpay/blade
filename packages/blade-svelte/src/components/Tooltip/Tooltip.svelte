<script lang="ts">
  import {
    computePosition,
    autoUpdate,
    shift,
    flip,
    offset,
    arrow as arrowMiddleware,
  } from '@floating-ui/dom';
  import {
    metaAttribute,
    MetaConstants,
    makeAccessible,
    makeAnalyticsAttribute,
    getStyledPropsClasses,
    getFloatingPlacementParts,
  } from '@razorpay/blade-core/utils';
  import {
    getTooltipClasses,
    getTooltipTemplateClasses,
    tooltipTriggerClass,
    tooltipPortalClass,
    tooltipArrowClass,
    tooltipTitleClass,
    tooltipContentClass,
  } from '@razorpay/blade-core/styles';
  import { portal } from '../../utils/portal';
  import { setTooltipContext } from './tooltipContext';
  import type { TooltipProps, TooltipPlacement } from './types';

  // Reference template classes so the build doesn't tree-shake them.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  void getTooltipTemplateClasses();

  /* React parity constants — see Tooltip.web.tsx + constants.ts.
   * GAP = `theme.spacing[2]` (4px); ARROW dimensions match React. */
  const GAP = 4;
  const ARROW_WIDTH = 14;
  const ARROW_HEIGHT = 8;

  let {
    title,
    content,
    placement = 'top',
    children,
    onOpenChange,
    zIndex = 1100,
    testID,
    ...rest
  }: TooltipProps = $props();

  // Marker context — TooltipInteractiveWrapper reads it to assert nesting.
  setTooltipContext(() => true);

  let isOpen = $state(false);
  let isMounted = $state(false);
  let dataState = $state<'open' | 'closed'>('closed');

  let referenceEl = $state<HTMLSpanElement | null>(null);
  let floatingEl = $state<HTMLDivElement | null>(null);
  let arrowEl = $state<SVGSVGElement | null>(null);

  // Position state written by floating-ui's `computePosition`.
  let resolvedPlacement = $state<TooltipPlacement>(placement);
  let floatingX = $state(0);
  let floatingY = $state(0);
  let arrowX = $state<number | null>(null);
  let arrowY = $state<number | null>(null);

  // Stable per-instance id used for `aria-describedby` linking.
  const tooltipId = `blade-tooltip-${Math.random().toString(36).slice(2, 10)}`;

  const isHorizontal = $derived(
    getFloatingPlacementParts(placement)[0] === 'left' ||
      getFloatingPlacementParts(placement)[0] === 'right',
  );

  const resolvedSide = $derived(getFloatingPlacementParts(resolvedPlacement)[0]);

  function notifyOpenChange(next: boolean): void {
    if (isOpen === next) return;
    isOpen = next;
    onOpenChange?.({ isOpen: next });
  }

  function handleMouseEnter(): void {
    notifyOpenChange(true);
  }

  function handleMouseLeave(): void {
    notifyOpenChange(false);
  }

  function handleFocusIn(): void {
    notifyOpenChange(true);
  }

  function handleFocusOut(): void {
    notifyOpenChange(false);
  }

  /* Mount the bubble as soon as it should open and keep it mounted until the
   * close transition finishes. We toggle `data-state` so CSS handles the
   * fade/slide; `isMounted` controls whether the DOM node exists at all. */
  $effect(() => {
    if (!isOpen) {
      dataState = 'closed';
      return () => {};
    }
    isMounted = true;
    // Defer to next frame so `data-state="closed"` paints before "open".
    const id = requestAnimationFrame(() => {
      dataState = 'open';
    });
    return () => cancelAnimationFrame(id);
  });

  function handleBubbleTransitionEnd(): void {
    if (!isOpen && dataState === 'closed') {
      isMounted = false;
    }
  }

  /* Floating UI positioning — runs whenever the bubble mounts or `placement`
   * changes. autoUpdate watches scroll/resize/layout-shift and re-runs
   * `update()`. Returning its cleanup tears it down on rerun/unmount. */
  $effect(() => {
    const ref = referenceEl;
    const float = floatingEl;
    const arrow = arrowEl;
    const currentPlacement = placement;
    const horizontal = isHorizontal;
    if (!ref || !float || !isMounted) return () => {};

    const update = (): void => {
      const middleware = [
        shift({ crossAxis: false, padding: GAP }),
        flip({ padding: GAP }),
        offset(GAP + ARROW_HEIGHT),
        arrow
          ? arrowMiddleware({
              element: arrow,
              padding: horizontal ? 0 : ARROW_WIDTH,
            })
          : null,
      ].filter((m): m is NonNullable<typeof m> => Boolean(m));

      computePosition(ref, float, {
        placement: currentPlacement,
        strategy: 'fixed',
        middleware,
      }).then(({ x, y, placement: actualPlacement, middlewareData }) => {
        floatingX = x;
        floatingY = y;
        resolvedPlacement = actualPlacement as TooltipPlacement;
        if (middlewareData.arrow) {
          arrowX = middlewareData.arrow.x ?? null;
          arrowY = middlewareData.arrow.y ?? null;
        }
      });
    };

    return autoUpdate(ref, float, update);
  });

  // Trigger element wires aria-describedby + label so SR reads the tooltip
  // content even when not visually open.
  const triggerA11y = $derived(makeAccessible({ describedBy: tooltipId, label: content }));

  const bubbleClasses = $derived(getTooltipClasses({ placementSide: resolvedSide }));

  const styledProps = $derived(getStyledPropsClasses(rest));
  const portalExtraClasses = $derived(styledProps.classes.filter(Boolean).join(' '));

  const portalStyle = $derived(
    [
      `--tooltip-z-index:${zIndex}`,
      `transform:translate3d(${Math.round(floatingX)}px,${Math.round(floatingY)}px,0)`,
    ].join(';'),
  );

  /* Arrow rotation per resolved side so the triangle points at the trigger.
   * Coordinates from floating-ui's arrow middleware go on whichever axis
   * matches the side. */
  const arrowStyle = $derived.by(() => {
    const sideOffset: Record<'top' | 'right' | 'bottom' | 'left', string> = {
      top: `bottom:-${ARROW_HEIGHT - 1}px;transform:rotate(180deg)`,
      bottom: `top:-${ARROW_HEIGHT - 1}px;transform:rotate(0deg)`,
      left: `right:-${ARROW_WIDTH - 1}px;transform:rotate(90deg)`,
      right: `left:-${ARROW_WIDTH - 1}px;transform:rotate(-90deg)`,
    };
    const parts: string[] = [sideOffset[resolvedSide]];
    if (arrowX !== null) parts.push(`left:${arrowX}px`);
    if (arrowY !== null) parts.push(`top:${arrowY}px`);
    return parts.join(';');
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.Tooltip, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

<!-- Trigger wrapper: owns floating-ui reference + interaction handlers.
     Inline-block keeps inline layout intact (deliberate +1 DOM node vs React,
     see migration plan Decision #4). -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  bind:this={referenceEl}
  class={tooltipTriggerClass}
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  onfocusin={handleFocusIn}
  onfocusout={handleFocusOut}
  {...triggerA11y}
>
  {@render children()}
</span>

{#if isMounted}
  <div
    bind:this={floatingEl}
    class="{tooltipPortalClass} {portalExtraClasses}"
    style={portalStyle}
    data-state={dataState}
    use:portal={document.body}
    {...metaAttrs}
    {...analyticsAttrs}
  >
    <div
      id={tooltipId}
      class={bubbleClasses}
      data-state={dataState}
      role="tooltip"
      ontransitionend={handleBubbleTransitionEnd}
    >
      {#if title}
        <p class={tooltipTitleClass}>{title}</p>
      {/if}
      <p class={tooltipContentClass}>{content}</p>
      <svg
        bind:this={arrowEl}
        class={tooltipArrowClass}
        style={arrowStyle}
        width={ARROW_WIDTH}
        height={ARROW_HEIGHT}
        viewBox="0 0 14 8"
        aria-hidden="true"
      >
        <path d="M7 8L0 0H14L7 8Z" />
      </svg>
    </div>
  </div>
{/if}
