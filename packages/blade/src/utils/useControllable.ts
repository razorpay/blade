/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

type ControllableStateSetter<T> = (
  /**
   * Sets the state to the given value
   */
  next: (prevState: T) => T,
  /**
   * If `true`, `onChange` won't be called
   */
  skipUpdate?: boolean,
) => void;

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
  const { current: isControlled } = React.useRef(valueProp !== undefined);
  const value = isControlled && typeof valueProp !== 'undefined' ? valueProp : valueState;

  const updateValue: ControllableStateSetter<T> = React.useCallback(
    (next, skipUpdate = false) => {
      const nextValue = next(value);
      if (!isControlled) setValue(nextValue);
      // We don't want to call onChange if skipUpdate is true
      if (skipUpdate) return;
      onChange?.(nextValue);
    },
    [onChange, value],
  );

  return [value, updateValue] as [T, ControllableStateSetter<T>];
}

export type { ControllableStateSetter };
