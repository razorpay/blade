/**
 * Splits a Floating UI placement string into its `[side, alignment]` parts.
 *
 * @example
 * getFloatingPlacementParts('top-start') // ['top', 'start']
 * getFloatingPlacementParts('bottom')    // ['bottom', undefined]
 */
export type FloatingSide = 'top' | 'right' | 'bottom' | 'left';
export type FloatingAlignment = 'start' | 'end';
export type FloatingPlacement = FloatingSide | `${FloatingSide}-${FloatingAlignment}`;

const getFloatingPlacementParts = (
  placement: FloatingPlacement,
): readonly [FloatingSide, FloatingAlignment | undefined] => {
  const [side, alignment] = placement.split('-') as [FloatingSide, FloatingAlignment | undefined];
  return [side, alignment] as const;
};

export { getFloatingPlacementParts };
