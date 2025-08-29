import { DataAnalyticsAttribute, TestID } from '../../utils/types';
import { ControllableStateSetter } from '../../utils/useControllable';
type QuickFilterProps = {
    title: string;
    value: string;
    trailing?: React.ReactNode;
} & TestID & DataAnalyticsAttribute;
type QuickFilterGroupCommomProps = {
    /**
     * Specifies the name attribute for the  component.
     * When provided, this attribute ensures that the QuickFilter elements within the group are semantically associated, allowing them to be grouped logically for form submission.
     * This can be particularly useful in scenarios where the QuickFilter is part of a larger form and needs to be identified as a distinct entity when the form is submitted.
     * If not provided, a default unique identifier will be generated internally.
     */
    name?: string;
    /**
     * Sets the initial value of the QuickFilter component.
     */
    defaultValue?: string | string[];
    /**
     * Value of the QuickFilter group
     * Acts as a controlled component by specifying the QuickFilter value
     * Use `onChange` to update its value
     */
    value?: string | string[];
    onChange?: ({ name, values }: {
        name: string;
        values: string[];
    }) => void;
    selectionType: 'single' | 'multiple';
    children: React.ReactNode;
};
type QuickFilterGroupProps = QuickFilterGroupCommomProps & TestID & DataAnalyticsAttribute;
type QuickFilterContentProps = Pick<QuickFilterProps, 'trailing' | 'value' | 'title'> & Pick<QuickFilterGroupCommomProps, 'selectionType'> & TestID & DataAnalyticsAttribute & {
    isSelected?: boolean;
};
type QuickFilterGroupContextType = Pick<QuickFilterGroupCommomProps, 'selectionType'> & {
    selectedQuickFilters: string[];
};
type QuickFilterWrapperProps = Pick<QuickFilterGroupCommomProps, 'children' | 'onChange'> & {
    setSelectedQuickFilters: ControllableStateSetter<string[]>;
};
type State = {
    value: string[];
    isChecked(value: string): boolean;
    addValue(value: string): void;
    removeValue(value: string): void;
};
export type { State, QuickFilterGroupProps, QuickFilterProps, QuickFilterContentProps, QuickFilterGroupContextType, QuickFilterWrapperProps, QuickFilterGroupCommomProps, };
