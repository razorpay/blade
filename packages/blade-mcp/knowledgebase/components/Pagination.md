## Component Name

Pagination

## Description

Pagination is a navigation component that allows users to navigate through multiple pages of content. It provides page number navigation buttons, page size selection dropdown, and direct page jumping capabilities with ellipsis for large page ranges. The component supports both controlled and uncontrolled modes for page and page size state management, and automatically adapts its UI for mobile devices by hiding certain features like page size picker, page number selector, and labels.

## Important Constraints

- Pages are 1-indexed externally (1 is the first page, 2 is the second page, etc.) - the `selectedPage` and `defaultSelectedPage` props use 1-based indexing
- `pageSize` can only be one of: `10`, `25`, or `50`
- `defaultPageSize` can only be one of: `10`, `25`, or `50`
- When both `selectedPage` and `defaultSelectedPage` are provided, `selectedPage` takes precedence (controlled mode)
- When both `pageSize` and `defaultPageSize` are provided, `pageSize` takes precedence (controlled mode)
- `showPageSizePicker`, `showPageNumberSelector`, and `showLabel` are always hidden on mobile devices
- `showPageNumberSelector` only displays when `totalPages > 1`
- If `totalPages` is not provided, the component defaults to 1 total page

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

### Controlled Pagination with All Features

This example demonstrates a fully controlled pagination component with all features enabled including page navigation, page size selection, page number selector with ellipsis for large page ranges, and custom label. It shows how to handle controlled state for both page and page size, with proper event handlers and accessibility considerations.

```typescript
import { Pagination } from '@razorpay/blade/components';
import { useState } from 'react';

function ControlledPaginationExample() {
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 25 | 50>(10);
  const totalItems = 1000;
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <Pagination
      totalPages={totalPages}
      selectedPage={selectedPage}
      pageSize={pageSize}
      onSelectedPageChange={({ page }) => setSelectedPage(page)}
      onPageSizeChange={({ pageSize }) => setPageSize(pageSize as 10 | 25 | 50)}
      showPageSizePicker
      showPageNumberSelector
      showLabel
      label={`Showing ${(selectedPage - 1) * pageSize + 1}-${Math.min(
        selectedPage * pageSize,
        totalItems,
      )} of ${totalItems} items`}
      pageSizeLabel="items / page"
      isDisabled={false}
    />
  );
}
```
