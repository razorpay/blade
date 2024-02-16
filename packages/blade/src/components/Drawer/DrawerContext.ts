/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

const DrawerContext = React.createContext<{
  close: () => void;
  closeButtonRef?: React.MutableRefObject<any>;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
}>({ close: () => {} });

export { DrawerContext };
