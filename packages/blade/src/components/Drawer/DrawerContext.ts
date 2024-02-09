import React from 'react';

const DrawerContext = React.createContext<{
  close: () => void;
  defaultInitialFocusRef?: React.MutableRefObject<any>;
  stackingLevel: number;
}>({ close: () => {}, stackingLevel: 0 });

export { DrawerContext };
