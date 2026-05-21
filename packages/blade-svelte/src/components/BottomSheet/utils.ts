/**
 * BottomSheet snap-point + content-height math.
 *
 * Verbatim port of blade/src/components/BottomSheet/utils.ts. Keep this file
 * pure JS — no Svelte runes, no DOM access — so it can be unit-tested.
 */

export type SnapPoints = [number, number, number];

/**
 * Find the nearest snap point to `unsafeHeight`, plus the snap points
 * immediately below and above it. Returns `[nearest, lower, upper]`.
 *
 * Sourced from https://github.com/bottom-sheet/state-machine.
 */
export function computeSnapPointBounds(
  unsafeHeight: number,
  snapPoints: SnapPoints,
): [nearest: number, lower: number, upper: number] {
  const height = Math.round(unsafeHeight);
  if (!Number.isFinite(height) || height <= 0) {
    return [0, 0, 0];
  }

  const [minSnap] = snapPoints;
  const nearest = snapPoints.reduce(
    (prev, curr) => (Math.abs(curr - height) < Math.abs(prev - height) ? curr : prev),
    minSnap,
  );
  const nearestIndex = snapPoints.indexOf(nearest);
  const lower = snapPoints[Math.max(nearestIndex - 1, 0)];
  const upper = snapPoints[Math.min(nearestIndex + 1, snapPoints.length - 1)];

  return [nearest, lower, upper];
}

/**
 * Minimum permissible content height — clamped between `minHeight` (default
 * 50px) and `maxHeight`, falling back to `headerHeight + footerHeight` if the
 * caller provides them.
 */
export function computeMinContent(
  {
    maxHeight,
    headerHeight,
    footerHeight,
  }: { maxHeight: number; headerHeight: number; footerHeight: number },
  minHeight = 50,
): number {
  return Math.min(maxHeight, Math.max(headerHeight + footerHeight, minHeight));
}

/**
 * Maximum permissible content height — picks the smaller of `maxHeight` and
 * the natural total content height (`header + content + footer`), but never
 * goes below `computeMinContent`.
 */
export function computeMaxContent(
  {
    maxHeight,
    headerHeight,
    contentHeight,
    footerHeight,
  }: {
    maxHeight: number;
    headerHeight: number;
    footerHeight: number;
    contentHeight: number;
  },
  minHeight?: number,
): number {
  return Math.min(
    maxHeight,
    Math.max(
      headerHeight + contentHeight + footerHeight,
      computeMinContent({ maxHeight, headerHeight, footerHeight }, minHeight),
    ),
  );
}

/**
 * Rubberband function — produces a damped value when `value` falls outside
 * `[min, max]`. Mirrors `@use-gesture`'s `rubberbandIfOutOfBounds`.
 */
export function rubberbandIfOutOfBounds(
  value: number,
  min: number,
  max: number,
  dampening = 0.55,
): number {
  if (value > max) {
    return max + (value - max) * dampening;
  }
  if (value < min) {
    return min + (value - min) * dampening;
  }
  return value;
}
