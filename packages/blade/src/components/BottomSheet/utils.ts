/* eslint-disable @typescript-eslint/explicit-function-return-type */

import type { NativeScrollEvent } from 'react-native';

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

function hslToRgb(hsl: { h: number; s: number; l: number }) {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  let r, g, b;

  if (s == 0) {
    // eslint-disable-next-line no-multi-assign
    r = g = b = l; // achromatic
  } else {
    // eslint-disable-next-line no-inner-declarations
    function hue2rgb(p: number, q: number, t: number): number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r *= 255;
  g *= 255;
  b *= 255;

  return { r, g, b } as const;
}

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent): boolean => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

export {
  SnapPoints,
  computeMaxContent,
  computeMinContent,
  computeSnapPointBounds,
  hslToRgb,
  isCloseToBottom,
};
