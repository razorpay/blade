/* eslint-disable @typescript-eslint/explicit-function-return-type */

/* eslint-disable @typescript-eslint/ban-ts-comment */
type SnapPoints = [number, number, number];

// Taken from:
// https://github.com/bottom-sheet/state-machine/blob/main/src/utils.ts
function computeSnapPointBounds(
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

function computeMinContent(
  {
    maxHeight,
    headerHeight,
    footerHeight,
  }: { maxHeight: number; headerHeight: number; footerHeight: number },
  minHeight = 50,
) {
  return Math.min(maxHeight, Math.max(headerHeight + footerHeight, minHeight));
}

function computeMaxContent(
  {
    maxHeight,
    headerHeight,
    contentHeight,
    footerHeight,
  }: { maxHeight: number; headerHeight: number; footerHeight: number; contentHeight: number },
  minHeight?: number,
) {
  return Math.min(
    maxHeight,
    Math.max(
      headerHeight + contentHeight + footerHeight,
      computeMinContent({ maxHeight, headerHeight, footerHeight }, minHeight),
    ),
  );
}

export { SnapPoints, computeMaxContent, computeMinContent, computeSnapPointBounds };
