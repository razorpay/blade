import { CSSObject } from 'styled-components';
import { BaseInputProps } from './BaseInput';
import { BaseInputWrapperProps } from './types';
import { Theme } from '../../BladeProvider';
type GetInputStyles = Pick<BaseInputProps, 'isDisabled' | 'validationState' | 'leadingIcon' | 'prefix' | 'trailingInteractionElement' | 'leadingInteractionElement' | 'suffix' | 'trailingIcon' | 'textAlign' | 'isDropdownTrigger' | 'valueComponentType'> & {
    isHovered?: boolean;
    isFocused?: boolean;
    isTextArea?: boolean;
    hasTags?: boolean;
    theme: Theme;
    size: NonNullable<BaseInputProps['size']>;
    isTableInputCell: NonNullable<BaseInputProps['isTableInputCell']>;
    hasLeadingDropdown?: boolean;
};
export declare const getBaseInputState: ({ isFocused, isHovered, isDisabled, }: {
    isFocused?: boolean | undefined;
    isHovered?: boolean | undefined;
    isDisabled?: boolean | undefined;
}) => 'focused' | 'hovered' | 'disabled' | 'default';
export declare const getInputBackgroundAndBorderStyles: ({ theme, isHovered, isFocused, isDisabled, validationState, isTextArea, isDropdownTrigger, isTableInputCell, }: Pick<GetInputStyles, 'theme' | 'isFocused' | 'isDisabled' | 'validationState' | 'isHovered' | 'isTextArea' | 'isDropdownTrigger' | 'isTableInputCell'>) => CSSObject;
export declare const getBaseInputStyles: ({ theme, isDisabled, leadingIcon, prefix, trailingInteractionElement, leadingInteractionElement, suffix, trailingIcon, textAlign, isTextArea, hasTags, isDropdownTrigger, size, valueComponentType, hasLeadingDropdown, }: GetInputStyles) => CSSObject;
export declare const getAnimatedBaseInputWrapperMaxHeight: ({ maxTagRows, showAllTags, size, }: Pick<BaseInputWrapperProps, 'maxTagRows' | 'showAllTags' | 'size'>) => number;
export {};
