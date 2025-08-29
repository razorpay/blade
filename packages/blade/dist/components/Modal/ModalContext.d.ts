import { default as React } from 'react';
type ModalContextProps = {
    /**
     * Indicates open state of Modal
     */
    isOpen: boolean;
    /**
     * Function to close the Modal
     */
    close: () => void;
    /**
     * The element that will get focused when the Modal first opens
     */
    defaultInitialFocusRef: React.MutableRefObject<any>;
    /**
     * Indicates if the Modal is visible according to the usePresence hook
     */
    isVisible: boolean;
};
declare const ModalContext: React.Context<ModalContextProps>;
declare const useModalContext: () => ModalContextProps;
export { ModalContext, useModalContext };
