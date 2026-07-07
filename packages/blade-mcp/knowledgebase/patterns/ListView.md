# ListView

## Description

ListView is a comprehensive data presentation pattern that combines tables with advanced filtering, searching, and data management capabilities. It provides a complete solution for displaying large datasets with interactive filters including quick filters, search functionality, date range selection, and dropdown filters. This pattern is ideal for dashboards, admin panels, and any interface that needs to display and filter tabular data efficiently with a consistent user experience.

## Components Used

- ListView
- Table
- QuickFilter
- Dropdown
- ActionList
- Counter
- Badge
- Button
- IconButton
- Code
- Amount
- Box
- SearchInput
- ButtonGroup
- Tooltip

## How to Use

The pattern is assembled in two steps:

1. **Create a Table** — Build your data table using the Blade `Table` component.
2. **Place the Table in the List View template** — Drop the table into the `Table` slot inside the `ListView` component, replacing the placeholder.

**Key rules:**
- Quick filters and All Filters are always visible in a List View.
- Search inputs and action buttons are optional — include them only when the use case requires them.

## Desktop Layout

**Canvas:** 1280 × 800px

```
┌─ Top Navigation (56px) ───────────────────────────────────────────────────┤
│  [Logo] [Option] [Option] [Option] [Option]    [Search] [🔔] [⚙] [RK]   │
├─ Side Navigation (240px) ─┬─ Content Area (968px) ────────────────────────┤
│  • Home                   │  Page Title                    Link 2 | Link 1│
│  ◉ Transactions           │  ──────────────────────────────── [+ Button]  │
│  • Settlements            │  [Payments tab] [Orders tab]                  │
│  • Reports                │                                               │
│  ─ PAYMENTS PRODUCTS ─    │  ┌─ List View Card ──────────────────────────┐│
│  • Payment Link           │  │ Quick Filters         [Search] [🔍 Button] ││
│  • Affordability          │  │ Filter chips (Parameter ˅) × N            ││
│  • QR code                │  │                                            ││
│  +13 more                 │  │ ┌─ Table Slot ───────────────────────────┐ ││
│  ─ BANKING PRODUCTS ─     │  │ │  Replace with Blade Table component    │ ││
│  • Line of Credit         │  │ └────────────────────────────────────────┘ ││
│  ─────────────────        │  │                                            ││
│  ⊙ Test Mode  ○           │  │ Footer: Showing 10 of 240 [Items]          ││
│  • Settings               │  │         [10 ˅] rows/page  [‹] [›]         ││
└───────────────────────────┴──┴────────────────────────────────────────────┘┘
```

### Top Navigation

| Element | Details |
|---|---|
| **Blade Component** | `TopNavigation` |
| **Logo** | Razorpay wordmark (left-aligned) |
| **Tab Nav** | Multiple tab items; active tab has white underline bar with glow effect |
| **Search Input** | Placeholder: "Search in payments"; 180px wide; dark theme |
| **Icon Buttons** | 2× icon buttons (notification / settings); 32×32px |
| **Avatar** | Initials-based Avatar; 28px diameter, rounded |

### Side Navigation

| Element | Details |
|---|---|
| **Blade Component** | `SideNavigation` |
| **Width** | 240px |
| **Background** | `surface.background.gray.moderate` (#f8f8f8) |
| **Active item** | `interactive.background.primary.faded` (blue tint), blue text |
| **Section headers** | Small caps labels: "PAYMENTS PRODUCTS", "BANKING PRODUCTS" |
| **Footer** | Test Mode toggle (Switch) + Settings |

### Content Area Header

| Element | Details |
|---|---|
| **Page Title** | `Heading/XLargeSemibold` · TASA Orbiter Display SemiBold · 32px · `surface.text.gray.normal` |
| **Action group** | Right-aligned; contains Link 2 + vertical Divider + Link 1 + primary Button |
| **Tabs** | Active tab: bold underline; `surface.border.gray.muted` bottom border |

### Filter Group

| Element | Variant | Notes |
|---|---|---|
| **Quick Filters** | Selected (highlighted bg) / Default | Each filter shows label + Counter badge |
| **Search Input** | Joined left side; right-side search Button | Placeholder: "Column Data" |
| **Filter Panel** | Up to N filter chips | Chips use dashed border when active |

### Table

The table body is a **slot** — replace it with your Blade `Table` instance.

| Column type | Recommended Blade usage |
|---|---|
| ID / Code | `Code` component |
| Links | `Link` component (`variant="button" color="primary"`) |
| Monetary values | `Amount` component (right-aligned) |
| Status | `Badge` component |
| 2-line cells | Stacked text (primary + muted) |

**Row height:** 48px | **Header height:** 36px | **Header background:** `surface.background.gray.moderate`

### Table Footer

| Element | Details |
|---|---|
| **"Showing" text** | "Showing 10 of 240 [Items]"; 12px Regular; `surface.text.gray.subtle` |
| **Rows per page** | `SelectInput` (64px wide) |
| **Pagination** | `Pagination` with chevron-left and chevron-right buttons |

## Mobile Layout

**Canvas:** 375 × 812px

```
┌────────────────────────────────────────────────────────┐
│  Transactions                                          │
│  ─────────────────                                     │
│  [Payments] [Orders]                                   │
├────────────────────────────────────────────────────────┤
│  [🔍 Payment ID, Ref ID, etc.         ]  │ [filter ▽] │
├────────────────────────────────────────────────────────┤
│  ⬤ All 320   ○ Captured 300   ○ Failed                 │
├─ Table ────────────────────────────────────────────────┤
│  Payment ID          Bank RRN                          │
│  plink_uin68fdwisk…  8765976350893467                  │
│  ────────────────────────────────────────              │
│  Showing 10 of 240  [10 ˅] rows/page  [‹][›]          │
└────────────────────────────────────────────────────────┘
```

- **Search Input:** 335px wide; leading search icon
- **Filter Button:** Icon-only (`filter` icon); launches All Filters panel
- **Quick Filter Group:** Horizontally arranged `Card` components (elevation=None)
- **Table:** Same Blade Table structure as Desktop; columns scroll horizontally on 375px viewport
- **Header height on mobile:** 48px (vs. 36px on desktop)

## Blade Components Used

| Component | Import Path | Usage |
|---|---|---|
| `Button` | `@razorpay/blade/components` | Action buttons, pagination, search trigger |
| `Link` | `@razorpay/blade/components` | Table cell links, header links |
| `Badge` | `@razorpay/blade/components` | Table Status column |
| `Table` | `@razorpay/blade/components` | Data grid (slotted in) |
| `Tabs` | `@razorpay/blade/components` | Page-level tab navigation |
| `SearchInput` | `@razorpay/blade/components` | Filter search field |
| `SelectInput` | `@razorpay/blade/components` | Rows-per-page selector in footer |
| `SideNavigation` | `@razorpay/blade/components` | Left nav panel (Desktop) |
| `TopNavigation` | `@razorpay/blade/components` | App top bar (Desktop) |
| `Switch` | `@razorpay/blade/components` | Test Mode toggle |
| `Counter` | `@razorpay/blade/components` | Filter count badges |
| `Divider` | `@razorpay/blade/components` | Vertical separator between Search & Filter |
| `Avatar` | `@razorpay/blade/components` | User initials in top nav |
| `Card` | `@razorpay/blade/components` | Quick Filter items (Mobile) |
| `Amount` | `@razorpay/blade/components` | Monetary display with currency symbol |
| `Pagination` | `@razorpay/blade/components` | Footer prev/next navigation |

## Anatomy Summary

```
List View
├── [Desktop only] Top Navigation
│   ├── Logo
│   ├── Tab Navigation
│   └── Right Section (Search, Icon Buttons, Avatar)
├── [Desktop only] Side Navigation
│   ├── Main nav items
│   ├── Section groups (Payments Products, Banking Products)
│   └── Footer (Test Mode switch, Settings)
├── Content Area
│   ├── Page Title + Action Group (Links + Button)
│   ├── Tabs
│   └── List View Card
│       ├── Filter Group
│       │   ├── Quick Filters (horizontal strip)
│       │   ├── Search Input + Search Button  [optional]
│       │   └── Filter Panel (filter chips)   [visible when filters applied]
│       ├── Table [SLOT — replace with Blade Table]
│       └── Table Footer
│           ├── "Showing X of Y [Items]"
│           ├── Rows per page (SelectInput)
│           └── Pagination (prev/next Buttons)
└── [Mobile only] Filter Button (alongside Search Input)
```

## Example

### Basic ListView with Comprehensive Filtering

This example demonstrates a complete ListView implementation with quick filters, search functionality, dropdown filters, date range selection, and table interactions including row selection and hover actions.

```tsx
import React, { useState } from 'react';
import {
  ListView,
  ListViewFilters,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableEditableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
  QuickFilterGroup,
  QuickFilter,
  FilterChipGroup,
  FilterChipSelectInput,
  FilterChipDatePicker,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  Counter,
  Badge,
  Button,
  IconButton,
  Code,
  Amount,
  Box,
  SearchInput,
  ButtonGroup,
  Tooltip,
  CheckIcon,
  CloseIcon,
  Link,
} from '@razorpay/blade/components';
import type { TableData, DatesRangeValue } from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: {
    key: string;
    title: string;
  };
  bank: string;
  account: string;
  name: string;
};

const MethodFilterValues = [
  { key: 'bank-transfer', title: 'Bank Transfer' },
  { key: 'credit-card', title: 'Credit Card' },
  { key: 'paypal', title: 'PayPal' },
];

const nodes: PaymentItem[] = [
  ...Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: MethodFilterValues[Math.floor(Math.random() * 3)],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: ['John Doe', 'Jane Doe', 'Bob Smith', 'Alice Smith'][Math.floor(Math.random() * 4)],
  })),
];

const quickFilters = ['All', 'Pending', 'Failed', 'Completed'];
const filterChipQuickFilters = ['Pending', 'Failed', 'Completed'];

const data: TableData<PaymentItem> = { nodes };

function BasicListViewExample() {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);

  const getQuickFilterValueCount = (value: string): number => {
    if (value === 'All') {
      return data.nodes.length;
    }
    return data.nodes.filter((node) => node.status === value).length;
  };

  const getQuickFilterData = (
    data: TableData<PaymentItem>,
    value?: string,
  ): TableData<PaymentItem> => {
    if (!value || value === 'All') {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.status === value) };
  };

  const getSearchedData = (
    data: TableData<PaymentItem>,
    value?: string,
  ): TableData<PaymentItem> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.paymentId.includes(value)) };
  };

  const getMethodFilterData = (
    data: TableData<PaymentItem>,
    value?: string,
  ): TableData<PaymentItem> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (
    data: TableData<PaymentItem>,
    value?: DatesRangeValue,
  ): TableData<PaymentItem> => {
    if (!value?.[0]) {
      return { nodes: data.nodes };
    }
    return {
      nodes: data.nodes.filter((node) => {
        if (!value?.[0] || !value?.[1]) return false;
        return node.date >= value[0] && node.date <= value[1];
      }),
    };
  };

  const applyAllFilters = (
    quickFilter: string,
    search: string | undefined,
    method: string | undefined,
    dateRange: DatesRangeValue | undefined,
  ) => {
    const quickFilterData = getQuickFilterData(data, quickFilter);
    const searchValueData = getSearchedData(quickFilterData, search);
    const methodFilterData = getMethodFilterData(searchValueData, method);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, dateRange);
    setListViewTableData(dateRangeFilterData);
  };

  const handleSearchChange = (value?: string): void => {
    setSearchValue(value);
    applyAllFilters(selectedQuickFilter, value, methodFilter, filterDateRange);
  };

  const handleSearchClear = (): void => {
    setSearchValue('');
    applyAllFilters(selectedQuickFilter, '', methodFilter, filterDateRange);
  };

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search for Payment ID"
          onChange={({ value }) => handleSearchChange(value)}
          onClearButtonClick={handleSearchClear}
        />
      )}
      <ListView>
        <ListViewFilters
          quickFilters={
            <QuickFilterGroup
              selectionType="single"
              onChange={({ values }) => {
                const value = values[0];
                setSelectedQuickFilter(value);
                applyAllFilters(value, searchValue, methodFilter, filterDateRange);
              }}
              defaultValue="All"
              value={selectedQuickFilter}
            >
              {quickFilters.map((status) => (
                <QuickFilter
                  key={status}
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                />
              ))}
            </QuickFilterGroup>
          }
          selectedFiltersCount={
            (methodFilter ? 1 : 0) +
            (Array.isArray(filterDateRange) && filterDateRange[0] ? 1 : 0) +
            (selectedQuickFilter !== 'All' ? 1 : 0)
          }
          actions={
            !isMobile && (
              <Box width="208px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search for Payment ID"
                  onChange={({ value }) => handleSearchChange(value)}
                  onClearButtonClick={handleSearchClear}
                />
              </Box>
            )
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
              applyAllFilters('All', searchValue, undefined, undefined);
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                value={methodFilter}
                onChange={({ values }) => {
                  const value = values[0];
                  setMethodFilter(value);
                  applyAllFilters(selectedQuickFilter, searchValue, value, filterDateRange);
                }}
                onClearButtonClick={() => {
                  setMethodFilter(undefined);
                  applyAllFilters(selectedQuickFilter, searchValue, undefined, filterDateRange);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method) => (
                    <ActionListItem key={method.key} title={method.title} value={method.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>

            <FilterChipDatePicker
              label="Date Range"
              selectionType="range"
              value={filterDateRange}
              onChange={(value) => {
                const dateRange = Array.isArray(value) ? value : undefined;
                setFilterDateRange(dateRange);
                applyAllFilters(selectedQuickFilter, searchValue, methodFilter, dateRange);
              }}
              onClearButtonClick={() => {
                setFilterDateRange(undefined);
                applyAllFilters(selectedQuickFilter, searchValue, methodFilter, undefined);
              }}
            />

            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const value = values[0] || 'All';
                  setSelectedQuickFilter(value);
                  applyAllFilters(value, searchValue, methodFilter, filterDateRange);
                }}
                onClearButtonClick={() => {
                  setSelectedQuickFilter('All');
                  applyAllFilters('All', searchValue, methodFilter, filterDateRange);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((status) => (
                    <ActionListItem
                      key={status}
                      title={status}
                      value={status}
                      isSelected={selectedQuickFilter === status}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>

        <Table
          data={listViewTableData}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={(selectedItems) => {
            console.log('Selected items:', selectedItems);
          }}
          isFirstColumnSticky
          selectionType="multiple"
          pagination={
            <TablePagination
              onPageChange={console.log}
              defaultPageSize={10}
              onPageSizeChange={console.log}
              showPageSizePicker
              showPageNumberSelector
            />
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                  <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                  <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow
                    key={tableItem.id}
                    item={tableItem}
                    hoverActions={
                      <>
                        <Button
                          variant="tertiary"
                          size="xsmall"
                          onClick={() => console.log('View details:', tableItem.id)}
                        >
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel={`Approve payment ${tableItem.paymentId}`}
                          onClick={() => console.log('Approved:', tableItem.id)}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel={`Reject payment ${tableItem.paymentId}`}
                          onClick={() => console.log('Rejected:', tableItem.id)}
                        />
                      </>
                    }
                    onClick={() => console.log('Row clicked:', tableItem.id)}
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel={`Edit amount for payment ${tableItem.paymentId}`}
                      placeholder="Enter amount"
                      successText="Amount updated successfully"
                      defaultValue={tableItem.amount.toString()}
                    />
                    <TableCell>
                      <Link size="small" color="neutral" target="_blank" href={`/`}>
                        {tableItem.account}
                      </Link>
                    </TableCell>
                    <TableCell>
                      {tableItem.date?.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>{tableItem.method.title}</TableCell>
                    <TableCell>
                      <Badge
                        size="xsmall"
                        color={
                          tableItem.status === 'Completed'
                            ? 'positive'
                            : tableItem.status === 'Pending'
                            ? 'notice'
                            : tableItem.status === 'Failed'
                            ? 'negative'
                            : 'primary'
                        }
                      >
                        {tableItem.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableFooterRow>
                  <TableFooterCell>Total</TableFooterCell>
                  <TableFooterCell>
                    <Amount
                      value={listViewTableData.nodes.reduce((sum, item) => sum + item.amount, 0)}
                    />
                  </TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>{listViewTableData.nodes.length} items</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </Box>
  );
}

export default BasicListViewExample;
```

### Multi-Select Quick Filters with Bulk Actions and Advanced Date Filtering

This comprehensive example shows ListView with multi-select quick filters, bulk operations, action buttons with tooltips, and advanced date range functionality including preset date ranges.

```tsx
import React, { useState } from 'react';
import dayjs from 'dayjs';
import {
  ListView,
  ListViewFilters,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarActions,
  TablePagination,
  QuickFilterGroup,
  QuickFilter,
  FilterChipGroup,
  FilterChipSelectInput,
  FilterChipDatePicker,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  Counter,
  Badge,
  Button,
  IconButton,
  Code,
  Amount,
  Box,
  Link,
  SearchInput,
  ButtonGroup,
  Tooltip,
  MoreVerticalIcon,
  DownloadIcon,
  ShareIcon,
  CopyIcon,
  TrashIcon,
  SelectInput,
} from '@razorpay/blade/components';
import type { TableData, DatesRangeValue, Identifier } from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

// Using the same PaymentItem type and data from previous example
// ... (PaymentItem type, MethodFilterValues, nodes, data definitions)

type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: {
    key: string;
    title: string;
  };
  bank: string;
  account: string;
  name: string;
};

const MethodFilterValues = [
  { key: 'bank-transfer', title: 'Bank Transfer' },
  { key: 'credit-card', title: 'Credit Card' },
  { key: 'paypal', title: 'PayPal' },
];

const nodes: PaymentItem[] = [
  ...Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    label: `Payment ${i + 1}`,
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: MethodFilterValues[Math.floor(Math.random() * 3)],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: ['John Doe', 'Jane Doe', 'Bob Smith', 'Alice Smith'][Math.floor(Math.random() * 4)],
  })),
];

const data: TableData<PaymentItem> = { nodes };

const filterChipQuickFilters = ['Pending', 'Failed', 'Completed'];

function ComprehensiveListViewExample() {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Identifier[]>([]);

  const getQuickFilterValueCount = (value: string): number => {
    if (value === 'All') {
      return data.nodes.length;
    }
    return data.nodes.filter((node) => node.status === value).length;
  };

  const getQuickFilterData = (
    data: TableData<PaymentItem>,
    values?: string[],
  ): TableData<PaymentItem> => {
    if (!values?.length) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => values.includes(node.status)) };
  };

  const getSearchedData = (
    data: TableData<PaymentItem>,
    value?: string,
  ): TableData<PaymentItem> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.paymentId.includes(value)) };
  };

  const getMethodFilterData = (
    data: TableData<PaymentItem>,
    value?: string,
  ): TableData<PaymentItem> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (
    data: TableData<PaymentItem>,
    value?: DatesRangeValue,
  ): TableData<PaymentItem> => {
    if (!value?.[0]) {
      return { nodes: data.nodes };
    }
    return {
      nodes: data.nodes.filter((node) => {
        if (!value?.[0] || !value?.[1]) return false;
        return node.date >= value[0] && node.date <= value[1];
      }),
    };
  };

  const getLastWeekDateRange = (): DatesRangeValue => {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    return [lastWeek, new Date()];
  };

  const compareDateRangeValues = (
    dateRange1: DatesRangeValue,
    dateRange2: DatesRangeValue,
  ): boolean => {
    if (!dateRange1?.[0] || !dateRange2?.[0]) {
      return false;
    }
    return (
      dayjs(dateRange1[0]).isSame(dayjs(dateRange2[0]), 'day') &&
      dayjs(dateRange1[1]).isSame(dayjs(dateRange2[1]), 'day')
    );
  };

  const applyAllFilters = (
    quickFilters: string[],
    search: string | undefined,
    method: string | undefined,
    dateRange: DatesRangeValue | undefined,
  ) => {
    const quickFilterData = getQuickFilterData(data, quickFilters);
    const searchValueData = getSearchedData(quickFilterData, search);
    const methodFilterData = getMethodFilterData(searchValueData, method);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, dateRange);
    setListViewTableData(dateRangeFilterData);
  };

  const handleSearchChange = (value?: string): void => {
    setSearchValue(value);
    applyAllFilters(selectedQuickFilter, value, methodFilter, filterDateRange);
  };

  const handleSearchClear = (): void => {
    setSearchValue('');
    applyAllFilters(selectedQuickFilter, '', methodFilter, filterDateRange);
  };

  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const isMobile = matchedDeviceType === 'mobile';

  return (
    <Box height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search for Payment ID"
          onChange={({ value }) => handleSearchChange(value)}
          onClearButtonClick={handleSearchClear}
        />
      )}
      <ListView>
        <ListViewFilters
          selectedFiltersCount={
            (methodFilter ? 1 : 0) +
            (Array.isArray(filterDateRange) && filterDateRange[0] ? 1 : 0) +
            (selectedQuickFilter.filter((filter) => filter !== 'LastWeek').length !== 0 ? 1 : 0)
          }
          quickFilters={
            <QuickFilterGroup
              selectionType="multiple"
              onChange={({ values }) => {
                const lastWeekDateRange = getLastWeekDateRange();
                const shouldChangeValue = values.includes('LastWeek');

                if (!shouldChangeValue) {
                  const rangeToUse = compareDateRangeValues(lastWeekDateRange, filterDateRange!)
                    ? undefined
                    : filterDateRange;

                  setFilterDateRange(rangeToUse);
                  setSelectedQuickFilter(values.filter((value) => value !== 'LastWeek'));
                  applyAllFilters(
                    values.filter((value) => value !== 'LastWeek'),
                    searchValue,
                    methodFilter,
                    rangeToUse,
                  );
                } else {
                  setFilterDateRange(lastWeekDateRange);
                  setSelectedQuickFilter(values);
                  applyAllFilters(
                    values.filter((value) => value !== 'LastWeek'),
                    searchValue,
                    methodFilter,
                    lastWeekDateRange,
                  );
                }
              }}
              value={selectedQuickFilter}
            >
              {filterChipQuickFilters.map((status) => (
                <QuickFilter
                  key={status}
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                />
              ))}
              <QuickFilter title="Last Week" value="LastWeek" />
            </QuickFilterGroup>
          }
          actions={
            <Box display="flex" gap="spacing.4" alignItems="center">
              {!isMobile && (
                <Box width="280px">
                  <SearchInput
                    label=""
                    value={searchValue}
                    placeholder="Search for Payment ID"
                    onChange={({ value }) => handleSearchChange(value)}
                    onClearButtonClick={handleSearchClear}
                    trailing={
                      <Dropdown selectionType="single">
                        <SelectInput label="" placeholder="Filter by method" labelPosition="top" />
                        <DropdownOverlay>
                          <ActionList>
                            <ActionListItem title="All Methods" value="all" />
                            <ActionListItem title="Bank Transfer" value="bank" />
                            <ActionListItem title="Credit Card" value="card" />
                            <ActionListItem title="UPI" value="upi" />
                          </ActionList>
                        </DropdownOverlay>
                      </Dropdown>
                    }
                  />
                </Box>
              )}
              <ButtonGroup variant="tertiary">
                <Tooltip content="More options">
                  <Button icon={MoreVerticalIcon} />
                </Tooltip>
                <Tooltip content="Download data">
                  <Button icon={DownloadIcon} />
                </Tooltip>
                <Tooltip content="Share">
                  <Button icon={ShareIcon} />
                </Tooltip>
              </ButtonGroup>
            </Box>
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter([]);
              const searchValueData = getSearchedData(data, searchValue);
              setListViewTableData(searchValueData);
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                value={methodFilter}
                onChange={({ values }) => {
                  const value = values[0];
                  setMethodFilter(value);
                  applyAllFilters(selectedQuickFilter, searchValue, value, filterDateRange);
                }}
                onClearButtonClick={() => {
                  setMethodFilter(undefined);
                  applyAllFilters(selectedQuickFilter, searchValue, undefined, filterDateRange);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method) => (
                    <ActionListItem key={method.key} title={method.title} value={method.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>

            <FilterChipDatePicker
              label="Date Range"
              selectionType="range"
              value={filterDateRange}
              onChange={(value) => {
                const dateRange = Array.isArray(value) ? value : undefined;
                setFilterDateRange(dateRange);
                applyAllFilters(selectedQuickFilter, searchValue, methodFilter, dateRange);
              }}
              onClearButtonClick={() => {
                const quickFilters = selectedQuickFilter.filter((value) => value !== 'LastWeek');
                setFilterDateRange(undefined);
                setSelectedQuickFilter(quickFilters);
                applyAllFilters(quickFilters, searchValue, methodFilter, undefined);
              }}
            />

            <Dropdown selectionType="multiple">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter.filter((filters) => filters !== 'LastWeek')}
                onChange={({ values }) => {
                  setSelectedQuickFilter((prev) => [
                    ...prev.filter((filter) => filter === 'LastWeek'),
                    ...values,
                  ]);
                  applyAllFilters(values, searchValue, methodFilter, filterDateRange);
                }}
                onClearButtonClick={() => {
                  setSelectedQuickFilter((prev) => prev.filter((filter) => filter === 'LastWeek'));
                  applyAllFilters([], searchValue, methodFilter, filterDateRange);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((status) => (
                    <ActionListItem
                      key={status}
                      title={status}
                      value={status}
                      isSelected={selectedQuickFilter.includes(status)}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>

        <Table
          data={listViewTableData}
          onSelectionChange={({ selectedIds }) => {
            setSelectedIds(selectedIds);
          }}
          isFirstColumnSticky
          selectionType="multiple"
          rowDensity="compact"
          pagination={
            <TablePagination
              onPageChange={console.log}
              defaultPageSize={10}
              onPageSizeChange={console.log}
              showPageSizePicker
              showPageNumberSelector
            />
          }
          toolbar={
            selectedIds.length > 0 ? (
              <TableToolbar placement="overlay" title={`${selectedIds.length} selected`}>
                <TableToolbarActions>
                  <Box
                    width="100%"
                    justifyContent="end"
                    display="flex"
                    alignItems="center"
                    gap="spacing.4"
                  >
                    <Link size="small" icon={CopyIcon}>
                      Copy
                    </Link>
                    <Link size="small" icon={TrashIcon}>
                      Delete
                    </Link>
                  </Box>
                </TableToolbarActions>
              </TableToolbar>
            ) : undefined
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                  <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem) => (
                  <TableRow key={tableItem.id} item={tableItem}>
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Amount value={tableItem.amount} />
                    </TableCell>
                    <TableCell>
                      {tableItem.date?.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>{tableItem.method.title}</TableCell>
                    <TableCell>
                      <Badge
                        size="xsmall"
                        color={
                          tableItem.status === 'Completed'
                            ? 'positive'
                            : tableItem.status === 'Pending'
                            ? 'notice'
                            : tableItem.status === 'Failed'
                            ? 'negative'
                            : 'primary'
                        }
                      >
                        {tableItem.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </ListView>
    </Box>
  );
}

export default ComprehensiveListViewExample;
```

### Minimal ListView without Search

This example demonstrates a ListView implementation focused on filtering without search functionality, ideal for simpler data presentation needs.

```tsx
import React, { useState } from 'react';
import {
  ListView,
  ListViewFilters,
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
  QuickFilterGroup,
  QuickFilter,
  FilterChipGroup,
  FilterChipSelectInput,
  FilterChipDatePicker,
  Dropdown,
  DropdownOverlay,
  ActionList,
  ActionListItem,
  Counter,
  Badge,
  Code,
  Amount,
  Box,
} from '@razorpay/blade/components';
import type { TableData, DatesRangeValue } from '@razorpay/blade/components';

// Using the same PaymentItem type and data from previous examples
// ... (PaymentItem type, MethodFilterValues, nodes, data definitions)

type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: {
    key: string;
    title: string;
  };
  bank: string;
  account: string;
  name: string;
};

const MethodFilterValues = [
  { key: 'bank-transfer', title: 'Bank Transfer' },
  { key: 'credit-card', title: 'Credit Card' },
  { key: 'paypal', title: 'PayPal' },
];

const quickFilters = ['All', 'Pending', 'Failed', 'Completed'];

const nodes: PaymentItem[] = [
  ...Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    label: `Payment ${i + 1}`,
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: MethodFilterValues[Math.floor(Math.random() * 3)],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: ['John Doe', 'Jane Doe', 'Bob Smith', 'Alice Smith'][Math.floor(Math.random() * 4)],
  })),
];

const data: TableData<PaymentItem> = { nodes };

function MinimalListViewExample() {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
  const [methodFilter, setMethodFilter] = useState<string | undefined>(undefined);
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);

  const getQuickFilterValueCount = (value: string): number => {
    if (value === 'All') {
      return data.nodes.length;
    }
    return data.nodes.filter((node) => node.status === value).length;
  };

  const getQuickFilterData = (
    data: TableData<PaymentItem>,
    value?: string,
  ): TableData<PaymentItem> => {
    if (!value || value === 'All') {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.status === value) };
  };

  const getMethodFilterData = (
    data: TableData<PaymentItem>,
    value?: string,
  ): TableData<PaymentItem> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (
    data: TableData<PaymentItem>,
    value?: DatesRangeValue,
  ): TableData<PaymentItem> => {
    if (!value?.[0]) {
      return { nodes: data.nodes };
    }
    return {
      nodes: data.nodes.filter((node) => {
        if (!value?.[0] || !value?.[1]) return false;
        return node.date >= value[0] && node.date <= value[1];
      }),
    };
  };

  const applyAllFilters = (
    quickFilter: string,
    method: string | undefined,
    dateRange: DatesRangeValue | undefined,
  ) => {
    const quickFilterData = getQuickFilterData(data, quickFilter);
    const methodFilterData = getMethodFilterData(quickFilterData, method);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, dateRange);
    setListViewTableData(dateRangeFilterData);
  };

  return (
    <Box height="100%">
      <ListView>
        <ListViewFilters
          selectedFiltersCount={
            (methodFilter ? 1 : 0) +
            (Array.isArray(filterDateRange) && filterDateRange[0] ? 1 : 0) +
            (selectedQuickFilter !== 'All' ? 1 : 0)
          }
          quickFilters={
            <QuickFilterGroup
              selectionType="single"
              onChange={({ values }) => {
                const value = values[0];
                setSelectedQuickFilter(value);
                applyAllFilters(value, methodFilter, filterDateRange);
              }}
              defaultValue="All"
              value={selectedQuickFilter}
            >
              {quickFilters.map((status) => (
                <QuickFilter
                  key={status}
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                />
              ))}
            </QuickFilterGroup>
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
              setListViewTableData(data);
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Payment Method"
                value={methodFilter}
                onChange={({ values }) => {
                  const value = values[0];
                  setMethodFilter(value);
                  applyAllFilters(selectedQuickFilter, value, filterDateRange);
                }}
                onClearButtonClick={() => {
                  setMethodFilter(undefined);
                  applyAllFilters(selectedQuickFilter, undefined, filterDateRange);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method) => (
                    <ActionListItem key={method.key} title={method.title} value={method.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>

            <FilterChipDatePicker
              label="Transaction Date"
              selectionType="range"
              value={filterDateRange}
              onChange={(value) => {
                const dateRange = Array.isArray(value) ? value : undefined;
                setFilterDateRange(dateRange);
                applyAllFilters(selectedQuickFilter, methodFilter, dateRange);
              }}
              onClearButtonClick={() => {
                setFilterDateRange(undefined);
                applyAllFilters(selectedQuickFilter, methodFilter, undefined);
              }}
            />
          </FilterChipGroup>
        </ListViewFilters>

        <Table
          data={listViewTableData}
          selectionType="single"
          onSelectionChange={(selectedItems) => {
            console.log('Selected item:', selectedItems);
          }}
          isFirstColumnSticky
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                  <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem) => (
                  <TableRow
                    key={tableItem.id}
                    item={tableItem}
                    onClick={() => console.log('Row selected:', tableItem.id)}
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Amount value={tableItem.amount} />
                    </TableCell>
                    <TableCell>
                      {tableItem.date?.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </TableCell>
                    <TableCell>{tableItem.method.title}</TableCell>
                    <TableCell>
                      <Badge
                        size="xsmall"
                        color={
                          tableItem.status === 'Completed'
                            ? 'positive'
                            : tableItem.status === 'Pending'
                            ? 'notice'
                            : tableItem.status === 'Failed'
                            ? 'negative'
                            : 'primary'
                        }
                      >
                        {tableItem.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableFooterRow>
                  <TableFooterCell>Total Transactions</TableFooterCell>
                  <TableFooterCell>
                    <Amount
                      value={listViewTableData.nodes.reduce((sum, item) => sum + item.amount, 0)}
                    />
                  </TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>{listViewTableData.nodes.length} items</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </Box>
  );
}

export default MinimalListViewExample;
```
