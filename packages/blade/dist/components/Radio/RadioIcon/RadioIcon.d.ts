import { default as React } from 'react';
import { RadioProps } from '../Radio';
export type RadioIconProps = {
    isDisabled?: boolean;
    isNegative?: boolean;
    isChecked?: boolean;
} & Required<Pick<RadioProps, 'size'>>;
declare const RadioIcon: ({ isChecked, isDisabled, isNegative, size }: RadioIconProps) => React.JSX.Element;
export { RadioIcon };
