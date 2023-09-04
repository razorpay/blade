/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Alignment, Placement, Side } from '@floating-ui/react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getPlacementParts = (placement: NonNullable<Placement>) => {
  const [side, alignment] = placement.split('-') as [Side, Alignment];
  return [side, alignment] as const;
};

export { getPlacementParts };
