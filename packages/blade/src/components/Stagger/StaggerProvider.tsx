import React from 'react';
import type { BaseMotionBoxProps } from '~components/BaseMotion';

type StaggerContextType = {
  isInsideStaggerContainer: boolean;
  staggerType: BaseMotionBoxProps['type'];
};

const StaggerContext = React.createContext<StaggerContextType>({
  isInsideStaggerContainer: false,
  staggerType: 'inout',
});

const useStagger = (): StaggerContextType => {
  const staggerContextValue = React.useContext(StaggerContext);
  return staggerContextValue;
};

export { useStagger, StaggerContext };
