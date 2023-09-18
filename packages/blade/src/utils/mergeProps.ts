/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

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

export { mergeProps };
