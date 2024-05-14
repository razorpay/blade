import React from 'react';
import { getComponentId } from '../isValidAllowedChildren';
import { throwBladeError } from '../logger';

/**
 * Verify if the passed childrens are only of allowedComponents list
 */
const useVerifyAllowedChildren = (props: {
  children: React.ReactNode;
  componentName: string;
  allowedComponents: string[];
}): void => {
  const { children, componentName, allowedComponents } = props;
  if (__DEV__) {
    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) return;
      const isValidChild = child && allowedComponents.includes(getComponentId(child)!);
      if (!isValidChild) {
        throwBladeError({
          message: `Only \`${allowedComponents.join(
            ', ',
          )}\` components are accepted in \`${componentName}\` children`,
          moduleName: componentName,
        });
      }
    });
  }
};

export { useVerifyAllowedChildren };
