## Component Name

ListView

## Description

ListView is a pattern component that provides a structured way to display tabular data with powerful filtering capabilities. It combines search functionality, quick filters, and advanced filtering options with a table display in a unified interface. This component is designed for data-heavy applications that require efficient data navigation and manipulation.

## TypeScript Types

These types define the props that the ListView component and its subcomponents accept. Understanding these types will help you properly implement the ListView pattern in your application.

```typescript
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
   * @deprecated Filters are now always expanded. This prop will be removed in a future version.
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
   * @deprecated Filters are now always expanded. This prop will be removed in a future version.
   */
  onShowFiltersChange?: (showFilters: boolean) => void;
  /**
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

type ListViewFiltersContextType = {
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
```

## Example

Below is a comprehensive example demonstrating how to use the ListView component with various filtering options, search functionality, and table display:

```tsx
import React, { useState } from 'react';
import {
  Amount,
  ListView,
  ListViewFilters,
  Box,
  QuickFilterGroup,
  QuickFilter,
  FilterChipGroup,
  Dropdown,
  DropdownOverlay,
  Counter,
  FilterChipSelectInput,
  ActionList,
  ActionListItem,
  FilterChipDatePicker,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
  TableEditableCell,
  Button,
  IconButton,
  CheckIcon,
  CloseIcon,
  Code,
  Badge,
  SearchInput,
  Link,
  SelectInput,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

// Define data types for strong typing
type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: Date;
  method: string;
  account: string;
};

type TableData<T> = {
  nodes: T[];
};

function ListViewExample() {
  // Sample data for the table
  const nodes: PaymentItem[] = [
    ...Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1).toString(),
      paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
      amount: Number((Math.random() * 10000).toFixed(2)),
      status: ['Completed', 'Pending', 'Failed'][
        Math.floor(Math.random() * 3)
      ] as PaymentItem['status'],
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      method: ['Bank Transfer', 'Credit Card', 'PayPal'][Math.floor(Math.random() * 3)],
      account: Math.floor(Math.random() * 1000000000).toString(),
    })),
  ];

  const data: TableData<PaymentItem> = { nodes };

  // State management for filters and search
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
  const [searchValue, setSearchValue] = useState<string>('');
  const [methodFilter, setMethodFilter] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<[Date, Date] | undefined>(undefined);

  // Mobile responsive hook
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const isMobile = matchedDeviceType === 'mobile';

  // Filter utility functions
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
    return { nodes: data.nodes.filter((node) => node.method === value) };
  };

  const getFilterRangeData = (
    data: TableData<PaymentItem>,
    value?: [Date, Date],
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

  // Search handlers
  const handleSearchChange = (value?: string): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const searchValueData = getSearchedData(quickFilterData, value);
    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue(value || '');
  };

  const handleSearchClear = (): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue('');
  };

  return (
    <Box height="100%" testID="payment-list-view">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search by Payment ID"
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
                const quickFilterData = getQuickFilterData(data, value);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                setListViewTableData(dateRangeFilterData);
                setSelectedQuickFilter(value);
              }}
              defaultValue="All"
              value={selectedQuickFilter}
            >
              {['All', 'Pending', 'Failed', 'Completed'].map((status) => (
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
            (filterDateRange?.[0] ? 1 : 0) +
            (selectedQuickFilter !== 'All' ? 1 : 0)
          }
          actions={
            !isMobile && (
              <Box width="280px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search by Payment ID"
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
            )
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, 'All');
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              setListViewTableData(searchValueData);
              setMethodFilter('');
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Payment Method"
                value={methodFilter}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, value);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(value);
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const dateRangeFilterData = getFilterRangeData(searchValueData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter('');
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {['Bank Transfer', 'Credit Card', 'PayPal'].map((method) => (
                    <ActionListItem
                      key={method}
                      title={method}
                      value={method}
                      isSelected={methodFilter === method}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>

            <FilterChipDatePicker
              label="Date Range"
              selectionType="range"
              value={filterDateRange}
              onChange={(value) => {
                const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(
                  methodFilterData,
                  value as [Date, Date],
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as [Date, Date]);
              }}
              onClearButtonClick={() => {
                const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                setListViewTableData(methodFilterData);
                setFilterDateRange(undefined);
              }}
            />
          </FilterChipGroup>
        </ListViewFilters>

        <Table
          data={listViewTableData}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={(selectedIds) => console.log('Selected rows:', selectedIds)}
          isFirstColumnSticky
          selectionType="single"
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
                        <Button variant="tertiary" size="xsmall">
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel="Approve payment"
                          onClick={() => {
                            console.log('Approved', tableItem.id);
                          }}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel="Reject payment"
                          onClick={() => {
                            console.log('Rejected', tableItem.id);
                          }}
                        />
                      </>
                    }
                    onClick={() => {
                      console.log('Row clicked:', tableItem);
                    }}
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Edit payment amount"
                      placeholder="Enter amount"
                      successText="Amount is valid"
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
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>
                      <Badge
                        size="xsmall"
                        color={
                          tableItem.status === 'Completed'
                            ? 'positive'
                            : tableItem.status === 'Pending'
                            ? 'notice'
                            : 'negative'
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
                    <Amount value={tableData.reduce((sum, item) => sum + item.amount, 0)} />
                  </TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </Box>
  );
}

export default ListViewExample;
```

### Multiple Selection Example

Here's an example demonstrating multiple selection in ListView's quick filters:

```tsx
import React, { useState } from 'react';
import {
  ListView,
  ListViewFilters,
  Box,
  QuickFilterGroup,
  QuickFilter,
  Counter,
  Table,
  SearchInput,
  TableHeader,
  TableCell,
  TableRow,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  Badge,
  Amount,
  Code,
  TableEditableCell,
  Link,
} from '@razorpay/blade/components';
import { useBreakpoint, useTheme } from '@razorpay/blade/utils';

// Define data types for strong typing
type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: Date;
  method: string;
  account: string;
};

type TableData<T> = {
  nodes: T[];
};
function MultiSelectListViewExample() {
  // Sample data similar to the first example
  const nodes: PaymentItem[] = [
    ...Array.from({ length: 20 }, (_, i) => ({
      id: (i + 1).toString(),
      paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
      amount: Number((Math.random() * 10000).toFixed(2)),
      status: ['Completed', 'Pending', 'Failed'][
        Math.floor(Math.random() * 3)
      ] as PaymentItem['status'],
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      method: ['Bank Transfer', 'Credit Card', 'PayPal'][Math.floor(Math.random() * 3)],
      account: Math.floor(Math.random() * 1000000000).toString(),
    })),
  ];

  const data: TableData<PaymentItem> = { nodes };

  // State management
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const { theme } = useTheme();
  const { matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const isMobile = matchedDeviceType === 'mobile';

  // Filter function for multiple selected status values
  const getMultipleStatusFilterData = (
    data: TableData<PaymentItem>,
    values: string | string[],
  ): TableData<PaymentItem> => {
    if (!values || values.length === 0) {
      return { nodes: data.nodes };
    }
    return {
      nodes: data.nodes.filter((node) => values.includes(node.status)),
    };
  };
  const handleSearchChange = (value?: string): void => {
    // Apply search logic here similar to first example
    setSearchValue(value || '');
  };

  const handleSearchClear = (): void => {
    // Apply search clear logic here similar to first example
    setSearchValue('');
  };

  return (
    <Box height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search payments"
          onChange={({ value }) => handleSearchChange(value)}
          onClearButtonClick={handleSearchClear}
        />
      )}

      <ListView>
        <ListViewFilters
          quickFilters={
            <QuickFilterGroup
              selectionType="multiple"
              onChange={({ values }) => {
                const filteredData = getMultipleStatusFilterData(data, values);
                setListViewTableData(filteredData);
                setSelectedQuickFilters(values);
              }}
              value={selectedQuickFilters}
            >
              {['Pending', 'Failed', 'Completed'].map((status) => (
                <QuickFilter
                  key={status}
                  title={status}
                  value={status}
                  trailing={
                    <Counter
                      value={data.nodes.filter((node) => node.status === status).length}
                      color="neutral"
                    />
                  }
                />
              ))}
            </QuickFilterGroup>
          }
          selectedFiltersCount={selectedQuickFilters.length}
          actions={
            !isMobile && (
              <Box width="208px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search payments"
                  onChange={({ value }) => handleSearchChange(value)}
                  onClearButtonClick={handleSearchClear}
                />
              </Box>
            )
          }
        >
          {/* Filter chips and table similar to first example */}
        </ListViewFilters>
        <Table data={listViewTableData}>
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="ID">ID</TableHeaderCell>
                  <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                  <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                  <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow
                    key={tableItem.id}
                    item={tableItem}
                    onClick={() => {
                      console.log('Row clicked:', tableItem);
                    }}
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Edit payment amount"
                      placeholder="Enter amount"
                      successText="Amount is valid"
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
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>
                      <Badge
                        size="xsmall"
                        color={
                          tableItem.status === 'Completed'
                            ? 'positive'
                            : tableItem.status === 'Pending'
                            ? 'notice'
                            : 'negative'
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

export default MultiSelectListViewExample;
```
