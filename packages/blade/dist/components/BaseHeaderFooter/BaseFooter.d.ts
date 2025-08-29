import { default as React } from 'react';
import { DataAnalyticsAttribute, TestID } from '../../utils/types';
import { BoxProps } from '../Box';
type BaseFooterProps = {
    children: React.ReactNode;
    metaComponentName?: string;
    showDivider?: boolean;
    padding?: BoxProps['padding'];
} & TestID & DataAnalyticsAttribute;
declare const BaseFooter: ({ children, showDivider, metaComponentName, padding, testID, ...rest }: BaseFooterProps) => React.ReactElement;
export type { BaseFooterProps };
export { BaseFooter };
