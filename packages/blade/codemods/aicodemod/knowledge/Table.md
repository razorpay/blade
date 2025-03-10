# Table

A table component helps in displaying data in a grid format, through rows and columns of cells. Table facilitates data organisation and allow users to: scan, sort, compare, and take action on large amounts of data.

## Props

```ts
type TableNode<Item> = Item & {
  id: Identifier;
};

type TableData<Item> = {
  nodes: TableNode<Item>[];
};

type TableBackgroundColors = `surface.background.gray.${DotNotationToken<
  Theme['colors']['surface']['background']['gray']
>}`;

type TableHeaderProps = {
  /**
   * The children of TableHeader should be TableHeaderRow
   * @example
   * <TableHeader>
   *   <TableHeaderRow>
   *     <TableHeaderCell>Header Cell 1</TableHeaderCell>
   *   </TableHeaderRow>
   * </TableHeader>
   **/
  children: React.ReactNode;
};

type TableHeaderRowProps = {
  /**
   * The children of TableHeaderRow should be TableHeaderCell
   * @example
   * <TableHeader>
   *   <TableHeaderRow>
   *     <TableHeaderCell>Header Cell 1</TableHeaderCell>
   *   </TableHeaderRow>
   * </TableHeader>
   **/
  children: React.ReactNode;
  /**
   * The rowDensity prop determines the density of the table.
   * The rowDensity prop can be 'compact', 'normal', or'comfortable'.
   * The default value is `normal`.
   **/
  rowDensity?: TableProps<unknown>['rowDensity'];
};

type TableHeaderCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
  /**
   * The unique key of the column.
   * This is used to identify the column for sorting in sortFunctions prop of Table.
   * Sorting is enabled only for columns whose key is present in sortableColumns prop of Table.
   **/
  headerKey?: string;
};

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
   * The selectionType prop can be 'none', 'single' or 'multiple'.
   * @default 'none'
   **/
  selectionType?: 'none' | 'single' | 'multiple';
  /**
   * The onSelectionChange prop is a function that is called when the selection changes.
   * The function is called with an object that has a values property that is an array of the selected rows.
   **/
  onSelectionChange?: ({
    values,
    selectedIds,
  }: {
    /**
     * Note: on server side paginated data, this prop will only contain the selected rows on the current page.
     *
     * Thus, it's recommended to use `selectedIds` for more consistent state management across server/client paginated data.
     *
     * *Deprecated:* Use `selectedIds` instead.
     *
     * @deprecated
     */
    values: TableNode<Item>[];
    /**
     * An array of selected row ids.
     */
    selectedIds: Identifier[];
  }) => void;
  /**
   * The isHeaderSticky prop determines whether the table header is sticky or not.
   * The default value is `false`.
   **/
  isHeaderSticky?: boolean;
  /**
   * The isFooterSticky prop determines whether the table footer is sticky or not.
   * The default value is `false`.
   **/
  isFooterSticky?: boolean;
  /**
   * The isFirstColumnSticky prop determines whether the first column is sticky or not.
   * The default value is `false`.
   **/
  isFirstColumnSticky?: boolean;
  /**
   * The rowDensity prop determines the density of the table.
   * The rowDensity prop can be 'compact', 'normal', or'comfortable'.
   * The default value is `normal`.
   **/
  rowDensity?: 'compact' | 'normal' | 'comfortable';
  /**
   * The onSortChange prop is a function that is called when the sort changes.
   * The function is called with an object that has a sortKey property that is the key of the column that is sorted and a isSortReversed property that is a boolean that determines whether the sort is reversed or not.
   **/
  onSortChange?: ({
    sortKey,
    isSortReversed,
  }: {
    sortKey: TableHeaderCellProps['headerKey'];
    isSortReversed: boolean;
  }) => void;
  /**
   * The sortFunctions prop is an object that has a key for each column that is sortable.
   * The value of each key is a function that is called when the column is sorted.
   * The function is called with an array of the rows in the table.
   * The function should return an array of the rows in the table.
   **/
  sortFunctions?: Record<string, (array: TableNode<Item>[]) => TableNode<Item>[]>;
  /**
   * The toolbar prop is a React element that is rendered above the table.
   * The toolbar prop should be a `TableToolbar` component.
   **/
  toolbar?: React.ReactElement;
  /**
   * The pagination prop is a React element that is rendered below the table.
   * The pagination prop should be a `TablePagination` component.
   **/
  pagination?: React.ReactElement;
  /**
   * The height prop is a responsive styled prop that determines the height of the table.
   **/
  height?: BoxProps['height'];
  /**
   * The showStripedRows prop determines whether the table should have striped rows or not.
   * The default value is `false`.
   **/
  showStripedRows?: boolean;
  /**
   * The gridTemplateColumns prop determines the grid-template-columns CSS property of the table.
   * The default value is `repeat(${columnCount},minmax(100px, 1fr))`.
   **/
  gridTemplateColumns?: string;
  /**
   * The isLoading prop determines whether the table is loading or not.
   * The default value is `false`.
   **/
  isLoading?: boolean;
  /**
   * The isRefreshing prop determines whether the table is refreshing or not.
   * The default value is `false`.
   **/
  isRefreshing?: boolean;
  /**
   * The showBorderedCells prop determines whether the table should have bordered cells or not.
   **/
  showBorderedCells?: boolean;
} & StyledPropsBlade;

type Identifier = string | number;

type TableBodyProps = {
  /**
   * The children of the TableBody component should be TableRow components.
   * @example
   * <TableBody>
   *   <TableRow>
   *     <TableCell>...</TableCell>
   *   </TableRow>
   * </TableBody>
   **/
  children: React.ReactNode;
};

type TableRowProps<Item> = {
  /**
   * The children of the TableRow component should be TableCell components.
   * @example
   * <TableRow>
   *   <TableCell>...</TableCell>
   * </TableRow>
   **/
  children: React.ReactNode;
  /**
   * The item prop is used to pass the individual table item to the TableRow component.
   * @example
   * tableData.map((tableItem) => (
   *   <TableRow item={item}>
   *     <TableCell>...</TableCell>
   *   </TableRow>
   * ));
   **/
  item: TableNode<Item>;
  /**
   * The isDisabled prop is used to disable the TableRow component.
   * @example
   * <TableRow isDisabled>
   *   <TableCell>...</TableCell>
   * </TableRow>
   **/
  isDisabled?: boolean;
  /**
   * Callback triggered when the row is hovered. It is called with the current row item prop.
   */
  onHover?: ({ item }: { item: TableNode<Item> }) => void;
  /**
   * Callback triggered when the row is clicked. It is called with the current row item prop.
   */
  onClick?: ({ item }: { item: TableNode<Item> }) => void;
};

type TableCellProps = {
  /**
   * The children of the TableCell component should be a string or a ReactNode.
   * @example
   * <TableCell>{'Hello'}</TableCell>
   * <TableCell>
   *  <Text>...</Text>
   * </TableCell>
   * <TableCell>
   * <Button>...</Button>
   * </TableCell>
   **/
  children: React.ReactNode;
};

type TableEditableCellProps = Pick<
  BaseInputProps,
  | 'validationState'
  | 'placeholder'
  | 'defaultValue'
  | 'name'
  | 'onChange'
  | 'onFocus'
  | 'onBlur'
  | 'value'
  | 'isDisabled'
  | 'isRequired'
  | 'prefix'
  | 'suffix'
  | 'maxCharacters'
  | 'autoFocus'
  | 'keyboardReturnKeyType'
  | 'autoCompleteSuggestionType'
  | 'onSubmit'
  | 'autoCapitalize'
  | 'testID'
  | 'onClick'
  | 'leadingIcon'
  | 'trailingButton'
  | 'errorText'
  | 'successText'
> & {
  accessibilityLabel: NonNullable<BaseInputProps['accessibilityLabel']>;
};

type TableFooterProps = {
  /**
   * The children of TableFooter should be TableFooterRow
   * @example
   * <TableFooter>
   *   <TableFooterRow>
   *     <TableFooterCell>Footer Cell 1</TableFooterCell>
   *   </TableFooterRow>
   * </TableFooter>
   **/
  children: React.ReactNode;
};

type TableFooterRowProps = {
  /**
   * The children of TableFooterRow should be TableFooterCell
   * @example
   * <TableFooter>
   *   <TableFooterRow>
   *     <TableFooterCell>Footer Cell 1</TableFooterCell>
   *   </TableFooterRow>
   * </TableFooter>
   **/
  children: React.ReactNode;
};

type TableFooterCellProps = {
  /**
   * The children of TableHeaderCell can be a string or a ReactNode.
   **/
  children: string | React.ReactNode;
};

type TablePaginationCommonProps = {
  /**
   * The default page size.
   * Page size controls how rows are shown per page.
   * @default 10
   **/
  defaultPageSize?: 10 | 25 | 50;
  /**
   * The current page. Passing this prop will make the component controlled and will not update the page on its own.
   **/
  currentPage?: number;

  /**
   * Callback function that is called when the page size is changed
   */
  onPageSizeChange?: ({ pageSize }: { pageSize: number }) => void;
  /**
   * Whether to show the page size picker. It will be always be hidden on mobile.
   * Page size picker controls how rows are shown per page.
   * @default true
   */
  showPageSizePicker?: boolean;
  /**
   * Whether to show the page number selector. It will be always be hidden on mobile.
   * Page number selectors is a group of buttons that allows the user to jump to a specific page.
   * @default false
   */
  showPageNumberSelector?: boolean;
  /**
   * Content of the label to be shown in the pagination component
   * @default `Showing 1 to ${totalItems} Items`
   */
  label?: string;
  /**
   * Whether to show the label. It will be always be hidden on mobile.
   * @default false
   */
  showLabel?: boolean;
};

type TablePaginationType = 'client' | 'server';

type TablePaginationServerProps = TablePaginationCommonProps & {
  /**
   * Whether the pagination is happening on client or server.
   * If the pagination is happening on `client`, the Table component will **divide the data into pages** and show the pages based on the page size.
   * If the pagination is happening on `server`, the Table component will **not divide the data into pages and will show all the data**. You will have to fetch data for each page as the page changes and pass it to the Table component.
   * When paginationType is `server`, the `onPageChange` & `totalItemCount` props are required.
   * @default 'client'
   * */
  paginationType?: Extract<TablePaginationType, 'server'>;
  /**
   * The total number of possible items in the table. This is used to calculate the total number of pages when pagination is happening on server and not all the data is fetched at once.
   */
  totalItemCount: number;
  /**
   * Callback function that is called when the page is changed
   */
  onPageChange: ({ page }: { page: number }) => void;
};

type TablePaginationClientProps = TablePaginationCommonProps & {
  /**
   * Whether the pagination is happening on client or server.
   * If the pagination is happening on `client`, the Table component will **divide the data into pages** and show the pages based on the page size.
   * If the pagination is happening on `server`, the Table component will **not divide the data into pages and will show all the data**. You will have to fetch data for each page as the page changes and pass it to the Table component.
   * When paginationType is `server`, the `onPageChange` & `totalItemCount` props are required.
   * @default 'client'
   * */
  paginationType?: Extract<TablePaginationType, 'client'>;
  /**
   * The total number of possible items in the table. This is used to calculate the total number of pages when pagination is happening on server and not all the data is fetched at once.
   */
  totalItemCount?: number;
  /**
   * Callback function that is called when the page is changed
   */
  onPageChange?: ({ page }: { page: number }) => void;
};

type TablePaginationProps = TablePaginationCommonProps &
  (TablePaginationServerProps | TablePaginationClientProps);

type TableToolbarProps = {
  /**
   * The children of TableToolbar should be TableToolbarActions
   */
  children?: React.ReactNode;
  /**
   * The title of the TableToolbar. If not provided, it will show the default title.
   * @default `Showing 1 to ${totalItems} Items`
   */
  title?: string;
  /**
   * The title to show when items are selected. If not provided, it will show the default title.
   * @default `${selectedRows.length} 'Items'} Selected`
   */
  selectedTitle?: string;
};

type TableToolbarActionsProps = {
  children?: React.ReactNode;
} & StyledPropsBlade;
```

## Example

```jsx
import {
  Table,
  TableEditableCell,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarActions,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
} from '@razorpay/blade/components';

const nodes: Item[] = [
  ...Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: `rzp${Math.floor(Math.random() * 1000000)}`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(2021, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
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
  id: string,
  paymentId: string,
  amount: number,
  status: string,
  date: Date,
  type: string,
  method: string,
  bank: string,
  account: string,
  name: string,
};
const data: TableData<Item> = {
  nodes,
};

const TableComponent: StoryFn<typeof Table> = ({ ...args }) => {
  return (
    <Box
      backgroundColor={args.backgroundColor ?? 'surface.background.gray.intense'}
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Table
        {...args}
        data={data}
        toolbar={
          <TableToolbar title="Showing 1-10 [Items]" selectedTitle="Showing 1-10 [Items]">
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.2">
                Export
              </Button>
              <Button>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        sortFunctions={{
          ID: (array) => array.sort((a, b) => Number(a.id) - Number(b.id)),
          AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
          PAYMENT_ID: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
          DATE: (array) => array.sort((a, b) => a.date.getTime() - b.date.getTime()),
          STATUS: (array) => array.sort((a, b) => a.status.localeCompare(b.status)),
        }}
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
        {/* tableData variables has things that you passed from data.nodes in Table component */}
        {(tableData) => (
          <>
            {/* Add when you need header */}
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
                <TableRow key={index} item={tableItem}>
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
            {/* Add when you need footer */}
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                {args.selectionType === 'multiple' ? <TableFooterCell>-</TableFooterCell> : null}
                <TableFooterCell>
                  <Amount value={10} />
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>
    </Box>
  );
};
```

# Virtualized Table

Virtaulized table is a table component that renders only the visible rows and columns. This is useful when you have a large dataset and you want to render only the visible rows and columns to improve the performance of the table.

Out implementation of virtualized table is an wrapper on top of react-table-library 's implementation. It provides a simple API to create a virtualized table.

## Props

most of props are same as Table component. we have added following table component.


but their is a change in children prop of Table component. In virtualized table we need to pass a component named TableVirtulized that takes TableHeader, TableBody components.
VirtualizedTable is a wrapper on top of react-table-library's [Virtualized](https://github.com/table-library/react-table-library/blob/master/src/virtualized/Virtualized.tsx) component. It provides a simple API to create a virtualized table.

```ts
type VirtualizedWrapperProps<Item> = {
  /**
   * * @example
   *   <TableComponent
   *      data={data}
   *      isVirtualized
   *      rowDensity="compact"
   *      selectionType="multiple"
   *      height="700px"
   *      toolbar={
   *        <TableToolbar>
   *          <TableToolbarActions>
   *            <Button variant="secondary" marginRight="spacing.2">
   *              Export
   *            </Button>
   *            <Button>Payout</Button>
   *          </TableToolbarActions>
   *        </TableToolbar>
   *      }
   *    >
   *      {(tableData) => (
   *        <TableVirtualizedWrapper tableData={tableData}>
   *          <TableHeader>
   *            <TableHeaderRow>
   *              <TableHeaderCell>ID</TableHeaderCell>
   *              <TableHeaderCell>Amount</TableHeaderCell>
   *              <TableHeaderCell>Account</TableHeaderCell>
   *              <TableHeaderCell>Date</TableHeaderCell>
   *              <TableHeaderCell>Method</TableHeaderCell>
   *              <TableHeaderCell>Status</TableHeaderCell>
   *            </TableHeaderRow>
   *          </TableHeader>
   *          <TableBody<Item>>
   *            {(tableItem, index) => (
   *              <TableRow
   *                key={index}
   *                item={tableItem}
   *                hoverActions={
   *                  <>
   *                    <IconButton
   *                      accessibilityLabel="Copy"
   *                      isHighlighted
   *                      icon={CopyIcon}
   *                      onClick={() => console.log('copy', tableItem)}
   *                    />
   *                    <IconButton
   *                      accessibilityLabel="Delete"
   *                      isHighlighted
   *                      icon={TrashIcon}
   *                      onClick={() => console.log('delete', tableItem)}
   *                    />
   *                  </>
   *                }
   *              >
   *                <TableCell>
   *                  <Code size="medium">{tableItem.paymentId}</Code>
   *                </TableCell>
   *                <TableCell>
   *                  <Amount value={tableItem.amount} />
   *                </TableCell>
   *                <TableCell>{tableItem.account}</TableCell>
   *                <TableCell>
   *                  {tableItem.date?.toLocaleDateString('en-IN', {
   *                    year: 'numeric',
   *                    month: '2-digit',
   *                    day: '2-digit',
   *                  })}
   *                </TableCell>
   *                <TableCell>{tableItem.method}</TableCell>
   *                <TableCell>
   *                  <Badge
   *                    size="medium"
   *                    color={
   *                      tableItem.status === 'Completed'
   *                        ? 'positive'
   *                        : tableItem.status === 'Pending'
   *                        ? 'notice'
   *                        : tableItem.status === 'Failed'
   *                        ? 'negative'
   *                        : 'default'
   *                    }
   *                  >
   *                    {tableItem.status}
   *                  </Badge>
   *                </TableCell>
   *              </TableRow>
   *            )}
   *          </TableBody>
   *        </TableVirtualizedWrapper>
   *      )}
   *    </TableComponent>
   *
   **/
  /**
   /**
   * The tableData prop is an array of objects.
   */
  tableData: TableNode<Item>[];
  /**
   * headerHeight is the height of the header
   **/
  headerHeight?: number;
  /**
   * rowHeight is the height of each row, it can be a fixed number or a function that returns a number
   **/
  rowHeight?: (item: TableLibraryTableNode, index: number) => number;
  children: React.ReactNode;
  children: React.ReactNode;
};
```
