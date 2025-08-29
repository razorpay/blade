import { default as React } from 'react';
export type CheckboxIconProps = {
    isDisabled?: boolean;
    isNegative?: boolean;
    isChecked?: boolean;
    isIndeterminate?: boolean;
    size: 'small' | 'medium' | 'large';
};
declare const CheckboxIcon: ({ isChecked, isIndeterminate, isDisabled, isNegative, size, }: CheckboxIconProps) => React.JSX.Element;
export { CheckboxIcon };
