## Component Name

DetailedView

## Description

A DetailedView is a pattern that shows details of a transaction, user, or entity in a drawer in a defined format. It provides a standardized way to display detailed information when a user interacts with a row in a table or clicks a link to view additional information about an item. This is a commonly reused template rather than a component with exposed APIs.

## Examples

The following examples demonstrate how to implement the DetailedView pattern in different contexts.

### DetailedView with Table Integration

This example shows how to implement a DetailedView triggered from a table row, with timeline and key-value pair details.

```tsx
import React, { useState } from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  Box,
  Table,
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
  Text,
  IconButton,
  CopyIcon,
  DownloadIcon,
  MoreHorizontalIcon,
} from '@razorpay/blade/components';
import type { TableData, BoxProps } from '@razorpay/blade/components';

// Define the item type for the table data
type Item = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
  date: Date;
  type: string;
  method: string;
  name: string;
};

// Helper types for the DetailedView pattern
type KeyValueGridProps = {
  children: React.ReactNode;
  padding?: BoxProps['padding'];
};

type KeyValueItemProps = {
  label: string;
  children: React.ReactNode;
};

type TimelineProps = {
  status: string; // 'Completed', 'Pending', 'Failed', etc.
};

// Helper component for key-value display in DetailedView
const KeyValueItem = ({ label, children }: KeyValueItemProps) => (
  <>
    <Text variant="body" size="small" color="surface.text.gray.muted">
      {label}
    </Text>
    <Box>{children}</Box>
  </>
);

// Container grid for key-value pairs
const KeyValueGrid = ({ children, padding }: KeyValueGridProps) => (
  <Box display="grid" gridTemplateColumns="160px 1fr" gap="spacing.3" padding={padding}>
    {children}
  </Box>
);

// Timeline component to show transaction status
const Timeline = ({ status }: TimelineProps) => (
  <StepGroup orientation="vertical" size="medium">
    <StepItem
      title="Payment Initiated"
      stepProgress={['Completed', 'Pending', 'Failed'].includes(status) ? 'full' : 'none'}
      marker={
        <StepItemIndicator
          color={['Completed', 'Pending', 'Failed'].includes(status) ? 'positive' : 'neutral'}
        />
      }
    />
    <Collapsible direction="top">
      <CollapsibleLink>Show More</CollapsibleLink>
      <CollapsibleBody>
        <StepItem
          title="Payment Processing"
          stepProgress={['Completed', 'Failed'].includes(status) ? 'full' : 'start'}
          marker={
            <StepItemIndicator
              color={['Completed', 'Failed'].includes(status) ? 'positive' : 'notice'}
            />
          }
        />
        <StepItem
          title={status === 'Failed' ? 'Payment Failed' : 'Payment Completed'}
          stepProgress={['Completed', 'Failed'].includes(status) ? 'full' : 'none'}
          marker={
            <StepItemIndicator
              color={
                status === 'Failed' ? 'negative' : status === 'Completed' ? 'positive' : 'neutral'
              }
            />
          }
        />
      </CollapsibleBody>
    </Collapsible>
  </StepGroup>
);

const DetailedViewWithTable = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // Sample data for the table
  const sampleData: Item[] = [
    {
      id: '1',
      paymentId: 'rzp123456',
      amount: 2500,
      status: 'Completed',
      date: new Date(2023, 4, 15),
      type: 'Payout',
      method: 'Bank Transfer',
      name: 'Saurabh Daware',
    },
    {
      id: '2',
      paymentId: 'rzp789012',
      amount: 1750.5,
      status: 'Pending',
      date: new Date(2023, 4, 16),
      type: 'Refund',
      method: 'Credit Card',
      name: 'Kamlesh Chandnani',
    },
    {
      id: '3',
      paymentId: 'rzp345678',
      amount: 890,
      status: 'Failed',
      date: new Date(2023, 4, 17),
      type: 'Payout',
      method: 'PayPal',
      name: 'Gaurav Tewari',
    },
  ];

  const data: TableData<Item> = { nodes: sampleData };

  return (
    <Box overflow="auto" minHeight="400px">
      {/* Table component displaying the data */}
      <Table
        data={data}
        selectionType="none"
        toolbar={
          <TableToolbar title="Showing 1-3 Payments" selectedTitle="Showing 1-3 Payments">
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
                <TableHeaderCell headerKey="NAME">Account Holder</TableHeaderCell>
                <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
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
                    setSelectedItem(tableItem);
                    setIsDrawerOpen(true);
                  }}
                >
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
      </Table>

      {/* DetailedView implemented as a Drawer */}
      <Drawer
        showOverlay={false}
        isOpen={isDrawerOpen}
        onDismiss={() => {
          setIsDrawerOpen(false);
        }}
        onUnmount={() => {
          setSelectedItem(null);
        }}
      >
        <DrawerHeader
          color={
            selectedItem?.status === 'Completed'
              ? 'positive'
              : selectedItem?.status === 'Pending'
              ? 'notice'
              : 'negative'
          }
          title="Payment Details"
          trailing={
            <IconButton
              icon={MoreHorizontalIcon}
              accessibilityLabel="Options"
              onClick={() => console.log('Options Clicked')}
              size="large"
            />
          }
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={selectedItem?.amount ?? 0}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          </Box>
          <Box display="flex" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
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
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="spacing.4"
            marginTop="spacing.6"
            paddingX="spacing.4"
          >
            <Box display="flex">
              <Divider thickness="thicker" orientation="vertical" />
              <Box paddingX="spacing.3">
                <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">
                  Payment ID
                </Text>
                <Text size="medium">{selectedItem?.paymentId}</Text>
              </Box>
            </Box>

            <Box display="flex">
              <Divider thickness="thicker" orientation="vertical" />
              <Box paddingX="spacing.3">
                <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">
                  Date
                </Text>
                <Text size="medium">
                  {selectedItem?.date?.toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </Box>
            </Box>
          </Box>
          <Box marginTop="spacing.6" textAlign="center">
            <Button
              variant="secondary"
              color="primary"
              size="small"
              icon={DownloadIcon}
              isFullWidth
            >
              Download Report
            </Button>
          </Box>
        </DrawerHeader>
        <DrawerBody>
          <Box display="flex" flexDirection="column" gap="spacing.6">
            <Box>
              <Text variant="body" size="medium" weight="semibold" marginBottom="spacing.4">
                Timeline
              </Text>
              <Timeline status={selectedItem?.status ?? 'Pending'} />
            </Box>
            <Divider />
            <Box>
              <Text variant="body" size="medium" weight="semibold" marginBottom="spacing.4">
                Details
              </Text>
              <KeyValueGrid>
                {/* Amount */}
                <KeyValueItem label="Amount">
                  <Amount value={selectedItem?.amount ?? 0} />
                </KeyValueItem>

                {/* Payment Link ID */}
                <KeyValueItem label="Payment Link ID">
                  <Box display="flex" gap="spacing.2" alignItems="center">
                    <Code size="small">{selectedItem?.paymentId ?? 'NA'}</Code>
                    <Link variant="button" size="small" icon={CopyIcon} />
                  </Box>
                </KeyValueItem>

                {/* Payment Type */}
                <KeyValueItem label="Payment for">
                  <Text variant="body" size="medium">
                    {selectedItem?.type}
                  </Text>
                </KeyValueItem>

                {/* Payment Method */}
                <KeyValueItem label="Payment Method">
                  <Text variant="body" size="medium">
                    {selectedItem?.method}
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
    </Box>
  );
};

export default DetailedViewWithTable;
```

### DetailedView with Card Trigger

This example demonstrates how to implement a DetailedView that opens from a Card component instead of a table row.

```tsx
import React, { useState } from 'react';
import {
  Drawer,
  DrawerHeader,
  DrawerBody,
  Box,
  Card,
  CardHeader,
  CardHeaderLeading,
  CardHeaderIcon,
  CardHeaderTrailing,
  CardHeaderLink,
  CardBody,
  Amount,
  Badge,
  Button,
  Text,
  Divider,
  Link,
  Code,
  CheckIcon,
  DownloadIcon,
  ExternalLinkIcon,
  RazorpayIcon,
  CopyIcon,
} from '@razorpay/blade/components';

// Helper types for DetailedView pattern
type KeyValueItemProps = {
  label: string;
  children: React.ReactNode;
};

type KeyValueGridProps = {
  children: React.ReactNode;
};

// Helper components for the DetailedView pattern
const KeyValueItem = ({ label, children }: KeyValueItemProps) => (
  <>
    <Text variant="body" size="small" color="surface.text.gray.muted">
      {label}
    </Text>
    <Box>{children}</Box>
  </>
);

const KeyValueGrid = ({ children }: KeyValueGridProps) => (
  <Box display="grid" gridTemplateColumns="160px 1fr" gap="spacing.3">
    {children}
  </Box>
);

// Sample transaction data
const transactionData = {
  amount: 3120,
  amountPaid: 3120,
  paymentId: 'pay_MK7DGqwYXEwx9Q',
  referenceId: 'ref_MK7DGqwYXEwx9Q',
  type: 'Settlement',
  partialPayment: 'Enabled',
  reminders: 'Send auto reminders',
  createdBy: 'Saurabh Daware',
  utr: 'UTR123456789',
  bankAccount: '1234567890',
  ifsc: 'HDFC0001234',
  status: 'Completed',
};

const DetailedViewWithCard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box>
      {/* Card that triggers the DetailedView */}
      <Card width={{ base: '100%', m: '500px' }}>
        <CardHeader>
          <CardHeaderLeading
            prefix={<CardHeaderIcon icon={RazorpayIcon} />}
            title="Transaction Details"
          />
          <CardHeaderTrailing
            visual={
              <CardHeaderLink
                variant="button"
                onClick={() => {
                  setIsDrawerOpen(true);
                }}
                icon={ExternalLinkIcon}
                iconPosition="right"
              >
                View Details
              </CardHeaderLink>
            }
          />
        </CardHeader>
        <CardBody>
          <Box
            display="grid"
            gridTemplateColumns="1fr auto"
            columnGap="spacing.4"
            rowGap="spacing.3"
          >
            {/* Gross Settlements */}
            <Text variant="body" size="medium" color="surface.text.gray.muted" gridColumn="1 / -1">
              Gross Settlements
            </Text>

            <Text variant="body" size="medium">
              Payment
            </Text>
            <Box>
              <Amount value={transactionData.amount} alignSelf="right" currency="INR" />
            </Box>

            {/* Deductions - spans full width */}
            <Text
              variant="body"
              size="medium"
              color="surface.text.gray.muted"
              gridColumn="1 / -1"
              marginTop="spacing.4"
            >
              Deductions
            </Text>

            <Text variant="body" size="medium">
              Tax
            </Text>
            <Box>
              <Amount value={260} currency="INR" />
            </Box>

            <Text variant="body" size="medium">
              Fee
            </Text>
            <Box>
              <Amount value={260} currency="INR" />
            </Box>

            {/* Net Settlement - with divider */}
            <Box gridColumn="1 / -1" marginTop="spacing.4">
              <Divider marginBottom="spacing.4" />
              <Box display="grid" gridTemplateColumns="1fr auto">
                <Text variant="body" size="medium" weight="semibold">
                  Net Settlement amount
                </Text>
                <Box>
                  <Amount value={2600} currency="INR" weight="semibold" />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

      {/* DetailedView Drawer showing detailed information */}
      <Drawer
        isOpen={isDrawerOpen}
        onDismiss={() => {
          setIsDrawerOpen(false);
        }}
      >
        <DrawerHeader
          color="positive"
          title="Settlements"
          trailing={<Button size="medium" icon={DownloadIcon} />}
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={transactionData.amount}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          </Box>
          <Box display="flex" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
            <Badge icon={CheckIcon} size="medium" color="positive" emphasis="intense">
              Completed
            </Badge>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="spacing.4"
            marginTop="spacing.6"
            paddingX="spacing.4"
          >
            <Box display="flex">
              <Divider thickness="thicker" orientation="vertical" />
              <Box paddingX="spacing.3">
                <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">
                  Payment ID
                </Text>
                <Text size="medium">{transactionData.paymentId}</Text>
              </Box>
            </Box>
          </Box>

          <Text
            size="small"
            marginTop="spacing.6"
            textAlign="center"
            color="surface.text.gray.muted"
          >
            Settlement was completed on 24th April 2023
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Text variant="body" size="medium" weight="semibold" marginBottom="spacing.4">
            Transaction Breakdown
          </Text>

          <KeyValueGrid>
            <KeyValueItem label="Amount">
              <Amount value={transactionData.amount} currency="INR" />
            </KeyValueItem>

            <KeyValueItem label="Amount Paid">
              <Amount value={transactionData.amountPaid} currency="INR" />
            </KeyValueItem>

            <KeyValueItem label="Payment ID">
              <Box display="flex" gap="spacing.2" alignItems="center">
                <Code size="small">{transactionData.paymentId}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>

            <KeyValueItem label="Reference ID">
              <Text variant="body" size="medium">
                {transactionData.referenceId}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Payment for">
              <Text variant="body" size="medium">
                {transactionData.type}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="UTR Number">
              <Box display="flex" gap="spacing.2" alignItems="center">
                <Code size="small">{transactionData.utr}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>

            <KeyValueItem label="Bank Account">
              <Text variant="body" size="medium">
                {transactionData.bankAccount}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="IFSC">
              <Text variant="body" size="medium">
                {transactionData.ifsc}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Created By">
              <Text variant="body" size="medium">
                {transactionData.createdBy}
              </Text>
            </KeyValueItem>
          </KeyValueGrid>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export default DetailedViewWithCard;
```
