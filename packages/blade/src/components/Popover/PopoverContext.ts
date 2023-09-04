import React from 'react';
import { throwBladeError } from '~utils/logger';

type PopoverContext = {
  close: () => void;
  defaultInitialFocusRef: React.RefObject<HTMLElement>;
} | null;
const PopoverContext = React.createContext<PopoverContext>(null);

const usePopoverContext = (): NonNullable<PopoverContext> => {
  const context = React.useContext(PopoverContext);

  if (__DEV__) {
    if (!context) {
      throwBladeError({
        message: `PopoverInteractiveWrapper must be used within Popover`,
        moduleName: 'Popover',
      });
    }
  }

  return context!;
};

export { PopoverContext, usePopoverContext };
