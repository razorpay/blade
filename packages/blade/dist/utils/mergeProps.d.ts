/**
 * Merges two sets of props.
 *
 * modified from: https://github.com/ariakit/ariakit/blob/f152585bbb698412ced42bcfa059038ef9d40100/packages/ariakit-react-core/src/utils/misc.ts#L48
 */
declare const mergeProps: <T extends Record<string, any>>(base: T, overrides: T) => T;
export { mergeProps };
