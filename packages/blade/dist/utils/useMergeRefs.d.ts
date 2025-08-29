/// <reference types="react" />
type ReactRef<T> = React.RefCallback<T> | React.MutableRefObject<T>;
declare function mergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]): (node: T | null) => void;
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
declare function useMergeRefs<T>(...refs: (ReactRef<T> | null | undefined)[]): (node: T | null) => void;
export { useMergeRefs, mergeRefs };
