import React from 'react';
import type { IconComponent } from '~components/Icons';

const isIconComponent = (element: React.ReactNode | IconComponent): boolean => {
  if (typeof element === 'function') {
    const elementType = React.createElement(element).type;
    if (typeof elementType === 'function') {
      return elementType.name?.includes('Icon') ?? false;
    }
  }
  return false;
};

export { isIconComponent };
