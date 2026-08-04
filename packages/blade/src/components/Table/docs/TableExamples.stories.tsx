import React from 'react';
import type { Meta } from '@storybook/react-vite';
import {
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
  TableToolbar,
  TableToolbarActions,
  TableEditableCell,
  TableEditableDropdownCell,
  TablePagination,
} from '../../Table';
import type { TableExampleItem } from './exampleData';
import { createTableData, formatDate, getStatusColor } from './exampleData';
import { Box } from '~components/Box';
import { Code, Heading, Text } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Link } from '~components/Link';
import { Tooltip } from '~components/Tooltip';
import { Radio, RadioGroup } from '~components/Radio';
import { CopyIcon, InfoIcon, TrashIcon } from '~components/Icons';
import { AutoComplete } from '~components/Input/DropdownInputTriggers';
import { DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { useTheme } from '~components/BladeProvider';

const TableMeta: Meta = {
  title: 'Components/Table/Examples',
  component: Table,
  parameters: {
    viewMode: 'story',
    options: {
      showPanel: false,
    },
    previewTabs: {
      'storybook/docs/panel': {
        hidden: true,
      },
    },
    chromatic: { disableSnapshot: true },
  },
};

const ExampleWrapper = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}): React.ReactElement => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>{title}</Heading>
        {description ? <Text>{description}</Text> : null}
      </Box>
      {children}
    </Box>
  );
};

const basicTableData = createTableData(5);

export const BasicTable = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Basic Table">
      <Table data={basicTableData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{`₹${tableItem.amount.toString()}`}</TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const customCellTableData = createTableData(5);

export const TableWithCustomCellComponents = (): React.ReactElement => {
  const headerCells = [
    { title: 'ID', tooltip: 'Payment ID of the transaction' },
    { title: 'Amount', tooltip: 'Amount transacted' },
    { title: 'Date', tooltip: 'Creation date of the transaction' },
    { title: 'Status', tooltip: 'Current status of the transaction' },
  ];

  return (
    <ExampleWrapper title="Table with Custom Cell Components">
      <Table data={customCellTableData}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                {headerCells.map((headerCell) => (
                  <TableHeaderCell key={headerCell.title}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      flex={1}
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Text weight="semibold">{headerCell.title}</Text>
                      <Tooltip content={headerCell.tooltip}>
                        <IconButton
                          onClick={() => console.log('info clicked')}
                          accessibilityLabel="info"
                          icon={InfoIcon}
                        />
                      </Tooltip>
                    </Box>
                  </TableHeaderCell>
                ))}
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const sortableTableData = createTableData(5);

export const SortableTable = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Sortable Table">
      <Table
        data={sortableTableData}
        sortFunctions={{
          PAYMENT_ID: (array) =>
            array.sort((first, second) => first.paymentId.localeCompare(second.paymentId)),
          AMOUNT: (array) => array.sort((first, second) => first.amount - second.amount),
          DATE: (array) =>
            array.sort((first, second) => first.date.getTime() - second.date.getTime()),
          STATUS: (array) =>
            array.sort((first, second) => first.status.localeCompare(second.status)),
        }}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const stickyHeaderFooterTableData = createTableData(20);

export const TableWithStickyHeaderAndFooter = (): React.ReactElement => {
  const totalAmount = stickyHeaderFooterTableData.nodes.reduce(
    (accumulator, node) => accumulator + node.amount,
    0,
  );

  return (
    <ExampleWrapper title="Table with Sticky Header & Sticky Footer">
      <Table data={stickyHeaderFooterTableData} isHeaderSticky isFooterSticky height="500px">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>
                  <Amount value={totalAmount} />
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const stickyFirstColumnTableData = createTableData(20);

export const TableWithStickyFirstColumn = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Table with Sticky First Column">
      <Table data={stickyFirstColumnTableData} isFirstColumnSticky height="500px">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.name}</TableCell>
                  <TableCell>{tableItem.account}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const singleSelectableTableData = createTableData(5);

export const SingleSelectableTable = (): React.ReactElement => {
  const [selectedItem, setSelectedItem] = React.useState<TableExampleItem | undefined>(undefined);

  return (
    <ExampleWrapper title="Single Selectable Table">
      <Table
        data={singleSelectableTableData}
        selectionType="single"
        onSelectionChange={({ values }) => setSelectedItem(values[0])}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
      <Box marginTop="spacing.3" display="flex" flexDirection="row" gap="spacing.2">
        <Text weight="semibold">Selected Row ID:</Text>
        <Text>{selectedItem?.paymentId}</Text>
      </Box>
    </ExampleWrapper>
  );
};

const multiSelectableTableData = createTableData(5);

export const MultiSelectableTableWithToolbar = (): React.ReactElement => {
  const [selectedItemsCount, setSelectedItemsCount] = React.useState(0);
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <ExampleWrapper
      title="Multi Selectable Table with Toolbar"
      description="(Tip: Expand screen width to see layout changes in toolbar)"
    >
      <Table
        data={multiSelectableTableData}
        selectionType="multiple"
        onSelectionChange={({ selectedIds }) => setSelectedItemsCount(selectedIds.length)}
        toolbar={
          <TableToolbar
            title="Showing Recent Transactions"
            selectedTitle={`${selectedItemsCount} Transaction${
              selectedItemsCount > 1 ? 's' : ''
            } Selected`}
          >
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const zebraStripesTableData = createTableData(5);

export const MultiSelectableWithZebraStripes = (): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <ExampleWrapper title="Multi Selectable Table with Zebra Stripes">
      <Table
        data={zebraStripesTableData}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar title="Showing Recent Transactions">
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const disabledRowsTableData = createTableData(10);

export const TableWithDisabledRows = (): React.ReactElement => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <ExampleWrapper title="Table with Disabled Rows">
      <Table
        data={disabledRowsTableData}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Action</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => {
                const isDisabled = ['1', '5', '10'].includes(tableItem.id);
                return (
                  <TableRow key={index} item={tableItem} isDisabled={isDisabled}>
                    <TableCell>
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Amount value={tableItem.amount} />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap="spacing.3">
                        <Link isDisabled={isDisabled} variant="button" icon={CopyIcon}>
                          Copy
                        </Link>
                        <Link isDisabled={isDisabled} variant="button" icon={TrashIcon}>
                          Delete
                        </Link>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const backgroundColorTableData = createTableData(5);
type BackgroundEmphasis = 'subtle' | 'moderate' | 'intense';

export const TableWithBackgroundColor = (): React.ReactElement => {
  const [emphasis, setEmphasis] = React.useState<BackgroundEmphasis>('subtle');

  return (
    <Box
      backgroundColor={`surface.background.gray.${emphasis}`}
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box marginBottom="spacing.4">
        <Heading marginBottom="spacing.3">Table on various background colors</Heading>
        <RadioGroup
          label="Select Emphasis Level"
          onChange={({ value }) => setEmphasis(value as BackgroundEmphasis)}
          value={emphasis}
        >
          <Radio value="subtle">subtle</Radio>
          <Radio value="moderate">moderate</Radio>
          <Radio value="intense">intense</Radio>
        </RadioGroup>
      </Box>
      <Table
        selectionType="multiple"
        showStripedRows={true}
        data={backgroundColorTableData}
        backgroundColor={`surface.background.gray.${emphasis}`}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{`₹${tableItem.amount.toString()}`}</TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableFooterRow>
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

const isLoadingTableData = createTableData(100);

export const TableWithIsLoading = (): React.ReactElement => {
  const { platform } = useTheme();
  const [showData, setShowData] = React.useState(false);
  const onMobile = platform === 'onMobile';

  React.useEffect(() => {
    if (showData) return;
    const timeoutId = setTimeout(() => setShowData(true), 2000);
    return () => clearTimeout(timeoutId);
  }, [showData]);

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5" minHeight="400px">
      <Heading>Table with initial isLoading state</Heading>
      <Link variant="button" onClick={() => setShowData(false)}>
        Refresh to show loader again
      </Link>
      <Box marginTop="spacing.4" display="flex">
        <Table
          data={isLoadingTableData}
          selectionType="multiple"
          showStripedRows={true}
          height="400px"
          isLoading={!showData}
          toolbar={
            <TableToolbar>
              <TableToolbarActions>
                <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                  Export
                </Button>
                <Button isFullWidth={onMobile}>Refund</Button>
              </TableToolbarActions>
            </TableToolbar>
          }
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>ID</TableHeaderCell>
                  <TableHeaderCell>Amount</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow key={index} item={tableItem}>
                    <TableCell>
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Amount value={tableItem.amount} />
                    </TableCell>
                    <TableCell>
                      <Badge size="medium" color={getStatusColor(tableItem.status)}>
                        {tableItem.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </>
          )}
        </Table>
      </Box>
    </Box>
  );
};

const isRefreshingTableData = createTableData(100);

export const TableWithIsRefreshing = (): React.ReactElement => {
  const { platform } = useTheme();
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const onMobile = platform === 'onMobile';

  const handlePageChange = ({ page }: { page: number }): void => {
    if (currentPage === page) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setCurrentPage(page);
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <ExampleWrapper
      title="Table with isRefreshing state"
      description="(Tip: Navigate to next page using the pagination buttons to see an isRefreshing state.)"
    >
      <Table
        data={isRefreshingTableData}
        isRefreshing={isRefreshing}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.3" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            onPageChange={handlePageChange}
            defaultPageSize={10}
            onPageSizeChange={console.log}
            showPageSizePicker
            showPageNumberSelector
            currentPage={currentPage}
          />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount} />
                  </TableCell>
                  <TableCell>{formatDate(tableItem.date)}</TableCell>
                  <TableCell>
                    <Badge size="medium" color={getStatusColor(tableItem.status)}>
                      {tableItem.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

const editableCellsTableData = createTableData(5);

export const TableWithEditableCells = (): React.ReactElement => {
  return (
    <ExampleWrapper title="Table with Editable Cells">
      <Table data={editableCellsTableData} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableEditableCell
                    placeholder="Enter ID"
                    accessibilityLabel="ID"
                    validationState="error"
                    errorText="ID Cannot be empty"
                  />
                  <TableEditableCell placeholder="Enter Date" accessibilityLabel="Date" />
                  <TableEditableCell
                    placeholder="Enter Amount"
                    accessibilityLabel="Amount"
                    defaultValue={`${tableItem.amount}`}
                    validationState="success"
                    successText="Amount is valid"
                  />
                  <TableEditableDropdownCell>
                    <AutoComplete accessibilityLabel="Method" />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="UPI" value="upi" />
                        <ActionListItem title="Credit Card" value="credit" />
                        <ActionListItem title="Debit Card" value="debit" />
                        <ActionListItem title="Cash" value="cash" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </ExampleWrapper>
  );
};

export default TableMeta;
