import React from 'react';
import { throwBladeError } from '~utils/logger';

type TooltipContext = true | null;
const TooltipContext = React.createContext<TooltipContext>(null);

const useTooltipContext = (): TooltipContext => {
  const context = React.useContext(TooltipContext);

  if (__DEV__) {
    if (!context) {
      throwBladeError({
        message: `TooltipInteractiveWrapper must be used within Tooltip`,
        moduleName: 'Tooltip',
      });
    }
  }

  return context;
};

export { TooltipContext, useTooltipContext };
