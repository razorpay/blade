import React from 'react';

type TooltipContext = true | null;
const TooltipContext = React.createContext<TooltipContext>(null);

const useTooltipContext = (): TooltipContext => {
  const context = React.useContext(TooltipContext);
  if (!context) {
    throw new Error('[Blade Tooltip]: TooltipInteractiveWrapper must be used within Tooltip');
  }

  return context;
};

export { TooltipContext, useTooltipContext };
