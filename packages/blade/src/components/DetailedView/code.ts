const DetailedViewStoryCode = `import React from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  Box,
  IconButton,
  MoreHorizontalIcon,
  Table as TableComponent,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableToolbar,
  TableToolbarActions,
  TablePagination,
  Code,
  Amount,
  Badge,
  Button,
  StepGroup,
  StepItem,
  StepItemIndicator,
  Collapsible,
  CollapsibleBody,
  CollapsibleLink,
  Divider,
  Link,
  CopyIcon,
  DownloadIcon,
  Text,
} from '@razorpay/blade/components';
import type { TableData, BoxProps } from '@razorpay/blade/components';

const nodes: Item[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: (i + 1).toString(),
    paymentId: \`rzp\${Math.floor(Math.random() * 1000000)}\`,
    amount: Number((Math.random() * 10000).toFixed(2)),
    status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
    date: new Date(
      2021,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    ),
    type: ['Payout', 'Refund'][Math.floor(Math.random() * 2)],
    method: ['Bank Transfer', 'Credit Card', 'PayPal'][
      Math.floor(Math.random() * 3)
    ],
    bank: ['HDFC', 'ICICI', 'SBI'][Math.floor(Math.random() * 3)],
    account: Math.floor(Math.random() * 1000000000).toString(),
    name: [
      'Anurag Hazra',
      'Gaurav Tewari',
      'Kamlesh Chandnani',
      'Saurav Rastogi',
      'Rama Krushna Behera',
      'Chaitanya Deorukhkar',
      'Saurabh Daware',
      'Vinay Chopra',
      'Kajol Nigam',
    ][Math.floor(Math.random() * 9)],
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

const TableExample = ({ onRowClick }) => {
  return (
    <TableComponent
      data={data}
      selectionType="none"
      toolbar={
        <TableToolbar
          title="Showing 1-10 [Items]"
          selectedTitle="Showing 1-10 [Items]"
        >
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
        PAYMENT_ID: (array) =>
          array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
        DATE: (array) =>
          array.sort((a, b) => a.date.getTime() - b.date.getTime()),
        STATUS: (array) =>
          array.sort((a, b) => a.status.localeCompare(b.status)),
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
              <TableHeaderCell headerKey="NAME">Account Holder</TableHeaderCell>
              <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
              <TableHeaderCell headerKey="DATE">Date</TableHeaderCell>
              <TableHeaderCell headerKey="METHOD">Method</TableHeaderCell>
              <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((tableItem, index) => (
              <TableRow key={index} item={tableItem} onClick={onRowClick}>
                <TableCell>
                  <Code size="medium">{tableItem.paymentId}</Code>
                </TableCell>
                <TableCell>{tableItem.name}</TableCell>
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
  );
};

const Timeline = ({ status }: { status: string }): React.ReactElement => {
  return (
    <StepGroup orientation="vertical" size="medium">
      <StepItem
        title="Payment Initiated"
        stepProgress={
          ['Completed', 'Pending', 'Failed'].includes(status) ? 'full' : 'none'
        }
        marker={
          <StepItemIndicator
            color={
              ['Completed', 'Pending', 'Failed'].includes(status)
                ? 'positive'
                : 'neutral'
            }
          />
        }
      />
      <Collapsible direction="top">
        <CollapsibleLink>Show More</CollapsibleLink>
        <CollapsibleBody>
          <StepItem
            title="Payment Processing"
            stepProgress={
              ['Completed', 'Failed'].includes(status) ? 'full' : 'start'
            }
            marker={
              <StepItemIndicator
                color={
                  ['Completed', 'Failed'].includes(status)
                    ? 'positive'
                    : 'notice'
                }
              />
            }
          />
          <StepItem
            title={status === 'Failed' ? 'Payment Failed' : 'Payment Completed'}
            stepProgress={
              ['Completed', 'Failed'].includes(status) ? 'full' : 'none'
            }
            marker={
              <StepItemIndicator
                color={
                  status === 'Failed'
                    ? 'negative'
                    : status === 'Completed'
                    ? 'positive'
                    : 'neutral'
                }
              />
            }
          />
        </CollapsibleBody>
      </Collapsible>
    </StepGroup>
  );
};

type KeyValueGridProps = {
  children: React.ReactNode;
  padding?: BoxProps['padding'];
};

type KeyValueItemProps = {
  label: string;
  children: React.ReactNode;
};

const KeyValueItem = ({
  label,
  children,
}: KeyValueItemProps): React.ReactElement => {
  return (
    <>
      <Text variant="body" size="small" color="surface.text.gray.muted">
        {label}
      </Text>
      <Box textAlign="right">{children}</Box>
    </>
  );
};

const KeyValueGrid = ({
  children,
  padding = 'spacing.4',
}: KeyValueGridProps): React.ReactElement => {
  return (
    <Box
      display="grid"
      gridTemplateColumns="160px 1fr"
      gap="spacing.3"
      backgroundColor="surface.background.gray.moderate"
      padding={padding}
      borderRadius="large"
    >
      {children}
    </Box>
  );
};

const DetailedViewHighlight = ({ title, value }) => {
  return (
    <Box display="flex">
      <Divider thickness="thicker" orientation="vertical" />
      <Box paddingX="spacing.3">
        <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">
          {title}
        </Text>
        <Text size="medium">{value}</Text>
      </Box>
    </Box>
  );
};

const DetailedViewDrawerHeaderSlot = ({
  heading,
  badges,
  highlights,
  actions,
}) => {
  return (
    <>
      <Box marginTop="spacing.6" textAlign="center">
        {heading}
      </Box>
      <Box
        display="flex"
        justifyContent="center"
        gap="spacing.4"
        marginTop="spacing.4"
      >
        {badges}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap="spacing.4"
        marginTop="spacing.6"
        paddingX="spacing.4"
      >
        {highlights}
      </Box>
      <Box
        marginTop="spacing.6"
        display="flex"
        gap="spacing.3"
        textAlign="center"
      >
        {actions}
      </Box>
    </>
  );
};

const DetailedViewDrawer = ({ isOpen, onDismiss, onUnmount, selectedItem }) => {
  return (
    <Drawer isOpen={isOpen} onDismiss={onDismiss} showOverlay={false} onUnmount={onUnmount}>
      <DrawerHeader
        title="Settlements"
        color={
          selectedItem?.status === 'Completed'
            ? 'positive'
            : selectedItem?.status === 'Pending'
            ? 'notice'
            : 'negative'
        }
        trailing={
          <IconButton
            icon={MoreHorizontalIcon}
            accessibilityLabel="Options"
            onClick={() => console.log('Options Clicked')}
            size="large"
          />
        }
      >
        <DetailedViewDrawerHeaderSlot
          heading={
            <Amount
              value={selectedItem?.amount ?? 0}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          }
          badges={
            <>
              <Badge
                size="medium"
                color={
                  selectedItem?.status === 'Completed'
                    ? 'positive'
                    : selectedItem?.status === 'Pending'
                    ? 'notice'
                    : 'negative'
                }
                emphasis="intense"
              >
                {selectedItem?.status ?? 'Pending'}
              </Badge>
            </>
          }
          highlights={
            <>
              <DetailedViewHighlight
                title="Payment ID"
                value={selectedItem?.paymentId}
              />
              <DetailedViewHighlight
                title="Date"
                value={selectedItem?.date?.toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
            </>
          }
          actions={
            <Button
              variant="secondary"
              color="primary"
              size="small"
              icon={DownloadIcon}
              isFullWidth
            >
              Download Report
            </Button>
          }
        />
      </DrawerHeader>
      <DrawerBody>
        <Box display="flex" flexDirection="column" gap="spacing.6">
          <Box>
            <Text
              variant="body"
              size="medium"
              weight="semibold"
              marginBottom="spacing.4"
            >
              Timeline
            </Text>
            <Timeline status={selectedItem?.status ?? 'Pending'} />
          </Box>
          <Divider />
          <Box>
            <Text
              variant="body"
              size="medium"
              weight="semibold"
              marginBottom="spacing.4"
            >
              Details
            </Text>
            <KeyValueGrid>
              {/* Amount */}
              <KeyValueItem label="Amount">
                <Amount value={selectedItem?.amount ?? 0} />
              </KeyValueItem>

              {/* Amount Paid */}
              <KeyValueItem label="Amount Paid">
                <Amount value={0} />
              </KeyValueItem>

              {/* Payment Link ID */}
              <KeyValueItem label="Payment Link ID">
                <Box
                  display="flex"
                  gap="spacing.2"
                  alignItems="center"
                  justifyContent="right"
                >
                  <Code size="small">{selectedItem?.paymentId ?? 'NA'}</Code>
                  <Link variant="button" size="small" icon={CopyIcon} />
                </Box>
              </KeyValueItem>

              {/* Reference ID */}
              <KeyValueItem label="Reference ID">
                <Text variant="body" size="medium">
                  NA
                </Text>
              </KeyValueItem>

              {/* Payment For */}
              <KeyValueItem label="Payment for">
                <Text variant="body" size="medium">
                  {selectedItem?.type}
                </Text>
              </KeyValueItem>

              {/* Partial Payment */}
              <KeyValueItem label="Partial Payment">
                <Text variant="body" size="medium">
                  Enabled
                </Text>
              </KeyValueItem>

              {/* Reminders */}
              <KeyValueItem label="Reminders">
                <Text variant="body" size="medium">
                  Send auto reminders
                </Text>
              </KeyValueItem>

              {/* Created By */}
              <KeyValueItem label="Created By">
                <Text variant="body" size="medium">
                  {selectedItem?.name}
                </Text>
              </KeyValueItem>
            </KeyValueGrid>
          </Box>
        </Box>
      </DrawerBody>
    </Drawer>
  );
};

const App = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const handleRowClick = ({ item }) => {
    setSelectedItem(item);
    setIsDrawerOpen(true);
  };

  return (
    <Box>
      <TableExample onRowClick={handleRowClick} />
      <DetailedViewDrawer
        isOpen={isDrawerOpen}
        onDismiss={() => setIsDrawerOpen(false)}
        onUnmount={() => setSelectedItem(null)}
        selectedItem={selectedItem}
      />
    </Box>
  );
};

export default App;
`;

export { DetailedViewStoryCode };
