import React from 'react';
import { throwBladeError } from '~utils/logger';

type CardContextType = true | null;
const CardContext = React.createContext<CardContextType>(null);

const useVerifyInsideCard = (componentName: string): CardContextType => {
  const context = React.useContext(CardContext);
  if (__DEV__) {
    if (!context) {
      throwBladeError({
        message: `${componentName} cannot be used outside of Card component`,
        moduleName: 'Card',
      });
    }
  }
  return true;
};

type CardProviderProps = { children: React.ReactNode };
const CardProvider = ({ children }: CardProviderProps): React.ReactElement => {
  return <CardContext.Provider value={true}>{children}</CardContext.Provider>;
};

export { useVerifyInsideCard, CardProvider };
