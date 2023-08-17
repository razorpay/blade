/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';

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
  console.log('🚀 ~ file: useControllable.ts:33 ~ defaultValue:', defaultValue);

  const [valueState, setValue] = React.useState(defaultValue as T);
  const { current: isControlled } = React.useRef(valueProp !== undefined);
  const value = isControlled && typeof valueProp !== 'undefined' ? valueProp : valueState;

  const updateValue = React.useCallback(
    (next: (prevState: T) => T) => {
      const nextValue = next(value);
      if (!isControlled) setValue(nextValue);
      onChange?.(nextValue);
    },
    [onChange, value],
  );

  return [value, updateValue] as [T, (next: (prevState: T) => T) => void];
}
