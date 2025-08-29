import { ButtonProps } from '../Button';
import { BladeElementRef, DataAnalyticsAttribute } from '../../utils/types';
type CollapsibleButtonProps = Pick<ButtonProps, 'variant' | 'size' | 'iconPosition' | 'isDisabled' | 'testID' | 'accessibilityLabel' | 'icon' | 'children'> & DataAnalyticsAttribute;
declare const CollapsibleButton: import('react').ForwardRefExoticComponent<Pick<ButtonProps, "icon" | "children" | "testID" | "size" | "variant" | "isDisabled" | "accessibilityLabel" | "iconPosition"> & DataAnalyticsAttribute & import('react').RefAttributes<BladeElementRef>>;
export type { CollapsibleButtonProps };
export { CollapsibleButton };
