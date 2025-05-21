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
  children: React.ReactNode;
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
} & TestID &
  DataAnalyticsAttribute &
  ListViewCommonProps;

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
  TableEditableCell,
  Button,
  IconButton,
  CheckIcon,
  CloseIcon,
  Code,
  Badge,
} from '@razorpay/blade/components';

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

  // Quick filter status colors
  const quickFilterColorMapping = {
    All: 'primary',
    Pending: 'notice',
    Failed: 'negative',
    Completed: 'positive',
  };

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

  return (
    <Box height="100%" testID="payment-list-view">
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
                  trailing={
                    <Counter
                      value={getQuickFilterValueCount(status)}
                      color={quickFilterColorMapping[status]}
                    />
                  }
                />
              ))}
            </QuickFilterGroup>
          }
          searchName="paymentIdSearch"
          onSearchChange={({ value }) => {
            const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
            const searchValueData = getSearchedData(quickFilterData, value);
            const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
            const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
            setListViewTableData(dateRangeFilterData);
            setSearchValue(value);
          }}
          onSearchClear={() => {
            const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
            const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
            const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
            setListViewTableData(dateRangeFilterData);
            setSearchValue('');
          }}
          searchValuePlaceholder="Search by Payment ID"
          selectedFiltersCount={
            (methodFilter ? 1 : 0) +
            (filterDateRange?.[0] ? 1 : 0) +
            (selectedQuickFilter !== 'All' ? 1 : 0)
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
          accessibilityLabel="Payments history table"
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
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Edit payment amount"
                      placeholder="Enter amount"
                      successText="Amount is valid"
                      defaultValue={tableItem.amount.toString()}
                    />
                    <TableCell>{tableItem.account}</TableCell>
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
                        size="medium"
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
                    <Amount
                      value={tableData.reduce((sum, item) => sum + item.amount, 0)}
                      currency="INR"
                    />
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

### Multiple Selection Example with Quick Filters Toggle

Here's an example demonstrating multiple selection in ListView's quick filters along with the ability to toggle the visibility of quick filters:

```tsx
import React, { useState } from 'react';
import {
  ListView,
  ListViewFilters,
  Box,
  QuickFilterGroup,
  QuickFilter,
  FilterChipGroup,
  Counter,
  Table,
  Switch,
  Text,
  Flex,
  // ...other imports as needed
} from '@razorpay/blade/components';

function MultiSelectListViewExample() {
  // Sample data similar to the first example
  const data = {
    nodes: [
      // ... payment data items
    ],
  };

  // State management
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilters, setSelectedQuickFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(true);

  // Filter function for multiple selected status values
  const getMultipleStatusFilterData = (data, values) => {
    if (!values || values.length === 0) {
      return { nodes: data.nodes };
    }
    return {
      nodes: data.nodes.filter((node) => values.includes(node.status)),
    };
  };

  return (
    <Box height="100%">
      <Flex padding="spacing.5" alignItems="center" gap="spacing.3">
        <Text>Show Quick Filters</Text>
        <Switch
          isChecked={showFilters}
          onChange={() => setShowFilters(!showFilters)}
          accessibilityLabel="Toggle quick filters visibility"
        />
      </Flex>

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
                      color={
                        status === 'Completed'
                          ? 'positive'
                          : status === 'Failed'
                          ? 'negative'
                          : 'notice'
                      }
                    />
                  }
                />
              ))}
            </QuickFilterGroup>
          }
          searchName="multiSelectSearch"
          searchValuePlaceholder="Search payments"
          selectedFiltersCount={selectedQuickFilters.length}
          showQuickFilters={showFilters}
          onShowQuickFiltersChange={setShowFilters}
        >
          {/* Filter chips and table similar to first example */}
          <FilterChipGroup>{/* Filter chips */}</FilterChipGroup>
        </ListViewFilters>

        <Table data={listViewTableData}>{/* Table implementation */}</Table>
      </ListView>
    </Box>
  );
}
```
