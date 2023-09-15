import React from 'react';
import { getComponentId } from '~utils/isValidAllowedChildren';
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
    if (__DEV__) {
      if (!isValidChild) {
        throwBladeError({
          message: `Only one of \`${allowedComponents.join(
            ', ',
          )}\` component is accepted as ${componentName} children`,
          moduleName: 'Card',
        });
      }
    }
  });
};

type CardProviderProps = { children: React.ReactNode };
const CardProvider = ({ children }: CardProviderProps): React.ReactElement => {
  return <CardContext.Provider value={true}>{children}</CardContext.Provider>;
};

export { useVerifyInsideCard, useVerifyAllowedComponents, CardProvider };
