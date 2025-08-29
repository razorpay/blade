import { default as React } from 'react';
import { CardSpacingValueType } from './types';
import { BadgeProps } from '../Badge';
import { LinkProps } from '../Link';
import { ButtonProps } from '../Button';
import { CounterProps } from '../Counter';
import { TextProps, TextVariant } from '../Typography';
import { IconComponent } from '../Icons';
import { DataAnalyticsAttribute, TestID } from '../../utils/types';
import { AmountProps } from '../Amount';
declare const CardHeaderIcon: ({ icon: Icon }: {
    icon: IconComponent;
}) => React.ReactElement;
declare const CardHeaderCounter: (props: CounterProps) => React.ReactElement;
declare const CardHeaderBadge: (props: BadgeProps) => React.ReactElement;
declare const CardHeaderAmount: (props: AmountProps) => React.ReactElement;
declare const CardHeaderText: (props: TextProps<{
    variant: TextVariant;
}>) => React.ReactElement;
declare const CardHeaderLink: (props: LinkProps) => React.ReactElement;
type CardHeaderIconButtonProps = Omit<ButtonProps, 'variant' | 'size' | 'iconPosition' | 'isFullWidth' | 'children'> & {
    icon: IconComponent;
};
declare const CardHeaderIconButton: (props: CardHeaderIconButtonProps) => React.ReactElement;
type CardHeaderProps = {
    children?: React.ReactNode;
    /**
     * For spacing between divider and header title
     */
    paddingBottom?: CardSpacingValueType;
    /**
     * For spacing between body content and divider
     */
    marginBottom?: CardSpacingValueType;
    /**
     * @default true
     */
    showDivider?: boolean;
} & TestID & DataAnalyticsAttribute;
declare const CardHeader: ({ children, testID, marginBottom, paddingBottom, showDivider, ...rest }: CardHeaderProps) => React.ReactElement;
type CardHeaderLeadingProps = {
    title: string;
    subtitle?: string;
    /**
     * prefix element of Card
     *
     * Accepts: `CardHeaderIcon` component
     */
    prefix?: React.ReactNode;
    /**
     * suffix element of Card
     *
     * it add marginLeft to `CardHeaderCounter`,`CardHeaderLink`  components by default.
     */
    suffix?: React.ReactNode;
} & DataAnalyticsAttribute;
declare const CardHeaderLeading: ({ title, subtitle, prefix, suffix, ...rest }: CardHeaderLeadingProps) => React.ReactElement;
type CardHeaderTrailingProps = {
    /**
     * Renders a visual ornament in card header trailing section
     *
     */
    visual?: React.ReactNode;
};
declare const CardHeaderTrailing: ({ visual }: CardHeaderTrailingProps) => React.ReactElement;
export { CardHeader, CardHeaderLeading, CardHeaderTrailing, CardHeaderBadge, CardHeaderIcon, CardHeaderCounter, CardHeaderText, CardHeaderLink, CardHeaderAmount, CardHeaderIconButton, };
