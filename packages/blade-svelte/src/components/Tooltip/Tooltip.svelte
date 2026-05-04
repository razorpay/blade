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
  /* React's `PopupArrow` passes `tipRadius={theme.border.radius['2xsmall']}`
   * which resolves to 2px (see blade/src/tokens/global/border.ts). */
  const ARROW_TIP_RADIUS = 2;

  /* Rounded-apex SVG path, mirroring `@floating-ui/react`'s `FloatingArrow`.
   * The triangle's apex is replaced by a quadratic Bezier whose control point
   * sits at the would-be sharp tip; the curve's actual peak lands halfway
   * between the chord and the control, giving a smooth rounded apex.
   *   svgX = ARROW_WIDTH/2 * (tipRadius / -8 + 1)  → horizontal inset
   *   svgY = ARROW_HEIGHT/2 * tipRadius / 4         → vertical inset
   * For (14, 8, 2): svgX = 5.25, svgY = 2 → `M0,0 H14 L8.75,6 Q7,8 5.25,6 Z`. */
  const _ARROW_SVG_X = (ARROW_WIDTH / 2) * (ARROW_TIP_RADIUS / -8 + 1);
  const _ARROW_SVG_Y = ((ARROW_HEIGHT / 2) * ARROW_TIP_RADIUS) / 4;
  const ARROW_PATH =
    `M0,0 H${ARROW_WIDTH}` +
    ` L${ARROW_WIDTH - _ARROW_SVG_X},${ARROW_HEIGHT - _ARROW_SVG_Y}` +
    ` Q${ARROW_WIDTH / 2},${ARROW_HEIGHT} ${_ARROW_SVG_X},${ARROW_HEIGHT - _ARROW_SVG_Y}` +
    ' Z';

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

  let resolvedPlacement = $state<TooltipPlacement>(placement);
  let floatingX = $state(0);
  let floatingY = $state(0);
  let arrowX = $state<number | null>(null);
  let arrowY = $state<number | null>(null);

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

  /* Rotate the base ▼ path so the apex points at the trigger; anchor with
   * `[side]: 100%` so the base stays flush with the bubble edge on all sides. */
  const arrowStyle = $derived.by(() => {
    const sideOffset: Record<'top' | 'right' | 'bottom' | 'left', string> = {
      top: 'top:100%;transform:rotate(0deg)',
      bottom: 'bottom:100%;transform:rotate(180deg)',
      left: 'left:100%;transform:rotate(-90deg)',
      right: 'right:100%;transform:rotate(90deg)',
    };
    const parts: string[] = [sideOffset[resolvedSide]];
    if (arrowX !== null) parts.push(`left:${arrowX}px`);
    if (arrowY !== null) parts.push(`top:${arrowY}px`);
    return parts.join(';');
  });

  const metaAttrs = metaAttribute({ name: MetaConstants.Tooltip, testID });
  const analyticsAttrs = $derived(makeAnalyticsAttribute(rest));
</script>

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
        height={ARROW_WIDTH}
        viewBox="0 0 {ARROW_WIDTH} {ARROW_WIDTH}"
        aria-hidden="true"
      >
        <path d={ARROW_PATH} />
      </svg>
    </div>
  </div>
{/if}
