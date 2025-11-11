## Component Name

Table

## Description

A table component that displays data in a grid format through rows and columns of cells. Table facilitates data organization and allows users to scan, sort, compare, and take action on large amounts of data. It supports features like row selection, pagination, sorting, sticky headers/footers, and customizable cell content.

## Important Constraints

- `Table` `toolbar` prop only accepts `TableToolbar` component

## TypeScript Types

These types define the props that the Table component and its subcomponents accept, helping you understand how to use them properly in your application.

```typescript
// The base identifier type used in tables
type Identifier = string | number;

// Defines the shape of a table node (row)
type TableNode<Item> = Item & {
  id: Identifier;
};

// The main data structure passed to Table
type TableData<Item> = {
  nodes: TableNode<Item>[];
};

// Main Table component props
type TableProps<Item> = {
  /**
   * The children of the Table component should be a function that returns TableHeader, TableBody and TableFooter components.
   * The function will be called with the tableData prop.
   */
  children: (tableData: TableNode<Item>[]) => React.ReactElement;

  /**
   * The data prop is an object with a nodes property that is an array of objects.
   * Each object in the array is a row in the table.
   * The object should have an id property that is a unique identifier for the row.
   */
  data: TableData<Item>;

  /**
   * Selection mode determines how the table rows can be selected.
   * @default 'row'
   **/
  multiSelectTrigger?: 'checkbox' | 'row';

  /**
   * The selectionType prop determines the type of selection that is allowed on the table.
   * @default 'none'
   **/
  selectionType?: 'none' | 'single' | 'multiple';

  /**
   * The onSelectionChange prop is a function that is called when the selection changes.
   **/
  onSelectionChange?: ({
    values,
    selectedIds,
  }: {
    values: TableNode<Item>[];
    selectedIds: Identifier[];
  }) => void;

  /**
   * The isHeaderSticky prop determines whether the table header is sticky or not.
   * @default false
   **/
  isHeaderSticky?: boolean;

  /**
   * The isFooterSticky prop determines whether the table footer is sticky or not.
   * @default false
   **/
  isFooterSticky?: boolean;

  /**
   * The isFirstColumnSticky prop determines whether the first column is sticky or not.
   * @default false
   **/
  isFirstColumnSticky?: boolean;

  /**
   * The rowDensity prop determines the density of the table.
   * @default 'normal'
   **/
  rowDensity?: 'compact' | 'normal' | 'comfortable';

  /**
   * The onSortChange prop is a function that is called when the sort changes.
   **/
  onSortChange?: ({
    sortKey,
    isSortReversed,
  }: {
    sortKey: string | undefined;
    isSortReversed: boolean;
  }) => void;

  /**
   * The sortFunctions prop is an object that has a key for each column that is sortable.
   **/
  sortFunctions?: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]>;

  /**
   * The toolbar prop is a React element that is rendered above the table.
   **/
  toolbar?: React.ReactElement;

  /**
   * The pagination prop is a React element that is rendered below the table.
   **/
  pagination?: React.ReactElement;

  /**
   * The height prop is a responsive styled prop that determines the height of the table.
   **/
  height?: BoxProps['height'];

  /**
   * The showStripedRows prop determines whether the table should have striped rows or not.
   * @default false
   **/
  showStripedRows?: boolean;

  /**
   * The gridTemplateColumns prop determines the grid-template-columns CSS property of the table.
   * @default `repeat(${columnCount},minmax(100px, 1fr))`
   **/
  gridTemplateColumns?: string;

  /**
   * The isLoading prop determines whether the table is loading or not.
   * @default false
   **/
  isLoading?: boolean;

  /**
   * The isRefreshing prop determines whether the table is refreshing or not.
   * @default false
   **/
  isRefreshing?: boolean;

  /**
   * The showBorderedCells prop determines whether the table should have bordered cells or not.
   **/
  showBorderedCells?: boolean;

  /**
   * An array of default selected row ids. This will be used to set the initial selected rows.
   */
  defaultSelectedIds?: Identifier[];

  /**
   * The backgroundColor prop determines the background color of the table.
   **/
  backgroundColor?: string | 'transparent';
};

// TableHeader component props
type TableHeaderProps = {
  /**
   * The children of TableHeader should be TableHeaderRow
   **/
  children: React.ReactNode;
};

// TableHeaderRow component props
type TableHeaderRowProps = {
  /**
   * The children of TableHeaderRow should be TableHeaderCell
   **/
  children: React.ReactNode;
  /**
   * The rowDensity prop determines the density of the table.
   **/
  rowDensity?: TableProps<unknown>['rowDensity'];
};

// TableHeaderCell component props
type TableHeaderCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The unique key of the column.
   * This is used to identify the column for sorting in sortFunctions prop of Table.
   **/
  headerKey?: string;
  /**
   * The textAlign prop determines the content alignment of the table.
   * @default 'left'
   **/
  textAlign?: 'left' | 'center' | 'right';
};

// TableBody component props
type TableBodyProps<Item> = {
  /**
   * The children of the TableBody component should be TableRow components.
   **/
  children: React.ReactNode | ((tableItem: Item, index: number) => React.ReactElement);
};

// TableRow component props
type TableRowProps<Item> = {
  /**
   * The children of the TableRow component should be TableCell components.
   **/
  children: React.ReactNode;
  /**
   * The item prop is used to pass the individual table item to the TableRow component.
   **/
  item: TableNode<Item>;
  /**
   * The isDisabled prop is used to disable the TableRow component.
   **/
  isDisabled?: boolean;
  /**
   * Callback triggered when the row is hovered.
   */
  onHover?: ({ item }: { item: TableNode<Item> }) => void;
  /**
   * Callback triggered when the row is clicked.
   */
  onClick?: ({ item }: { item: TableNode<Item> }) => void;
  /**
   * Actions to display when hovering over the row
   */
  hoverActions?: React.ReactElement;
};

// TableCell component props
type TableCellProps = {
  /**
   * The children of the TableCell component should be a string or a ReactNode.
   **/
  children: React.ReactNode;
  /**
   * The textAlign prop determines the content alignment of the table.
   * @default 'left'
   **/
  textAlign?: 'left' | 'center' | 'right';
};

// TableEditableCell component props
type TableEditableCellProps = {
  // Input related props
  validationState?: 'none' | 'error' | 'success';
  placeholder?: string;
  defaultValue?: string;
  name?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  value?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  maxCharacters?: number;
  autoFocus?: boolean;
  errorText?: string;
  successText?: string;
  // Required prop
  accessibilityLabel: string;
};

// TableFooter component props
type TableFooterProps = {
  /**
   * The children of TableFooter should be TableFooterRow
   **/
  children: React.ReactNode;
};

// TableFooterRow component props
type TableFooterRowProps = {
  /**
   * The children of TableFooterRow should be TableFooterCell
   **/
  children: React.ReactNode;
};

// TableFooterCell component props
type TableFooterCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The textAlign prop determines the content alignment of the table.
   * @default 'left'
   **/
  textAlign?: 'left' | 'center' | 'right';
};

// TableToolbar component props
type TableToolbarProps = {
  /**
   * The children of TableToolbar should be TableToolbarActions
   */
  children?: React.ReactNode;
  /**
   * The title of the TableToolbar.
   * @default `Showing 1 to ${totalItems} Items`
   */
  title?: string;
  /**
   * The title to show when items are selected.
   * @default `${selectedRows.length} 'Items'} Selected`
   */
  selectedTitle?: string;
  /**
   * Controls how the TableToolbar is positioned relative to the TableHeader.
   * - `inline`: Renders the toolbar above the TableHeader as part of the normal layout (default).
   * - `overlay`: Renders the toolbar over the TableHeader.
   *
   * Defaults to `inline`.
   */
  placement?: 'inline' | 'overlay';
};

// TablePagination component props
type TablePaginationProps = {
  /**
   * The default page size.
   * @default 10
   **/
  defaultPageSize?: 10 | 25 | 50;

  /**
   * The current page. Passing this prop will make the component controlled.
   **/
  currentPage?: number;

  /**
   * Callback function that is called when the page size is changed
   */
  onPageSizeChange?: ({ pageSize }: { pageSize: number }) => void;

  /**
   * Whether to show the page size picker.
   * @default true
   */
  showPageSizePicker?: boolean;

  /**
   * Whether to show the page number selector.
   * @default false
   */
  showPageNumberSelector?: boolean;

  /**
   * Content of the label to be shown in the pagination component
   */
  label?: string;

  /**
   * Whether to show the label.
   * @default false
   */
  showLabel?: boolean;

  /**
   * Whether the pagination is happening on client or server.
   * @default 'client'
   */
  paginationType?: 'client' | 'server';

  /**
   * The total number of possible items in the table.
   * Required when paginationType is 'server'.
   */
  totalItemCount?: number;

  /**
   * Callback function that is called when the page is changed.
   * Required when paginationType is 'server'.
   */
  onPageChange?: ({ page }: { page: number }) => void;
};
```

## Example

### Comprehensive Table with Advanced Features

This example demonstrates a fully-featured payment transactions table with multiple interactive elements including selection, sorting, sticky headers, row actions, editable cells, custom toolbar, pagination, and footer summaries.

```tsx
import React, { useState } from 'react';
import {
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
  TableToolbar,
  TableToolbarActions,
  TablePagination,
  TableData,
  TableNode,
  Box,
  Text,
  Code,
  Button,
  IconButton,
  Badge,
  Amount,
  CheckIcon,
  CloseIcon,
  PlusIcon,
} from '@razorpay/blade/components';

// Define your data types
type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: Date;
  type: 'Payout' | 'Refund';
  method: string;
  bank: string;
  account: string;
  name: string;
};

const PaymentTable = () => {
  // Sample data
  const payments: PaymentItem[] = Array.from({ length: 50 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)] as
      | 'Completed'
      | 'Pending'
      | 'Failed',
    date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)] as 'Payout' | 'Refund',
    method: ['Bank Transfer', 'Credit Card', 'PayPal'][Math.floor(Math.random() * 3)],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: ['John Doe', 'Jane Smith', 'Bob Johnson'][Math.floor(Math.random() * 3)],
  }));

  const tableData: TableData<PaymentItem> = {
    nodes: payments,
  };

  // State for selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Handle selection change
  const handleSelectionChange = ({ selectedIds }: { selectedIds: (string | number)[] }) => {
    setSelectedIds(selectedIds as string[]);
    console.log('Selected IDs:', selectedIds);
  };

  // Define sort functions
  const sortFunctions = {
    PAYMENT_ID: (array: TableNode<PaymentItem>[]) =>
      [...array].sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
    AMOUNT: (array: TableNode<PaymentItem>[]) => [...array].sort((a, b) => a.amount - b.amount),
    DATE: (array: TableNode<PaymentItem>[]) =>
      [...array].sort((a, b) => a.date.getTime() - b.date.getTime()),
    STATUS: (array: TableNode<PaymentItem>[]) =>
      [...array].sort((a, b) => a.status.localeCompare(b.status)),
  };

  return (
    <Box padding="spacing.5" overflow="auto" minHeight="400px">
      <Table
        data={tableData}
        defaultSelectedIds={['1', '3']}
        onSelectionChange={handleSelectionChange}
        isFirstColumnSticky
        isHeaderSticky
        selectionType="multiple"
        rowDensity="normal"
        showStripedRows
        showBorderedCells
        sortFunctions={sortFunctions}
        toolbar={
          <TableToolbar
            title="Payment Transactions"
            selectedTitle={`${selectedIds.length} Payments Selected`}
          >
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.2" icon={PlusIcon}>
                Export
              </Button>
              <Button>Process Selected</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            defaultPageSize={10}
            showPageSizePicker
            showPageNumberSelector
            onPageChange={({ page }) => console.log('Page changed:', page)}
            onPageSizeChange={({ pageSize }) => console.log('Page size changed:', pageSize)}
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">Payment ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT" textAlign="right">
                  Amount
                </TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
                <TableHeaderCell textAlign="center">Actions</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>

            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow
                  key={index}
                  item={tableItem}
                  onClick={({ item }) => console.log('Row clicked:', item.id)}
                  onHover={({ item }) => console.log('Row hovered:', item.id)}
                  hoverActions={
                    <>
                      <Button variant="tertiary" size="xsmall">
                        View Details
                      </Button>
                      <IconButton
                        icon={CheckIcon}
                        isHighlighted
                        accessibilityLabel="Approve"
                        onClick={() => console.log('Approved', tableItem.paymentId)}
                      />
                      <IconButton
                        icon={CloseIcon}
                        isHighlighted
                        accessibilityLabel="Reject"
                        onClick={() => console.log('Rejected', tableItem.paymentId)}
                      />
                    </>
                  }
                >
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell textAlign="right">
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableEditableCell
                    accessibilityLabel="Account"
                    placeholder="Enter account number"
                    defaultValue={tableItem.account}
                    successText="Account is valid"
                    onChange={(value) => console.log('Account changed:', value)}
                  />
                  <TableCell>
                    {tableItem.date.toLocaleDateString('en-IN', {
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
                  <TableCell textAlign="center">
                    <Box display="flex" justifyContent="center" gap="spacing.2">
                      <IconButton
                        icon={CheckIcon}
                        accessibilityLabel="Approve"
                        onClick={() => console.log('Approved', tableItem.id)}
                      />
                      <IconButton
                        icon={CloseIcon}
                        accessibilityLabel="Reject"
                        onClick={() => console.log('Rejected', tableItem.id)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell textAlign="right">
                  <Amount
                    value={tableData.reduce((sum, item) => sum + item.amount, 0)}
                    weight="semibold"
                  />
                </TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>
    </Box>
  );
};

export default PaymentTable;
```

### Server-Side Pagination Example

This example shows how to implement a table with server-side pagination, where data is fetched from an API based on the current page, with loading states and proper handling of page changes.

```tsx
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TableData,
  Box,
  Spinner,
} from '@razorpay/blade/components';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

const ServerPaginatedTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  // Simulated API fetch
  const fetchUsers = async (page: number) => {
    setLoading(true);

    // Replace with actual API call
    setTimeout(() => {
      // Mock data generation for demonstration
      const newUsers = Array.from({ length: pageSize }, (_, i) => ({
        id: `user-${page * pageSize + i + 1}`,
        name: `User ${page * pageSize + i + 1}`,
        email: `user${page * pageSize + i + 1}@example.com`,
        role: ['Admin', 'User', 'Editor'][Math.floor(Math.random() * 3)],
      }));

      setUsers(newUsers);
      setTotalCount(100); // Total count from API
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const handlePageChange = ({ page }: { page: number }) => {
    setCurrentPage(page);
  };

  const tableData: TableData<User> = {
    nodes: users,
  };

  return (
    <Box padding="spacing.5">
      <Table
        data={tableData}
        isLoading={loading}
        pagination={
          <TablePagination
            paginationType="server"
            totalItemCount={totalCount}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            defaultPageSize={pageSize}
            showPageSizePicker={false}
            showPageNumberSelector
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>

            <TableBody>
              {tableData.map((user, index) => (
                <TableRow key={index} item={user}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
};

export default ServerPaginatedTable;
```

### Table Nesting Pattern

Hierarchical data display with expandable rows and animations. Use for parent-child relationships or detailed information.

```tsx
import React, { useState } from 'react';
import {
  Table,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Badge,
  Box,
  Text,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@razorpay/blade/components';

type Data = {
  id: string;
  name: string;
  totalAmount: number;
  status: string;
  nestedData: Data[];
};

type TableData = Data[];

const tableData: TableData = [
  {
    id: '1',
    name: 'John Doe',
    totalAmount: 100,
    status: 'Completed',
    nestedData: [],
  },
  {
    id: '2',
    name: 'Jane Smith',
    totalAmount: 200,
    status: 'Pending',
    nestedData: [],
  },
];
const TableNestingExample = () => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <Table data={{ nodes: tableData }}>
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {tableData.map((item) => (
              <>
                <TableRow key={item.id} item={item}>
                  <TableCell>
                    <Button
                      variant="tertiary"
                      size="xsmall"
                      icon={expandedRows.has(item.id) ? ChevronDownIcon : ChevronRightIcon}
                      onClick={() => toggleRow(item.id)}
                    />
                    {item.name}
                  </TableCell>
                  <TableCell>{item.totalAmount}</TableCell>
                  <TableCell>
                    <Badge color="positive">{item.status}</Badge>
                  </TableCell>
                </TableRow>

                {expandedRows.has(String(item.id)) && (
                  <TableRow key={`${item.id}-expanded`} item={item}>
                    <TableCell gridColumnStart={1} gridColumnEnd={4}>
                      <Box
                        backgroundColor="surface.background.gray.subtle"
                        padding="spacing.4"
                        borderRadius="medium"
                        margin="spacing.2"
                      >
                        {/* Nested content here */}
                        {item.nestedData?.map((child) => (
                          <Box key={child.id} display="flex" justifyContent="space-between">
                            <Text>{child.name}</Text>
                            <Text>{child.totalAmount}</Text>
                          </Box>
                        ))}
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};

export default TableNestingExample;
```

### Table Spanning Pattern

Row and column spanning for complex layouts with merged cells. Use for grouping related data or creating summary sections. Use grid props on TableCell to span across multiple rows or columns for merged cells.

```jsx
{/* Header spanning */}
<TableHeaderCell gridColumnStart={2} gridColumnEnd={4}>
  Combined Header
</TableHeaderCell>

<TableRow item={item}>
  {/* Span across multiple columns */}
  <TableCell gridColumnStart={1} gridColumnEnd={4}>
    Summary spanning 3 columns
  </TableCell>
</TableRow>

<TableRow item={item}>
  {/* Span across multiple rows */}
  <TableCell gridRowStart={2} gridRowEnd={4}>
    Group spanning 2 rows
  </TableCell>
</TableRow>

{/* Footer spanning */}
<TableFooterCell gridColumnStart={1} gridColumnEnd={3}>
  Total
</TableFooterCell>
```

### Table Grouping Pattern

Hierarchical grouped data with automatic tree structure. Use for categorized data with parent-child relationships.

```jsx
const TableGroupingExample = () => {
  return (
    <Table data={groupedData} isGrouped showBorderedCells>
      {(tableData) => (
        <>
          <TableHeader>
            <TableHeaderRow>
              <TableHeaderCell>Category</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>

          <TableBody>
            {tableData.map((item, index) => (
              <TableRow key={index} item={item}>
                <TableCell
                  gridColumnStart={item.treeXLevel === 0 ? 1 : undefined}
                  gridColumnEnd={item.treeXLevel === 0 ? 4 : undefined}
                >
                  {item.name}
                </TableCell>
                {item.treeXLevel !== 0 && (
                  <>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.status}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};
```
