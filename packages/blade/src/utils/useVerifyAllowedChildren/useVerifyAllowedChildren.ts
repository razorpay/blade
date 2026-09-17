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
      const childComponentId = getComponentId(child);
      const isValidChild = child && allowedComponents.includes(childComponentId!);
      if (!isValidChild) {
        let actualChildName: string | undefined = childComponentId ?? undefined;
        if (!actualChildName) {
          if (typeof child.type === 'function') {
            const componentType = child.type as { displayName?: string; name?: string };
            // eslint-disable-next-line no-restricted-properties
            actualChildName = componentType.displayName ?? componentType.name;
          } else {
            actualChildName = String(child.type);
          }
        }
        throwBladeError({
          message: `Only \`${allowedComponents.join(
            ', ',
          )}\` components are accepted in \`${componentName}\` children. Received \`${
            actualChildName ?? 'Unknown'
          }\``,
          moduleName: componentName,
        });
      }
    });
  }
};

export { useVerifyAllowedChildren };
