import { CardProps } from './Card';
import { BaseBoxProps, SpacingValueType } from '../Box/BaseBox';
type CardSpacingValueType = Extract<SpacingValueType, 'spacing.0' | 'spacing.3' | 'spacing.4' | 'spacing.5' | 'spacing.7'>;
type CardRootProps = {
    isSelected?: boolean;
    isFocused?: boolean;
    shouldScaleOnHover?: boolean;
    onClick?: CardProps['onClick'];
    children?: React.ReactNode;
    href?: string;
    as?: 'label';
    accessibilityLabel?: string;
    validationState?: 'none' | 'error' | 'success';
} & BaseBoxProps;
type LinkOverlayProps = {
    href?: string;
} & BaseBoxProps;
export type { CardRootProps, LinkOverlayProps, CardSpacingValueType };
