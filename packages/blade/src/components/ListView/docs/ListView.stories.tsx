import dayjs from 'dayjs';
import type { StoryFn, Meta } from '@storybook/react';
import React, { useState } from 'react';
import storyRouterDecorator from 'storybook-react-router';
import { ListView } from '../ListView';
import type { ListViewProps } from '../types';
import { ListViewFilters } from '../ListViewFilters';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import type { Identifier, TableData } from '~components/Table/types';
import { BaseBox } from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import {
  CheckIcon,
  CloseIcon,
  ShareIcon,
  DownloadIcon,
  MoreVerticalIcon,
  CopyIcon,
  TrashIcon,
} from '~components/Icons';
import { Code } from '~components/Typography/Code';
import { TableEditableCell } from '~components/Table/TableEditableCell';
import { Amount } from '~components/Amount';
import { QuickFilter, QuickFilterGroup } from '~components/QuickFilters';
import { Counter } from '~components/Counter';
import {
  FilterChipSelectInput,
  Dropdown,
  DropdownOverlay,
  FilterChipGroup,
  InputDropdownButton,
} from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import type { DatesRangeValue } from '~components/DatePicker';
import { FilterChipDatePicker } from '~components/DatePicker';
import {
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
  TableToolbarActions,
  TableToolbar,
} from '~components/Table';
import { IconButton } from '~components/Button/IconButton';
import { Box } from '~components/Box';
import { Link } from '~components/Link';
import { ButtonGroup } from '~components/ButtonGroup';
import { Tooltip } from '~components/Tooltip';
import { SearchInput } from '~components/Input/SearchInput';
import { useIsMobile } from '~utils/useIsMobile';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ListView"
      componentDescription="List View is a pattern"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
      import { useState } from 'react';
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
      import type {
        DatesRangeValue,
        TableData,
        CounterProps,
      } from '@razorpay/blade/components';
      
      type Item = {
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
      
      const nodes = [
        ...Array.from({ length: 30 }, (_, i) => ({
          id: (i + 1).toString(),
          paymentId: Math.floor(Math.random() * 1000000),
          amount: Number((Math.random() * 10000).toFixed(2)),
          status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
          date: new Date(
            2025,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
          method: MethodFilterValues[Math.floor(Math.random() * 3)],
          bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
          account: Math.floor(Math.random() * 1000000000).toString(),
          name: [
            'John Doe',
            'Jane Doe',
            'Bob Smith',
            'Alice Smith',
            'John Smith',
            'Jane Smith',
            'Bob Doe',
            'Alice Doe',
          ][Math.floor(Math.random() * 8)],
        })),
      ];
      const quickFilters = ['All', 'Pending', 'Failed', 'Completed'];
      const filterChipQuickFilters = ['Pending', 'Failed', 'Completed'];
     
      const data: TableData<Item> = {
        nodes,
      };
      
      function App() {
        const [listViewTableData, setListViewTableData] = useState(data);
        const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
        const [searchValue, setSearchValue] = useState<string | undefined>('');
        const [methodFilter, setMethodFilter] = useState<string | undefined>('');
        const [filterDateRange, setFilterDateRange] = useState<
          DatesRangeValue | undefined
        >(undefined);
      
        const getQuickFilterValueCount = (value: string): number => {
          if (value === 'All') {
            return data.nodes.length;
          }
          return data.nodes.filter((node) => node.status === value).length;
        };
        const getQuickFilterData = (
          data: TableData<Item>,
          value?: string
        ): TableData<Item> => {
          if (!value || value === 'All') {
            return { nodes: data.nodes };
          }
          return { nodes: data.nodes.filter((node) => node.status === value) };
        };
        const getSearchedData = (
          data: TableData<Item>,
          value?: string
        ): TableData<Item> => {
          if (!value) {
            return { nodes: data.nodes };
          }
          return {
            nodes: data.nodes.filter((node) => node.paymentId.includes(value)),
          };
        };
        const getMethodFilterData = (
          data: TableData<Item>,
          value?: string
        ): TableData<Item> => {
          if (!value) {
            return { nodes: data.nodes };
          }
          return { nodes: data.nodes.filter((node) => node.method.key === value) };
        };
      
        const getFilterRangeData = (
          data: TableData<Item>,
          value?: DatesRangeValue
        ): TableData<Item> => {
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
          <Box height="100%">
            <ListView>
              <ListViewFilters
                quickFilters={
                  <QuickFilterGroup
                    selectionType="single"
                    onChange={({ values }) => {
                      const value = values[0];
                      const quickFilterData = getQuickFilterData(data, value);
                      const searchValueData = getSearchedData(
                        quickFilterData,
                        searchValue
                      );
                      const methodFilterData = getMethodFilterData(
                        searchValueData,
                        methodFilter
                      );
                      const dateRangeFilterData = getFilterRangeData(
                        methodFilterData,
                        filterDateRange
                      );
      
                      setListViewTableData(dateRangeFilterData);
                      setSelectedQuickFilter(value);
                    }}
                    defaultValue="All"
                    value={selectedQuickFilter}
                  >
                    {quickFilters.map((status, index) => (
                      <QuickFilter
                        title={status}
                        value={status}
                        trailing={
                          <Counter
                            value={getQuickFilterValueCount(status)}
                            color="neutral"
                          />
                        }
                        key={status}
                      />
                    ))}
                  </QuickFilterGroup>
                }
                onSearchChange={({ value }) => {
                  const quickFilterData = getQuickFilterData(
                    data,
                    selectedQuickFilter
                  );
                  const searchValueData = getSearchedData(quickFilterData, value);
                  const methodFilterData = getMethodFilterData(
                    searchValueData,
                    methodFilter
                  );
                  const dateRangeFilterData = getFilterRangeData(
                    methodFilterData,
                    filterDateRange
                  );
                  setListViewTableData(dateRangeFilterData);
                  setSearchValue(value);
                }}
                onSearchClear={() => {
                  const quickFilterData = getQuickFilterData(
                    data,
                    selectedQuickFilter
                  );
                  const methodFilterData = getMethodFilterData(
                    quickFilterData,
                    methodFilter
                  );
                  const dateRangeFilterData = getFilterRangeData(
                    methodFilterData,
                    filterDateRange
                  );
                  setListViewTableData(dateRangeFilterData);
                  setSearchValue('');
                }}
                searchValuePlaceholder="Search for Payment Id"
                selectedFiltersCount={
                  (methodFilter ? 1 : 0) +
                  (Array.isArray(filterDateRange) && filterDateRange[0] ? 1 : 0) +
                  (selectedQuickFilter !== 'All' ? 1 : 0)
                }
              >
                <FilterChipGroup
                  onClearButtonClick={() => {
                    const quickFilterData = getQuickFilterData(data, 'All');
                    const searchValueData = getSearchedData(
                      quickFilterData,
                      searchValue
                    );
                    const methodFilterData = getMethodFilterData(searchValueData, '');
                    const dateRangeFilterData = getFilterRangeData(
                      methodFilterData,
                      undefined
                    );
                    setListViewTableData(dateRangeFilterData);
                    setMethodFilter(undefined);
                    setFilterDateRange(undefined);
                    setSelectedQuickFilter('All');
                  }}
                >
                  <Dropdown selectionType="single">
                    <FilterChipSelectInput
                      label="Method"
                      onChange={({ values }) => {
                        const value = values[0];
                        const quickFilterData = getQuickFilterData(
                          data,
                          selectedQuickFilter
                        );
                        const searchValueData = getSearchedData(
                          quickFilterData,
                          searchValue
                        );
                        const methodFilterData = getMethodFilterData(
                          searchValueData,
                          value
                        );
                        const dateRangeFilterData = getFilterRangeData(
                          methodFilterData,
                          filterDateRange
                        );
      
                        setListViewTableData(dateRangeFilterData);
                        setMethodFilter(value);
                      }}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        {MethodFilterValues.map((method, index) => (
                          <ActionListItem
                            key={index}
                            title={method.title}
                            value={method.key}
                          />
                        ))}
                      </ActionList>
                    </DropdownOverlay>
                  </Dropdown>
                  <FilterChipDatePicker
                    label="Date Range"
                    selectionType="range"
                    onChange={(value) => {
                      const quickFilterData = getQuickFilterData(
                        data,
                        selectedQuickFilter
                      );
                      const searchValueData = getSearchedData(
                        quickFilterData,
                        searchValue
                      );
                      const methodFilterData = getMethodFilterData(
                        searchValueData,
                        methodFilter
                      );
                      const dateRangeFilterData = getFilterRangeData(
                        methodFilterData,
                        Array.isArray(value) ? value : undefined
                      );
                      setListViewTableData(dateRangeFilterData);
                      setFilterDateRange(value as DatesRangeValue);
                    }}
                  />
                  <Dropdown selectionType="single">
                    <FilterChipSelectInput
                      label="Status"
                      value={
                        selectedQuickFilter !== 'All'
                          ? selectedQuickFilter
                          : undefined
                      }
                      onChange={({ values }) => {
                        const value = values[0];
                        const quickFilterData = getQuickFilterData(data, value);
                        const searchValueData = getSearchedData(
                          quickFilterData,
                          searchValue
                        );
                        const methodFilterData = getMethodFilterData(
                          searchValueData,
                          methodFilter
                        );
                        const dateRangeFilterData = getFilterRangeData(
                          methodFilterData,
                          filterDateRange
                        );
                        setListViewTableData(dateRangeFilterData);
                        setSelectedQuickFilter(value ? value : 'All');
                      }}
                      onClearButtonClick={() => {
                        const quickFilterData = getQuickFilterData(data, 'All');
                        const searchValueData = getSearchedData(
                          quickFilterData,
                          searchValue
                        );
                        const methodFilterData = getMethodFilterData(
                          searchValueData,
                          methodFilter
                        );
                        const dateRangeFilterData = getFilterRangeData(
                          methodFilterData,
                          filterDateRange
                        );
                        setListViewTableData(dateRangeFilterData);
                        setSelectedQuickFilter('All');
                      }}
                    />
                    <DropdownOverlay>
                      <ActionList>
                        {filterChipQuickFilters.map((method, index) => (
                          <ActionListItem
                            key={index}
                            title={method}
                            value={method}
                            isSelected={selectedQuickFilter === method}
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
                onSelectionChange={console.log}
                isFirstColumnSticky
                selectionType="single"
              >
                {(tableData) => (
                  <>
                    <TableHeader>
                      <TableHeaderRow>
                        <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
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
                          key={index}
                          item={tableItem}
                          hoverActions={
                            <>
                              <Button variant="tertiary" size="xsmall">
                                View Details
                              </Button>
                              <IconButton
                                icon={CheckIcon}
                                isHighlighted
                                accessibilityLabel="Approve"
                                onClick={() => {
                                  console.log('Approved', tableItem.id);
                                }}
                              />
                              <IconButton
                                icon={CloseIcon}
                                isHighlighted
                                accessibilityLabel="Reject"
                                onClick={() => {
                                  console.log('Rejected', tableItem.id);
                                }}
                              />
                            </>
                          }
                          onClick={() => {
                            console.log('where');
                          }}
                        >
                          <TableCell>
                            <Code size="medium">{tableItem.paymentId}</Code>
                          </TableCell>
                          <TableEditableCell
                            accessibilityLabel="Amount"
                            placeholder="Enter text"
                            successText="Amount is valid"
                          />
                          <TableCell>{tableItem.account}</TableCell>
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
                              size="medium"
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
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>-</TableFooterCell>
                        <TableFooterCell>
                          <Amount value={10} />
                        </TableFooterCell>
                      </TableFooterRow>
                    </TableFooter>
                  </>
                )}
              </Table>
            </ListView>
          </Box>
        );
      }
      
      export default App;

      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Patterns/ListView',
  component: ListView,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
    decorators: [storyRouterDecorator(undefined, { initialEntries: ['/'] })] as unknown,
  },
} as Meta<ListViewProps>;

const MethodFilterValues = [
  { key: 'bank-transfer', title: 'Bank Transfer' },
  { key: 'credit-card', title: 'Credit Card' },
  { key: 'paypal', title: 'PayPal' },
];

const nodes: Item[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: MethodFilterValues[Math.floor(Math.random() * 3)],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: [
      'John Doe',
      'Jane Doe',
      'Bob Smith',
      'Alice Smith',
      'John Smith',
      'Jane Smith',
      'Bob Doe',
      'Alice Doe',
    ][Math.floor(Math.random() * 8)],
  })),
  // to make sure one item from last week's date is always present
  {
    id: '21',
    paymentId: 'rzp123456',
    amount: 1000,
    status: 'Pending',
    date: new Date(new Date().setDate(new Date().getDate() - 4)),
    type: 'Payout',
    method: {
      key: 'bank-transfer',
      title: 'Bank Transfer',
    },
    bank: 'HDFC',
    account: '1234567890',
    name: 'John Doe',
  },
];

type Item = {
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
const data: TableData<Item> = {
  nodes,
};

const quickFilters = ['All', 'Pending', 'Failed', 'Completed'];
const filterChipQuickFilters = ['Pending', 'Failed', 'Completed'];

const extendedStatusFilters = [
  'Pending',
  'Failed',
  'Completed',
  'Processing',
  'Authorized',
  'Captured',
  'Refunded',
  'Disputed',
  'LastWeek',
  'Cancelled',
  'Expired',
  'Rejected',
  'Waiting',
  'Review',
  'Hold',
];

const DefaultExample: StoryFn<typeof ListView> = (args) => {
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
  const getQuickFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value || value === 'All') {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.status === value) };
  };
  const getSearchedData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.paymentId.includes(value)) };
  };
  const getMethodFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (data: TableData<Item>, value?: DatesRangeValue): TableData<Item> => {
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

  const handleSearchChange = (value?: string): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const searchValueData = getSearchedData(quickFilterData, value);
    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue(value);
  };

  const handleSearchClear = (): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue('');
  };

  const isMobile = useIsMobile();

  return (
    <BaseBox height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search for Payment Id"
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
              {quickFilters.map((status, index) => (
                <QuickFilter
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                  key={`${index}-${status}`}
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
                  placeholder="Search for Payment Id"
                  onChange={({ value }) => handleSearchChange(value)}
                  onClearButtonClick={handleSearchClear}
                />
              </Box>
            )
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, 'All');
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              const methodFilterData = getMethodFilterData(searchValueData, '');
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, value);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(value);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method, index) => (
                    <ActionListItem key={index} title={method.title} value={method.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <FilterChipDatePicker
              label="Date Range"
              selectionType="range"
              onChange={(value) => {
                const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(
                  methodFilterData,
                  Array.isArray(value) ? value : undefined,
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as DatesRangeValue);
              }}
            />
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, value);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter(value ? value : 'All');
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, 'All');
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter('All');
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((method, index) => (
                    <ActionListItem
                      key={index}
                      title={method}
                      value={method}
                      isSelected={selectedQuickFilter === method}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
          data={listViewTableData}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={console.log}
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
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
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
                    key={index}
                    item={tableItem}
                    hoverActions={
                      <>
                        <Button variant="tertiary" size="xsmall">
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel="Approve"
                          onClick={() => {
                            console.log('Approved', tableItem.id);
                          }}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel="Reject"
                          onClick={() => {
                            console.log('Rejected', tableItem.id);
                          }}
                        />
                      </>
                    }
                    onClick={() => {
                      console.log('where');
                    }}
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Amount"
                      placeholder="Enter text"
                      successText="Amount is valid"
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
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};

export const Default = DefaultExample.bind({});
Default.storyName = 'Default';

const ControlledExample: StoryFn<typeof ListView> = (args) => {
  const getQuickFilterValueCount = (value: string): number => {
    if (value === 'All') {
      return data.nodes.length;
    }
    return data.nodes.filter((node) => node.status === value).length;
  };
  const getQuickFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value || value === 'All') {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.status === value) };
  };
  const getSearchedData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.paymentId.includes(value)) };
  };
  const getMethodFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (data: TableData<Item>, value?: DatesRangeValue): TableData<Item> => {
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
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('Completed');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('paypal');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);
  const [listViewTableData, setListViewTableData] = useState(() => {
    const filteredQuickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(filteredQuickFilterData, methodFilter);
    return methodFilterData;
  });

  const handleSearchChange = (value?: string): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const searchValueData = getSearchedData(quickFilterData, value);
    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue(value);
  };

  const handleSearchClear = (): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue('');
  };

  const isMobile = useIsMobile();

  return (
    <BaseBox height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search for Payment Id"
          onChange={({ value }) => handleSearchChange(value)}
          onClearButtonClick={handleSearchClear}
        />
      )}
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
              {quickFilters.map((status, index) => (
                <QuickFilter
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                  key={`${index}-${status}`}
                />
              ))}
            </QuickFilterGroup>
          }
          actions={
            !isMobile && (
              <Box width="208px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search for Payment Id"
                  onChange={({ value }) => handleSearchChange(value)}
                  onClearButtonClick={handleSearchClear}
                />
              </Box>
            )
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, 'All');
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              const methodFilterData = getMethodFilterData(searchValueData, undefined);
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
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
                  setMethodFilter(undefined);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method, index) => (
                    <ActionListItem key={index} title={method.title} value={method.key} />
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
                  Array.isArray(value) ? value : undefined,
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as DatesRangeValue);
              }}
            />
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, value);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter(value ? value : 'All');
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, 'All');
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter('All');
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((method, index) => (
                    <ActionListItem
                      key={index}
                      title={method}
                      value={method}
                      isSelected={selectedQuickFilter === method}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
          data={listViewTableData}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={console.log}
          isFirstColumnSticky
          selectionType="single"
          rowDensity="compact"
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
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
                    key={index}
                    item={tableItem}
                    hoverActions={
                      <>
                        <Button variant="tertiary" size="xsmall">
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel="Approve"
                          onClick={() => {
                            console.log('Approved', tableItem.id);
                          }}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel="Reject"
                          onClick={() => {
                            console.log('Rejected', tableItem.id);
                          }}
                        />
                      </>
                    }
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Amount"
                      placeholder="Enter text"
                      successText="Amount is valid"
                    />
                    <TableCell>{tableItem.account}</TableCell>
                    <TableCell>
                      {tableItem.date?.toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </TableCell>
                    <TableCell>
                      <Link size="small" color="neutral" target="_blank" href={`/`}>
                        {tableItem.account}
                      </Link>
                    </TableCell>
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
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};

export const Controlled = ControlledExample.bind({});
Controlled.storyName = 'Controlled';

const WithBulkActionExample: StoryFn<typeof ListView> = (args) => {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
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
  const getQuickFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value || value === 'All') {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.status === value) };
  };
  const getSearchedData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.paymentId.includes(value)) };
  };
  const getMethodFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (data: TableData<Item>, value?: DatesRangeValue): TableData<Item> => {
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

  const handleSearchChange = (value?: string): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const searchValueData = getSearchedData(quickFilterData, value);
    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue(value);
  };

  const handleSearchClear = (): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue('');
  };

  const isMobile = useIsMobile();

  return (
    <BaseBox height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search for Payment Id"
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
              {quickFilters.map((status, index) => (
                <QuickFilter
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                  key={`${index}-${status}`}
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
            <Box display="flex" gap="spacing.4" alignItems="center">
              {!isMobile && (
                <Box width="208px">
                  <SearchInput
                    label=""
                    value={searchValue}
                    placeholder="Search for Payment Id"
                    onChange={({ value }) => handleSearchChange(value)}
                    onClearButtonClick={handleSearchClear}
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
              const quickFilterData = getQuickFilterData(data, 'All');
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              const methodFilterData = getMethodFilterData(searchValueData, '');
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, value);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(value);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method, index) => (
                    <ActionListItem key={index} title={method.title} value={method.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <FilterChipDatePicker
              label="Date Range"
              selectionType="range"
              onChange={(value) => {
                const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(
                  methodFilterData,
                  Array.isArray(value) ? value : undefined,
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as DatesRangeValue);
              }}
            />
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, value);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter(value ? value : 'All');
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, 'All');
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter('All');
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((method, index) => (
                    <ActionListItem
                      key={index}
                      title={method}
                      value={method}
                      isSelected={selectedQuickFilter === method}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
          data={listViewTableData}
          onSelectionChange={({ selectedIds }) => {
            console.log('Selected ids:', selectedIds);
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
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
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
                    key={index}
                    item={tableItem}
                    onClick={() => {
                      console.log('where');
                    }}
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Amount"
                      placeholder="Enter text"
                      successText="Amount is valid"
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
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};

export const WithBulkAction = WithBulkActionExample.bind({});
WithBulkActionExample.storyName = 'With Bulk Action';

const MultiSelectQuickFilter: StoryFn<typeof ListView> = (args) => {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);

  const getQuickFilterValueCount = (value: string): number => {
    if (value === 'All') {
      return data.nodes.length;
    }

    const statusMap: Record<string, string[]> = {
      Pending: ['Pending'],
      Failed: ['Failed'],
      Completed: ['Completed'],
      Processing: ['Pending'],
      Authorized: ['Completed'],
      Captured: ['Completed'],
      Refunded: ['Failed'],
      Disputed: ['Failed'],
      Cancelled: ['Failed'],
      Expired: ['Failed'],
      Rejected: ['Failed'],
      Waiting: ['Pending'],
      Review: ['Pending'],
      Hold: ['Pending'],
    };

    const mappedStatuses = statusMap[value] || [value];
    return data.nodes.filter((node) => mappedStatuses.includes(node.status)).length;
  };
  const getQuickFilterData = (data: TableData<Item>, values?: string[]): TableData<Item> => {
    if (!values?.length) {
      return { nodes: data.nodes };
    }

    const statusMap: Record<string, string[]> = {
      Pending: ['Pending'],
      Failed: ['Failed'],
      Completed: ['Completed'],
      Processing: ['Pending'],
      Authorized: ['Completed'],
      Captured: ['Completed'],
      Refunded: ['Failed'],
      Disputed: ['Failed'],
      Cancelled: ['Failed'],
      Expired: ['Failed'],
      Rejected: ['Failed'],
      Waiting: ['Pending'],
      Review: ['Pending'],
      Hold: ['Pending'],
    };

    const allMappedStatuses = values.flatMap((value) => statusMap[value] || [value]);
    return { nodes: data.nodes.filter((node) => allMappedStatuses.includes(node.status)) };
  };
  const getSearchedData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.paymentId.includes(value)) };
  };
  const getMethodFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (data: TableData<Item>, value?: DatesRangeValue): TableData<Item> => {
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

  const handleSearchChange = (value?: string): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const searchValueData = getSearchedData(quickFilterData, value);
    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue(value);
  };

  const handleSearchClear = (): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue('');
  };

  const isMobile = useIsMobile();

  return (
    <BaseBox height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search for Payment Id"
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
            <Box display="flex" gap="spacing.3">
              <QuickFilterGroup
                selectionType="multiple"
                onChange={({ values }) => {
                  const lastWeekDateRange = getLastWeekDateRange();
                  const shouldChangeValue = values.includes('LastWeek');
                  if (!shouldChangeValue) {
                    const quickFilterData = getQuickFilterData(data, values);
                    const searchValueData = getSearchedData(quickFilterData, searchValue);
                    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                    const rangeToUse = compareDateRangeValues(
                      lastWeekDateRange,
                      filterDateRange as DatesRangeValue,
                    )
                      ? undefined
                      : filterDateRange;
                    const dateRangeFilterData = getFilterRangeData(methodFilterData, rangeToUse);
                    setListViewTableData(dateRangeFilterData);
                    setFilterDateRange(undefined);
                    setSelectedQuickFilter(values.filter((value) => value !== 'LastWeek'));
                  } else {
                    const quickFilterData = getQuickFilterData(
                      data,
                      values.filter((value) => value !== 'LastWeek'),
                    );
                    const searchValueData = getSearchedData(quickFilterData, searchValue);
                    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                    const dateRangeFilterData = getFilterRangeData(
                      methodFilterData,
                      lastWeekDateRange,
                    );
                    setFilterDateRange(lastWeekDateRange);
                    setSelectedQuickFilter(values);
                    setListViewTableData(dateRangeFilterData);
                  }
                }}
                value={selectedQuickFilter}
              >
                {extendedStatusFilters.map((status, index) => (
                  <QuickFilter
                    title={status}
                    value={status}
                    trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                    key={`${index}-${status}`}
                  />
                ))}
              </QuickFilterGroup>
            </Box>
          }
          actions={
            !isMobile && (
              <Box width="208px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search for Payment Id"
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
              setSelectedQuickFilter([]);
              const searchValueData = getSearchedData(data, searchValue);
              setListViewTableData(searchValueData);
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, value);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(value);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method, index) => (
                    <ActionListItem key={index} title={method.title} value={method.key} />
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
                  Array.isArray(value) ? value : undefined,
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as DatesRangeValue);
              }}
              onClearButtonClick={() => {
                const quickFilters = selectedQuickFilter.filter((value) => value !== 'LastWeek');
                const quickFilterData = getQuickFilterData(data, quickFilters);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
                setListViewTableData(dateRangeFilterData);
                setSelectedQuickFilter(quickFilters);
              }}
            />
            <Dropdown selectionType="multiple">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter.filter((filters) => filters !== 'LastWeek')}
                onChange={({ values }) => {
                  const quickFilterData = getQuickFilterData(data, values);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter((prev) => [
                    ...prev.filter((filter) => filter === 'LastWeek'),
                    ...values,
                  ]);
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, []);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter((prev) => prev.filter((filter) => filter === 'LastWeek'));
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {extendedStatusFilters.map((method, index) => (
                    <ActionListItem
                      key={index}
                      title={method}
                      value={method}
                      isSelected={selectedQuickFilter.includes(method)}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
          data={listViewTableData}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={console.log}
          isFirstColumnSticky
          selectionType="single"
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
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
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
                    key={index}
                    item={tableItem}
                    hoverActions={
                      <>
                        <Button variant="tertiary" size="xsmall">
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel="Approve"
                          onClick={() => {
                            console.log('Approved', tableItem.id);
                          }}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel="Reject"
                          onClick={() => {
                            console.log('Rejected', tableItem.id);
                          }}
                        />
                      </>
                    }
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Amount"
                      placeholder="Enter text"
                      successText="Amount is valid"
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
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};

export const MultiSelectQuickFilterExample = MultiSelectQuickFilter.bind({});
MultiSelectQuickFilterExample.storyName = 'Multi Select Quick Filter';

const WithoutSearchExample: StoryFn<typeof ListView> = (args) => {
  const getQuickFilterValueCount = (value: string): number => {
    if (value === 'All') {
      return data.nodes.length;
    }
    return data.nodes.filter((node) => node.status === value).length;
  };
  const getQuickFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value || value === 'All') {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.status === value) };
  };
  const getMethodFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (data: TableData<Item>, value?: DatesRangeValue): TableData<Item> => {
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
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('Completed');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('paypal');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);
  const [listViewTableData, setListViewTableData] = useState(() => {
    const filteredQuickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(filteredQuickFilterData, methodFilter);
    return methodFilterData;
  });

  return (
    <BaseBox height="100%">
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
                const quickFilterData = getQuickFilterData(data, value);
                const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                setListViewTableData(dateRangeFilterData);
                setSelectedQuickFilter(value);
              }}
              defaultValue="All"
              value={selectedQuickFilter}
            >
              {quickFilters.map((status, index) => (
                <QuickFilter
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                  key={`${index}-${status}`}
                />
              ))}
            </QuickFilterGroup>
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, 'All');
              const methodFilterData = getMethodFilterData(quickFilterData, undefined);
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                value={methodFilter}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const methodFilterData = getMethodFilterData(quickFilterData, value);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(value);
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const dateRangeFilterData = getFilterRangeData(quickFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(undefined);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method, index) => (
                    <ActionListItem key={index} title={method.title} value={method.key} />
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
                const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(
                  methodFilterData,
                  Array.isArray(value) ? value : undefined,
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as DatesRangeValue);
              }}
            />
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, value);
                  const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter(value ? value : 'All');
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, 'All');
                  const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter('All');
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((method, index) => (
                    <ActionListItem
                      key={index}
                      title={method}
                      value={method}
                      isSelected={selectedQuickFilter === method}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
          data={listViewTableData}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={console.log}
          isFirstColumnSticky
          selectionType="single"
          rowDensity="normal"
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
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
                    key={index}
                    item={tableItem}
                    hoverActions={
                      <>
                        <Button variant="tertiary" size="xsmall">
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel="Approve"
                          onClick={() => {
                            console.log('Approved', tableItem.id);
                          }}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel="Reject"
                          onClick={() => {
                            console.log('Rejected', tableItem.id);
                          }}
                        />
                      </>
                    }
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Amount"
                      placeholder="Enter text"
                      successText="Amount is valid"
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
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};

export const WithoutSearchExampleStory = WithoutSearchExample.bind({});
WithoutSearchExampleStory.storyName = 'Without Search Example';

const WithDropDownSearchExample: StoryFn<typeof ListView> = (args) => {
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
  const getQuickFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value || value === 'All') {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.status === value) };
  };
  const getSearchedData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.paymentId.includes(value)) };
  };
  const getMethodFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => node.method.key === value) };
  };

  const getFilterRangeData = (data: TableData<Item>, value?: DatesRangeValue): TableData<Item> => {
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

  const handleSearchChange = (value?: string): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const searchValueData = getSearchedData(quickFilterData, value);
    const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue(value);
  };

  const handleSearchClear = (): void => {
    const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
    const methodFilterData = getMethodFilterData(quickFilterData, methodFilter);
    const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
    setListViewTableData(dateRangeFilterData);
    setSearchValue('');
  };

  const isMobile = useIsMobile();
  const searchTrailing = (
    <Dropdown>
      <InputDropdownButton
        value={selectedQuickFilter}
        onChange={({ value }) => {
          const quickFilterData = getQuickFilterData(data, value);
          const searchValueData = getSearchedData(quickFilterData, searchValue);
          const dateRangeFilterData = getFilterRangeData(searchValueData, filterDateRange);
          setListViewTableData(dateRangeFilterData);
          setSelectedQuickFilter(value);
        }}
      />
      <DropdownOverlay>
        <ActionList>
          {quickFilters.map((status, index) => (
            <ActionListItem
              key={index}
              title={status}
              value={status}
              isSelected={selectedQuickFilter === status}
            />
          ))}
        </ActionList>
      </DropdownOverlay>
    </Dropdown>
  );
  return (
    <BaseBox height="100%">
      {isMobile && (
        <SearchInput
          label=""
          value={searchValue}
          placeholder="Search for Payment Id"
          onChange={({ value }) => handleSearchChange(value)}
          onClearButtonClick={handleSearchClear}
          trailing={searchTrailing}
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
              {quickFilters.map((status, index) => (
                <QuickFilter
                  title={status}
                  value={status}
                  trailing={<Counter value={getQuickFilterValueCount(status)} color="neutral" />}
                  key={`${index}-${status}`}
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
              <Box width="280px">
                <SearchInput
                  label=""
                  value={searchValue}
                  placeholder="Search for Payment Id"
                  onChange={({ value }) => handleSearchChange(value)}
                  onClearButtonClick={handleSearchClear}
                  trailing={searchTrailing}
                />
              </Box>
            )
          }
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, 'All');
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              const methodFilterData = getMethodFilterData(searchValueData, '');
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter(undefined);
              setFilterDateRange(undefined);
              setSelectedQuickFilter('All');
            }}
          >
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Method"
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, value);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                  setListViewTableData(dateRangeFilterData);
                  setMethodFilter(value);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {MethodFilterValues.map((method, index) => (
                    <ActionListItem key={index} title={method.title} value={method.key} />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <FilterChipDatePicker
              label="Date Range"
              selectionType="range"
              onChange={(value) => {
                const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(
                  methodFilterData,
                  Array.isArray(value) ? value : undefined,
                );
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value as DatesRangeValue);
              }}
            />
            <Dropdown selectionType="single">
              <FilterChipSelectInput
                label="Status"
                value={selectedQuickFilter !== 'All' ? selectedQuickFilter : undefined}
                onChange={({ values }) => {
                  const value = values[0];
                  const quickFilterData = getQuickFilterData(data, value);
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter(value ? value : 'All');
                }}
                onClearButtonClick={() => {
                  const quickFilterData = getQuickFilterData(data, 'All');
                  const searchValueData = getSearchedData(quickFilterData, searchValue);
                  const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                  const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
                  setListViewTableData(dateRangeFilterData);
                  setSelectedQuickFilter('All');
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  {filterChipQuickFilters.map((method, index) => (
                    <ActionListItem
                      key={index}
                      title={method}
                      value={method}
                      isSelected={selectedQuickFilter === method}
                    />
                  ))}
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
          data={listViewTableData}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={console.log}
          isFirstColumnSticky
          selectionType="single"
          rowDensity="normal"
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
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
                    key={index}
                    item={tableItem}
                    hoverActions={
                      <>
                        <Button variant="tertiary" size="xsmall">
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel="Approve"
                          onClick={() => {
                            console.log('Approved', tableItem.id);
                          }}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel="Reject"
                          onClick={() => {
                            console.log('Rejected', tableItem.id);
                          }}
                        />
                      </>
                    }
                    onClick={() => {
                      console.log('where');
                    }}
                  >
                    <TableCell>
                      <Code size="small">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Amount"
                      placeholder="Enter text"
                      successText="Amount is valid"
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
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </BaseBox>
  );
};
export const WithDropDownSearchExampleStory = WithDropDownSearchExample.bind({});
WithDropDownSearchExampleStory.storyName = 'With Dropdown in Search Example';
