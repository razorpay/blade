import React from 'react';
import type { TabsProps } from './types';
import { throwBladeError } from '~utils/logger';

type TabsContextProps =
  | (Pick<TabsProps, 'orientation' | 'size' | 'variant' | 'autoWidth'> & {
      baseId: string;
      selectedValue: string;
      setSelectedValue: (next: (prevState: string) => string) => void;
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
