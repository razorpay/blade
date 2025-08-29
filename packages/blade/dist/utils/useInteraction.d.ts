import { Dispatch, SetStateAction } from 'react';
export type ActionStates = 'default' | 'hover' | 'focus' | 'disabled';
declare const useInteraction: () => {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocus: () => void;
    onBlur: () => void;
    currentInteraction: ActionStates;
    setCurrentInteraction: Dispatch<SetStateAction<ActionStates>>;
};
export default useInteraction;
