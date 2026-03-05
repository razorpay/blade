/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useId } from 'react';
import { useFluidGradient } from './useFluidGradient';

// Canvas renders this much larger than the visible area so the gradient
// fills the logo shape fully rather than fading at the edges.
const CANVAS_SCALE = 1.4;

export interface FluidGradientProps {
  /**
   * SVG children define the mask shape.
   * Use SVG elements (path, g, circle, etc.) or framer-motion SVG
   * variants (motion.path, motion.g) directly.
   *
   * Shapes must use fill="white" to be visible through the gradient.
   *
   * The coordinate space matches `viewBox` (defaults to "0 0 24 24").
   *
   * @example
   * <FluidGradient>
   *   <motion.path d="M3 3..." fill="white" />
   * </FluidGradient>
   *
   * @example with motion.div wrapping an SVG:
   * <FluidGradient>
   *   <motion.g animate={{ scale: 1.2 }} style={{ originX: "50%", originY: "50%" }}>
   *     <path d="M3 3..." fill="white" />
   *   </motion.g>
   * </FluidGradient>
   */
  children?: React.ReactNode;

  /** Side length of the square canvas in CSS pixels. Default: 200 */
  size?: number;

  /**
   * viewBox for the SVG mask coordinate space.
   * Match this to your path's native coordinate system.
   * Default: "0 0 24 24"
   */
  viewBox?: string;

  /**
   * Origin of the radial gradient in UV space.
   * [0, 0] = top-left  [0.5, 0.5] = center (default)  [1, 1] = bottom-right
   * Accepts any [x, y] tuple; values outside [0,1] push the origin off-canvas.
   */
  origin?: [number, number];

  className?: string;
  style?: React.CSSProperties;
}

/**
 * FluidGradient renders an animated WebGL gradient clipped to whatever
 * SVG shape you pass as children.
 *
 * Children are placed inside an SVG <mask>, so they should be valid SVG
 * elements. Use `fill="white"` for the visible area.
 * Animate with framer-motion's SVG variants: motion.path, motion.g, motion.svg.
 */
export function FluidGradient({
  children,
  size = 200,
  viewBox = '0 0 24 24',
  origin = [0.5, 0.0],
  className,
  style,
}: FluidGradientProps) {
  const uid = useId().replace(/:/g, '');
  const maskId = `fg-mask-${uid}`;

  // Canvas is larger than the visible area; offset centers it behind the mask
  const canvasSize = Math.round(size * CANVAS_SCALE);
  const offset = (canvasSize - size) / 2;

  const containerRef = useFluidGradient({ size: canvasSize, origin });

  const vbW = parseViewBoxSize(viewBox, 'w');
  const vbH = parseViewBoxSize(viewBox, 'h');

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'inline-block',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Hidden SVG that defines the mask shape */}
      <svg aria-hidden style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          {/*
           * Mask coordinate space = the canvas element (canvasSize × canvasSize).
           * Paths are scaled to fit `size`, then shifted by `offset` to center
           * them inside the larger canvas.
           */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width={canvasSize}
            height={canvasSize}
          >
            <g transform={`translate(${offset}, ${offset}) scale(${size / vbW}, ${size / vbH})`}>
              {children}
            </g>
          </mask>
        </defs>
      </svg>

      {/* Canvas is larger and centered behind the mask via negative offset */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: -offset,
          left: -offset,
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
        }}
      />
    </div>
  );
}

/** Extract width or height from a viewBox string like "0 0 24 24" */
function parseViewBoxSize(viewBox: string, dim: 'w' | 'h'): number {
  const parts = viewBox.trim().split(/[\s,]+/);
  const val = dim === 'w' ? parseFloat(parts[2]) : parseFloat(parts[3]);
  return val > 0 ? val : 24;
}
