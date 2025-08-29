import { default as React } from 'react';
import { StepGroupContextType } from './types';
declare const StepGroupContext: React.Context<StepGroupContextType>;
declare const useStepGroup: () => StepGroupContextType;
export { useStepGroup, StepGroupContext };
