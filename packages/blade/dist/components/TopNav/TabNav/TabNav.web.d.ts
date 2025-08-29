import { default as React } from 'react';
import { TabNavProps } from './types';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BoxProps } from '../../Box';
import { DataAnalyticsAttribute } from '../../../utils/types';
declare const TabNavItems: ({ children, ...rest }: BoxProps) => React.ReactElement;
declare const TabNav: ({ children, items, ...rest }: TabNavProps & StyledPropsBlade & DataAnalyticsAttribute) => React.ReactElement;
export { TabNav, TabNavItems };
