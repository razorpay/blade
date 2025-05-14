import React from 'react';
import { propValidations } from '~utils/errors';
import { throwBladeError } from '~utils/logger';

type CardContextType = true | null;
const CardContext = React.createContext<CardContextType>(null);

const useVerifyInsideCard = (componentName: string): CardContextType => {
  const context = React.useContext(CardContext);
  if (__DEV__) {
    if (!context) {
      throwBladeError({
        moduleName: 'Card',
        message: propValidations.Card.CANNOT_BE_USED_OUTSIDE,
        values: { componentName },
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
