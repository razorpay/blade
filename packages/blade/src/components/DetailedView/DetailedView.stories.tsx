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
import { Code, Text } from '~components/Typography';
import { Badge } from '~components/Badge';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Button } from '~components/Button';
import { Drawer, DrawerHeader, DrawerBody } from '~components/Drawer';
import { LinkIcon, CopyIcon, DownloadIcon } from '~components/Icons';
import { Link } from '~components/Link';
import { Divider } from '~components/Divider';
import { StepGroup, StepItem, StepItemIndicator } from '~components/StepGroup';

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
          componentDescription="A detailed view component that displays data in a table format with additional features for detailed information viewing."
          componentName="DetailedView"
          figmaURL="YOUR_FIGMA_URL_HERE"
        />
      ),
    },
  },
} as Meta<TableProps<unknown>>;

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
    </StepGroup>
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

const DetailedViewTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <Box padding="spacing.5" overflow="auto" minHeight="400px">
      <div
        onKeyDown={(e) => {
          e.preventDefault();
          console.log(e.key);
        }}
      >
        <TableComponent
          {...args}
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
                  {args.selectionType === 'multiple' ? <TableFooterCell>-</TableFooterCell> : null}
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </TableComponent>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onDismiss={() => {
          setIsDrawerOpen(false);
        }}
        onUnmount={() => {
          setSelectedItem(null);
        }}
        showOverlay={false}
      >
        <DrawerHeader>
          <Box display="flex" flexDirection="column" gap="spacing.3">
            <Box display="flex" alignItems="center" gap="spacing.2" marginBottom="spacing.3">
              <Badge icon={LinkIcon} color="primary">
                {selectedItem?.type ?? 'Payment'}
              </Badge>
              <Badge
                color={
                  selectedItem?.status === 'Completed'
                    ? 'positive'
                    : selectedItem?.status === 'Pending'
                    ? 'notice'
                    : 'negative'
                }
              >
                {selectedItem?.status ?? 'Pending'}
              </Badge>
            </Box>

            <Box display="flex" flexDirection="column" gap="spacing.1">
              <Amount
                weight="semibold"
                value={selectedItem?.amount ?? 0}
                currency="INR"
                size="xlarge"
                type="heading"
              />
              <Text size="small" color="surface.text.gray.muted">
                Payment ID: {selectedItem?.paymentId}
              </Text>
              <Text size="small" color="surface.text.gray.muted">
                Date:{' '}
                {selectedItem?.date?.toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </Box>

            <Box display="flex" gap="spacing.3">
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
              <Box
                display="grid"
                gridTemplateColumns="160px 1fr"
                gap="spacing.3"
                backgroundColor="surface.background.gray.moderate"
                padding="spacing.4"
                borderRadius="large"
              >
                {/* Amount */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Amount
                </Text>
                <Box>
                  <Amount value={selectedItem?.amount ?? 0} />
                </Box>

                {/* Amount Paid */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Amount Paid
                </Text>
                <Box>
                  <Amount value={0} />
                </Box>

                {/* Payment Link ID */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Payment Link ID
                </Text>
                <Box display="flex" gap="spacing.2" alignItems="center">
                  <Code size="small">{selectedItem?.paymentId ?? 'NA'}</Code>
                  <Link variant="button" size="small" icon={CopyIcon} />
                </Box>

                {/* Reference ID */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Reference ID
                </Text>
                <Box>
                  <Text variant="body" size="medium">
                    NA
                  </Text>
                </Box>

                {/* Payment For */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Payment for
                </Text>
                <Box>
                  <Text variant="body" size="medium">
                    {selectedItem?.type}
                  </Text>
                </Box>

                {/* Partial Payment */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Partial Payment
                </Text>
                <Box>
                  <Text variant="body" size="medium">
                    Enabled
                  </Text>
                </Box>

                {/* Reminders */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Reminders
                </Text>
                <Box>
                  <Text variant="body" size="medium">
                    Send auto reminders
                  </Text>
                </Box>

                {/* Created By */}
                <Text variant="body" size="small" color="surface.text.gray.muted">
                  Created by
                </Text>
                <Box>
                  <Text variant="body" size="medium">
                    {selectedItem?.name}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </DrawerBody>
      </Drawer>
    </Box>
  );
};

export const WithTable = DetailedViewTemplate.bind({});
