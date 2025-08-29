type FocusWithinHandlers = {
    onFocusWithin?: () => void;
    onBlurWithin?: () => void;
};
export declare const useFocusWithin: <T extends HTMLElement>(ref: import('react').RefObject<T>, { onFocusWithin, onBlurWithin }: FocusWithinHandlers) => void;
export {};
