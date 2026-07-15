import React, { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import type { TableData } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { Box } from '~components/Box';
import { Text, Code } from '~components/Typography';
import { Amount } from '~components/Amount';
import { Badge } from '~components/Badge';

export default {
  title: 'Components/Table/API',
  component: TableComponent,
  parameters: {
    viewMode: 'story',
  },
} as Meta<typeof TableComponent>;

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  method: string;
  name: string;
};

const nodes: Item[] = [
  {
    id: '1',
    paymentId: 'rzp001',
    amount: 4500,
    status: 'Completed',
    method: 'Credit Card',
    name: 'John Doe',
  },
  {
    id: '2',
    paymentId: 'rzp002',
    amount: 1200,
    status: 'Pending',
    method: 'UPI',
    name: 'Jane Smith',
  },
  {
    id: '3',
    paymentId: 'rzp003',
    amount: 8900,
    status: 'Failed',
    method: 'Netbanking',
    name: 'Alice Johnson',
  },
  {
    id: '4',
    paymentId: 'rzp004',
    amount: 3400,
    status: 'Completed',
    method: 'Debit Card',
    name: 'Bob Williams',
  },
  {
    id: '5',
    paymentId: 'rzp005',
    amount: 6700,
    status: 'Pending',
    method: 'Wallet',
    name: 'Carol Brown',
  },
];

const data: TableData<Item> = { nodes };

const statusColorMap: Record<Item['status'], 'positive' | 'notice' | 'negative'> = {
  Completed: 'positive',
  Pending: 'notice',
  Failed: 'negative',
};

export const TableWithActiveRow: StoryFn<typeof TableComponent> = () => {
  const [activeId, setActiveId] = useState<string | null>('2');

  const activeItem = nodes.find((n) => n.id === activeId) ?? null;

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      minHeight="400px"
      display="flex"
      flexDirection="column"
      gap="spacing.5"
    >
      <Text size="medium" weight="semibold">
        Click a row to view its details in the side panel.
      </Text>
      <Box display="flex" gap="spacing.5" alignItems="flex-start">
        {/* Table — left side */}
        <Box flex="1" overflow="auto">
          <TableComponent data={data} selectionType="none">
            {(tableData) => (
              <>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>Payment ID</TableHeaderCell>
                    <TableHeaderCell>Amount</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Method</TableHeaderCell>
                    <TableHeaderCell>Name</TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {tableData.map((item) => (
                    <TableRow
                      key={item.id}
                      item={item}
                      isActive={activeId === item.id}
                      onClick={({ item: clickedItem }) => setActiveId(clickedItem.id)}
                    >
                      <TableCell>
                        <Code size="medium">{item.paymentId}</Code>
                      </TableCell>
                      <TableCell>
                        <Amount value={item.amount} />
                      </TableCell>
                      <TableCell>
                        <Badge color={statusColorMap[item.status]}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>{item.method}</TableCell>
                      <TableCell>{item.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </>
            )}
          </TableComponent>
        </Box>

        {/* Detail panel — right side */}
        {activeItem && (
          <Box
            width="280px"
            flexShrink={0}
            padding="spacing.5"
            backgroundColor="surface.background.gray.moderate"
            borderRadius="medium"
            borderWidth="thin"
            borderColor="surface.border.gray.muted"
            borderStyle="solid"
            display="flex"
            flexDirection="column"
            gap="spacing.4"
          >
            <Text size="large" weight="semibold">
              Payment Details
            </Text>
            <Box display="flex" flexDirection="column" gap="spacing.3">
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">
                  Payment ID
                </Text>
                <Code size="small">{activeItem.paymentId}</Code>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">
                  Amount
                </Text>
                <Amount value={activeItem.amount} />
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">
                  Status
                </Text>
                <Badge color={statusColorMap[activeItem.status]}>{activeItem.status}</Badge>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">
                  Method
                </Text>
                <Text size="small">{activeItem.method}</Text>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Text size="small" color="surface.text.gray.subtle">
                  Customer
                </Text>
                <Text size="small">{activeItem.name}</Text>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

TableWithActiveRow.storyName = 'TableRow with Active State (Detail Panel)';
