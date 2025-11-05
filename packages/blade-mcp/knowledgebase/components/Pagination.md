## Component Name

Pagination

## Description

Pagination is a navigation component that allows users to navigate through multiple pages of content. It provides page number navigation buttons, page size selection, and direct page jumping capabilities with ellipsis for large page ranges. The component supports both controlled and uncontrolled modes for page and page size state management, making it flexible for various use cases. It automatically calculates total pages from item count when needed and adapts its UI for mobile devices by hiding certain features.

## Important Constraints

- Pages are 0-indexed (0 is the first page, 1 is the second page, etc.)
- Either `totalPages` or `totalItemCount` must be provided (or both, but `totalPages` takes precedence over calculation)
- `defaultPageSize` can only be one of: `10`, `25`, or `50`
- When both `currentPage` and `defaultCurrentPage` are provided, `currentPage` takes precedence (controlled mode)
- When both `currentPageSize` and `defaultPageSize` are provided, `currentPageSize` takes precedence (controlled mode)
- `showPageSizePicker`, `showPageNumberSelector`, and `showLabel` are always hidden on mobile devices
- `showPageNumberSelector` only displays when `totalPages > 1`
- Page size picker options are limited to 10, 25, or 50 items per page

## TypeScript Types

The following types represent the props that the Pagination component accepts. These types allow you to properly configure pagination according to your needs.

```typescript
type DataAnalyticsKey = `data-analytics-${string}`;

type DataAnalyticsAttribute = {
  [key: DataAnalyticsKey]: string;
};

type PaginationCommonProps = {
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

type PaginationProps = PaginationCommonProps & {
  /**
   * The label to be shown in the page size picker.
   * @default 'items / page'
   */
  pageSizeLabel?: string;
};
```

## Example

### Basic Pagination with All Features

This example demonstrates a fully controlled pagination component with all features enabled including page navigation, page size selection, page number selector, and custom label. It shows how to handle controlled state for both page and page size, with proper event handlers and accessibility considerations.

```typescript
import { Pagination } from '@razorpay/blade/components';
import { useState } from 'react';

function PaginationExample() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Pagination
      totalPages={100}
      currentPage={currentPage}
      currentPageSize={pageSize}
      onPageChange={({ page }) => setCurrentPage(page)}
      onPageSizeChange={({ pageSize }) => setPageSize(pageSize)}
      showPageSizePicker
      showPageNumberSelector
      showLabel
      pageSizeLabel="items / page"
      isDisabled={false}
    />
  );
}
```