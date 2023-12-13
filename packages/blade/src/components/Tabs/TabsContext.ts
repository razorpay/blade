import React from 'react';
import type { TabsProps } from './types';
import type { ScrollIntoViewAnimation } from './useScrollIntoView';
import { throwBladeError } from '~utils/logger';
import type { ControllableStateSetter } from '~utils/useControllable';

type TabsContextProps =
  | (Pick<
      TabsProps,
      'size' | 'variant' | 'isFullWidthTabItem' | 'isLazy' | 'scrollIntoViewAlignment'
    > & {
      isVertical: boolean;
      baseId: string;
      selectedValue: string;
      setSelectedValue?: ControllableStateSetter<string>;
      scrollIntoView?: (props?: ScrollIntoViewAnimation) => void;
    })
  | null;

const TabsContext = React.createContext<TabsContextProps>(null);

const useTabsContext = (): NonNullable<TabsContextProps> => {
  const context = React.useContext(TabsContext);

  if (!context) {
    throwBladeError({
      moduleName: 'Tabs',
      message: 'useTabsContext must be used within Tabs',
    });
  }

  return context!;
};

export { TabsContext, useTabsContext };
