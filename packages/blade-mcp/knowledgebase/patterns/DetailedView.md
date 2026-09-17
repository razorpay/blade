# DetailedView

## Pattern Name

DetailedView

## Description

A DetailedView is a pattern that displays comprehensive details of a transaction, user, or entity in a drawer format. It provides a structured layout for showing key information, timelines, transaction breakdowns, and related actions. This pattern is commonly used when users need to view detailed information about a selected item from a table, list, or card without navigating away from the current page.

## Components Used

- Drawer
- DrawerFooter
- Table
- Card
- Box
- Amount
- Badge
- Button
- IconButton
- Text
- Heading
- Code
- Link
- Divider
- StepGroup
- Collapsible
- Alert

## When to Use

- Displaying record-level details inline alongside a list/table
- Showing financial summaries (amount, status, metadata) for a transaction, payout, or settlement
- Presenting contextual information without losing the user's position in a long list
- Actions that apply to a single item (approve, reject, download, copy)

**Do not use** for full-page flows, multi-step wizards, or cases where the detail content requires its own navigation.

## Anatomy

### Desktop Layout (1280×800px)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Top Navigation (56px, black)  — Logo | Tabs | Search | Avatar              │
├──────────────┬──────────────────────────────────────┬────────────────────   ┤
│              │  Page Title                Actions   │  ┌──────────────┐     │
│  Side Nav    │  Tabs (Payments | Orders)            │  │ Drawer       │     │
│  (240px)     ├──────────────────────────────────────┤  │  Header      │     │
│              │  Quick Filters  Search  Export  CTA  │  │  ─────────── │     │
│  Home        ├──────────────────────────────────────┤  │  Body (slot) │     │
│  Transact.◀  │  Table Header (Showing X of Y)       │  │              │     │
│  Settlement  │  ╔══════════════════════════════╗    │  └──────────────┘     │
│  Reports     │  ║  Table rows (slot)           ║    │                       │
│              │  ╚══════════════════════════════╝    │  ◀ Dim overlay        │
│              │  Table Footer (Pagination)           │                       │
└──────────────┴──────────────────────────────────────┘                       │
```

- **Drawer** — Slides in from the right at 380px width; semi-transparent overlay (`rgba(0,0,0,0.56)`) covers the rest

### Mobile Layout (393×852px)

```
┌──────────────────────────────────────┐
│  Top Navigation (56px, black)        │
├──────────────────────────────────────┤
│  Page Title            CTA   Button  │
│  Tabs (Payments | Orders)            │
├──────────────────────────────────────┤
│  Quick Filters | Search | Actions    │
│  ┌──────────────────────────────┐    │
│  │  Table (slot)                │    │
│  │  Pagination: < 1 of 60 >     │    │
│  └──────────────────────────────┘    │
│  ┌──────────────────────────────┐    │
│  │  Drawer (351px, full-height) │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

## Drawer Component Structure

```
Drawer
├── overlay                        (optional, rgba(0,0,0,0.56))
└── root (380px desktop / 351px mobile, border-radius: 16px, elevation: highRaised)
    └── wrapper (white background)
        ├── Drawer Header
        │   ├── title-bar
        │   │   ├── left-container
        │   │   │   ├── Back Navigation icon (optional)
        │   │   │   └── drawer-content
        │   │   │       ├── title  +  title-affix Badge (optional)
        │   │   │       └── subtitle (optional)
        │   │   └── right-container
        │   │       ├── trailing action icons (optional)
        │   │       └── close (×) icon button
        │   └── detail-view-content (optional)
        │       ├── leading icon/slot
        │       ├── Amount display (₹ value)
        │       ├── badge-group (1–3 badges)
        │       ├── lead-text (optional)
        │       ├── highlights (key-value pairs, optional)
        │       ├── slot card (optional)
        │       ├── actions (Approve / Reject buttons, optional)
        │       └── caption-text
        ├── drawer-body (slot — replace with your content sections)
        └── Drawer Footer (optional)
            ├── Divider
            └── actions-container
                ├── Secondary Button
                └── Primary Button
```

## Drawer Header — Detail View Content

The gradient-tinted header block communicates the essential context of the selected record:

### Amount Display
Use the `Amount` component. Format: `₹ 1,000.00` (symbol + value + decimals). Larger size on desktop than mobile.

### Badge Group
Up to 3 semantic badge slots — use to communicate:
- **Badge 1** (notice/orange): Transaction or payout status (e.g. Pending, Processing, Captured)
- **Badge 2** (information/blue): Secondary status or payment method (e.g. UPI, NEFT, Card)
- **Badge 3** (neutral/grey): Additional metadata (e.g. Internal, Refund, Test)

### Caption Text
Use `•` separated meta items (e.g. `14 May 2025 • 10:30 AM`). Render with muted text color.

### Highlights (optional)
Two-column key–value grid using `InfoItem` pairs. Use when 2–4 key facts need to surface without opening the body (e.g. Ref ID, Bank, Account number).

## Drawer Body — Drawer Sections

The drawer body is a **slot** — replace it with one or more `drawer-section` components.

### Available Built-in Drawer Views

| Component | Use Case |
|---|---|
| `.drawer / single-payout-view` | Single payout details (recipient, bank, amount, UTR) |
| `.drawer / bulk-payout-view` | Bulk payout batch details |
| `.drawer / transactions-view` | Transaction breakdown |
| `.drawer / contact-view` | Contact / vendor information |
| `.drawer / settlement-view` | Settlement summary and breakdown |
| `.drawer / payment-link-view` | Payment link metadata |
| `.drawer / link-view` | Linked entity reference |
| `.drawer / tax-view` | Tax and invoice summary |
| `.drawer / qr-code-view` | QR code display with sections |
| `.drawer / cards / body-card` | Card-style body section (header + body sub-sections) |

## Product Examples

| Example | Context |
|---|---|
| `single-payout-view` | RazorpayX payout — recipient bank details, amount, UTR |
| `bulk-payout-view` | Bulk payout batch — batch ID, file name, items count |
| `transactions-view` | Payments dashboard — payment ID, order, method, gateway |
| `contact-view` | Contacts — name, email, phone, fund accounts |
| `tax-view` | Invoice/tax — GST, TDS, invoice number |
| `link-view` | Payment Links — link URL, expiry, usage |
| `settlements-view` | Settlements — UTR, settled amount, date |
| `payment-links-view` | Payment Links page — link details with QR |
| `qr-code-view` | QR code page — QR image, payment info |
| `transactions-view` (2nd) | Alternate transaction detail variant |

## Example

### Transaction Details with Table Integration

This example shows a DetailedView pattern integrated with a Table component, displaying transaction details in a drawer when a table row is clicked.

```tsx
import React, { useState } from 'react';
import {
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
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Box,
  Amount,
  Badge,
  Button,
  IconButton,
  Text,
  Code,
  Link,
  Divider,
  StepGroup,
  StepItem,
  StepItemIndicator,
  Collapsible,
  CollapsibleBody,
  CollapsibleLink,
  MoreHorizontalIcon,
  DownloadIcon,
  CloseIcon,
  ArrowRightIcon,
  CopyIcon,
  CheckIcon,
  ClockIcon,
} from '@razorpay/blade/components';
type Transaction = {
  id: string;
  paymentId: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  date: Date;
  type: string;
  method: string;
  name: string;
  bank: string;
  account: string;
};

const KeyValueItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <>
    <Text variant="body" size="small" color="surface.text.gray.muted">
      {label}
    </Text>
    <Box>{children}</Box>
  </>
);

const KeyValueGrid = ({ children }: { children: React.ReactNode }) => (
  <Box display="grid" gridTemplateColumns="160px 1fr" gap="spacing.3">
    {children}
  </Box>
);

const Timeline = ({ status }: { status: string }) => (
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

const TransactionDetailedView = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const transactions: Transaction[] = [
    {
      id: '1',
      paymentId: 'rzp_123456',
      amount: 5000,
      status: 'Completed',
      date: new Date('2024-01-15'),
      type: 'Settlement',
      method: 'Bank Transfer',
      name: 'John Doe',
      bank: 'HDFC',
      account: '1234567890',
    },
    {
      id: '2',
      paymentId: 'rzp_789012',
      amount: 2500,
      status: 'Pending',
      date: new Date('2024-01-16'),
      type: 'Refund',
      method: 'UPI',
      name: 'Jane Smith',
      bank: 'ICICI',
      account: '0987654321',
    },
  ];

  const tableData = { nodes: transactions };

  return (
    <Box overflow="auto" minHeight="400px">
      <Table
        data={tableData}
        selectionType="none"
        toolbar={
          <TableToolbar title="Transactions">
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.2">
                Export
              </Button>
              <Button>Refund</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination defaultPageSize={10} showPageSizePicker showPageNumberSelector />
        }
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Payment ID</TableHeaderCell>
                <TableHeaderCell>Account Holder</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((transaction, index) => (
                <TableRow
                  key={index}
                  item={transaction}
                  onClick={() => {
                    setSelectedTransaction(transaction);
                    setIsDrawerOpen(true);
                  }}
                >
                  <TableCell>
                    <Code size="medium">{transaction.paymentId}</Code>
                  </TableCell>
                  <TableCell>{transaction.name}</TableCell>
                  <TableCell>
                    <Amount value={transaction.amount} currency="INR" />
                  </TableCell>
                  <TableCell>
                    {transaction.date.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableCell>{transaction.method}</TableCell>
                  <TableCell>
                    <Badge
                      size="medium"
                      color={
                        transaction.status === 'Completed'
                          ? 'positive'
                          : transaction.status === 'Pending'
                          ? 'notice'
                          : 'negative'
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        )}
      </Table>

      <Drawer
        isOpen={isDrawerOpen}
        onDismiss={() => setIsDrawerOpen(false)}
        onUnmount={() => setSelectedTransaction(null)}
      >
        <DrawerHeader
          color={
            selectedTransaction?.status === 'Completed'
              ? 'positive'
              : selectedTransaction?.status === 'Pending'
              ? 'notice'
              : 'negative'
          }
          title="Transaction Details"
          trailing={
            <IconButton
              icon={MoreHorizontalIcon}
              accessibilityLabel="More options"
              onClick={() => console.log('Options clicked')}
              size="large"
            />
          }
          showDivider={false}
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={selectedTransaction?.amount ?? 0}
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
                selectedTransaction?.status === 'Completed'
                  ? 'positive'
                  : selectedTransaction?.status === 'Pending'
                  ? 'notice'
                  : 'negative'
              }
              emphasis="intense"
              icon={
                selectedTransaction?.status === 'Completed'
                  ? CheckIcon
                  : selectedTransaction?.status === 'Pending'
                  ? ClockIcon
                  : undefined
              }
            >
              {selectedTransaction?.status ?? 'Pending'}
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
                <Text size="medium">{selectedTransaction?.paymentId}</Text>
              </Box>
            </Box>
            <Box display="flex">
              <Divider thickness="thicker" orientation="vertical" />
              <Box paddingX="spacing.3">
                <Text size="xsmall" color="surface.text.gray.muted" weight="semibold">
                  Date
                </Text>
                <Text size="medium">
                  {selectedTransaction?.date?.toLocaleDateString('en-IN', {
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
              <Timeline status={selectedTransaction?.status ?? 'Pending'} />
            </Box>
            <Divider />
            <Box>
              <Text variant="body" size="medium" weight="semibold" marginBottom="spacing.4">
                Transaction Details
              </Text>
              <KeyValueGrid>
                <KeyValueItem label="Amount">
                  <Amount value={selectedTransaction?.amount ?? 0} currency="INR" />
                </KeyValueItem>
                <KeyValueItem label="Payment ID">
                  <Box display="flex" gap="spacing.2" alignItems="center">
                    <Code size="small">{selectedTransaction?.paymentId ?? 'NA'}</Code>
                    <Link variant="button" size="small" icon={CopyIcon} />
                  </Box>
                </KeyValueItem>
                <KeyValueItem label="Payment Type">
                  <Text variant="body" size="medium">
                    {selectedTransaction?.type}
                  </Text>
                </KeyValueItem>
                <KeyValueItem label="Payment Method">
                  <Text variant="body" size="medium">
                    {selectedTransaction?.method}
                  </Text>
                </KeyValueItem>
                <KeyValueItem label="Account Holder">
                  <Text variant="body" size="medium">
                    {selectedTransaction?.name}
                  </Text>
                </KeyValueItem>
                <KeyValueItem label="Bank">
                  <Text variant="body" size="medium">
                    {selectedTransaction?.bank}
                  </Text>
                </KeyValueItem>
                <KeyValueItem label="Account Number">
                  <Text variant="body" size="medium">
                    {selectedTransaction?.account}
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

export default TransactionDetailedView;
```

### Settlement Details with Card Integration

This example demonstrates a DetailedView pattern triggered from a Card component, showing settlement breakdown and transaction details.

```tsx
import React, { useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderLeading,
  CardHeaderTrailing,
  CardHeaderIcon,
  CardHeaderLink,
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Box,
  Amount,
  Badge,
  Button,
  Text,
  Heading,
  Divider,
  Code,
  Link,
  RazorpayIcon,
  ExternalLinkIcon,
  DownloadIcon,
  CheckIcon,
  CopyIcon,
  CloseIcon,
  ArrowRightIcon,
} from '@razorpay/blade/components';

const KeyValueItem = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <>
    <Text variant="body" size="small" color="surface.text.gray.muted">
      {label}
    </Text>
    <Box>{children}</Box>
  </>
);

const KeyValueGrid = ({ children }: { children: React.ReactNode }) => (
  <Box display="grid" gridTemplateColumns="160px 1fr" gap="spacing.3">
    {children}
  </Box>
);

const SettlementDetailedView = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFooter, setShowFooter] = useState(true);

  const settlementData = {
    amount: 3120,
    amountPaid: 3120,
    paymentId: 'pay_MK7DGqwYXEwx9Q',
    referenceId: 'ref_MK7DGqwYXEwx9Q',
    type: 'Settlement',
    utr: 'UTR123456789',
    bankAccount: '1234567890',
    ifsc: 'HDFC0001234',
    status: 'Completed',
    tax: 260,
    fee: 260,
    netAmount: 2600,
  };

  return (
    <Box>
      <Box display="flex" gap="spacing.4" marginBottom="spacing.4">
        <Button variant="secondary" onClick={() => setShowFooter(!showFooter)}>
          {showFooter ? 'Hide Footer' : 'Show Footer'}
        </Button>
      </Box>

      <Card width={{ base: '100%', m: '500px' }}>
        <CardHeader>
          <CardHeaderLeading
            prefix={<CardHeaderIcon icon={RazorpayIcon} />}
            title="Settlement Summary"
          />
          <CardHeaderTrailing
            visual={
              <CardHeaderLink
                variant="button"
                onClick={() => setIsDrawerOpen(true)}
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
            <Text variant="body" size="medium" color="surface.text.gray.muted" gridColumn="1 / -1">
              Gross Settlements
            </Text>
            <Text variant="body" size="medium">
              Payment
            </Text>
            <Box>
              <Amount value={settlementData.amount} currency="INR" />
            </Box>

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
              <Amount value={settlementData.tax} currency="INR" />
            </Box>
            <Text variant="body" size="medium">
              Fee
            </Text>
            <Box>
              <Amount value={settlementData.fee} currency="INR" />
            </Box>

            <Box gridColumn="1 / -1" marginTop="spacing.4">
              <Divider marginBottom="spacing.4" />
              <Box display="grid" gridTemplateColumns="1fr auto">
                <Text variant="body" size="medium" weight="semibold">
                  Net Settlement Amount
                </Text>
                <Box>
                  <Amount value={settlementData.netAmount} currency="INR" weight="semibold" />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Drawer isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <DrawerHeader
          color="positive"
          title="Settlement Details"
          trailing={<Button size="medium" icon={DownloadIcon} />}
          showDivider={false}
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={settlementData.amount}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          </Box>
          <Box display="flex" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
            <Badge icon={CheckIcon} size="medium" color="positive" emphasis="intense">
              {settlementData.status}
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
                <Text size="medium">{settlementData.paymentId}</Text>
              </Box>
            </Box>
          </Box>
          <Text
            size="small"
            marginTop="spacing.6"
            textAlign="center"
            color="surface.text.gray.muted"
          >
            Settlement was completed on 24th April 2025
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Heading size="small" weight="semibold" marginBottom="spacing.4">
            Settlement Breakdown
          </Heading>
          <KeyValueGrid>
            <KeyValueItem label="Gross Amount">
              <Amount value={settlementData.amount} currency="INR" />
            </KeyValueItem>
            <KeyValueItem label="Tax Deducted">
              <Amount value={settlementData.tax} currency="INR" />
            </KeyValueItem>
            <KeyValueItem label="Processing Fee">
              <Amount value={settlementData.fee} currency="INR" />
            </KeyValueItem>
            <KeyValueItem label="Net Amount">
              <Amount value={settlementData.netAmount} currency="INR" weight="semibold" />
            </KeyValueItem>
          </KeyValueGrid>

          <Heading marginTop="spacing.6" marginBottom="spacing.4" size="small" weight="semibold">
            Transaction Information
          </Heading>
          <KeyValueGrid>
            <KeyValueItem label="Payment ID">
              <Box display="flex" gap="spacing.2" alignItems="center">
                <Code size="small">{settlementData.paymentId}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>
            <KeyValueItem label="Reference ID">
              <Text variant="body" size="medium">
                {settlementData.referenceId}
              </Text>
            </KeyValueItem>
            <KeyValueItem label="UTR Number">
              <Box display="flex" gap="spacing.2" alignItems="center">
                <Code size="small">{settlementData.utr}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>
            <KeyValueItem label="Bank Account">
              <Text variant="body" size="medium">
                {settlementData.bankAccount}
              </Text>
            </KeyValueItem>
            <KeyValueItem label="IFSC Code">
              <Text variant="body" size="medium">
                {settlementData.ifsc}
              </Text>
            </KeyValueItem>
            <KeyValueItem label="Settlement Type">
              <Text variant="body" size="medium">
                {settlementData.type}
              </Text>
            </KeyValueItem>
          </KeyValueGrid>
        </DrawerBody>

        {showFooter && (
          <DrawerFooter>
            <Box display="flex" gap="spacing.5">
              <Button
                variant="tertiary"
                icon={CloseIcon}
                iconPosition="left"
                isFullWidth
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" icon={ArrowRightIcon} iconPosition="right" isFullWidth>
                Process Settlement
              </Button>
            </Box>
          </DrawerFooter>
        )}
      </Drawer>
    </Box>
  );
};

export default SettlementDetailedView;
```
