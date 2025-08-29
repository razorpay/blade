import { default as React } from 'react';
import { BaseInputProps } from '../BaseInput';
import { StyledPropsBlade } from '../../Box/styledProps';
import { BladeElementRef, DataAnalyticsAttribute } from '../../../utils/types';
type SearchInputCommonProps = Pick<BaseInputProps, 'label' | 'accessibilityLabel' | 'labelPosition' | 'labelSuffix' | 'labelTrailing' | 'helpText' | 'placeholder' | 'defaultValue' | 'name' | 'onChange' | 'onFocus' | 'onBlur' | 'value' | 'isDisabled' | 'autoFocus' | 'onSubmit' | 'autoCapitalize' | 'testID' | 'onClick' | 'size' | keyof DataAnalyticsAttribute> & {
    /**
     * Event handler to handle the onClick event for clear button.
     */
    onClearButtonClick?: () => void;
    /**
     * Decides whether to show a loading spinner for the input field.
     */
    isLoading?: boolean;
    /**
     * Toggle the visibility of the search icon.
     *
     * @default true
     */
    showSearchIcon?: boolean;
    /**
     * Optional trailing  to be shown at the end of the input.
     */
    trailing?: React.ReactNode;
} & StyledPropsBlade;
type SearchInputPropsWithA11yLabel = {
    /**
     * Label to be shown for the input field
     */
    label?: undefined;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel: string;
};
type SearchInputPropsWithLabel = {
    /**
     * Label to be shown for the input field
     */
    label: string;
    /**
     * Accessibility label for the input
     */
    accessibilityLabel?: string;
};
type SearchInputProps = (SearchInputPropsWithA11yLabel | SearchInputPropsWithLabel) & SearchInputCommonProps;
declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<BladeElementRef>>;
export type { SearchInputProps };
export { SearchInput };
