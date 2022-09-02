import type { Dispatch, SetStateAction } from 'react';
import { useState } from 'react';
import type { ActionStates } from '~tokens/theme/theme';

const useInteraction = (): {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
  currentInteraction: keyof ActionStates;
  setCurrentInteraction: Dispatch<SetStateAction<keyof ActionStates>>;
} => {
  const [currentInteraction, setCurrentInteraction] = useState<keyof ActionStates>('default');

  const onMouseEnter = (): void => {
    if (currentInteraction !== 'active') setCurrentInteraction('hover');
  };
  const onMouseLeave = (): void => {
    if (currentInteraction !== 'active') setCurrentInteraction('default');
  };
  const onFocus = (): void => {
    setCurrentInteraction('active');
  };
  const onBlur = (): void => {
    setCurrentInteraction('default');
  };

  return { onMouseEnter, onMouseLeave, onFocus, onBlur, currentInteraction, setCurrentInteraction };
};

export default useInteraction;
