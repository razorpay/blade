import type { StoryFn, Meta } from '@storybook/react';
import { useRef } from 'react';
import type { TableData, TableProps } from '../types';
import {
  Table as TableComponent,
  TableEditableCell,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarActions,
} from '../../Table';
import { TableVirtualizedWrapper } from '../TableBody';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code, Heading } from '~components/Typography';
import { Badge } from '~components/Badge';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Button } from '~components/Button';

export default {
  title: 'Components/Table',
  component: TableComponent,
  args: {
    selectionType: 'none',
    rowDensity: 'normal',
  },
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
    data: {
      control: {
        disable: true,
      },
    },
    sortFunctions: {
      control: {
        disable: true,
      },
    },
    toolbar: {
      control: {
        disable: true,
      },
    },
    pagination: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="A table component helps in displaying data in a grid format, through rows and columns of cells. Table facilitates data organisation and allow users to: scan, sort, compare, and take action on large amounts of data."
          componentName="Table"
          figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=76359-131223&t=pHgtavW20B3SIqfo-1&scaling=min-zoom&page-id=64177%3A996&mode=design"
        />
      ),
    },
  },
} as Meta<TableProps<unknown>>;

const getNodes = (number: number): Item[] => [
  ...Array.from({ length: number }, (_, i) => ({
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

const nodes: Item[] = getNodes(20);

const largeNodes: Item[] = getNodes(500);
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

const largeData: TableData<Item> = {
  nodes: largeNodes,
};

const TableTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  const tableRef = useRef<HTMLDivElement>(null);
  return (
    <Box padding="spacing.5" ref={tableRef} height="500px">
      <Heading> Total rows : {largeNodes.length}</Heading>
      <TableComponent
        {...args}
        data={largeData}
        onSelectionChange={console.log}
        selectionType="multiple"
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
        defaultSelectedIds={['1', '3']}
        rowDensity="normal"
        height="600px"
        isFirstColumnSticky
        isVirtualized
      >
        {(tableData) => (
          <TableVirtualizedWrapper tableData={tableData}>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">Status </TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody<Item>>
              {(tableItem, index) => (
                <TableRow
                  key={index}
                  item={tableItem}
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
              )}
            </TableBody>
          </TableVirtualizedWrapper>
        )}
      </TableComponent>
    </Box>
  );
};

export const NormalTable: StoryFn<typeof TableComponent> = ({ ...args }) => {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <Box>
      <Heading>Normal Table-</Heading>
      <Box padding="spacing.5" minHeight="400px">
        <TableComponent
          {...args}
          data={data}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={console.log}
          isFirstColumnSticky
          selectionType="multiple"
          height="400px"
          // eslint-disable-next-line react/jsx-no-duplicate-props
          onSelectionChange={({ selectedIds }) => {
            console.log(selectedIds);
            // setSelectedItems(data.nodes.filter((node) => selectedIds.includes(node.id)));
          }}
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
            </>
          )}
        </TableComponent>
      </Box>

      <Heading>Virtualized Table-</Heading>
      <Box padding="spacing.5" ref={ref} minHeight="600px">
        <Heading> Total rows : {largeNodes.length}</Heading>
        <TableComponent
          {...args}
          data={largeData}
          onSelectionChange={console.log}
          selectionType="multiple"
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
          ref={ref}
          defaultSelectedIds={['1', '3']}
          rowDensity="normal"
          height="600px"
          isFirstColumnSticky
        >
          {(tableData) => (
            <TableVirtualizedWrapper tableData={tableData}>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
                  <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                  <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
                  <TableHeaderCell headerKey="STATUS">Status </TableHeaderCell>
                </TableHeaderRow>
              </TableHeader>
              <TableBody<Item>>
                {(tableItem, index) => (
                  <TableRow
                    key={index}
                    item={tableItem}
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
                )}
              </TableBody>
            </TableVirtualizedWrapper>
          )}
        </TableComponent>
      </Box>
    </Box>
  );
};

export const Table = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Table.storyName = 'Virtualized Table';
