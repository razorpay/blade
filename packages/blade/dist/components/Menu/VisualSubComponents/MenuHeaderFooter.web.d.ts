import { default as React } from 'react';
import { MenuFooterProps, MenuHeaderProps } from '../types';
declare const MenuHeader: ({ title, subtitle, leading, titleSuffix, trailing, testID, ...rest }: MenuHeaderProps) => React.ReactElement;
declare const MenuFooter: ({ children, testID, ...rest }: MenuFooterProps) => React.ReactElement;
export { MenuHeader, MenuFooter };
