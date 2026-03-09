import React from 'react';

type LightBoxContextType = {
  activeIndex: number;
  handleIndexChange: (index: number) => void;
};

const LightBoxContext = React.createContext<LightBoxContextType>({
  activeIndex: 0,
  handleIndexChange: () => undefined,
});

const LightBoxProvider = LightBoxContext.Provider;

const useLightBoxContext = (): LightBoxContextType => {
  return React.useContext(LightBoxContext);
};

export { LightBoxProvider, useLightBoxContext };
