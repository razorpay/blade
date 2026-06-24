import React from 'react';
import type { CardVariant } from './types';
import { throwBladeError } from '~utils/logger';

type CardContextType = { size: 'large' | 'medium' | undefined; variant: CardVariant | undefined };
const CardContext = React.createContext<CardContextType>({ size: undefined, variant: undefined });

const useVerifyInsideCard = (componentName: string): CardContextType => {
  const context = React.useContext(CardContext);
  if (__DEV__) {
    if (!context?.size) {
      throwBladeError({
        message: `${componentName} cannot be used outside of Card component`,
        moduleName: 'Card',
      });
    }
  }
  return context;
};

type CardProviderProps = { children: React.ReactNode };
const CardProvider = ({
  children,
  size,
  variant,
}: CardProviderProps & { size: 'large' | 'medium'; variant: CardVariant }): React.ReactElement => {
  return <CardContext.Provider value={{ size, variant }}>{children}</CardContext.Provider>;
};

export { useVerifyInsideCard, CardProvider, CardContext };
