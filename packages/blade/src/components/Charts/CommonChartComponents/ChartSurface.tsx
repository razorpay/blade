import React from 'react';
import styled from 'styled-components';
import type { ChartAxisStyle, ChartYLabelPlacement } from './types';

/** Set on the lowest Y label of an `outside` chart when it meets an X label. It then hides. */
const Y_LABEL_COLLIDES_ATTR = 'data-blade-y-label-collides';

const MinimalChartSurface = styled.div<{ $yLabelPlacement: ChartYLabelPlacement }>(
  ({ $yLabelPlacement }) => ({
    width: '100%',
    height: '100%',
    // The plot runs to the edges of the chart. A point or an active dot on the edge is not cut.
    '.recharts-surface': { overflow: 'visible' },
    ...($yLabelPlacement === 'outside'
      ? {
          // The lowest label sits on the base gridline. It hides only when it meets an X label.
          [`.recharts-yAxis-tick-labels > g[${Y_LABEL_COLLIDES_ATTR}]`]: { visibility: 'hidden' },
        }
      : {
          // The bottom Y label would sit under the base of the plot, on the X labels. Not drawn.
          '.recharts-yAxis-tick-labels > g:first-of-type': { display: 'none' },
        }),
  }),
);

type Box2D = Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>;

/** True when two boxes share any area. Boxes that only touch do not overlap. */
const boxesOverlap = (a: Box2D, b: Box2D): boolean =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

/**
 * `outside` only. Marks the lowest Y label when its box meets an X label's box, so it hides.
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
  axisStyle: ChartAxisStyle;
  yLabelPlacement?: ChartYLabelPlacement;
  children: React.ReactNode;
};

/**
 * The element around a chart's recharts container. With `minimal`, it holds the CSS that axis
 * style needs. With `lines`, it renders as the wrappers did before `axisStyle`, so the chart does
 * not change.
 */
const ChartSurface = React.forwardRef<HTMLDivElement, ChartSurfaceProps>(
  ({ axisStyle, yLabelPlacement = 'overlap', children }, ref) => {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const isMinimal = axisStyle === 'minimal';
    useLowestYLabelCollision(innerRef, isMinimal && yLabelPlacement === 'outside');
    const setRefs = React.useCallback(
      (node: HTMLDivElement | null) => {
        (innerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );
    if (isMinimal) {
      return (
        <MinimalChartSurface
          ref={setRefs}
          $yLabelPlacement={yLabelPlacement}
          data-blade-chart-axis-style="minimal"
          data-blade-chart-y-labels={yLabelPlacement}
        >
          {children}
        </MinimalChartSurface>
      );
    }
    return (
      <div ref={setRefs} style={{ width: '100%', height: '100%' }}>
        {children}
      </div>
    );
  },
);

export { ChartSurface, boxesOverlap, Y_LABEL_COLLIDES_ATTR };
