/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react-hooks/exhaustive-deps */
import isFunction from 'lodash/isFunction';
import * as React from 'react';

/**
 * React hook for detecting controlled props
 */
export function useControllableProp<T>(prop: T | undefined, state: T) {
  const { current: isControlled } = React.useRef(prop !== undefined);
  const value = isControlled && typeof prop !== 'undefined' ? prop : state;
  return [isControlled, value] as const;
}

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
  onChange?: (value: T) => void;
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
export function useControllableState<T>(props: UseControllableStateProps<T>) {
  const { value: valueProp, defaultValue, onChange } = props;

  const [valueState, setValue] = React.useState(defaultValue as T);
  const [isControlled, value] = useControllableProp(valueProp, valueState);

  const updateValue = React.useCallback(
    (next: React.SetStateAction<T>) => {
      const nextValue = isFunction(next) ? next(value) : next;
      if (!isControlled) setValue(nextValue);
      onChange?.(nextValue);
    },
    [onChange, value],
  );

  return [value, updateValue] as [T, React.Dispatch<React.SetStateAction<T>>];
}
