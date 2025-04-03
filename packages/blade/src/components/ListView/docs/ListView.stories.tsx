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
import type { TableData } from '~components/Table/types';
import { BaseBox } from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { CheckIcon, CloseIcon } from '~components/Icons';
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
} from '~components/Table';
import { IconButton } from '~components/Button/IconButton';

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
           method: ['Bank Transfer', 'Credit Card', 'PayPal'][
             Math.floor(Math.random() * 3)
           ],
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
       
       const data = {
         nodes,
       };
       
       function App() {
         const [listViewTableData, setListViewTableData] = useState(data);
         const [selectedQuickFilter, setSelectedQuickFilter] = useState('Pending');
         const [searchValue, setSearchValue] = useState('');
         const [methodFilter, setMethodFilter] = useState('');
         const [filterDateRange, setFilterDateRange] = useState(undefined);
       
         const getQuickFilterValueCount = (value) => {
           return data.nodes.filter((node) => node.status === value).length;
         };
         const getQuickFilterData = (data, value) => {
           if (!value) {
             return { nodes: data.nodes };
           }
           return { nodes: data.nodes.filter((node) => node.status === value) };
         };
         const getSearchedData = (data, value) => {
           if (!value) {
             return { nodes: data.nodes };
           }
           return {
             nodes: data.nodes.filter((node) => node.paymentId.includes(value)),
           };
         };
         const getMethodFilterData = (data, value) => {
           if (!value) {
             return { nodes: data.nodes };
           }
           return { nodes: data.nodes.filter((node) => node.method === value) };
         };
       
         const getFilterRangeData = (data, value) => {
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
                   >
                     <QuickFilter
                       title="Pending"
                       value="Pending"
                       trailing={
                         <Counter
                           value={getQuickFilterValueCount('Pending')}
                           color="positive"
                         />
                       }
                     />
                     <QuickFilter
                       title="Failed"
                       value="Failed"
                       trailing={
                         <Counter
                           value={getQuickFilterValueCount('Failed')}
                           color="negative"
                         />
                       }
                     />
                     <QuickFilter
                       title="Completed"
                       value="Completed"
                       trailing={
                         <Counter
                           value={getQuickFilterValueCount('Completed')}
                           color="neutral"
                         />
                       }
                     />
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
                 searchValuePlaceholder="Search for Payment Id"
               >
                 <FilterChipGroup 
                  onClearButtonClick={() => {
                   const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                   const searchValueData = getSearchedData(quickFilterData, searchValue);
                   const methodFilterData = getMethodFilterData(searchValueData, '');
                   const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
                   setListViewTableData(dateRangeFilterData);
                   setMethodFilter('');
                   setFilterDateRange(undefined);
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
                         {['Bank Transfer', 'Credit Card', 'PayPal'].map(
                           (method, index) => (
                             <ActionListItem
                               key={index}
                               title={method}
                               value={method}
                             />
                           )
                         )}
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
                         value
                       );
                       setListViewTableData(dateRangeFilterData);
                       setFilterDateRange(value);
                     }}
                   />
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
                           <TableCell>{tableItem.method}</TableCell>
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

const nodes: Item[] = [
  ...Array.from({ length: 30 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: ['Bank Transfer', 'Credit Card', 'PayPal'][Math.floor(Math.random() * 3)],
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

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: string;
  bank: string;
  account: string;
  name: string;
};
const data: TableData<Item> = {
  nodes,
};

const DefaultExample: StoryFn<typeof ListView> = (args) => {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);

  const getQuickFilterValueCount = (value: string): number => {
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
    return { nodes: data.nodes.filter((node) => node.method === value) };
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
  return (
    <BaseBox height="100%">
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
            >
              <QuickFilter
                title="All"
                value="All"
                trailing={<Counter value={data.nodes.length} color="primary" />}
              />
              <QuickFilter
                title="Pending"
                value="Pending"
                trailing={<Counter value={getQuickFilterValueCount('Pending')} color="positive" />}
              />
              <QuickFilter
                title="Failed"
                value="Failed"
                trailing={<Counter value={getQuickFilterValueCount('Failed')} color="negative" />}
              />
              <QuickFilter
                title="Completed"
                value="Completed"
                trailing={<Counter value={getQuickFilterValueCount('Completed')} color="neutral" />}
              />
            </QuickFilterGroup>
          }
          onSearchChange={({ value }) => {
            const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
            const searchValueData = getSearchedData(quickFilterData, value);
            const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
            const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
            setListViewTableData(dateRangeFilterData);
            setSearchValue(value);
          }}
          searchValuePlaceholder="Search for Payment Id"
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              const methodFilterData = getMethodFilterData(searchValueData, '');
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter('');
              setFilterDateRange(undefined);
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
                  {['Bank Transfer', 'Credit Card', 'PayPal'].map((method, index) => (
                    <ActionListItem key={index} title={method} value={method} />
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
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
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
                    <TableCell>{tableItem.method}</TableCell>
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
    </BaseBox>
  );
};

export const Default = DefaultExample.bind({});
Default.storyName = 'Default';

const ControlledExample: StoryFn<typeof ListView> = (args) => {
  const getQuickFilterValueCount = (value: string): number => {
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
    return { nodes: data.nodes.filter((node) => node.method === value) };
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
  const [methodFilter, setMethodFilter] = useState<string | undefined>('PayPal');
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
            (methodFilter ? 1 : 0) + (Array.isArray(filterDateRange) && filterDateRange[0] ? 1 : 0)
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
              <QuickFilter
                title="All"
                value="All"
                trailing={<Counter value={data.nodes.length} color="primary" />}
              />
              <QuickFilter
                title="Pending"
                value="Pending"
                trailing={<Counter value={getQuickFilterValueCount('Pending')} color="positive" />}
              />
              <QuickFilter
                title="Failed"
                value="Failed"
                trailing={<Counter value={getQuickFilterValueCount('Failed')} color="negative" />}
              />
              <QuickFilter
                title="Completed"
                value="Completed"
                trailing={<Counter value={getQuickFilterValueCount('Completed')} color="neutral" />}
              />
            </QuickFilterGroup>
          }
          onSearchChange={({ value }) => {
            const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
            const searchValueData = getSearchedData(quickFilterData, value);
            const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
            const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
            setListViewTableData(dateRangeFilterData);
            setSearchValue(value);
          }}
          searchValuePlaceholder="Search for Payment Id"
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              const methodFilterData = getMethodFilterData(searchValueData, '');
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter('');
              setFilterDateRange(undefined);
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
                  {['Bank Transfer', 'Credit Card', 'PayPal'].map((method, index) => (
                    <ActionListItem key={index} title={method} value={method} />
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
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
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
                    <TableCell>{tableItem.method}</TableCell>
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
    </BaseBox>
  );
};

export const Controlled = ControlledExample.bind({});
Controlled.storyName = 'Controlled';

const MultiSelectQuickFilter: StoryFn<typeof ListView> = (args) => {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<DatesRangeValue | undefined>(undefined);
  const getQuickFilterValueCount = (value: string): number => {
    return data.nodes.filter((node) => node.status === value).length;
  };
  const getQuickFilterData = (data: TableData<Item>, values?: string[]): TableData<Item> => {
    if (!values?.length) {
      return { nodes: data.nodes };
    }
    return { nodes: data.nodes.filter((node) => values?.includes(node.status)) };
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
    return { nodes: data.nodes.filter((node) => node.method === value) };
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

  return (
    <BaseBox height="100%">
      <ListView>
        <ListViewFilters
          quickFilters={
            <QuickFilterGroup
              selectionType="multiple"
              onChange={({ values }) => {
                const quickFilterData = getQuickFilterData(data, values);
                const searchValueData = getSearchedData(quickFilterData, searchValue);
                const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
                const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);

                setListViewTableData(dateRangeFilterData);
                setSelectedQuickFilter(values);
              }}
            >
              <QuickFilter
                title="Pending"
                value="Pending"
                trailing={<Counter value={getQuickFilterValueCount('Pending')} color="positive" />}
              />
              <QuickFilter
                title="Failed"
                value="Failed"
                trailing={<Counter value={getQuickFilterValueCount('Failed')} color="negative" />}
              />
              <QuickFilter
                title="Completed"
                value="Completed"
                trailing={<Counter value={getQuickFilterValueCount('Completed')} color="neutral" />}
              />
            </QuickFilterGroup>
          }
          onSearchChange={({ value }) => {
            const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
            const searchValueData = getSearchedData(quickFilterData, value);
            const methodFilterData = getMethodFilterData(searchValueData, methodFilter);
            const dateRangeFilterData = getFilterRangeData(methodFilterData, filterDateRange);
            setListViewTableData(dateRangeFilterData);
            setSearchValue(value);
          }}
          searchValuePlaceholder="Search for Payment Id"
        >
          <FilterChipGroup
            onClearButtonClick={() => {
              const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
              const searchValueData = getSearchedData(quickFilterData, searchValue);
              const methodFilterData = getMethodFilterData(searchValueData, '');
              const dateRangeFilterData = getFilterRangeData(methodFilterData, undefined);
              setListViewTableData(dateRangeFilterData);
              setMethodFilter('');
              setFilterDateRange(undefined);
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
                  {['Bank Transfer', 'Credit Card', 'PayPal'].map((method, index) => (
                    <ActionListItem key={index} title={method} value={method} />
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
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
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
                    <TableCell>{tableItem.method}</TableCell>
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
    </BaseBox>
  );
};

export const MultiSelectQuickFilterExample = MultiSelectQuickFilter.bind({});
MultiSelectQuickFilterExample.storyName = 'Multi Select Quick Filter';
