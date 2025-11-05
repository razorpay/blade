import type { DataAnalyticsAttribute } from '~utils/types';

/**
 * Common props for Pagination component
 */
export type PaginationCommonProps = {
  /**
   * Total pages in the pagination.
   * If not provided, will be calculated from totalItemCount and currentPageSize.
   * When provided, takes precedence over totalItemCount calculation.
   */
  totalPages?: number;

  /**
   * Total number of items. Used to calculate totalPages when totalPages is not provided.
   * Calculation: Math.ceil(totalItemCount / currentPageSize)
   * Only used if totalPages is not provided.
   */
  totalItemCount?: number;

  /**
   * Current active page (0-indexed, where 0 is the first page).
   * When provided, the component is controlled.
   * When not provided, the component is uncontrolled and manages its own state.
   * @default undefined (uncontrolled)
   */
  currentPage?: number;

  /**
   * Default page when uncontrolled (0-indexed, where 0 is the first page).
   * Only used when currentPage is not provided.
   * @default 0
   */
  defaultCurrentPage?: number;

  /**
   * Callback fired when the page is changed.
   * The page parameter is 0-indexed.
   */
  onPageChange?: ({ page }: { page: number }) => void;

  /**
   * The default page size.
   * Page size controls how items are shown per page.
   * @default 10
   */
  defaultPageSize?: 10 | 25 | 50;

  /**
   * Current page size when controlled.
   * When provided, the page size is controlled.
   * When not provided, the component manages page size internally.
   * @default undefined (uncontrolled)
   */
  currentPageSize?: number;

  /**
   * Callback function that is called when the page size is changed.
   */
  onPageSizeChange?: ({ pageSize }: { pageSize: number }) => void;

  /**
   * Whether to show the page size picker. It will be always hidden on mobile.
   * Page size picker controls how items are shown per page.
   * @default false
   */
  showPageSizePicker?: boolean;

  /**
   * Whether to show the page number selector. It will be always hidden on mobile.
   * Page number selectors is a group of buttons that allows the user to jump to a specific page.
   * @default false
   */
  showPageNumberSelector?: boolean;

  /**
   * Content of the label to be shown in the pagination component.
   * If not provided, a default label will be shown based on current page and page size.
   */
  label?: string;

  /**
   * Whether to show the label. It will be always hidden on mobile.
   * @default false
   */
  showLabel?: boolean;

  /**
   * Whether the pagination component is disabled.
   * @default false
   */
  isDisabled?: boolean;
} & DataAnalyticsAttribute;

export type PaginationProps = PaginationCommonProps & {
  /**
   * The label to be shown in the page size picker.
   * @default 'items / page'
   */
  pageSizeLabel?: string;
};
