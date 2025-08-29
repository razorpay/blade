import { CSSObject } from 'styled-components';
import { CheckboxIconProps } from './CheckboxIcon';
import { Theme } from '../../BladeProvider';
export type CheckboxRectProps = Omit<CheckboxIconProps, 'state'> & {
    isChecked: boolean;
};
declare const getCheckboxIconWrapperStyles: ({ theme, isChecked, isDisabled, isNegative, size, }: Omit<CheckboxIconProps, "state"> & {
    isChecked: boolean;
} & {
    theme: Theme;
}) => CSSObject;
export { getCheckboxIconWrapperStyles };
