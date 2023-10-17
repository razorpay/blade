import React from 'react';
import type { TabsProps } from './types';
import { throwBladeError } from '~utils/logger';
import type { ControllableStateSetter } from '~utils/useControllable';

type TabsContextProps =
  | (Pick<TabsProps, 'size' | 'variant' | 'isFullWidthTabItem'> & {
      isVertical: boolean;
      baseId: string;
      selectedValue: string;
      setSelectedValue: ControllableStateSetter<string>;
    })
  | null;

const TabsContext = React.createContext<TabsContextProps>(null);

const useTabsContext = (): NonNullable<TabsContextProps> => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throwBladeError({
      moduleName: 'Tabs',
      message: 'Tabs compound components cannot be rendered outside the Tabs component',
    });
  }

  return context!;
};

export { TabsContext, useTabsContext };
