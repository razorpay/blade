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
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
      backgroundColor="surface.background.gray.intense"
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
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
      backgroundColor="surface.background.gray.intense"
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
                <TableHeaderCell>
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
                <TableHeaderCell>
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
                <TableHeaderCell>
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
                <TableHeaderCell>
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

const SortableTableStory = `
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
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Sortable Table</Heading>
      </Box>
      <Table
        data={data}
        sortFunctions={{
          ID: (array) => array.sort((a, b) => Number(a.id) - Number(b.id)),
          AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
          PAYMENT_ID: (array) =>
            array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
          DATE: (array) =>
            array.sort((a, b) => a.date.getTime() - b.date.getTime()),
          STATUS: (array) =>
            array.sort((a, b) => a.status.localeCompare(b.status)),
        }}
      >
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

const SingleSelectableTableStory = `
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
} from '@razorpay/blade/components';
import type { TableData } from '@razorpay/blade/components';
import React, { useState } from 'react';

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
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
  const [selectedItem, setSelectedItem] = useState<Item | undefined>(undefined);
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Single Selectable Table</Heading>
      </Box>
      <Table
        data={data}
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
                <TableHeaderCell>Method</TableHeaderCell>
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
      <Box
        marginTop="spacing.3"
        display="flex"
        flexDirection="row"
        gap="spacing.2"
      >
        <Text weight="bold">Selected Row ID:</Text>
        <Text>{selectedItem?.paymentId}</Text>
      </Box>
    </Box>
  );
}

export default App;
`;

const MultiSelectableWithToolbarTableStory = `
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
  TableToolbar,
  TableToolbarActions,
  Button,
  useTheme,
  Text,
} from '@razorpay/blade/components';
import type { TableData } from '@razorpay/blade/components';
import React, { useState } from 'react';

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
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  const selectedItemsLength = selectedItems.length;
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Multi Selectable Table with Toolbar</Heading>
        <Text>(Tip: Expand screen Width to see layout changes in toolbar)</Text>
      </Box>
      <Table
        data={data}
        selectionType="multiple"
        onSelectionChange={({ values }) => setSelectedItems(values)}
        toolbar={
          <TableToolbar
            title="Showing Recent Transactions"
            selectedTitle={\`\${selectedItemsLength} Transaction\${
              selectedItemsLength > 1 ? 's' : ''
            } Selected\`}
          >
            <TableToolbarActions>
              <Button
                variant="secondary"
                marginRight="spacing.2"
                isFullWidth={onMobile}
              >
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
                <TableHeaderCell>Method</TableHeaderCell>
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

const MultiSelectableWithZebraStripesStory = `
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
  TableToolbar,
  TableToolbarActions,
  Button,
  useTheme,
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
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Multi Selectable Table with Zebra Stripes</Heading>
      </Box>
      <Table
        data={data}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar title="Showing Recent Transactions">
            <TableToolbarActions>
              <Button
                variant="secondary"
                marginRight="spacing.2"
                isFullWidth={onMobile}
              >
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
                <TableHeaderCell>Method</TableHeaderCell>
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

const TableWithStickyHeaderAndFooterStory = `
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
  TableFooter,
  TableFooterRow,
  TableFooterCell,
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
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
  const totalAmount = nodes.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table with Sticky Header & Sticky Footer</Heading>
      </Box>
      <Table data={data} isHeaderSticky isFooterSticky height="500px">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
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
    </Box>
  );
}

export default App;
`;

const TableWithStickyFirstColumnStory = `
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
} from '@razorpay/blade/components';
import type { TableData } from '@razorpay/blade/components';
import React from 'react';

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  date: Date;
  status: string;
  account: string;
  method: string;
  name: string;
};

const nodes: Item[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    date: new Date(
      2021,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: ['Bank Transfer', 'Credit Card', 'PayPal'][
      Math.floor(Math.random() * 3)
    ],
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

const data: TableData<Item> = {
  nodes,
};

function App(): React.ReactElement {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table with Sticky First Column</Heading>
      </Box>
      <Table data={data} isFirstColumnSticky height="500px">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
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
                  <TableCell>
                    <Amount value={tableItem.amount} />
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

const TableWithPaginationStory = `
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
  TableToolbar,
  TableToolbarActions,
  Button,
  useTheme,
  TablePagination,
  Text,
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
  ...Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Multi Selectable Table with Zebra Stripes</Heading>
        <Text>
          (Tip: Expand the window width. It shows a minimalistic version of
          pagination on mWeb and a full fletched version on dWeb.)
        </Text>
      </Box>
      <Table
        data={data}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button
                variant="secondary"
                marginRight="spacing.2"
                isFullWidth={onMobile}
              >
                Export
              </Button>
              <Button isFullWidth={onMobile}>Refund</Button>
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
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
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

const TableWithDisabledRowsStory = `
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
  TableToolbar,
  TableToolbarActions,
  Button,
  useTheme,
  Link,
  TrashIcon,
  CopyIcon,
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
  ...Array.from({ length: 10 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table with Disabled Rows</Heading>
      </Box>
      <Table
        data={data}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button
                variant="secondary"
                marginRight="spacing.2"
                isFullWidth={onMobile}
              >
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
                const isDisabled = ['0', '4', '10'].includes(tableItem.id);
                return (
                  <TableRow
                    key={index}
                    item={tableItem}
                    isDisabled={isDisabled}
                  >
                    <TableCell>
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableCell>
                      <Amount value={tableItem.amount} />
                    </TableCell>

                    <TableCell>
                      <Box display="flex" gap="spacing.3">
                        <Link
                          isDisabled={isDisabled}
                          variant="button"
                          icon={CopyIcon}
                        >
                          Copy
                        </Link>
                        <Link
                          isDisabled={isDisabled}
                          variant="button"
                          icon={TrashIcon}
                        >
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
    </Box>
  );
}

export default App;
`;

const TableWithBackgroundColorStory = `
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
  RadioGroup,
  Radio,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
} from '@razorpay/blade/components';
import type { TableData } from '@razorpay/blade/components';
import React, { useState } from 'react';

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
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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

type Emphasis = 'subtle' | 'intense' | 'moderate'

function App(): React.ReactElement {
  const [emphasis, setEmphasis] = useState<Emphasis>('subtle');
  return (
    <Box
      backgroundColor={\`surface.background.gray\${emphasis}\`}
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box marginBottom="spacing.4">
        <Heading marginBottom="spacing.3">
          Table on various background colors
        </Heading>
        <RadioGroup
          label="Select Emphasis Level"
          onChange={({ value }) =>
            setEmphasis(Number(value) as Emphasis)
          }
          value={\`\${emphasis}\`}
        >
          <Radio value="subtle">subtle</Radio>
          <Radio value="moderate">moderate</Radio>
          <Radio value="intense">intense</Radio>
        </RadioGroup>
      </Box>
      <Table
        selectionType="multiple"
        showStripedRows={true}
        data={data}
        backgroundColor={emphasis}
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
            <TableFooter>
              <TableFooterRow>
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
}

export default App;
`;

const TableWithIsLoadingStory = `
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
  TableToolbar,
  TableToolbarActions,
  Button,
  useTheme,
  TablePagination,
  Link,
} from '@razorpay/blade/components';
import type { TableData } from '@razorpay/blade/components';
import React, { useEffect, useState } from 'react';

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  date: Date;
  status: string;
};

const nodes: Item[] = [
  ...Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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

function App(): React.ReactElement {
  const { platform } = useTheme();
  const [showData, setShowData] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (!showData) setShowData(true);
    }, 2000);
  }, [showData]);

  const onMobile = platform === 'onMobile';
  const data: TableData<Item> = {
    nodes: nodes,
  };

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
    >
      <Heading>Table with initial isLoading state</Heading>
      <Link
        variant="button"
        onClick={() => {
          setShowData(false);
        }}
      >
        Refresh to show loader again
      </Link>
      <Box height="100vh" display="flex">
        <Table
          data={data}
          selectionType="multiple"
          showStripedRows={true}
          height="400px"
          toolbar={
            <TableToolbar>
              <TableToolbarActions>
                <Button
                  variant="secondary"
                  marginRight="spacing.2"
                  isFullWidth={onMobile}
                >
                  Export
                </Button>
                <Button isFullWidth={onMobile}>Refund</Button>
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
          isLoading={!showData}
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
    </Box>
  );
}

export default App;
`;

const TableWithIsRefreshingStory = `
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
  TableToolbar,
  TableToolbarActions,
  Button,
  useTheme,
  TablePagination,
  Text,
  TableProps,
} from '@razorpay/blade/components';
import React, { useState } from 'react';

type Item = {
  id: string;
  paymentId: string;
  amount: number;
  date: Date;
  status: string;
};

const nodes: Item[] = [
  ...Array.from({ length: 100 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
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

const data: TableProps<Item>['data'] = {
  nodes,
};

function App(): React.ReactElement {
  const { platform } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const onMobile = platform === 'onMobile';

  const handlePageChange = ({ page }: { page: number }) => {
    if (currentPage !== page) {
      setIsRefreshing(true);
      setTimeout(() => {
        setCurrentPage(page);
        setIsRefreshing(false);
      }, 2000);
    }
  };

  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <Box paddingBottom="spacing.4">
        <Heading>Table with isRefreshing state</Heading>
        <Text>
          (Tip: Navigate to next page using the pagination buttons to see an
          isRefreshing state.)
        </Text>
      </Box>
      <Table
        data={data}
        isRefreshing={isRefreshing}
        selectionType="multiple"
        showStripedRows={true}
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button
                variant="secondary"
                marginRight="spacing.2"
                isFullWidth={onMobile}
              >
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
                <TableHeaderCell>Method</TableHeaderCell>
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

export {
  BasicTableStory,
  TableWithCustomCellComponentsStory,
  SortableTableStory,
  SingleSelectableTableStory,
  MultiSelectableWithToolbarTableStory,
  MultiSelectableWithZebraStripesStory,
  TableWithStickyHeaderAndFooterStory,
  TableWithStickyFirstColumnStory,
  TableWithPaginationStory,
  TableWithDisabledRowsStory,
  TableWithBackgroundColorStory,
  TableWithIsLoadingStory,
  TableWithIsRefreshingStory,
};
