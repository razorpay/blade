import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type ListViewCommonProps = {
  children: React.ReactNode;
};

type ListViewProps = ListViewCommonProps & TestID & DataAnalyticsAttribute & ListViewCommonProps;

type FilterChipProps = TestID &
  DataAnalyticsAttribute & {
    children: React.ReactNode;
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
export type { ListViewProps, ListViewFilterProps, FilterChipProps };
