/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

type DrawerContextType = {
  close: () => void;
  closeButtonRef?: React.MutableRefObject<any>;
  stackingLevel?: number;
  isExiting: boolean;
};

const DrawerContext = React.createContext<DrawerContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close: () => {},
  isExiting: false,
});

export { DrawerContext };
