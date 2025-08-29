type ControllableStateSetter<T> = (
/**
 * Sets the state to the given value
 */
next: (prevState: T) => T, 
/**
 * If `true`, `onChange` won't be called
 */
skipUpdate?: boolean, 
/**
 * Extra data to be passed to `onChange` callback
 * Example use case: passing event object to `onChange` callback
 */
extraData?: any) => void;
type UseControllableStateProps<T> = {
    /**
     * The value to used in controlled mode
     */
    value?: T;
    /**
     * The initial value to be used, in uncontrolled mode
     */
    defaultValue?: T | (() => T);
    /**
     * The callback fired when the value changes
     */
    onChange?: (value: T, extraData: any) => void;
    shouldUpdate?: (prev: T, next: T) => boolean;
};
/**
 * React hook for using controlling component state.
 *
 * It automatically handles controlled and uncontrolled state,
 * while internally giving us the state value so that we can react to the changes.
 *
 * @example
 * In checkbox we want to internally track the checked state to be able to render the correct Icon
 * but also want to provide controlled and uncontrolled behavior to user
 */
declare function useControllableState<T>(props: UseControllableStateProps<T>): [T, ControllableStateSetter<T>];
export { useControllableState };
export type { ControllableStateSetter };
