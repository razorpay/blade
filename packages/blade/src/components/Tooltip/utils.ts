/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Alignment, Placement, Side } from '@floating-ui/react';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getPlacementParts = (placement: NonNullable<Placement>) => {
  const [side, alignment] = placement.split('-') as [Side, Alignment];
  return [side, alignment] as const;
};

/**
 * Merges two sets of props.
 *
 * modified from: https://github.com/ariakit/ariakit/blob/f152585bbb698412ced42bcfa059038ef9d40100/packages/ariakit-react-core/src/utils/misc.ts#L48
 */
const mergeProps = <T extends Record<string, any>>(base: T, overrides: T) => {
  const props = { ...base };

  for (const key in overrides) {
    if (!overrides.hasOwnProperty(key)) continue;
    const overrideValue = overrides[key];
    if (typeof overrideValue === 'function') {
      const baseValue = base[key];
      if (typeof baseValue === 'function') {
        // @ts-expect-error no overlap
        props[key as any] = (...args: any[]) => {
          overrideValue(...args);
          baseValue(...args);
        };
        continue;
      }
    }

    props[key] = overrideValue;
  }
  return props;
};

export { getPlacementParts, mergeProps };
