import React from 'react';

const StaggerContext = React.createContext({ isInsideStaggerContainer: false });

const useStagger = () => {
  const staggerContextValue = React.useContext(StaggerContext);
  return staggerContextValue;
};

export { useStagger, StaggerContext };
