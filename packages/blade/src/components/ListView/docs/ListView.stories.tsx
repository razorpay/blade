import type { StoryFn, Meta } from '@storybook/react';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useHistory, BrowserRouter } from 'react-router-dom';
import storyRouterDecorator from 'storybook-react-router';
import { ListView } from '../ListView';
import type { ListViewProps } from '../types';
import { ListViewFilters } from '../ListViewFilters';
import {
  TopNav,
  TopNavActions,
  TopNavContent,
  TopNavBrand,
  TabNavItems,
  TabNav,
  TabNavItem,
} from '~components/TopNav';
import type { TabNavItemProps } from '~components/TopNav';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Text } from '~components/Typography';

import type { TableData } from '~components/Table/types';
import { BaseBox } from '~components/Box/BaseBox';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import {
  AcceptPaymentsIcon,
  AwardIcon,
  ShoppingBagIcon,
  ChevronDownIcon,
  ActivityIcon,
  AnnouncementIcon,
  ChevronRightIcon,
  HomeIcon,
  RazorpayxPayrollIcon,
  SearchIcon,
  CheckIcon,
  CloseIcon,
  LayoutIcon,
  PaymentGatewayIcon,
  PaymentLinkIcon,
  PaymentPagesIcon,
  PaymentButtonIcon,
} from '~components/Icons';
import { Box } from '~components/Box';
import type { SideNavProps } from '~components/SideNav';
import {
  SideNav,
  SideNavBody,
  SideNavSection,
  SideNavLevel,
  SideNavLink,
  SIDE_NAV_EXPANDED_L1_WIDTH_BASE,
  SIDE_NAV_EXPANDED_L1_WIDTH_XL,
} from '~components/SideNav';
import { RazorpayLogo } from '~components/SideNav/docs/RazorpayLogo';
import { SearchInput } from '~components/Input/SearchInput';
import { Tooltip } from '~components/Tooltip';
import { Avatar } from '~components/Avatar';
import { Menu, MenuFooter, MenuHeader, MenuItem, MenuOverlay } from '~components/Menu';
import { Link as BladeLink } from '~components/Link';
import type { IconComponent } from '~components/Icons';
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
import { makeSize, useBreakpoint, useTheme } from '~utils';

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
         ListView,
         ListViewFilters,
         BaseBox,
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
       } from '@razorpay/blade/components';
       
       const nodes = [
         ...Array.from({ length: 30 }, (_, i) => ({
           id: (i + 1).toString(),
           paymentId: Math.floor(Math.random() * 1000000)},
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
             nodes: data.nodes.filter(
               (node) => node.date >= value[0] && node.date <= value[1]
             ),
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
                 <FilterChipGroup onClearButtonClick={() => {}}>
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
           </BaseBox>
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

const DashboardBackground = styled.div(() => {
  return {
    height: '100vh',
    background: 'radial-gradient(94.74% 64.44% at 29.03% 15.17%, #FFFFFF 0%, #90A5BB 100%)',
  };
});

const ExploreItem = ({
  icon: Icon,
  title,
  description,
}: {
  icon: IconComponent;
  title?: string;
  description: string;
}): React.ReactElement => {
  return (
    <Box display="flex" gap="spacing.4">
      <Box
        borderRadius="medium"
        padding="spacing.5"
        backgroundColor="surface.background.gray.subtle"
      >
        <Icon color="interactive.icon.neutral.subtle" size="medium" />
      </Box>
      <Box>
        <Text color="surface.text.gray.subtle" size="medium" weight="semibold">
          {title}
        </Text>
        <Text size="small" color="surface.text.gray.muted">
          {description}
        </Text>
      </Box>
    </Box>
  );
};

const TabNavItemLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<TabNavItemProps, 'as'> & {
    activeOnLinks?: string[];
  }
>((props, ref) => {
  return <TabNavItem ref={ref} {...props} isActive={props.href === '/home'} />;
});

const SideNavExample = ({
  isOpen,
  onDismiss,
}: Pick<SideNavProps, 'isOpen' | 'onDismiss'>): React.ReactElement => {
  return (
    <SideNav isOpen={isOpen} onDismiss={onDismiss} position="absolute">
      <SideNavBody>
        <SideNavLink icon={HomeIcon} title="Home" href="/home" as={Link} />
        <SideNavLink icon={LayoutIcon} title="L2 Trigger" href="/l2-item" as={Link}>
          <SideNavLevel>
            <SideNavLink title="L2 Item" href="/l2-item" as={Link} />
            <SideNavLink title="L2 Item 2" href="/l2-item-2" as={Link} />
            <SideNavLink title="L3 Trigger" href={'/l3-item-2'} as={Link}>
              <SideNavLevel>
                <SideNavLink title="L3 Item" href="/l3-item" as={Link} />
                <SideNavLink title="L3 Item 2" href="/l3-item-2" as={Link} />
              </SideNavLevel>
            </SideNavLink>
          </SideNavLevel>
        </SideNavLink>

        <SideNavSection title="Products" maxVisibleItems={2}>
          <SideNavLink icon={PaymentGatewayIcon} title="Gateway" href="/gateway" as={Link} />
          <SideNavLink icon={PaymentLinkIcon} title="Links" href="/links" as={Link} />
          <SideNavLink icon={PaymentPagesIcon} title="Pages" href="/pages" as={Link} />
          <SideNavLink icon={PaymentButtonIcon} title="Button" href="/button" as={Link} />
        </SideNavSection>
      </SideNavBody>
    </SideNav>
  );
};
const ListViewTemplate: StoryFn<typeof ListView> = (args) => {
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('Pending');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<Date[] | undefined>(undefined);

  const getQuickFilterValueCount = (value: string): number => {
    return data.nodes.filter((node) => node.status === value).length;
  };
  const getQuickFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
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
      nodes: data.nodes.filter((node) => node.date >= value[0] && node.date <= value[1]),
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
          <FilterChipGroup onClearButtonClick={() => {}}>
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
                const dateRangeFilterData = getFilterRangeData(methodFilterData, value);
                setListViewTableData(dateRangeFilterData);
                setFilterDateRange(value);
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

export const Default = ListViewTemplate.bind({});
Default.storyName = 'List View Example';

const ListViewFullExample: StoryFn<typeof ListView> = (args): React.ReactElement => {
  const history = useHistory();
  const { theme } = useTheme();
  const { matchedBreakpoint, matchedDeviceType } = useBreakpoint({
    breakpoints: theme.breakpoints,
  });
  const isTablet = matchedBreakpoint === 'm';
  const isMobile = matchedDeviceType === 'mobile';
  const [isSideBarOpen, setIsSideBarOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);
  const [listViewTableData, setListViewTableData] = useState(data);
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('Pending');
  const [searchValue, setSearchValue] = useState<string | undefined>('');
  const [methodFilter, setMethodFilter] = useState<string | undefined>('');
  const [filterDateRange, setFilterDateRange] = useState<Date[] | undefined>(undefined);

  const getQuickFilterValueCount = (value: string): number => {
    return data.nodes.filter((node) => node.status === value).length;
  };
  const getQuickFilterData = (data: TableData<Item>, value?: string): TableData<Item> => {
    if (!value) {
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
      nodes: data.nodes.filter((node) => node.date >= value[0] && node.date <= value[1]),
    };
  };

  return (
    <BrowserRouter>
      <DashboardBackground>
        <BaseBox backgroundColor="interactive.background.gray.default">
          <TopNav>
            {isMobile ? (
              <>
                <BladeLink icon={HomeIcon} size="medium" href="/home">
                  Home
                </BladeLink>
                <Heading textAlign="center" size="small" weight="semibold">
                  Payments
                </Heading>
                <Menu openInteraction="click">
                  <Avatar size="medium" name="Anurag Hazra" />
                  <MenuOverlay>
                    <MenuHeader title="Profile" />
                    <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                      <Avatar size="medium" name="John Doe" />
                      <Box display="flex" flexDirection="column" gap="spacing.2">
                        <Text size="medium" weight="semibold">
                          John Doe
                        </Text>
                        <Text size="xsmall" color="surface.text.gray.muted">
                          Razorpay Trusted Merchant
                        </Text>
                      </Box>
                    </Box>
                    <MenuItem>
                      <Text color="surface.text.gray.subtle">Settings</Text>
                    </MenuItem>
                    <MenuItem color="negative">
                      <Text color="feedback.text.negative.intense">Logout</Text>
                    </MenuItem>
                  </MenuOverlay>
                </Menu>
              </>
            ) : (
              <>
                <TopNavBrand>
                  <RazorpayLogo />
                </TopNavBrand>
                <TopNavContent>
                  <TabNav
                    items={[
                      { title: 'Home', href: '/home', icon: HomeIcon },
                      {
                        href: '/payroll',
                        title: 'Payroll',
                        icon: RazorpayxPayrollIcon,
                        description: 'Automate payroll with ease.',
                      },
                      {
                        href: '/payments',
                        title: 'Payments',
                        icon: AcceptPaymentsIcon,
                        description: 'Manage payments effortlessly.',
                      },
                      {
                        href: '/magic-checkout',
                        title: 'Magic Checkout',
                        icon: ShoppingBagIcon,
                        description: 'Fast, one-click checkout.',
                      },
                      {
                        href: '/rize',
                        title: 'Rize',
                        icon: AwardIcon,
                        isAlwaysOverflowing: true,
                        description: 'Boost your business growth.',
                      },
                    ]}
                  >
                    {({ items, overflowingItems }) => {
                      const activeProduct = overflowingItems.find(
                        (item) => item.href === selectedProduct,
                      );
                      return (
                        <>
                          <TabNavItems>
                            {items.map((item) => {
                              return (
                                <TabNavItemLink
                                  key={item.title}
                                  title={item.title}
                                  href={item.href}
                                  icon={item.icon}
                                />
                              );
                            })}
                          </TabNavItems>
                          {overflowingItems.length ? (
                            <Menu openInteraction="hover">
                              <TabNavItem
                                title={activeProduct ? `More: ${activeProduct.title}` : 'More'}
                                trailing={<ChevronDownIcon />}
                                isActive={Boolean(activeProduct)}
                              />
                              <MenuOverlay>
                                <MenuHeader
                                  title="Products for you"
                                  trailing={
                                    <Badge emphasis="subtle" color="notice">
                                      Recommended
                                    </Badge>
                                  }
                                />
                                {overflowingItems.map((item) => {
                                  return (
                                    <MenuItem
                                      key={item.href}
                                      onClick={() => {
                                        history.push(item.href!);
                                        setSelectedProduct(item.href!);
                                      }}
                                    >
                                      <ExploreItem
                                        icon={item.icon!}
                                        title={item.title}
                                        description={item.description!}
                                      />
                                    </MenuItem>
                                  );
                                })}
                                <MenuFooter>
                                  <BladeLink href="" icon={ChevronRightIcon} iconPosition="right">
                                    View all products
                                  </BladeLink>
                                </MenuFooter>
                              </MenuOverlay>
                            </Menu>
                          ) : null}
                        </>
                      );
                    }}
                  </TabNav>
                </TopNavContent>
                <TopNavActions>
                  {isTablet ? (
                    <Tooltip content="Search in payments">
                      <Button
                        size={isMobile ? 'small' : 'medium'}
                        variant="tertiary"
                        icon={SearchIcon}
                      />
                    </Tooltip>
                  ) : (
                    <SearchInput
                      placeholder="Search in payments"
                      accessibilityLabel="Search Across Razorpay"
                    />
                  )}
                  <Tooltip content="View Ecosystem Health">
                    <Button
                      size={isMobile ? 'small' : 'medium'}
                      variant="tertiary"
                      icon={ActivityIcon}
                    />
                  </Tooltip>
                  <Tooltip content="View Announcements">
                    <Button
                      size={isMobile ? 'small' : 'medium'}
                      variant="tertiary"
                      icon={AnnouncementIcon}
                    />
                  </Tooltip>
                  <Menu openInteraction="click">
                    <Avatar size="medium" name="Anurag Hazra" />
                    <MenuOverlay>
                      <MenuHeader title="Profile" />
                      <Box display="flex" gap="spacing.4" padding="spacing.4" alignItems="center">
                        <Avatar size="medium" name="John Doe" />
                        <Box display="flex" flexDirection="column" gap="spacing.2">
                          <Text size="medium" weight="semibold">
                            John Doe
                          </Text>
                          <Text size="xsmall" color="surface.text.gray.muted">
                            Razorpay Trusted Merchant
                          </Text>
                        </Box>
                      </Box>
                      <MenuItem>
                        <Text color="surface.text.gray.subtle">Settings</Text>
                      </MenuItem>
                      <MenuItem color="negative">
                        <Text color="feedback.text.negative.intense">Logout</Text>
                      </MenuItem>
                    </MenuOverlay>
                  </Menu>
                </TopNavActions>
              </>
            )}
          </TopNav>
          <Box
            overflow="hidden"
            position="relative"
            borderRadius="large"
            borderTopRightRadius="none"
            borderBottomLeftRadius="none"
            borderBottomRightRadius="none"
            height="100%"
            marginX={{ base: 'spacing.0', m: 'spacing.3' }}
          >
            <SideNavExample
              isOpen={isSideBarOpen}
              onDismiss={() => {
                setIsSideBarOpen(false);
              }}
            />
            <Box
              marginLeft={{
                base: '100%',
                m: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_BASE),
                xl: makeSize(SIDE_NAV_EXPANDED_L1_WIDTH_XL),
              }}
              // 100vh - (topnav height [56px] + border [2px])
              height="calc(100vh - 58px)"
            >
              <Box
                height="100vh"
                padding="spacing.5"
                overflowY="scroll"
                backgroundColor="surface.background.gray.moderate"
              >
                <BaseBox height="100%">
                  <Heading size="xlarge"> Settlements</Heading>
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
                              const methodFilterData = getMethodFilterData(
                                searchValueData,
                                methodFilter,
                              );
                              const dateRangeFilterData = getFilterRangeData(
                                methodFilterData,
                                filterDateRange,
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
                          const quickFilterData = getQuickFilterData(data, selectedQuickFilter);
                          const searchValueData = getSearchedData(quickFilterData, value);
                          const methodFilterData = getMethodFilterData(
                            searchValueData,
                            methodFilter,
                          );
                          const dateRangeFilterData = getFilterRangeData(
                            methodFilterData,
                            filterDateRange,
                          );
                          setListViewTableData(dateRangeFilterData);
                          setSearchValue(value);
                        }}
                        searchValuePlaceholder="Search for Payment Id"
                      >
                        <FilterChipGroup onClearButtonClick={() => {}}>
                          <Dropdown selectionType="single">
                            <FilterChipSelectInput
                              label="Method"
                              onChange={({ values }) => {
                                const value = values[0];
                                const quickFilterData = getQuickFilterData(
                                  data,
                                  selectedQuickFilter,
                                );
                                const searchValueData = getSearchedData(
                                  quickFilterData,
                                  searchValue,
                                );
                                const methodFilterData = getMethodFilterData(
                                  searchValueData,
                                  value,
                                );
                                const dateRangeFilterData = getFilterRangeData(
                                  methodFilterData,
                                  filterDateRange,
                                );

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
                              const methodFilterData = getMethodFilterData(
                                searchValueData,
                                methodFilter,
                              );
                              const dateRangeFilterData = getFilterRangeData(
                                methodFilterData,
                                value,
                              );
                              setListViewTableData(dateRangeFilterData);
                              setFilterDateRange(value);
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
                </BaseBox>
              </Box>
            </Box>
          </Box>
        </BaseBox>
      </DashboardBackground>
    </BrowserRouter>
  );
};
export const FullExample = ListViewFullExample.bind({});
FullExample.storyName = 'Full example';
