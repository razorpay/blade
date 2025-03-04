import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type ListViewCommonProps = {
  children: React.ReactNode;
};

type ListViewProps = ListViewCommonProps & TestID & DataAnalyticsAttribute & ListViewCommonProps;

type FilterChipGroupProps = TestID &
  DataAnalyticsAttribute & {
    children: React.ReactNode;
    onClearButtonClick: () => void;
    clearButtonText: string;
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
  ListViewCommonProps & {
    numberOfSelectedFilters: number;
  };
export type { ListViewProps, ListViewFilterProps, FilterChipGroupProps };
