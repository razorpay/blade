import type { BladeCommonEvents } from '~components/types';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { ControllableStateSetter } from '~utils/useControllable';

type QuickFilterProps = {
  /*
      title is a string that is displayed as the title of the quick filter.
  */
  title: string;
  /*
        value is a string that is displayed as the value of the quick filter.
  */
  value: string;
  /*
        trailing is a React node that is displayed after the quick filter.
  */
  trailing?: React.ReactNode;
} & TestID &
  BladeCommonEvents &
  DataAnalyticsAttribute;

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
  /*
   onChange is a function that is called when the selected quick filter changes.
   it returns an object with the name of the quick filter group and the values of the selected quick filters.
*/
  onChange?: ({ name, values }: { name: string; values: string[] }) => void;
  /*
     selectionType is a string that can be either 'single' or 'multiple'.
*/
  selectionType: 'single' | 'multiple';
  /*
       children is an array of QuickFilter components.
*/
  children: React.ReactNode;
};

type QuickFilterGroupProps = QuickFilterGroupCommomProps & TestID & DataAnalyticsAttribute;

type QuickFilterContentProps = Pick<QuickFilterProps, 'trailing' | 'value' | 'title'> &
  Pick<QuickFilterGroupCommomProps, 'selectionType'> &
  TestID &
  DataAnalyticsAttribute & {
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

export type {
  State,
  QuickFilterGroupProps,
  QuickFilterProps,
  QuickFilterContentProps,
  QuickFilterGroupContextType,
  QuickFilterWrapperProps,
  QuickFilterGroupCommomProps,
};
