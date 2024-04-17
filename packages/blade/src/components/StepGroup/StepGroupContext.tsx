import React from 'react';
import type { StepGroupContextType } from './types';

const StepGroupContext = React.createContext<StepGroupContextType>({
  nestingLevel: -1,
  itemsCount: 0,
});

const useStepGroup = (): StepGroupContextType => {
  const stepGroupContext = React.useContext(StepGroupContext);

  return stepGroupContext;
};

export { useStepGroup, StepGroupContext };
