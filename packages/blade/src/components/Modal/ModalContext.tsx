/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

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
  /**
   * The height of the Modal's footer
   */
  footerHeight: number;
  /**
   * Sets the height of the Modal's footer
   * @param height - The height of the Modal's footer
   */
  setFooterHeight: (height: number) => void;
};

const ModalContext = React.createContext<ModalContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {},
  defaultInitialFocusRef: { current: null },
  isOpen: false,
  isVisible: false,
  footerHeight: 0,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setFooterHeight: () => {},
});

const useModalContext = (): ModalContextProps => {
  const state = React.useContext(ModalContext);
  return state;
};

export { ModalContext, useModalContext };
