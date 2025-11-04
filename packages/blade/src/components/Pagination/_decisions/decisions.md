# Pagination

Pagination is a navigation component that allows users to navigate through multiple pages of content. It provides page number navigation, page size selection, and direct page jumping capabilities. This component is designed to be independent and reusable across different contexts, not just tables.

**Architecture**: The `Pagination` component is a fully-featured component with all pagination capabilities (page navigation, page size selection, labels, etc.). `TablePagination` is a wrapper component that uses `Pagination` internally and adds table-specific integrations (table context, paginationType for client/server modes).

## Design

- [Figma - Pagination](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=75154-262065&m=dev)

## API

### Pagination Component

The `Pagination` component is a fully-featured component that handles all pagination functionality including page navigation, page size selection, and labels. This component can be used standalone or composed within `TablePagination`.

Overall structure showing the main usage pattern:

```jsx
import { Pagination } from '@razorpay/blade/components';

<Pagination
  totalPages={1000}
  currentPage={1}
  onPageChange={({ page }) => setCurrentPage(page)}
  showPageNumberSelector
  showPageSizePicker
/>;
```

### Props

#### Pagination

```typescript
type PaginationCommonProps = {
  /**
   * Total pages in the pagination.
   * If not provided, will be calculated from totalItemCount and currentPageSize.
   * When provided, takes precedence over totalItemCount calculation.
   */
  totalPages?: number;

  /**


  /**
   * Current active page (1-indexed).
   * When provided, the component is controlled.
   * When not provided, the component is uncontrolled and manages its own state.
   * @default undefined (uncontrolled)
   */
  currentPage?: number;

  /**
   * Default page when uncontrolled.
   * Only used when currentPage is not provided.
   * @default 1
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

type PaginationProps = PaginationCommonProps;
```

#### Controlled vs Uncontrolled Behavior

**Page Control:**
- **Controlled**: Pass `currentPage` prop. Component will not update page internally; you must handle page changes via `onPageChange`.
- **Uncontrolled**: Omit `currentPage` prop. Component manages page state internally. Use `defaultCurrentPage` to set initial page.

**Page Size Control:**
- **Controlled**: Pass `currentPageSize` prop. Component will not update page size internally; you must handle page size changes via `onPageSizeChange`.
- **Uncontrolled**: Omit `currentPageSize` prop. Component manages page size internally using `defaultPageSize`.

**Examples:**

```jsx
// Controlled: Both page and page size are controlled
<Pagination
  totalPages={100}
  currentPage={page}
  currentPageSize={pageSize}
  onPageChange={({ page }) => setPage(page)}
  onPageSizeChange={({ pageSize }) => setPageSize(pageSize)}
/>

// Uncontrolled: Component manages its own state
<Pagination
  totalPages={100}
  defaultCurrentPage={0}
  defaultPageSize={10}
  onPageChange={({ page }) => console.log('Page changed:', page)}
/>

// Mixed: Page is controlled, page size is uncontrolled
<Pagination
  totalPages={100}
  currentPage={page}
  onPageChange={({ page }) => setPage(page)}
  defaultPageSize={10}
/>
```

### TablePagination Component (Wrapper Component)

`TablePagination` is a wrapper component that uses `Pagination` internally. It adds table-specific integrations:
- Automatic integration with Table context for `totalItemCount` calculation
- `paginationType` prop to distinguish between client-side and server-side pagination
- Table-specific label defaults

All props from `Pagination` are passed through to the internal `Pagination` component. `TablePagination` adds table-specific behavior on top.

#### Props

```typescript
type TablePaginationType = 'client' | 'server';

type TablePaginationServerProps = PaginationCommonProps & {
  /**
   * Whether the pagination is happening on client or server.
   * If the pagination is happening on `client`, the Table component will **divide the data into pages** and show the pages based on the page size.
   * If the pagination is happening on `server`, the Table component will **not divide the data into pages and will show all the data**. You will have to fetch data for each page as the page changes and pass it to the Table component.
   * When paginationType is `server`, the `onPageChange` & `totalItemCount` props are required.
   * @default 'client'
   */
  paginationType?: Extract<TablePaginationType, 'server'>;

  /**
   * The total number of possible items in the table. This is used to calculate the total number of pages when pagination is happening on server and not all the data is fetched at once.
   * Only used if totalPages is not provided.
   * When used within Table context, this may be automatically derived from table data.
   */
  totalItemCount: number;

  /**
   * Callback function that is called when the page is changed.
   * The page parameter is 0-indexed.
   * Required when paginationType is 'server'.
   */
  onPageChange: ({ page }: { page: number }) => void;
};

type TablePaginationClientProps = PaginationCommonProps & {
  /**
   * Whether the pagination is happening on client or server.
   * If the pagination is happening on `client`, the Table component will **divide the data into pages** and show the pages based on the page size.
   * If the pagination is happening on `server`, the Table component will **not divide the data into pages and will show all the data**. You will have to fetch data for each page as the page changes and pass it to the Table component.
   * When paginationType is `server`, the `onPageChange` & `totalItemCount` props are required.
   * @default 'client'
   */
  paginationType?: Extract<TablePaginationType, 'client'>;

  /**
   * The total number of possible items in the table. This is used to calculate the total number of pages when pagination is happening on server and not all the data is fetched at once.
   * Only used if totalPages is not provided.
   * When used within Table context, this may be automatically derived from table data.
   */
  totalItemCount?: number;

  /**
   * Callback function that is called when the page is changed.
   * The page parameter is 0-indexed.
   */
  onPageChange?: ({ page }: { page: number }) => void;
};

type TablePaginationProps = PaginationCommonProps &
  (TablePaginationServerProps | TablePaginationClientProps);
```

#### Usage Notes

- **All `Pagination` props are supported**: `TablePagination` accepts all props from `Pagination` and passes them through.
- **Table Context Integration**: When used within a `Table` component, `totalItemCount` may be automatically derived from the table's data if not explicitly provided.
- **Controlled/Uncontrolled**: Supports the same controlled/uncontrolled patterns as `Pagination` for both `currentPage` and `currentPageSize`.
- **Page Indexing**: Uses 0-indexed pages internally (page 0 is the first page).

## Component Architecture

### Relationship Between Components

The `Pagination` component is a **fully-featured standalone component** that contains all pagination functionality:
- Page navigation (previous/next buttons, page number selector, ellipsis handling)
- Page size selection (rows per page picker)
- Labels showing current range
- Controlled and uncontrolled behavior
- All features are available in both components

The `TablePagination` component is a **wrapper component** that:
1. **Uses `Pagination` internally** - All props are passed through to `Pagination`
2. **Adds table-specific integrations**:
   - Automatic integration with Table context for `totalItemCount` calculation
   - `paginationType` prop to distinguish client-side vs server-side pagination
   - Table-specific label defaults

### Implementation Strategy

```
┌─────────────────────────────────────┐
│      TablePagination                │
│  (Wrapper - adds table integrations)│
│  ┌──────────────────────────────┐   │
│  │   Pagination Component       │   │
│  │   (all features included)   │   │
│  │   - Page navigation          │   │
│  │   - Page size picker         │   │
│  │   - Labels                  │   │
│  │   - Controlled/Uncontrolled │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Key Points:**
- `Pagination` has **all the same props** as `TablePagination` (minus table-specific ones like `paginationType`)
- `TablePagination` is a **thin wrapper** that uses `Pagination` internally
- Both components support **controlled and uncontrolled** behavior
- Both components have **all features** (page size picker, labels, etc.)

### When to Use Which Component

**Use `Pagination` when:**
- You need pagination outside of a table context
- You want full control over pagination behavior
- You don't need table-specific integrations
- You want to use pagination in any context (not just tables)

**Use `TablePagination` when:**
- You're working with a Table component
- You want automatic integration with Table context
- You need to distinguish between client-side and server-side pagination modes
- You want table-specific default labels and behavior

## Examples

### Pagination Component Examples

#### Basic Usage (Uncontrolled)

Simple pagination with default settings, component manages its own state:

```jsx
<Pagination 
  totalPages={100}
  defaultCurrentPage={0}
  onPageChange={({ page }) => console.log('Page changed:', page)} 
/>
```

#### Controlled Usage

Fully controlled pagination:

```jsx
<Pagination 
  totalPages={100} 
  currentPage={page}
  currentPageSize={pageSize}
  onPageChange={({ page }) => setPage(page)}
  onPageSizeChange={({ pageSize }) => setPageSize(pageSize)}
  showPageSizePicker
  showPageNumberSelector
/>
```

#### Advanced Usage with All Features

Full-featured pagination with all controls:

```jsx
<Pagination
  totalPages={1000}
  currentPage={5}
  onPageChange={({ page }) => setCurrentPage(page)}
  defaultPageSize={25}
  showPageSizePicker
  showPageNumberSelector
  showLabel
  label="Showing 126-150 of 1000 items"
/>
```

#### Using totalItemCount (Automatic Calculation)

Pagination with automatic totalPages calculation:

```jsx
<Pagination
  totalItemCount={1000}
  currentPage={0}
  onPageChange={({ page }) => setCurrentPage(page)}
  defaultPageSize={10}
  // totalPages will be calculated as Math.ceil(1000 / 10) = 100
/>
```

#### Mixed Controlled/Uncontrolled

Page is controlled, page size is uncontrolled:

```jsx
<Pagination
  totalPages={100}
  currentPage={page}
  onPageChange={({ page }) => setPage(page)}
  defaultPageSize={10}
  showPageSizePicker
  // Page size is managed internally
/>
```

#### Disabled State

Pagination in disabled state:

```jsx
<Pagination
  totalPages={100}
  currentPage={0}
  onPageChange={({ page }) => setCurrentPage(page)}
  isDisabled
/>
```

### TablePagination Component Examples

#### Basic Usage (Uncontrolled)

Using TablePagination with table context, component manages its own state:

```jsx
<Table
  data={tableData}
  pagination={
    <TablePagination
      defaultPageSize={10}
      showPageSizePicker
      showPageNumberSelector
    />
  }
>
  {/* Table content */}
</Table>
```

#### Controlled Usage

Fully controlled TablePagination:

```jsx
<TablePagination
  totalPages={50}
  currentPage={page}
  currentPageSize={pageSize}
  onPageChange={({ page }) => setPage(page)}
  onPageSizeChange={({ pageSize }) => setPageSize(pageSize)}
  showPageSizePicker
  showPageNumberSelector
/>
```

#### Client-Side Pagination (with totalItemCount)

Using TablePagination with totalItemCount for automatic calculation:

```jsx
<TablePagination
  paginationType="client"
  totalItemCount={1000}
  currentPage={0}
  onPageChange={({ page }) => setCurrentPage(page)}
  defaultPageSize={25}
  showPageSizePicker
  showPageNumberSelector
  showLabel
/>
```

#### Server-Side Pagination

Using TablePagination for server-side pagination:

```jsx
<TablePagination
  paginationType="server"
  totalItemCount={5000}
  totalPages={500} // Optional: can be calculated from totalItemCount
  currentPage={0}
  onPageChange={({ page }) => {
    // Fetch data for the new page
    fetchPageData(page);
    setCurrentPage(page);
  }}
  defaultPageSize={10}
  showPageSizePicker
  showPageNumberSelector
  showLabel
  label="Showing 1-10 of 5000 items"
/>
```

#### Using totalPages in TablePagination (Precedence)

When both totalPages and totalItemCount are provided, totalPages takes precedence:

```jsx
<TablePagination
  totalPages={100} // This will be used, ignoring totalItemCount calculation
  totalItemCount={1000} // Ignored when totalPages is provided
  currentPage={0}
  onPageChange={({ page }) => setCurrentPage(page)}
  defaultPageSize={10}
/>
```

#### Mixed Controlled/Uncontrolled

Page is controlled, page size is uncontrolled:

```jsx
<TablePagination
  totalPages={100}
  currentPage={page}
  onPageChange={({ page }) => setPage(page)}
  defaultPageSize={10}
  showPageSizePicker
  // Page size is managed internally by TablePagination
/>
```

## Accessibility

- **Keyboard Navigation**: All interactive elements (buttons, inputs) are keyboard accessible
- **ARIA Labels**: Proper ARIA labels and roles for screen readers
- **Focus Management**: Logical tab order through pagination controls
- **Screen Reader Support**: Clear announcements for page changes and current page state
- **High Contrast**: Support for high contrast mode
- **Page Announcements**: Screen readers announce page changes and current page information

## Open Questions

- **Mobile Behavior**: Should page number selector be hidden on mobile by default, or should we have a different mobile-specific layout?
