import type { ActionStatesType, UseInteractionReturnType } from '../types';

/**
 * Hook for managing interaction states (default, hover, focus, disabled)
 * Similar to React's useInteraction hook
 *
 * This function returns handlers that work with state created in the component.
 * The component should create the state using $state and pass a setter function.
 *
 * @param getState - Function to get current state
 * @param setState - Function to set state
 * @returns Object with event handlers
 */
export function useInteraction(
  getState: () => ActionStatesType,
  setState: (state: ActionStatesType) => void,
): Omit<UseInteractionReturnType, 'currentInteraction' | 'setCurrentInteraction'> {
  const onMouseEnter = (): void => {
    if (getState() !== 'focus') {
      setState('hover');
    }
  };

  const onMouseLeave = (): void => {
    if (getState() !== 'focus') {
      setState('default');
    }
  };

  const onFocus = (): void => {
    setState('focus');
  };

  const onBlur = (): void => {
    setState('default');
  };

  return {
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
  };
}
