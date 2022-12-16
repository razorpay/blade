import React from 'react';

type CardContextType = true | null;
const CardContext = React.createContext<CardContextType>(null);

const useVerifyInsideCard = (componentName: string): CardContextType => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error(`[Blade Card]: ${componentName} cannot be used outside of Card component`);
  }
  return context;
};

type CardProviderProps = { children: React.ReactNode };
const CardProvider = ({ children }: CardProviderProps): React.ReactElement => {
  return <CardContext.Provider value={true}>{children}</CardContext.Provider>;
};

export { useVerifyInsideCard, CardProvider };
