import React from 'react';

const DrawerContext = React.createContext<{
  close: () => void;
  closeButtonRef?: React.MutableRefObject<any>;
  backButtonRef?: React.MutableRefObject<any>;
  stackingLevel: number;
}>({ close: () => {}, stackingLevel: 0 });

export { DrawerContext };
