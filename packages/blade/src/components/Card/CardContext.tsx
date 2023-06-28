import React from 'react';
import { getComponentId } from '~utils/isValidAllowedChildren';

type CardContextType = true | null;
const CardContext = React.createContext<CardContextType>(null);

const useVerifyInsideCard = (componentName: string): CardContextType => {
  const context = React.useContext(CardContext);
  if (!context) {
    throw new Error(`[Blade Card]: ${componentName} cannot be used outside of Card component`);
  }
  return true;
};

/**
 * Verify if the passed childrens are only of allowedComponents list
 */
const useVerifyAllowedComponents = (
  children: React.ReactNode,
  componentName: string,
  allowedComponents: string[],
): void => {
  React.Children.forEach(children, (child) => {
    const isValidChild = child && allowedComponents.includes(getComponentId(child)!);
    if (!isValidChild) {
      throw new Error(
        `[Blade Card]: Only one of \`${allowedComponents.join(
          ', ',
        )}\` component is accepted as ${componentName} children`,
      );
    }
  });
};

type CardProviderProps = { children: React.ReactNode };
const CardProvider = ({ children }: CardProviderProps): React.ReactElement => {
  return <CardContext.Provider value={true}>{children}</CardContext.Provider>;
};

export { useVerifyInsideCard, useVerifyAllowedComponents, CardProvider };
