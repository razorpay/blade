import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type ListViewCommonProps = {
  children: React.ReactNode;
};

type ListViewProps = ListViewCommonProps & TestID & DataAnalyticsAttribute;

type FilterChipGroupProps = TestID &
  DataAnalyticsAttribute & {
    children: React.ReactNode;
    /**
     * Callback which is called when clear button is clicked
     */
    onClearButtonClick: () => void;
    /**
     * Title of clear button
     */
    clearButtonText: string;
    /**
     * Boolean to decide if we should show clear button or not
     */
    showClearButton?: boolean;
  };

type ListViewFiltersCommonProps = {
  children: React.ReactNode;
  quickFilters: React.ReactNode;
  onSearchChange: (value: string) => void;
};

type ListViewFilterProps = ListViewFiltersCommonProps &
  TestID &
  DataAnalyticsAttribute &
  ListViewCommonProps;

type ListViewContextType = {
  /**
   *  Number of Selected Filters
   */
  setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  clearFiltersCallbackTriggerer: number;
  setClearFiltersCallbackTriggerer: React.Dispatch<React.SetStateAction<number>>;
};
export type { ListViewContextType, ListViewProps, ListViewFilterProps, FilterChipGroupProps };
