import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import type { TableData, TableProps } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableToolbarActions, TableToolbar } from '../../TableToolbar';
import { TablePagination } from '../../TablePagination';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

export default {
  title: 'Components/Table/API',
  component: TableComponent,
} as Meta<TableProps<unknown>>;

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  method: string;
  account: string;
};

const nodes: Item[] = [
  {
    id: '1',
    paymentId: 'rzp001',
    amount: 1000,
    status: 'Completed',
    date: new Date(2024, 0, 15),
    method: 'Bank Transfer',
    account: '1234567890',
  },
  {
    id: '2',
    paymentId: 'rzp002',
    amount: 2500,
    status: 'Pending',
    date: new Date(2024, 0, 16),
    method: 'Credit Card',
    account: '0987654321',
  },
  {
    id: '3',
    paymentId: 'rzp003',
    amount: 500,
    status: 'Failed',
    date: new Date(2024, 0, 17),
    method: 'PayPal',
    account: '1122334455',
  },
  {
    id: '4',
    paymentId: 'rzp004',
    amount: 3000,
    status: 'Completed',
    date: new Date(2024, 0, 18),
    method: 'Bank Transfer',
    account: '5566778899',
  },
  {
    id: '5',
    paymentId: 'rzp005',
    amount: 750,
    status: 'Pending',
    date: new Date(2024, 0, 19),
    method: 'Credit Card',
    account: '9988776655',
  },
  {
    id: '6',
    paymentId: 'rzp006',
    amount: 1200,
    status: 'Completed',
    date: new Date(2024, 0, 20),
    method: 'PayPal',
    account: '4433221100',
  },
  {
    id: '7',
    paymentId: 'rzp007',
    amount: 800,
    status: 'Failed',
    date: new Date(2024, 0, 21),
    method: 'Bank Transfer',
    account: '1357924680',
  },
  {
    id: '8',
    paymentId: 'rzp008',
    amount: 1500,
    status: 'Completed',
    date: new Date(2024, 0, 22),
    method: 'Credit Card',
    account: '2468013579',
  },
];

const data: TableData<Item> = {
  nodes,
};

const StripedTableContent = (): React.ReactElement => (
  <Box
    backgroundColor="surface.background.gray.moderate"
    padding="spacing.8"
    overflow="auto"
    minHeight="400px"
  >
    <TableComponent
      data={data}
      showStripedRows
      selectionType="multiple"
      onSelectionChange={({ selectedIds }) => console.log('Selected:', selectedIds)}
      toolbar={
        <TableToolbar title="Showing 1-8 Items">
          <TableToolbarActions>
            <Button variant="secondary" marginRight="spacing.3">
              Export
            </Button>
            <Button>Payout</Button>
          </TableToolbarActions>
        </TableToolbar>
      }
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
              <TableHeaderCell>Payment ID</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Account</TableHeaderCell>
              <TableHeaderCell>Date</TableHeaderCell>
              <TableHeaderCell>Method</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((tableItem) => (
              <TableRow key={tableItem.id} item={tableItem}>
                <TableCell>
                  <Code size="medium">{tableItem.paymentId}</Code>
                </TableCell>
                <TableCell>
                  <Amount value={tableItem.amount} />
                </TableCell>
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
                            : 'neutral'
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
);

export const TableFigmaExample: StoryFn<typeof TableComponent> = () => (
  <Box display="flex" flexDirection="column" gap="spacing.8">
    <StripedTableContent />
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <StripedTableContent />
    </BladeProvider>
  </Box>
);

TableFigmaExample.storyName = 'TableFigmaExample';
