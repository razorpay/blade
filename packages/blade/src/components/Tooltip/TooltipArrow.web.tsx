import React from 'react';
import type { FloatingContext } from '@floating-ui/react';
import { ARROW_WIDTH, ARROW_HEIGHT } from './constants';
import { getFloatingPlacementParts } from '~utils/getFloatingPlacementParts';
import { useId } from '~utils/useId';

type TooltipArrowProps = {
  context: FloatingContext;
  fillColor: string;
  strokeColor: string;
};

/**
 * Custom arrow for Tooltip that avoids the semi-transparent seam issue with FloatingArrow.
 *
 * Root cause of the seam: both the tooltip body and the arrow fill use a semi-transparent
 * color (e.g. rgba(0,0,0,0.72)). When two semi-transparent fills paint over the same
 * background pixels, alpha compounds: 0.72 + 0.72*(1-0.72) ≈ 0.92 — producing a
 * near-black line right at the arrow-body junction.
 *
 * Fix: a <clipPath> inside the SVG clips off the base row of pixels (the row that aligns
 * with the tooltip body edge). The arrow is simultaneously overlapped 1 px INTO the
 * tooltip body so the tooltip body background covers the clipped gap. Net result: the
 * arrow fill and tooltip body fill never paint the same pixels → no compounding.
 *
 * Additionally the stroke path is open (no closing segment at the base) so the border
 * only appears on the two visible sides of the arrow, not where it meets the tooltip body.
 */
const TooltipArrow = React.forwardRef<SVGSVGElement, TooltipArrowProps>(
  ({ context, fillColor, strokeColor }, ref) => {
    const { middlewareData, placement } = context;
    const [side] = getFloatingPlacementParts(placement);
    const clipId = useId('tooltip-arrow-clip');

    const arrowX = middlewareData.arrow?.x ?? 0;
    const arrowY = middlewareData.arrow?.y ?? 0;

    const W = ARROW_WIDTH; // 14 — arrow width
    const H = ARROW_HEIGHT; // 8  — arrow height
    const OVERLAP = 1;
    const TIP_R = 1.5; // rounded tip radius (matches border.radius['2xsmall'])
    const BASE_COVER_STROKE_WIDTH = 2; // px — thick enough to cover anti-aliasing bleed

    const isVertical = side === 'top' || side === 'bottom';
    const svgW = isVertical ? W : H;
    const svgH = isVertical ? H : W;

    const style: React.CSSProperties = { position: 'absolute' };

    if (side === 'top') {
      style.bottom = -(H - OVERLAP);
      style.left = arrowX;
    } else if (side === 'bottom') {
      style.top = -(H - OVERLAP);
      style.left = arrowX;
    } else if (side === 'left') {
      style.right = -(H - OVERLAP);
      style.top = arrowY;
    } else {
      style.left = -(H - OVERLAP);
      style.top = arrowY;
    }

    // Clip rect per side and base cover line to hide the semi-transparent compound seam
    let clipRect: React.ReactElement;
    let baseCoverLine: React.ReactElement; // Line at base edge with fillColor to cover seam
    let fillD: string;
    let strokeD: string;
    let viewBox: string;

    // Inset stroke endpoints from base edge to prevent any stroke pixel from painting
    // at the exact base coordinate where the tooltip body also paints.
    const STROKE_BASE_INSET = 0.5;

    switch (side) {
      case 'top':
        // Arrow points down. Base at top (y=0), tip at bottom centre.
        viewBox = `0 0 ${W} ${H}`;
        clipRect = <rect x={-1} y={0} width={W + 2} height={H} />;
        baseCoverLine = (
          <line
            x1={0}
            y1={0}
            x2={W}
            y2={0}
            stroke={fillColor}
            strokeWidth={BASE_COVER_STROKE_WIDTH}
            strokeLinecap="butt"
          />
        );
        fillD = `M0,0 L${W / 2 - TIP_R},${H - TIP_R * 1.5} Q${W / 2},${H} ${W / 2 + TIP_R},${
          H - TIP_R * 1.5
        } L${W},0 Z`;
        strokeD = `M0,${STROKE_BASE_INSET} L${W / 2 - TIP_R},${H - TIP_R * 1.5} Q${W / 2},${H} ${
          W / 2 + TIP_R
        },${H - TIP_R * 1.5} L${W},${STROKE_BASE_INSET}`;
        break;

      case 'bottom':
        // Arrow points up. Base at bottom (y=H), tip at top centre.
        viewBox = `0 0 ${W} ${H}`;
        clipRect = <rect x={-1} y={0} width={W + 2} height={H} />;
        baseCoverLine = (
          <line
            x1={0}
            y1={H}
            x2={W}
            y2={H}
            stroke={fillColor}
            strokeWidth={BASE_COVER_STROKE_WIDTH}
            strokeLinecap="butt"
          />
        );
        fillD = `M0,${H} L${W / 2 - TIP_R},${TIP_R * 1.5} Q${W / 2},0 ${W / 2 + TIP_R},${
          TIP_R * 1.5
        } L${W},${H} Z`;
        strokeD = `M0,${H - STROKE_BASE_INSET} L${W / 2 - TIP_R},${TIP_R * 1.5} Q${W / 2},0 ${
          W / 2 + TIP_R
        },${TIP_R * 1.5} L${W},${H - STROKE_BASE_INSET}`;
        break;

      case 'left':
        // Arrow points right. Base at left (x=0), tip at right centre.
        viewBox = `0 0 ${H} ${W}`;
        clipRect = <rect x={0} y={-1} width={H} height={W + 2} />;
        baseCoverLine = (
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={W}
            stroke={fillColor}
            strokeWidth={BASE_COVER_STROKE_WIDTH}
            strokeLinecap="butt"
          />
        );
        fillD = `M0,0 L${H - TIP_R * 1.5},${W / 2 - TIP_R} Q${H},${W / 2} ${H - TIP_R * 1.5},${
          W / 2 + TIP_R
        } L0,${W} Z`;
        strokeD = `M${STROKE_BASE_INSET},0 L${H - TIP_R * 1.5},${W / 2 - TIP_R} Q${H},${W / 2} ${
          H - TIP_R * 1.5
        },${W / 2 + TIP_R} L${STROKE_BASE_INSET},${W}`;
        break;

      default:
        // side === 'right': Arrow points left. Base at right (x=H), tip at left centre.
        viewBox = `0 0 ${H} ${W}`;
        clipRect = <rect x={0} y={-1} width={H} height={W + 2} />;
        baseCoverLine = (
          <line
            x1={H}
            y1={0}
            x2={H}
            y2={W}
            stroke={fillColor}
            strokeWidth={BASE_COVER_STROKE_WIDTH}
            strokeLinecap="butt"
          />
        );
        fillD = `M${H},0 L${TIP_R * 1.5},${W / 2 - TIP_R} Q0,${W / 2} ${TIP_R * 1.5},${
          W / 2 + TIP_R
        } L${H},${W} Z`;
        strokeD = `M${H - STROKE_BASE_INSET},0 L${TIP_R * 1.5},${W / 2 - TIP_R} Q0,${W / 2} ${
          TIP_R * 1.5
        },${W / 2 + TIP_R} L${H - STROKE_BASE_INSET},${W}`;
    }

    return (
      <svg
        ref={ref}
        aria-hidden
        style={style}
        width={svgW}
        height={svgH}
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>{clipRect}</clipPath>
        </defs>
        {/*
         * clipPath removes the base-edge pixels so the arrow fill never paints the same
         * pixels as the tooltip body, preventing alpha compounding.
         */}
        <g clipPath={`url(#${clipId})`}>
          <path d={fillD} fill={fillColor} />
          <path
            d={strokeD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="butt"
          />
        </g>
        {/* Cover line at base edge: paints over any compounded seam with the arrow's own color */}
        {baseCoverLine}
      </svg>
    );
  },
);

TooltipArrow.displayName = 'TooltipArrow';

export { TooltipArrow };
