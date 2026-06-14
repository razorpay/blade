import React from 'react';
import type { SegmentedControlContextType } from './types';
import { throwBladeError } from '~utils/logger';

const SegmentedControlContext = React.createContext<SegmentedControlContextType>({});

const SegmentedControlProvider = SegmentedControlContext.Provider;

const useSegmentedControlContext = (): SegmentedControlContextType => {
  const context = React.useContext(SegmentedControlContext);
  if (__DEV__) {
    if (typeof context === 'undefined') {
      throwBladeError({
        message: 'useSegmentedControlContext must be used within SegmentedControl',
        moduleName: 'SegmentedControl',
      });
    }
  }
  return context;
};

export { useSegmentedControlContext, SegmentedControlProvider };
