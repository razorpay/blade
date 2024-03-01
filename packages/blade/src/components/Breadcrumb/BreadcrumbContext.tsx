import React from 'react';
import type { BreadcrumbProps } from './types';

type BreadcrumbContextValue = Pick<BreadcrumbProps, 'color' | 'size'>;
const BreadcrumbContext = React.createContext<BreadcrumbContextValue>({
  size: 'medium',
  color: 'primary',
});

export { BreadcrumbContext };
