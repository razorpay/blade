import React from 'react';
import { throwBladeError } from '~utils/logger';

type PopoverContextProps = {
  close: () => void;
  defaultInitialFocusRef: React.RefObject<HTMLElement>;
  titleId?: string;
  openInteraction?: 'hover' | 'click';
} | null;
const PopoverContext = React.createContext<PopoverContextProps>(null);

const usePopoverContext = (): NonNullable<PopoverContextProps> => {
  const context = React.useContext(PopoverContext);

  if (__DEV__) {
    if (!context) {
      throwBladeError({
        message: `usePopoverContext must be used within Popover`,
        moduleName: 'Popover',
      });
    }
  }

  return context!;
};

export { PopoverContext, usePopoverContext };
