/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { getComponentId } from '~utils';

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

type TrailingComponents = 'Button' | 'Badge' | 'Link' | 'Text';

// prop restriction map for corresponding sub components
const propRestrictionMap = {
  Button: {
    size: 'xsmall',
    variant: 'tertiary',
  },
  Badge: {
    size: 'medium',
  },
  Link: {
    size: 'medium',
  },
  Text: {
    size: 'medium',
    variant: 'body',
  },
} as const;

const useBottomSheetHeaderTrailingRestriction = (trailing: React.ReactNode) => {
  // Could've used refs, but in react-native for some reason the validatedTrailing
  // is changing to null on opening the bottomsheet
  // thus saving it to state only
  const [
    validatedTrailingComponent,
    setValidatedTrailingComponent,
  ] = React.useState<React.ReactElement | null>(null);

  // validate and restrict sub component props in trailing prop
  React.useEffect(() => {
    if (React.isValidElement(trailing)) {
      const trailingComponentType = getComponentId(trailing) as TrailingComponents;
      const restrictedProps = propRestrictionMap[trailingComponentType];
      const allowedComponents = Object.keys(propRestrictionMap);
      if (!restrictedProps) {
        throw new Error(
          `[Blade BottomSheetHeader]: Only one of \`${allowedComponents.join(
            ', ',
          )}\` component is accepted as trailing`,
        );
      }

      const restrictedPropKeys = Object.keys(propRestrictionMap[trailingComponentType]);
      for (const prop of restrictedPropKeys) {
        if (trailing?.props?.hasOwnProperty(prop)) {
          console.warn(
            `[Blade BottomSheetHeader]: Do not pass "${prop}" to "${trailingComponentType}" while inside BottomSheetHeader trailing, because we override it.`,
          );
        }
      }
      setValidatedTrailingComponent(
        React.cloneElement(trailing as React.ReactElement, restrictedProps),
      );
    }
  }, [trailing]);

  return validatedTrailingComponent;
};

export {
  SnapPoints,
  computeMaxContent,
  computeMinContent,
  computeSnapPointBounds,
  useBottomSheetHeaderTrailingRestriction,
};
