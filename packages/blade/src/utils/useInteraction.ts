import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';

export type ActionStates = 'default' | 'hover' | 'focus' | 'disabled';
const useInteraction = (): {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  currentInteraction: ActionStates;
  setCurrentInteraction: Dispatch<SetStateAction<ActionStates>>;
} => {
  const [currentInteraction, setCurrentInteraction] = useState<ActionStates>('default');

  const onMouseEnter = (): void => {
    if (currentInteraction !== 'focus') setCurrentInteraction('hover');
  };
  const onMouseLeave = (): void => {
    if (currentInteraction !== 'focus') setCurrentInteraction('default');
  };
  const onFocus = (): void => {
    setCurrentInteraction('focus');
  };
  const onBlur = (): void => {
    setCurrentInteraction('default');
  };

  return {
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    currentInteraction,
    setCurrentInteraction,
  };
};

export default useInteraction;
