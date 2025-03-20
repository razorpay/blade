import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type ListViewCommonProps = {
  children: React.ReactNode;
};

type ListViewProps = ListViewCommonProps & TestID & DataAnalyticsAttribute;

type ListViewFilterProps = {
  children: React.ReactNode;
  quickFilters: React.ReactNode;
  searchValue?: string;
  searchValuePlaceholder?: string;
  searchName?: string;
  onSearchChange?: ({ name, value }: { name?: string; value?: string }) => void;
  showQuickFilters?: boolean;
  onShowQuickFiltersChange?: (showQuickFilters: boolean) => void;
} & TestID &
  DataAnalyticsAttribute &
  ListViewCommonProps;

type ListViewContextType = {
  /**
   *  Number of Selected Filters
   */
  listViewSelectedFilters: string[];
  setListViewSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
};
export type { ListViewContextType, ListViewProps, ListViewFilterProps };
