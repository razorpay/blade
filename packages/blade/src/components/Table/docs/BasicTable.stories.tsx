import type { StoryFn, Meta } from '@storybook/react';
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
  TableFooter,
  TableFooterRow,
  TableFooterCell,
  TablePagination,
} from '../../Table';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { CheckIcon, CloseIcon } from '~components/Icons';

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

const TableTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  return (
    <Box padding="spacing.5" overflow="auto" minHeight="400px">
      <TableComponent
        {...args}
        data={data}
        defaultSelectedIds={['1', '3']}
        onSelectionChange={console.log}
        isFirstColumnSticky
        selectionType="single"
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
                {args.selectionType === 'multiple' ? <TableFooterCell>-</TableFooterCell> : null}
                <TableFooterCell>
                  <Amount value={10} />
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const Table = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Table.storyName = 'Basic Table';
