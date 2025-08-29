import { CSSObject } from 'styled-components';
import { RadioIconProps } from './RadioIcon';
import { Theme } from '../../BladeProvider';
export type RadioRectProps = RadioIconProps;
declare const getRadioIconWrapperStyles: ({ theme, isChecked, isDisabled, isNegative, size, }: {
    isDisabled?: boolean | undefined;
    isNegative?: boolean | undefined;
    isChecked?: boolean | undefined;
} & Required<Pick<import('../Radio').RadioProps, "size">> & {
    theme: Theme;
}) => CSSObject;
export { getRadioIconWrapperStyles };
