import { default as React } from 'react';
import { ButtonProps } from '../Button';
import { BaseButtonProps } from '../Button/BaseButton/BaseButton';
type DropdownButtonProps = ButtonProps & {
    onBlur?: BaseButtonProps['onBlur'];
    onKeyDown?: BaseButtonProps['onKeyDown'];
};
declare const DropdownButton: ({ children, icon, iconPosition, isDisabled, isFullWidth, isLoading, onClick, onBlur, onKeyDown, size, type, variant, color, accessibilityLabel, testID, ...rest }: DropdownButtonProps) => React.ReactElement;
export { DropdownButton };
