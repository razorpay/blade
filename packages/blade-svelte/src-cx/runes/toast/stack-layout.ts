/** The numbers a toast stack's look decides; the maths here is the same for any. */
export interface ToastStackGeometry {
  /** px between toasts once the stack is expanded. */
  gutter: number;
  /** px each collapsed toast shows above the one in front of it. */
  peek: number;
  /** Each toast behind the front shrinks by this much more (0.05 = 5%). */
  scaleStep: number;
  /** Toasts drawn at full size and in full: the front of the stack. */
  front: number;
  /** Collapsed toasts drawn behind the front; the rest are hidden. */
  peeks: number;
}

export interface ToastPlacement {
  /** px from the stack's edge, away from it. */
  offset: number;
  scale: number;
  opacity: 0 | 1;
  /** px; undefined leaves the toast at its own height. */
  height?: number;
}

/**
 * Whether the stack lays its toasts out in full: a short stack always does,
 * a long one only while held (hovered on desktop, tapped on a phone).
 */
export function isToastStackExpanded(count: number, isHeld: boolean, minShown: number): boolean {
  return isHeld || count <= minShown;
}

/**
 * Where each toast sits, front (newest) first. Expanded, they stack edge to
 * edge with the gutter between; collapsed, each peeks above the one before
 * it, a step smaller, cropped to the front toast's height, and past the
 * peeks they are hidden. Heights are measured by the view; an unmeasured
 * toast is neither cropped nor sized.
 */
export function layoutToastStack(
  heights: readonly (number | undefined)[],
  isExpanded: boolean,
  geometry: ToastStackGeometry,
): ToastPlacement[] {
  const frontHeight = heights[0];
  let stacked = 0;
  return heights.map((height, index) => {
    const behind = index >= geometry.front;
    const offset = isExpanded ? stacked : index * geometry.peek;
    stacked += (height ?? 0) + geometry.gutter;
    const scale = !isExpanded && behind ? Math.max(0.7, 1 - index * geometry.scaleStep) : 1;
    const shown = isExpanded || index < geometry.front + geometry.peeks;
    const cropped = !isExpanded && behind && height !== undefined && frontHeight !== undefined;
    return {
      offset,
      scale,
      opacity: shown ? 1 : 0,
      height: cropped ? frontHeight : height,
    };
  });
}
