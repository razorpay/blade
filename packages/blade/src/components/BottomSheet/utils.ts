/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import clamp from 'lodash/clamp';

export type SnapPoints = [number, ...number[]];

// Only add the description field in dev mode
// export const addDescription = (description: string) =>
//   process.env.NODE_ENV !== 'production' ? { description } : {};

// export const assignSnapPoints = (getSnapPoints: GetSnapPoints) =>
//   assign<BottomSheetContext>({
//     snapPoints: ({
//       maxHeight,
//       headerHeight,
//       contentHeight,
//       footerHeight,
//       minContent,
//       maxContent,
//     }) =>
//       computeSnapPoints(
//         getSnapPoints({
//           maxHeight,
//           headerHeight,
//           contentHeight,
//           footerHeight,
//           minContent,
//           maxContent,
//         }),
//         maxHeight,
//       ),
//   });

// export const assignInitialHeight = (getInitialHeight: GetInitialHeight) =>
//   assign<BottomSheetContext>({
//     initialHeight: ({
//       maxHeight,
//       headerHeight,
//       contentHeight,
//       footerHeight,
//       minContent,
//       maxContent,
//       snapPoints,
//       lastHeight,
//     }) => {
//       const [initialHeight] = computeSnapPointBounds(
//         getInitialHeight({
//           maxHeight,
//           headerHeight,
//           contentHeight,
//           footerHeight,
//           minContent,
//           maxContent,
//           snapPoints,
//           lastHeight,
//         }),
//         snapPoints as SnapPoints,
//       );
//       return initialHeight;
//     },
//   });

export function computeSnapPoints(input: SnapPoints, maxHeight: number): SnapPoints {
  const snapPoints = [...input];
  const output = new Set<number>();
  for (const snapPoint of snapPoints) {
    if (!Number.isFinite(snapPoint)) {
      continue;
    }
    const clamped = clamp(Math.round(snapPoint), 0, maxHeight);
    if (clamped > 0) {
      output.add(clamped);
    }
  }

  // @ts-expect-error
  return [...output].sort(sortByNumbers);
}

function sortByNumbers(a: number, b: number): number {
  return a - b;
}

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

export function computeMinContent(
  {
    maxHeight,
    headerHeight,
    footerHeight,
  }: { maxHeight: number; headerHeight: number; footerHeight: number },
  minHeight = 50,
) {
  return Math.min(maxHeight, Math.max(headerHeight + footerHeight, minHeight));
}

export function computeMaxContent(
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

// function SpringSolver(mass, stiffness, damping, initialVelocity) {
//   this.m_w0 = Math.sqrt(stiffness / mass);
//   this.m_zeta = damping / (2 * Math.sqrt(stiffness * mass));

//   if (this.m_zeta < 1) {
//     // Under-damped.
//     this.m_wd = this.m_w0 * Math.sqrt(1 - this.m_zeta * this.m_zeta);
//     this.m_A = 1;
//     this.m_B = (this.m_zeta * this.m_w0 + -initialVelocity) / this.m_wd;
//   } else {
//     // Critically damped (ignoring over-damped case for now).
//     this.m_wd = 0;
//     this.m_A = 1;
//     this.m_B = -initialVelocity + this.m_w0;
//   }
// }

// SpringSolver.prototype.solve = function (t) {
//   if (this.m_zeta < 1) {
//     // Under-damped
//     t =
//       Math.exp(-t * this.m_zeta * this.m_w0) *
//       (this.m_A * Math.cos(this.m_wd * t) + this.m_B * Math.sin(this.m_wd * t));
//   } else {
//     // Critically damped (ignoring over-damped case for now).
//     t = (this.m_A + this.m_B * t) * Math.exp(-t * this.m_w0);
//   }

//   // Map range from [1..0] to [0..1].
//   return 1 - t;
// };
