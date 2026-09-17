import React from 'react';
import { throwBladeError } from '~utils/logger';

type CardContextType = { size: 'large' | 'medium' | undefined };
const CardContext = React.createContext<CardContextType>({ size: undefined });

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
}: CardProviderProps & { size: 'large' | 'medium' }): React.ReactElement => {
  return <CardContext.Provider value={{ size }}>{children}</CardContext.Provider>;
};

export { useVerifyInsideCard, CardProvider, CardContext };
