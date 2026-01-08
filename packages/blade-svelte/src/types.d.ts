export type ActionStatesType = 'default' | 'hover' | 'focus' | 'disabled';

export type ColorType = 'normal' | 'subtle' | 'disabled';

export interface UseInteractionReturnType {
  currentInteraction: ActionStates;
  setCurrentInteraction: (state: ActionStates) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: () => void;
  onBlur: () => void;
}
