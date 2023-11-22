const BasicTableStory = `
import {
  Table,
  Heading,
  Box,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
} from '@razorpay/blade/components';
import type { TableData } from '@razorpay/blade/components';
import React from 'react';

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  date: Date;
  method: string;
};

const nodes: Item[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp976693\`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    date: new Date(
      2021,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ),
    method: ['Bank Transfer', 'Credit Card', 'PayPal'][
      Math.floor(Math.random() * 3)
    ],
    account: Math.floor(Math.random() * 1000000000).toString(),
  })),
];

const data: TableData<Item> = {
  nodes,
};

function App(): React.ReactElement {
  return (
    <Box
      backgroundColor="surface.background.level2.lowContrast"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Basic Table</Heading>
      </Box>
      <Table data={data}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
                <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>{tableItem.paymentId}</TableCell>
                  <TableCell>{\`₹\${tableItem.amount.toString()}\`}</TableCell>
                  <TableCell>
                    {tableItem.date?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{tableItem.method}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>
    </Box>
  );
}

export default App;
`;

const TableWithCustomCellComponentsStory = `
import {
  Table,
  Code,
  Heading,
  Box,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Amount,
  Badge,
  Text,
  InfoIcon,
  IconButton,
  Tooltip,
} from '@razorpay/blade/components';
import type { TableData } from '@razorpay/blade/components';
import React from 'react';

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  date: Date;
  status: string;
};

const nodes: Item[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp${Math.floor(Math.random() * 1000000)}\`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    date: new Date(
      2021,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
  })),
];

const data: TableData<Item> = {
  nodes,
};

function App(): React.ReactElement {
  return (
    <Box
      backgroundColor="surface.background.level2.lowContrast"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table with Custom Cell Components</Heading>
      </Box>
      <Table data={data}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell headerKey="PAYMENT_ID">
                  <Box
                    display="flex"
                    flexDirection="row"
                    flex={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text weight="bold">ID</Text>
                    <Tooltip content="Payment ID of the transaction">
                      <IconButton
                        onClick={() => console.log('info clicked')}
                        accessibilityLabel="info"
                        icon={InfoIcon}
                      />
                    </Tooltip>
                  </Box>
                </TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">
                  <Box
                    display="flex"
                    flexDirection="row"
                    flex={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text weight="bold">Amount</Text>
                    <Tooltip content="Amount transacted">
                      <IconButton
                        onClick={() => console.log('info clicked')}
                        accessibilityLabel="info"
                        icon={InfoIcon}
                      />
                    </Tooltip>
                  </Box>
                </TableHeaderCell>
                <TableHeaderCell headerKey="DATE">
                  <Box
                    display="flex"
                    flexDirection="row"
                    flex={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text weight="bold">Date</Text>
                    <Tooltip content="Creation date of the transaction">
                      <IconButton
                        onClick={() => console.log('info clicked')}
                        accessibilityLabel="info"
                        icon={InfoIcon}
                      />
                    </Tooltip>
                  </Box>
                </TableHeaderCell>
                <TableHeaderCell headerKey="STATUS">
                  <Box
                    display="flex"
                    flexDirection="row"
                    flex={1}
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Text weight="bold">Status</Text>
                    <Tooltip content="Current status of the transaction">
                      <IconButton
                        onClick={() => console.log('info clicked')}
                        accessibilityLabel="info"
                        icon={InfoIcon}
                      />
                    </Tooltip>
                  </Box>
                </TableHeaderCell>
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
                    {tableItem.date?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
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
                          : 'default'
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
      </Table>
    </Box>
  );
}

export default App;
`;

export { BasicTableStory, TableWithCustomCellComponentsStory };
