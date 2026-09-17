import React from 'react';
import { getComponentId } from '~utils/isValidAllowedChildren';
import { throwBladeError } from '~utils/logger';

type SplitSectionedCardChildrenArgs = {
  children: React.ReactNode;
  bodyComponentId: string;
  footerComponentId: string;
  componentName: string;
};

type SplitSectionedCardChildrenResult = {
  body: React.ReactNode;
  footer: React.ReactNode;
};

const splitSectionedCardChildren = ({
  children,
  bodyComponentId,
  footerComponentId,
  componentName,
}: SplitSectionedCardChildrenArgs): SplitSectionedCardChildrenResult => {
  const childrenArray = React.Children.toArray(children);
  const bodyChild = childrenArray.find(
    (child) => React.isValidElement(child) && getComponentId(child) === bodyComponentId,
  );
  const footerChild = childrenArray.find(
    (child) => React.isValidElement(child) && getComponentId(child) === footerComponentId,
  );

  if (__DEV__) {
    if (!bodyChild) {
      throwBladeError({
        message: `${componentName} must contain a \`${bodyComponentId}\` child.`,
        moduleName: componentName,
      });
    }
    if (!footerChild) {
      throwBladeError({
        message: `${componentName} must contain a \`${footerComponentId}\` child.`,
        moduleName: componentName,
      });
    }
  }

  const body = bodyChild && React.isValidElement(bodyChild) ? bodyChild.props.children : null;
  const footer =
    footerChild && React.isValidElement(footerChild) ? footerChild.props.children : null;

  return { body, footer };
};

export { splitSectionedCardChildren };
