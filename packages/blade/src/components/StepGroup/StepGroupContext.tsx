import React from 'react';
import type { StepGroupContextType } from './types';

const StepGroupContext = React.createContext<StepGroupContextType>({
  itemsInGroupCount: 0,
  totalItemsInParentGroupCount: 0,
  size: 'medium',
  orientation: 'vertical',
});

const useStepGroup = (): StepGroupContextType => {
  const stepGroupContext = React.useContext(StepGroupContext);

  return stepGroupContext;
};

export { useStepGroup, StepGroupContext };
