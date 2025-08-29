import { ReactElement, default as React } from 'react';
import { CardSpacingValueType } from './types';
import { ButtonProps } from '../Button';
import { DataAnalyticsAttribute, TestID } from '../../utils/types';
export type CardFooterAction = Pick<ButtonProps, 'type' | 'accessibilityLabel' | 'isLoading' | 'isDisabled' | 'icon' | 'iconPosition' | 'onClick'> & {
    text: ButtonProps['children'];
};
type CardFooterProps = {
    children?: React.ReactNode;
    /**
     * For spacing between divider and footer title
     */
    paddingTop?: CardSpacingValueType;
    /**
     * For spacing between body content and divider
     */
    marginTop?: CardSpacingValueType;
    /**
     * @default true
     */
    showDivider?: boolean;
} & TestID & DataAnalyticsAttribute;
declare const CardFooter: ({ children, testID, marginTop, paddingTop, showDivider, ...props }: CardFooterProps) => React.ReactElement;
type CardFooterLeadingProps = {
    title?: string;
    subtitle?: string;
} & DataAnalyticsAttribute;
declare const CardFooterLeading: ({ title, subtitle, ...rest }: CardFooterLeadingProps) => React.ReactElement;
type CardFooterTrailingProps = {
    actions?: {
        primary?: CardFooterAction;
        secondary?: CardFooterAction;
    };
} & DataAnalyticsAttribute;
declare const CardFooterTrailing: ({ actions, ...rest }: CardFooterTrailingProps) => React.ReactElement;
export { CardFooter, CardFooterLeading, CardFooterTrailing };
