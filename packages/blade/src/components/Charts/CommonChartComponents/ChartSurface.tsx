import React from 'react';
import styled from 'styled-components';
import type { ChartAxisStyle, ChartResolvedYLabelPlacement, ChartVersion } from './types';

/** Set on the lowest Y label of a `right` chart when it meets an X label. It then hides. */
const Y_LABEL_COLLIDES_ATTR = 'data-blade-y-label-collides';

const Y_TICK_LABEL = '.recharts-yAxis-tick-labels .recharts-cartesian-axis-tick-value';

const StyledChartSurface = styled.div<{
  $yLabelPlacement: ChartResolvedYLabelPlacement;
}>(({ $yLabelPlacement }) => ({
  width: '100%',
  height: '100%',
  // The plot runs to the edges of the chart: no margin. A point, an active dot, the axis lines or
  // the top Y label on the edge is not cut.
  '.recharts-surface': { overflow: 'visible' },
  // A label column: tabular digits, so the numbers line up towards the axis.
  ...($yLabelPlacement === 'left' || $yLabelPlacement === 'right'
    ? { [Y_TICK_LABEL]: { fontVariantNumeric: 'tabular-nums' } }
    : {}),
  // `right`: the lowest label sits on the base gridline. It hides only when it meets an X label.
  ...($yLabelPlacement === 'right'
    ? { [`.recharts-yAxis-tick-labels > g[${Y_LABEL_COLLIDES_ATTR}]`]: { visibility: 'hidden' } }
    : {}),
  // `overlap`: the bottom Y label would sit under the base of the plot, on the X labels. Not drawn.
  ...($yLabelPlacement === 'overlap'
    ? { '.recharts-yAxis-tick-labels > g:first-of-type': { display: 'none' } }
    : {}),
}));

type Box2D = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;

/** True when two boxes share any area. Boxes that only touch do not overlap. */
const boxesOverlap = (a: Box2D, b: Box2D): boolean =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

/**
 * `right` only. Marks the lowest Y label when its box meets an X label's box, so it hides.
 * recharts draws its ticks after it measures, so this checks again on each change to the SVG.
 * The mark sets `visibility`, not `display`: a hidden label keeps its box for the next check.
 */
const useLowestYLabelCollision = (
  ref: React.RefObject<HTMLDivElement | null>,
  isActive: boolean,
): void => {
  React.useEffect(() => {
    const root = ref.current;
    if (!isActive || !root || typeof MutationObserver === 'undefined') return undefined;
    let frame = 0;
    const check = (): void => {
      frame = 0;
      const lowest = root.querySelector('.recharts-yAxis-tick-labels > g:first-of-type');
      if (!lowest) return;
      const box = lowest.getBoundingClientRect();
      const collides = Array.from(
        root.querySelectorAll('.recharts-xAxis-tick-labels > g'),
      ).some((tick) => boxesOverlap(box, tick.getBoundingClientRect()));
      if (lowest.hasAttribute(Y_LABEL_COLLIDES_ATTR) !== collides) {
        lowest.toggleAttribute(Y_LABEL_COLLIDES_ATTR, collides);
      }
    };
    const schedule = (): void => {
      if (frame === 0) frame = window.requestAnimationFrame(check);
    };
    const observer = new MutationObserver(schedule);
    // Not the mark itself, so a change to the mark does not start a check.
    observer.observe(root, {
      subtree: true,
      childList: true,
      characterData: true,
      attributeFilter: ['x', 'y', 'transform', 'width', 'height'],
    });
    schedule();
    return () => {
      observer.disconnect();
      if (frame !== 0) window.cancelAnimationFrame(frame);
    };
  }, [ref, isActive]);
};

type ChartSurfaceProps = {
  chartVersion: ChartVersion;
  axisStyle: ChartAxisStyle;
  yLabelPlacement: ChartResolvedYLabelPlacement;
  children: React.ReactNode;
};

/**
 * The element around a chart's recharts container. `v2`: it holds the CSS that the display props
 * need. `v1`: a plain box, as on master.
 */
const ChartSurface = React.forwardRef<HTMLDivElement, ChartSurfaceProps>(
  ({ chartVersion, axisStyle, yLabelPlacement, children }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const isV2 = chartVersion === 'v2';
    useLowestYLabelCollision(innerRef, isV2 && yLabelPlacement === 'right');
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );
    if (!isV2) {
      return (
        <div ref={setRefs} style={{ width: '100%', height: '100%' }}>
          {children}
        </div>
      );
    }
    return (
      <StyledChartSurface
        ref={setRefs}
        $yLabelPlacement={yLabelPlacement}
        data-blade-chart-axis-style={axisStyle === 'minimal' ? 'minimal' : undefined}
        data-blade-chart-y-labels={yLabelPlacement}
      >
        {children}
      </StyledChartSurface>
    );
  },
);

export { ChartSurface, boxesOverlap, Y_LABEL_COLLIDES_ATTR };
