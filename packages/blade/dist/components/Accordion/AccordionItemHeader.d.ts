import { default as React } from 'react';
import { BaseHeaderProps } from '../BaseHeaderFooter/BaseHeader';
import { DataAnalyticsAttribute } from '../../utils/types';
declare const AccordionItemHeader: ({ title, subtitle, leading, children, trailing, titleSuffix, ...rest }: Pick<BaseHeaderProps, 'title' | 'subtitle' | 'leading' | 'children' | 'trailing' | 'titleSuffix'> & DataAnalyticsAttribute) => React.ReactElement;
export { AccordionItemHeader };
