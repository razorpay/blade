/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const DrawerContext = React.createContext<{
  close: () => void;
  closeButtonRef?: React.MutableRefObject<any>;
  backButtonRef?: React.MutableRefObject<any>;
  stackingLevel: number;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ close: () => {}, stackingLevel: 0 });

export { DrawerContext };
