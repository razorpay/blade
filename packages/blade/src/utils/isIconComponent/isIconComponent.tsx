import React from 'react';
import type { IconComponent } from '~components/Icons';
import { getComponentId } from '~utils/isValidAllowedChildren';

const isIconComponent = (element: React.ReactNode | IconComponent): boolean => {
  if (typeof element === 'function') {
    const componentId = getComponentId(React.createElement(element));
    return componentId?.endsWith('Icon') ?? false;
  }
  return getComponentId(element)?.endsWith('Icon') ?? false;
};

export { isIconComponent };
