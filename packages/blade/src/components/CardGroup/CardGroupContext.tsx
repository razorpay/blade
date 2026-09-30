import React from 'react';
import { throwBladeError } from '~utils/logger';

type CardGroupContextType = { isInsideCardGroup: boolean };

const CardGroupContext = React.createContext<CardGroupContextType | null>(null);

const CardGroupProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const value = React.useMemo(() => ({ isInsideCardGroup: true }), []);
  return <CardGroupContext.Provider value={value}>{children}</CardGroupContext.Provider>;
};

const useCardGroupContext = (componentName: string): CardGroupContextType => {
  const context = React.useContext(CardGroupContext);
  if (__DEV__) {
    if (!context?.isInsideCardGroup) {
      throwBladeError({
        message: `${componentName} cannot be used outside of CardGroup component`,
        moduleName: 'CardGroup',
      });
    }
  }
  return context ?? { isInsideCardGroup: false };
};

/**
 * Marks the subtree rendered inside a CardGroupCollapsibleItemBody. A
 * CardGroupItem there reads this to know it is content, not the disclosure
 * trigger — otherwise it would hijack the parent Collapsible's expand/collapse.
 */
const CardGroupBodyContext = React.createContext<boolean>(false);

const CardGroupBodyProvider = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  return <CardGroupBodyContext.Provider value={true}>{children}</CardGroupBodyContext.Provider>;
};

const useIsInsideCardGroupBody = (): boolean => React.useContext(CardGroupBodyContext);

export {
  CardGroupContext,
  CardGroupProvider,
  useCardGroupContext,
  CardGroupBodyProvider,
  useIsInsideCardGroupBody,
};
export type { CardGroupContextType };
