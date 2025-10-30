# Pagination

Pagination is a navigation component that allows users to navigate through multiple pages of content. It provides page number navigation, page size selection, and direct page jumping capabilities. This component is designed to be independent and reusable across different contexts, not just tables.

## Design

- [Figma - Pagination](https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=75154-262065&m=dev)

## API

Overall structure showing the main usage pattern:

```jsx
import { Pagination } from '@razorpay/blade/components';

<Pagination
  totalPages={1000}
  currentPage={1}
  onPageChange={({ page }) => setCurrentPage(page)}
  showPageNumberSelector
/>;
```

### Props

#### Pagination

```typescript
type PaginationProps = {
  /**
   * Total pages in the pagination
   */
  totalPages: number;

  /**
   * Current active page (1-indexed)
   * @default 1
   */
  currentPage?: number;

  /**
   * Callback fired when the page is changed
   */
  onPageChange?: ({ page }: { page: number }) => void;

  /**
   * Whether to show the page number selector buttons
   * @default false
   */
  showPageNumberSelector?: boolean;

} & DataAnalyticsAttribute;
```

## Examples

### Basic Usage

Simple pagination with default settings:

```jsx
<Pagination totalPages={100} currentPage={0} onPageChange={({ page }) => setCurrentPage(page)} />
```

### Advanced Usage

Full-featured pagination with all controls:

```jsx
<Pagination
  totalPages={1000}
  currentPage={5}
  onPageChange={({ page }) => setCurrentPage(page)}
  showPageNumberSelector
/>
```


### Compact Pagination

Minimal pagination for space-constrained layouts:

```jsx
<Pagination
  totalPages={50}
  currentPage={2}
  onPageChange={({ page }) => setCurrentPage(page)}
  showPageNumberSelector={true}
/>
```

### Disabled State

Pagination in disabled state:

```jsx
<Pagination
  totalItems={100}
  currentPage={0}
  onPageChange={({ page }) => setCurrentPage(page)}
  isDisabled
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
