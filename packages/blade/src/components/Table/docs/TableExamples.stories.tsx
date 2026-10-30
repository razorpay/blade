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
import { CopyIcon, CreditCardIcon, InfoIcon, TrashIcon, UserIcon } from '~components/Icons';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
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

const stickyHeaderAndFirstColumnTableData = createTableData(30);

export const TableWithStickyHeaderAndFirstColumn = (): React.ReactElement => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  return (
    <ExampleWrapper
      title="Table with Sticky Header & Sticky First Column"
      description="Scroll vertically and horizontally - the first header cell (corner) stays above the sticky body cells. Toggle Refresh to check that the refresh overlay dims the whole table, the corner cell included."
    >
      <Box paddingBottom="spacing.4">
        <Button
          variant="secondary"
          onClick={() => {
            setIsRefreshing(!isRefreshing);
          }}
        >
          {isRefreshing ? 'Stop Refreshing' : 'Start Refreshing'}
        </Button>
      </Box>
      <Table
        data={stickyHeaderAndFirstColumnTableData}
        isHeaderSticky
        isFirstColumnSticky
        isRefreshing={isRefreshing}
        height="400px"
        gridTemplateColumns="280px 280px 280px 280px 280px 280px"
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.name}</TableCell>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.account}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
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

const stickyFirstColumnMultiSelectTableData = createTableData(20);

export const TableWithStickyFirstColumnAndMultiSelect = (): React.ReactElement => {
  return (
    <ExampleWrapper
      title="Table with Sticky Header, Footer & Sticky First Column (Multi Select)"
      description="The footer text in the checkbox column widens it beyond the checkbox width - scroll right and check that the first data column's header and footer cells stay visible above the checkbox column."
    >
      <Box maxWidth="620px">
        <Table
          data={stickyFirstColumnMultiSelectTableData}
          selectionType="multiple"
          isHeaderSticky
          isFooterSticky
          isFirstColumnSticky
          height="400px"
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell>Name</TableHeaderCell>
                  <TableHeaderCell>Payment ID</TableHeaderCell>
                  <TableHeaderCell>Account</TableHeaderCell>
                  <TableHeaderCell>Method</TableHeaderCell>
                  <TableHeaderCell>Date</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody>
                {tableData.map((tableItem, index) => (
                  <TableRow key={index} item={tableItem}>
                    <TableCell>{tableItem.name}</TableCell>
                    <TableCell>
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>{tableItem.account}</TableCell>
                    <TableCell>{tableItem.method}</TableCell>
                    <TableCell>{formatDate(tableItem.date)}</TableCell>
                    <TableCell>
                      <Badge size="medium" color={getStatusColor(tableItem.status)}>
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
                  <TableFooterCell>-</TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </Box>
    </ExampleWrapper>
  );
};

const stickyColumnsTableData = createTableData(20);
const stickyColumnsTotalAmount = Number(
  stickyColumnsTableData.nodes.reduce((total, item) => total + item.amount, 0).toFixed(2),
);

export const TableWithStickyColumns = (): React.ReactElement => {
  const [stickyColumns, setStickyColumns] = React.useState('3');
  const [selectionType, setSelectionType] = React.useState<'none' | 'multiple'>('multiple');

  return (
    <ExampleWrapper
      title="Table with Sticky Columns"
      description="Use stickyColumns to keep the first few columns in view while scrolling right. Once you scroll, a divider and a shadow fade in to mark where the sticky columns end. On mobile only the first column stays sticky."
    >
      <Box display="flex" gap="spacing.8" paddingBottom="spacing.4" flexWrap="wrap">
        <RadioGroup
          label="stickyColumns"
          labelPosition="left"
          orientation="horizontal"
          value={stickyColumns}
          onChange={({ value }) => setStickyColumns(value)}
        >
          <Radio value="1">1</Radio>
          <Radio value="2">2</Radio>
          <Radio value="3">3</Radio>
        </RadioGroup>
        <RadioGroup
          label="selectionType"
          labelPosition="left"
          orientation="horizontal"
          value={selectionType}
          onChange={({ value }) => setSelectionType(value as 'none' | 'multiple')}
        >
          <Radio value="none">none</Radio>
          <Radio value="multiple">multiple</Radio>
        </RadioGroup>
      </Box>
      <Table
        data={stickyColumnsTableData}
        stickyColumns={Number(stickyColumns)}
        selectionType={selectionType}
        isHeaderSticky
        isFooterSticky
        height="400px"
        gridTemplateColumns={`${
          selectionType === 'multiple' ? 'min-content ' : ''
        }160px 180px 160px 200px 200px 200px 200px 200px`}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.name}</TableCell>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>{tableItem.account}</TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                  <TableCell>{tableItem.type}</TableCell>
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
                {/* the checkbox column needs its own footer cell */}
                {selectionType === 'multiple' ? <TableFooterCell>{null}</TableFooterCell> : null}
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>
                  <Amount value={stickyColumnsTotalAmount} />
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
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
    if (showData) return undefined;
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

const editableDropdownCellsTableData = createTableData(3);

export const TableWithEditableDropdownCells = (): React.ReactElement => {
  return (
    <ExampleWrapper
      title="Table with Editable Dropdown Cells"
      description="The selected value, placeholder, leading icon, validation icon and chevron share one vertical centre in the resting, error and open states."
    >
      <Table data={editableDropdownCellsTableData} showBorderedCells>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Customer</TableHeaderCell>
                <TableHeaderCell>Payment Method</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap="spacing.3">
                      <UserIcon color="surface.icon.gray.subtle" size="small" />
                      {tableItem.name}
                    </Box>
                  </TableCell>
                  <TableEditableDropdownCell>
                    <SelectInput
                      icon={CreditCardIcon}
                      placeholder="Select Method"
                      defaultValue={index === 0 ? 'upi' : undefined}
                      accessibilityLabel="Payment Method"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="UPI" value="upi" />
                        <ActionListItem title="Credit Card" value="credit" />
                        <ActionListItem title="Netbanking" value="netbanking" />
                        <ActionListItem title="Wallet" value="wallet" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                  <TableEditableDropdownCell>
                    <SelectInput
                      icon={InfoIcon}
                      placeholder="Select Status"
                      defaultValue={index === 0 ? 'pending' : undefined}
                      validationState="error"
                      errorText="Invalid Status"
                      accessibilityLabel="Status"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Pending" value="pending" />
                        <ActionListItem title="Completed" value="completed" />
                        <ActionListItem title="Failed" value="failed" />
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
