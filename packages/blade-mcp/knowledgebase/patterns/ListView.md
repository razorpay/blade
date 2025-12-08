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
