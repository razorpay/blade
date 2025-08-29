import { default as React } from 'react';
import { BaseInputProps } from '../BaseInput';
import { TaggedInputProps } from '../BaseInput/useTaggedInput';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BladeElementRef, DataAnalyticsAttribute } from '../../../utils/types';
import { FormInputOnKeyDownEvent } from '../../Form/FormTypes';
type TextAreaCommonProps = Pick<BaseInputProps, 'label' | 'accessibilityLabel' | 'labelPosition' | 'labelSuffix' | 'labelTrailing' | 'necessityIndicator' | 'validationState' | 'helpText' | 'errorText' | 'successText' | 'placeholder' | 'defaultValue' | 'name' | 'onChange' | 'onFocus' | 'onBlur' | 'onSubmit' | 'value' | 'isDisabled' | 'isRequired' | 'maxCharacters' | 'autoFocus' | 'numberOfLines' | 'testID' | 'size' | keyof DataAnalyticsAttribute> & {
    /**
     * Decides whether to render a clear icon button
     */
    showClearButton?: boolean;
    /**
     * Event handler to handle the onClick event for clear button. Used when `showClearButton` is `true`
     */
    onClearButtonClick?: () => void;
    onKeyDown?: ({ name, value, event, }: {
        name?: FormInputOnKeyDownEvent['name'];
        value: string;
        event: FormInputOnKeyDownEvent['event'];
    }) => void;
} & TaggedInputProps & StyledPropsBlade;
type TextAreaPropsWithA11yLabel = {
    /**
     * Label to be shown for the input field
     */
    label?: undefined;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel: string;
};
type TextAreaPropsWithLabel = {
    /**
     * Label to be shown for the input field
     */
    label: string;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel?: string;
};
type TextAreaProps = (TextAreaPropsWithA11yLabel | TextAreaPropsWithLabel) & TextAreaCommonProps;
declare const TextArea: React.ForwardRefExoticComponent<TextAreaProps & React.RefAttributes<BladeElementRef>>;
export type { TextAreaProps };
export { TextArea };
