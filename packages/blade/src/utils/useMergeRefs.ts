/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useMemo } from 'react';
import { throwBladeError } from './logger';

type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>;

function assignRef<T = any>(ref: ReactRef<T> | null | undefined, value: T) {
  if (ref == null) return;

  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  try {
    ref.current = value;
  } catch (error: unknown) {
    throwBladeError({
      moduleName: 'useMergeRefs',
      message: `Cannot assign value '${value}' to ref '${ref}'`,
    });
  }
}

function mergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      assignRef(ref, node);
    });
  };
}

/**
 * Merged two or more refs into a single ref callback.
 *
 * Usage:
 * ```ts
 * const internalRef = React.useRef()
 * const ref = useMergeRefs(incomingRef, internalRef);
 * ```
 *
 *
 * Taken from ChakraUI:
 * https://github.com/chakra-ui/chakra-ui/blob/f3c4a492e5636d2745b438d10794fa4e7999b6de/packages/hooks/use-merge-refs/src/index.ts#L31
 */
function useMergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => mergeRefs(...refs), refs);
}

export { useMergeRefs };
