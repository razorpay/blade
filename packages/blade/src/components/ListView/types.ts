import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { BoxProps } from '~components/Box';

type ListViewCommonProps = {
  children: React.ReactNode;
};

type ListViewProps = ListViewCommonProps & TestID & DataAnalyticsAttribute;

type ListViewFilterProps = {
  children?: React.ReactNode;
  /**
   * Quick Filters Component
   */
  quickFilters: React.ReactNode;
  /**
   * Search value for search input
   */
  searchValue?: string;
  /**
   * Placeholder for search input
   */
  searchValuePlaceholder?: string;
  /**
   * Name for search input
   */
  searchName?: string;
  /**
   * onChange handler for search input
   */
  onSearchChange?: ({ name, value }: { name?: string; value?: string }) => void;
  /**
   *  onClear handler for search input
   */
  onSearchClear?: () => void;
  /**
   * it will show/hide the quick filters
   */
  showQuickFilters?: boolean;
  /**
   * onChange handler for showQuickFilters
   */
  onShowQuickFiltersChange?: (showQuickFilters: boolean) => void;
  /**
   * onChange handler for showQuickFilters
   * @default 0
   * you only need this if quick filters are controlled.
   */
  selectedFiltersCount?: number;
  /**
   * searchTrailing : trailing element for search input
   */
  searchTrailing?: React.ReactNode;
  /**
   * searchWidth : width of search input
   */
  searchContainerWidth?: BoxProps['width'];
  /**
   * showSearchButton : show search button in search input
   */
  showSearchButton?: boolean;

} & TestID &
  DataAnalyticsAttribute;

type ListViewSelectedFiltersType = {
  [key: string]: string[] | string | number[];
};

type ListViewContextType = {
  /**
   *  Number of Selected Filters
   */
  selectedFiltersCount: number;
  /**
   *  Selected Filters
   */
  listViewSelectedFilters: ListViewSelectedFiltersType;
  /**
   *  Selected Filters
   */
  setListViewSelectedFilters: React.Dispatch<React.SetStateAction<ListViewSelectedFiltersType>>;
};
export type {
  ListViewContextType,
  ListViewProps,
  ListViewFilterProps,
  ListViewSelectedFiltersType,
};
