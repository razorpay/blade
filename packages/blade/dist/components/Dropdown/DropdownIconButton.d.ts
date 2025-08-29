import { default as React } from 'react';
import { BaseButtonProps } from '../Button/BaseButton/BaseButton';
import { IconButtonProps } from '../Button/IconButton';
type DropdownIconButtonProps = Omit<IconButtonProps, 'onClick'> & {
    onBlur?: BaseButtonProps['onBlur'];
    onKeyDown?: BaseButtonProps['onKeyDown'];
    onClick?: IconButtonProps['onClick'];
};
declare const DropdownIconButton: ({ icon, isDisabled, onClick, onBlur, onKeyDown, size, accessibilityLabel, emphasis, ...rest }: DropdownIconButtonProps) => React.ReactElement;
export { DropdownIconButton };
