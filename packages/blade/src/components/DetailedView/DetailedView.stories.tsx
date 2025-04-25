import type { StoryFn, Meta } from '@storybook/react';
import { useState } from 'react';
import type { TableData, TableProps } from '~components/Table';
import {
  Table as TableComponent,
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
} from '~components/Table';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Amount } from '~components/Amount';
import { Code, Heading, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import type { SpacingValueType } from '~components/Box/BaseBox/types';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Button } from '~components/Button';
import { Drawer, DrawerHeader, DrawerBody } from '~components/Drawer';
import {
  CheckIcon,
  ClockIcon,
  CopyIcon,
  DownloadIcon,
  ExternalLinkIcon,
  MoreHorizontalIcon,
  RazorpayIcon,
} from '~components/Icons';
import { Link } from '~components/Link';
import { Divider } from '~components/Divider';
import { StepGroup, StepItem, StepItemIndicator } from '~components/StepGroup';
import { IconButton } from '~components/Button/IconButton';
import { Collapsible, CollapsibleBody, CollapsibleLink } from '~components/Collapsible';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderIcon,
  CardHeaderLeading,
  CardHeaderLink,
  CardHeaderTrailing,
} from '~components/Card';

export default {
  title: 'Patterns/DetailedView',
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
          componentDescription="A DetailedView is a pattern that shows details of a transaction / user / entity in drawer in a defined format."
          componentName="DetailedView"
        />
      ),
    },
  },
} as Meta<TableProps<unknown>>;

const QRCodeImage = (): React.ReactElement => {
  return (
    <Box>
      <svg
        width="114"
        height="114"
        viewBox="0 0 114 114"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="svg8822">
          <path
            id="path3093"
            d="M4.95654 4.95654V9.91306V14.8696V19.8261V24.7826V29.7392V34.6957V39.6522H9.91306H14.8696H19.8261H24.7826H29.7392H34.6957H39.6522V34.6957V29.7392V24.7826V19.8261V14.8696V9.91306V4.95654H34.6957H29.7392H24.7826H19.8261H14.8696H9.91306H4.95654ZM44.6087 4.95654V9.91306V14.8696H49.5652V9.91306H54.5218V4.95654H49.5652H44.6087ZM54.5218 9.91306V14.8696H59.4783V9.91306H54.5218ZM59.4783 14.8696V19.8261H64.4348H69.3913V14.8696V9.91306V4.95654H64.4348V9.91306V14.8696H59.4783ZM59.4783 19.8261H54.5218H49.5652H44.6087V24.7826H49.5652H54.5218V29.7392H49.5652V34.6957H54.5218V39.6522H59.4783V34.6957H64.4348V39.6522H59.4783V44.6087H54.5218V49.5652H59.4783H64.4348V54.5218H69.3913V49.5652V44.6087V39.6522V34.6957V29.7392H64.4348V24.7826H59.4783V19.8261ZM64.4348 54.5218H59.4783V59.4783H54.5218V64.4348V69.3913H59.4783V74.3479V79.3044H54.5218H49.5652V74.3479H54.5218V69.3913H49.5652V64.4348V59.4783H44.6087V54.5218H49.5652V59.4783H54.5218V54.5218V49.5652H49.5652H44.6087V44.6087H39.6522H34.6957H29.7392V49.5652H24.7826V54.5218H19.8261V49.5652H24.7826V44.6087H19.8261H14.8696V49.5652H9.91306V54.5218V59.4783V64.4348H14.8696V59.4783H19.8261H24.7826H29.7392V54.5218H34.6957V49.5652H39.6522V54.5218H34.6957V59.4783H39.6522V64.4348H34.6957V69.3913H39.6522H44.6087V74.3479V79.3044V84.2609H49.5652V89.2174H54.5218H59.4783H64.4348V94.1739H59.4783H54.5218H49.5652V89.2174H44.6087V94.1739V99.1305H49.5652V104.087H44.6087V109.044H49.5652H54.5218V104.087H59.4783V109.044H64.4348H69.3913H74.3479H79.3044V104.087H84.2609V109.044H89.2174H94.1739H99.1305V104.087H94.1739H89.2174V99.1305H84.2609V94.1739H79.3044V99.1305H74.3479H69.3913V104.087H64.4348V99.1305H69.3913V94.1739V89.2174V84.2609H74.3479V79.3044H69.3913H64.4348V74.3479H69.3913V69.3913V64.4348V59.4783H64.4348V54.5218ZM79.3044 94.1739V89.2174H74.3479V94.1739H79.3044ZM89.2174 99.1305H94.1739H99.1305V94.1739H94.1739H89.2174V99.1305ZM99.1305 94.1739H104.087V89.2174V84.2609V79.3044V74.3479H99.1305H94.1739H89.2174V69.3913H84.2609V74.3479H79.3044V79.3044V84.2609H84.2609V79.3044H89.2174V84.2609V89.2174H94.1739H99.1305V94.1739ZM84.2609 69.3913V64.4348H79.3044H74.3479V69.3913H79.3044H84.2609ZM89.2174 69.3913H94.1739V64.4348V59.4783V54.5218H99.1305V59.4783H104.087V64.4348H109.044V59.4783V54.5218H104.087V49.5652H109.044V44.6087H104.087H99.1305V49.5652H94.1739V44.6087H89.2174V49.5652H84.2609V54.5218H89.2174V59.4783V64.4348V69.3913ZM84.2609 54.5218H79.3044V59.4783H84.2609V54.5218ZM104.087 64.4348H99.1305V69.3913H104.087V64.4348ZM34.6957 64.4348V59.4783H29.7392V64.4348H34.6957ZM29.7392 64.4348H24.7826H19.8261H14.8696V69.3913H19.8261H24.7826H29.7392V64.4348ZM9.91306 64.4348H4.95654V69.3913H9.91306V64.4348ZM9.91306 49.5652V44.6087H4.95654V49.5652H9.91306ZM44.6087 44.6087H49.5652V39.6522V34.6957H44.6087V39.6522V44.6087ZM74.3479 4.95654V9.91306V14.8696V19.8261V24.7826V29.7392V34.6957V39.6522H79.3044H84.2609H89.2174H94.1739H99.1305H104.087H109.044V34.6957V29.7392V24.7826V19.8261V14.8696V9.91306V4.95654H104.087H99.1305H94.1739H89.2174H84.2609H79.3044H74.3479ZM9.91306 9.91306H14.8696H19.8261H24.7826H29.7392H34.6957V14.8696V19.8261V24.7826V29.7392V34.6957H29.7392H24.7826H19.8261H14.8696H9.91306V29.7392V24.7826V19.8261V14.8696V9.91306ZM79.3044 9.91306H84.2609H89.2174H94.1739H99.1305H104.087V14.8696V19.8261V24.7826V29.7392V34.6957H99.1305H94.1739H89.2174H84.2609H79.3044V29.7392V24.7826V19.8261V14.8696V9.91306ZM14.8696 14.8696V19.8261V24.7826V29.7392H19.8261H24.7826H29.7392V24.7826V19.8261V14.8696H24.7826H19.8261H14.8696ZM84.2609 14.8696V19.8261V24.7826V29.7392H89.2174H94.1739H99.1305V24.7826V19.8261V14.8696H94.1739H89.2174H84.2609ZM74.3479 44.6087V49.5652H79.3044V44.6087H74.3479ZM4.95654 74.3479V79.3044V84.2609V89.2174V94.1739V99.1305V104.087V109.044H9.91306H14.8696H19.8261H24.7826H29.7392H34.6957H39.6522V104.087V99.1305V94.1739V89.2174V84.2609V79.3044V74.3479H34.6957H29.7392H24.7826H19.8261H14.8696H9.91306H4.95654ZM9.91306 79.3044H14.8696H19.8261H24.7826H29.7392H34.6957V84.2609V89.2174V94.1739V99.1305V104.087H29.7392H24.7826H19.8261H14.8696H9.91306V99.1305V94.1739V89.2174V84.2609V79.3044ZM14.8696 84.2609V89.2174V94.1739V99.1305H19.8261H24.7826H29.7392V94.1739V89.2174V84.2609H24.7826H19.8261H14.8696ZM104.087 99.1305V104.087H109.044V99.1305H104.087Z"
            fill="black"
          />
        </g>
      </svg>
    </Box>
  );
};

const Timeline = ({ status }: { status: string }): React.ReactElement => {
  return (
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
};

type KeyValueGridProps = {
  children: React.ReactNode;
  padding?: SpacingValueType;
};

type KeyValueItemProps = {
  label: string;
  children: React.ReactNode;
};

const KeyValueItem = ({ label, children }: KeyValueItemProps): React.ReactElement => {
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

const nodes: Item[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
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

const DetailedViewWithTableTemplate: StoryFn<typeof Drawer> = ({ ...args }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <Box padding="spacing.5" overflow="auto" minHeight="400px">
      <TableComponent
        data={data}
        selectionType="none"
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
            <TableFooter>
              <TableFooterRow>
                <TableFooterCell>Total</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>
                  <Amount value={10} />
                </TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>

      <Drawer
        showOverlay={false}
        {...args}
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
          title="Settlements"
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

                {/* Amount Paid */}
                <KeyValueItem label="Amount Paid">
                  <Amount value={0} />
                </KeyValueItem>

                {/* Payment Link ID */}
                <KeyValueItem label="Payment Link ID">
                  <Box display="flex" gap="spacing.2" alignItems="center" justifyContent="right">
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
    </Box>
  );
};

export const WithTable = DetailedViewWithTableTemplate.bind({});

const dummyData = {
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
  status: 'Processing',
};

const DetailedViewWithCardTemplate: StoryFn<typeof Drawer> = ({ ...args }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Box padding="spacing.5">
      <Card width="500px">
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
                Gross settlement details
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
            <Box textAlign="right">
              <Amount value={dummyData.amount} alignSelf="right" currency="INR" />
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
            <Box textAlign="right">
              <Amount value={260} currency="INR" />
            </Box>

            <Text variant="body" size="medium">
              Fee
            </Text>
            <Box textAlign="right">
              <Amount value={260} currency="INR" />
            </Box>

            {/* Net Settlement - with divider */}
            <Box gridColumn="1 / -1" marginTop="spacing.4">
              <Divider marginBottom="spacing.4" />
              <Box display="grid" gridTemplateColumns="1fr auto">
                <Text variant="body" size="medium" weight="semibold">
                  Net Settlement amount
                </Text>
                <Box textAlign="right">
                  <Amount value={2600} currency="INR" weight="semibold" />
                </Box>
              </Box>
            </Box>
          </Box>
        </CardBody>
      </Card>

      <Drawer
        {...args}
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
              value={dummyData?.amount ?? 0}
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
                <Text size="medium">{dummyData?.paymentId}</Text>
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
          <Heading size="small" weight="semibold">
            Timeline
          </Heading>
          <Timeline status="Completed" />

          <Heading marginTop="spacing.6" marginBottom="spacing.3" size="small" weight="semibold">
            Transaction Breakdown
          </Heading>

          <KeyValueGrid>
            <KeyValueItem label="Amount">
              <Amount value={dummyData.amount} currency="INR" />
            </KeyValueItem>

            <KeyValueItem label="Amount Paid">
              <Amount value={dummyData.amountPaid} currency="INR" />
            </KeyValueItem>

            <KeyValueItem label="Payment Link ID">
              <Box display="flex" gap="spacing.2" alignItems="center" justifyContent="right">
                <Code size="small">{dummyData.paymentId}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>

            <KeyValueItem label="Reference ID">
              <Text variant="body" size="medium">
                {dummyData.referenceId}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Payment for">
              <Text variant="body" size="medium">
                {dummyData.type}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="UTR Number">
              <Box display="flex" gap="spacing.2" alignItems="center" justifyContent="right">
                <Code size="small">{dummyData.utr}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>

            <KeyValueItem label="Bank Account">
              <Text variant="body" size="medium">
                {dummyData.bankAccount}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="IFSC">
              <Text variant="body" size="medium">
                {dummyData.ifsc}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Partial Payment">
              <Text variant="body" size="medium">
                {dummyData.partialPayment}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Reminders">
              <Text variant="body" size="medium">
                {dummyData.reminders}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Created By">
              <Text variant="body" size="medium">
                {dummyData.createdBy}
              </Text>
            </KeyValueItem>
          </KeyValueGrid>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const WithCard = DetailedViewWithCardTemplate.bind({});

const DetailedViewWithQRCodeTemplate: StoryFn<typeof Drawer> = ({ ...args }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTransactionBreakdownOpen, setIsTransactionBreakdownOpen] = useState(false);
  return (
    <Box padding="spacing.5">
      <Button onClick={() => setIsDrawerOpen(true)}>Show QR Details</Button>
      <Drawer
        {...args}
        isOpen={isDrawerOpen}
        onDismiss={() => {
          setIsDrawerOpen(false);
        }}
      >
        <DrawerHeader
          color="notice"
          title="Payment QR Code"
          trailing={<Button size="medium" icon={DownloadIcon} />}
        >
          <Box marginTop="spacing.6" textAlign="center">
            <Amount
              value={dummyData?.amount ?? 0}
              currency="INR"
              size="2xlarge"
              type="heading"
              weight="semibold"
              suffix="decimals"
            />
          </Box>
          <Box display="flex" justifyContent="center" gap="spacing.4" marginTop="spacing.4">
            <Badge icon={ClockIcon} size="medium" color="notice" emphasis="intense">
              Pending
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
                <Text size="medium">{dummyData?.paymentId}</Text>
              </Box>
            </Box>
          </Box>

          <Text
            size="small"
            marginTop="spacing.6"
            textAlign="center"
            color="surface.text.gray.muted"
          >
            QR was generated on 24th April 2025
          </Text>
        </DrawerHeader>
        <DrawerBody>
          <Heading marginBottom="spacing.3" size="small" weight="semibold">
            QR Code
          </Heading>
          <Box textAlign="center">
            <QRCodeImage />
          </Box>

          <Heading marginTop="spacing.6" size="small" weight="semibold">
            Timeline
          </Heading>
          <Timeline status="Pending" />

          <Box
            marginTop="spacing.6"
            marginBottom="spacing.3"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Heading size="small" weight="semibold">
              Transaction Details
            </Heading>
            <Link
              variant="button"
              size="small"
              icon={ExternalLinkIcon}
              onClick={() => setIsTransactionBreakdownOpen(true)}
            >
              Open Details
            </Link>
          </Box>

          <Text marginTop="spacing.3" marginBottom="spacing.6">
            Order of <Amount value={dummyData.amount} currency="INR" /> is created successfully.
            Scan the QR Code to proceed
          </Text>
        </DrawerBody>
      </Drawer>

      <Drawer
        {...args}
        isOpen={isTransactionBreakdownOpen}
        onDismiss={() => {
          setIsTransactionBreakdownOpen(false);
        }}
      >
        <DrawerHeader title="Transaction Breakdown" />
        <DrawerBody>
          <KeyValueGrid>
            <KeyValueItem label="Amount">
              <Amount value={dummyData.amount} currency="INR" />
            </KeyValueItem>

            <KeyValueItem label="Amount Paid">
              <Amount value={dummyData.amountPaid} currency="INR" />
            </KeyValueItem>

            <KeyValueItem label="Payment Link ID">
              <Box display="flex" gap="spacing.2" alignItems="center" justifyContent="right">
                <Code size="small">{dummyData.paymentId}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>

            <KeyValueItem label="Reference ID">
              <Text variant="body" size="medium">
                {dummyData.referenceId}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Payment for">
              <Text variant="body" size="medium">
                {dummyData.type}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="UTR Number">
              <Box display="flex" gap="spacing.2" alignItems="center" justifyContent="right">
                <Code size="small">{dummyData.utr}</Code>
                <Link variant="button" size="small" icon={CopyIcon} />
              </Box>
            </KeyValueItem>

            <KeyValueItem label="Bank Account">
              <Text variant="body" size="medium">
                {dummyData.bankAccount}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="IFSC">
              <Text variant="body" size="medium">
                {dummyData.ifsc}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Partial Payment">
              <Text variant="body" size="medium">
                {dummyData.partialPayment}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Reminders">
              <Text variant="body" size="medium">
                {dummyData.reminders}
              </Text>
            </KeyValueItem>

            <KeyValueItem label="Created By">
              <Text variant="body" size="medium">
                {dummyData.createdBy}
              </Text>
            </KeyValueItem>
          </KeyValueGrid>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const WithQRCode = DetailedViewWithQRCodeTemplate.bind({});
