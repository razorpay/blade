import type React from 'react';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

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
   * @deprecated Use `actions` prop instead. This will be removed in a future major version.
   */
  searchValue?: string;
  /**
   * Placeholder for search input
   * @deprecated Use `actions` prop instead. This will be removed in a future major version.
   */
  searchValuePlaceholder?: string;
  /**
   * Name for search input
   * @deprecated Use `actions` prop instead. This will be removed in a future major version.
   */
  searchName?: string;
  /**
   * onChange handler for search input
   * @deprecated Use `actions` prop instead. This will be removed in a future major version.
   */
  onSearchChange?: ({ name, value }: { name?: string; value?: string }) => void;
  /**
   *  onClear handler for search input
   * @deprecated Use `actions` prop instead. This will be removed in a future major version.
   */
  onSearchClear?: () => void;
  /**
   * it will show/hide the quick filters
   * @deprecated use showFilters instead
   */
  showQuickFilters?: boolean;
  /**
   * it will show/hide the filters
   * @deprecated Filters are now always expanded.
   * @default true
   */
  showFilters?: boolean;
  /**
   * onChange handler for showQuickFilters
   * @deprecated use onShowFiltersChange instead
   */
  onShowQuickFiltersChange?: (showQuickFilters: boolean) => void;
  /**
   * onChange handler for showFilters
   * @deprecated Filters are now always expanded.
   */
  onShowFiltersChange?: (showFilters: boolean) => void;
  /**
   *
   * @default 0
   * you only need this if quick filters are controlled.
   */
  selectedFiltersCount?: number;
  /**
   * searchTrailing : trailing element for search input
   * @deprecated Use `actions` prop instead. This will be removed in a future major version.
   */
  searchTrailing?: React.ReactNode;
  /**
   * Actions slot for search input and action buttons
   * This will replace searchValue, onSearchChange, onSearchClear, searchValuePlaceholder, searchName, searchTrailing, and actionButtonGroup in a future major version.
   */
  actions?: React.ReactNode;
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
