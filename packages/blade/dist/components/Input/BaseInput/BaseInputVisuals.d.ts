import { ReactElement } from 'react';
import { BaseInputProps } from './BaseInput';
type InputVisuals = Pick<BaseInputProps, 'leadingIcon' | 'prefix' | 'trailingInteractionElement' | 'onTrailingInteractionElementClick' | 'leadingInteractionElement' | 'leadingDropDown' | 'trailingDropDown' | 'suffix' | 'trailingIcon' | 'isDisabled' | 'validationState' | 'size' | 'trailingButton' | 'showHintsAsTooltip' | 'errorText' | 'successText'> & {
    size: NonNullable<BaseInputProps['size']>;
};
export declare const getInputVisualsToBeRendered: ({ leadingIcon, prefix, trailingInteractionElement, leadingInteractionElement, suffix, trailingIcon, trailingButton, leadingDropDown, trailingDropDown, }: InputVisuals) => {
    hasLeadingIcon: boolean;
    hasPrefix: boolean;
    hasTrailingInteractionElement: boolean;
    hasLeadingInteractionElement: boolean;
    hasSuffix: boolean;
    hasTrailingIcon: boolean;
    hasTrailingButton: boolean;
    hasLeadingDropDown: boolean;
    hasTrailingDropDown: boolean;
};
export declare const BaseInputVisuals: ({ leadingIcon: LeadingIcon, prefix, trailingInteractionElement, onTrailingInteractionElementClick, leadingDropDown, trailingDropDown, leadingInteractionElement, suffix, trailingIcon: TrailingIcon, isDisabled, validationState, size, showHintsAsTooltip, errorText, successText, trailingButton: TrailingButton, }: InputVisuals) => ReactElement | null;
export {};
