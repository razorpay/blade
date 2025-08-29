import { default as React } from 'react';
import { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import { BaseFooterProps } from '../BaseHeaderFooter/BaseFooter';
import { DataAnalyticsAttribute } from '../../utils/types';
type DropdownHeaderProps = Pick<BaseHeaderProps, 'title' | 'subtitle' | 'leading' | 'trailing' | 'titleSuffix' | 'testID' | 'children' | keyof DataAnalyticsAttribute>;
declare const DropdownHeader: ({ title, subtitle, leading, titleSuffix, trailing, testID, children, ...rest }: DropdownHeaderProps) => React.ReactElement;
type DropdownFooter = Pick<BaseFooterProps, 'children' | 'testID'>;
declare const DropdownFooter: ({ children, testID }: DropdownFooter) => React.ReactElement;
export { DropdownHeader, DropdownFooter };
