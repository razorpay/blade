import { default as React } from 'react';
import { BreadcrumbProps } from './types';
type BreadcrumbContextValue = Pick<BreadcrumbProps, 'color' | 'size'>;
declare const BreadcrumbContext: React.Context<BreadcrumbContextValue>;
export { BreadcrumbContext };
