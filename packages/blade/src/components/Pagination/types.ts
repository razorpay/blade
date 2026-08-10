import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';

/**
 * Common props for Pagination component
 */
export type PaginationProps = {
  /**
   * Total pages in the pagination.
   */
  totalPages?: number;

  /**
   * Current active page (1-indexed).
   * When provided, the component is controlled.
   * When not provided, the component is uncontrolled and manages its own state.
   * @default undefined (uncontrolled)
   */
  selectedPage?: number;

  /**
   * Default page when uncontrolled (1-indexed, where 1 is the first page).
   * Only used when selectedPage is not provided.
   * @default 1
   */
  defaultSelectedPage?: number;

  /**
   * Callback fired when the page is changed.
   * The page parameter is 1-indexed.
   */
  onSelectedPageChange?: ({ page }: { page: number }) => void;

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
   * @default 10
   */
  pageSize?: 10 | 25 | 50;

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

  /**
   * The label to be shown in the page size picker.
   * @default 'items / page'
   */
  pageSizeLabel?: string;

  /**
   * Total number of items being paginated.
   * When provided, the pagination hides itself entirely if all the items already fit
   * on a single page at the smallest available page size.
   *
   * When `totalPages` is not explicitly provided, the page count is derived from this
   * value (`Math.ceil(totalItemCount / pageSize)`) so the two props stay consistent.
   * If you provide both, keep them consistent: `totalItemCount` drives the hide
   * decision while `totalPages` drives navigation.
   */
  totalItemCount?: number;

  /**
   * Whether to always render the pagination even when all items fit on a single page.
   * By default the pagination hides itself when there is nothing to navigate or pick,
   * which is a behaviour change from the previous always-render behaviour.
   *
   * Set this to `true` when rows load asynchronously or filters change the row count,
   * so the footer does not appear and disappear and shift the layout. It also lets
   * existing surfaces opt back in to the old always-render behaviour.
   * @default false
   */
  showOnSinglePage?: boolean;
} & DataAnalyticsAttribute &
  TestID &
  StyledPropsBlade;
