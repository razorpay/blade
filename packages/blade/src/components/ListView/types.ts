import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type ListViewCommonProps = {
  children: React.ReactNode;
};

type ListViewProps = ListViewCommonProps & TestID & DataAnalyticsAttribute & ListViewCommonProps;

type ListViewFiltersCommonProps = {
  children: React.ReactNode;
  quickFilter: React.ReactNode;
  onSearchChange: (value: string) => void;
};

type ListViewFilterProps = ListViewFiltersCommonProps &
  TestID &
  DataAnalyticsAttribute &
  ListViewCommonProps;
export type { ListViewProps, ListViewFilterProps };
