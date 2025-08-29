import { default as React } from 'react';
import { BaseFilterChipProps } from '../FilterChip/types';
import { DataAnalyticsAttribute } from '../../utils/types';
type FilterChipSelectInputProps = Pick<BaseFilterChipProps, 'onKeyDown' | 'value' | 'label' | 'testID' | 'onClick' | 'selectionType' | 'onBlur'> & {
    accessibilityLabel?: string;
    onChange?: (props: {
        name: string;
        values: string[];
    }) => void;
    name?: string;
    onClearButtonClick?: (props: {
        name: string;
        values: string[];
    }) => void;
    isDisabled?: boolean;
} & DataAnalyticsAttribute;
declare const FilterChipSelectInput: (props: FilterChipSelectInputProps) => React.ReactElement;
export { FilterChipSelectInput };
