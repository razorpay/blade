import { useState } from 'react';
import type { StoryFn, Meta } from '@storybook/react';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { Button } from '~components/Button';
import { Badge } from '~components/Badge';
import { Amount } from '~components/Amount';
import { ChevronDownIcon, ChevronRightIcon } from '~components/Icons';
import { BaseMotionEntryExit } from '~components/BaseMotion';
import type { MotionVariantsType } from '~components/BaseMotion';
import { castWebType, makeSpace, useTheme } from '~utils';
import { cssBezierToArray } from '~utils/cssBezierToArray';
import { msToSeconds } from '~utils/msToSeconds';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';

type TransactionData = {
  id: string;
  paymentId: string;
  amount: number;
  date: string;
  method: string;
  customerEmail: string;
  status: string;
};

type SummaryData = {
  gatewayUsed: string;
  totalAmount: number;
  transactionCount: number;
  successRate: number;
};

type MerchantData = {
  id: string;
  merchantName: string;
  merchantId: string;
  totalAmount: number;
  transactionCount: number;
  successRate: number;
  status: string;
  children: TransactionData[] | SummaryData[];
};

const TableMeta: Meta = {
  title: 'Components/Table/Nesting',
  component: TableComponent,
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableNesting props here"
          componentName="TableNesting"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
};

const merchantData: MerchantData[] = [
  {
    id: 'merchant_1',
    merchantName: 'Amazon',
    merchantId: 'rzp_merchant_amazon',
    totalAmount: 43000,
    transactionCount: 1247,
    successRate: 66.7,
    status: 'Active',
    children: [
      {
        id: 'txn_1',
        paymentId: 'rzp_pay_amazon_001',
        amount: 10000,
        date: '2024-01-15',
        method: 'Credit Card',
        customerEmail: 'customer@example.com',
        status: 'Completed',
      },
      {
        id: 'txn_2',
        paymentId: 'rzp_pay_amazon_002',
        amount: 16000,
        date: '2024-01-15',
        method: 'UPI',
        customerEmail: 'user@gmail.com',
        status: 'Completed',
      },
      {
        id: 'txn_3',
        paymentId: 'rzp_pay_amazon_003',
        amount: 7000,
        date: '2024-01-14',
        method: 'Net Banking',
        customerEmail: 'buyer@yahoo.com',
        status: 'Failed',
      },
    ],
  },
  {
    id: 'merchant_2',
    merchantName: 'Flipkart',
    merchantId: 'rzp_merchant_flipkart',
    totalAmount: 24500,
    transactionCount: 983,
    successRate: 100.0,
    status: 'Active',
    children: [
      {
        gatewayUsed: 'Razorpay',
        totalAmount: 18000,
        transactionCount: 790,
        successRate: 100.0,
      },
    ],
  },
  {
    id: 'merchant_3',
    merchantName: 'Zomato',
    merchantId: 'rzp_merchant_zomato',
    totalAmount: 1450,
    transactionCount: 756,
    successRate: 50.0,
    status: 'Active',
    children: [
      {
        id: 'txn_z1',
        paymentId: 'rzp_pay_zomato_001',
        amount: 450,
        date: '2024-01-15',
        method: 'UPI',
        customerEmail: 'foodie@zomato.com',
        status: 'Completed',
      },
      {
        id: 'txn_z2',
        paymentId: 'rzp_pay_zomato_002',
        amount: 1000,
        date: '2024-01-15',
        method: 'Credit Card',
        customerEmail: 'customer@food.com',
        status: 'Failed',
      },
    ],
  },
];

// Custom slide down animation component
const SlideDown = ({ children }: { children: React.ReactElement }): React.ReactElement => {
  const { theme } = useTheme();
  const movePx = makeSpace(theme.spacing[3]); // 8px offset from above

  const slideDownVariants: MotionVariantsType = {
    initial: {
      opacity: 0,
      transform: `translateY(-${movePx})`, // Start from above (negative Y)
    },
    animate: {
      opacity: 1,
      transform: `translateY(${makeSpace(theme.spacing[0])})`, // End at 0
      transition: {
        duration: msToSeconds(theme.motion.duration.quick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.entrance)),
      },
    },
    exit: {
      opacity: 0,
      transform: `translateY(-${movePx})`, // Exit upward
      transition: {
        duration: msToSeconds(theme.motion.duration.quick),
        ease: cssBezierToArray(castWebType(theme.motion.easing.exit)),
      },
    },
  };

  return (
    <BaseMotionEntryExit
      motionVariants={slideDownVariants}
      children={children}
      type="inout"
      motionTriggers={['mount']}
    />
  );
};

const TableNestingTemplate = ({ withSorting = false }: { withSorting?: boolean }): JSX.Element => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string): void => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const sortFunctions = withSorting
    ? {
        totalAmount: (array: MerchantData[]) =>
          [...array].sort((a, b) => a.totalAmount - b.totalAmount),
      }
    : undefined;

  return (
    <Box backgroundColor="surface.background.gray.intense" padding="spacing.5">
      <Box paddingBottom="spacing.4">
        <Text size="large" weight="semibold">
          {withSorting ? 'Table Nesting with Sorting' : 'Table Nesting'}
        </Text>
        <Text size="medium" color="surface.text.gray.muted">
          {withSorting
            ? 'Hierarchical data with expandable rows and sortable amount column'
            : 'Hierarchical data with expandable rows'}
        </Text>
      </Box>

      <TableComponent
        data={{ nodes: merchantData }}
        {...(withSorting && {
          sortFunctions,
          onSortChange: ({ sortKey, isSortReversed }) =>
            console.log('Sort:', sortKey, 'Reversed:', isSortReversed),
        })}
      >
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Merchant</TableHeaderCell>
                <TableHeaderCell {...(withSorting && { headerKey: 'totalAmount' })}>
                  Amount
                </TableHeaderCell>
                <TableHeaderCell>Success Rate</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((item, index) => (
                <>
                  <TableRow key={item.id} item={item} onClick={() => toggleRow(item.id)}>
                    <TableCell>
                      <Button
                        variant="tertiary"
                        size="xsmall"
                        icon={expandedRows.has(item.id) ? ChevronDownIcon : ChevronRightIcon}
                        marginRight="spacing.2"
                        onClick={() => toggleRow(item.id)}
                      />
                      {item.merchantName}
                    </TableCell>
                    <TableCell>
                      <Amount value={item.totalAmount} isAffixSubtle={false} />
                    </TableCell>
                    <TableCell>
                      <Text size="small" color="feedback.text.positive.intense">
                        {item.successRate}%
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge color={item.status === 'Active' ? 'positive' : 'neutral'}>
                        {item.status}
                      </Badge>
                    </TableCell>
                  </TableRow>

                  {expandedRows.has(item.id) && (
                    <TableRow key={`${item.id}-expanded`} item={item}>
                      <TableCell gridColumnStart={1} gridColumnEnd={5}>
                        <SlideDown>
                          <Box
                            backgroundColor="surface.background.gray.subtle"
                            padding="spacing.5"
                            borderRadius="medium"
                            margin={['spacing.4', 'spacing.0']}
                            width="100%"
                          >
                            {index !== 1 ? (
                              <Box display="flex" flexDirection="column" gap="spacing.2">
                                {(item.children as TransactionData[]).map((child) => (
                                  <Box
                                    key={child.id}
                                    display="grid"
                                    gridTemplateColumns="repeat(4, 1fr)"
                                    gap="spacing.2"
                                  >
                                    <Text size="small" color="surface.text.gray.muted">
                                      {child.paymentId}
                                    </Text>
                                    <Amount value={child.amount} isAffixSubtle={false} />
                                    {child.date}
                                    <Badge
                                      size="small"
                                      color={child.status === 'Completed' ? 'positive' : 'negative'}
                                    >
                                      {child.status}
                                    </Badge>
                                  </Box>
                                ))}
                              </Box>
                            ) : (
                              <Box display="flex" flexDirection="column" gap="spacing.4">
                                <Text
                                  size="medium"
                                  weight="semibold"
                                  color="surface.text.gray.normal"
                                >
                                  Payment Gateway Summary
                                </Text>
                                <Box
                                  display="grid"
                                  gridTemplateColumns="repeat(2, 1fr)"
                                  gap="spacing.4"
                                  backgroundColor="surface.background.gray.moderate"
                                  padding="spacing.3"
                                  borderRadius="medium"
                                >
                                  <Box display="flex" flexDirection="column" gap="spacing.1">
                                    <Text size="small" color="surface.text.gray.muted">
                                      Primary Gateway
                                    </Text>
                                    <Badge size="medium" color="information">
                                      {(item.children[0] as SummaryData).gatewayUsed}
                                    </Badge>
                                  </Box>
                                  <Box display="flex" flexDirection="column" gap="spacing.1">
                                    <Text size="small" color="surface.text.gray.muted">
                                      Transaction Count
                                    </Text>
                                    <Text size="medium" weight="semibold">
                                      {(item
                                        .children[0] as SummaryData).transactionCount.toLocaleString()}
                                    </Text>
                                  </Box>
                                  <Box display="flex" flexDirection="column" gap="spacing.1">
                                    <Text size="small" color="surface.text.gray.muted">
                                      Total Amount
                                    </Text>
                                    <Amount
                                      value={(item.children[0] as SummaryData).totalAmount}
                                      size="medium"
                                      isAffixSubtle={false}
                                    />
                                  </Box>
                                  <Box display="flex" flexDirection="column" gap="spacing.1">
                                    <Text size="small" color="surface.text.gray.muted">
                                      Success Rate
                                    </Text>
                                    <Text
                                      size="medium"
                                      weight="semibold"
                                      color="feedback.text.positive.intense"
                                    >
                                      {(item.children[0] as SummaryData).successRate}%
                                    </Text>
                                  </Box>
                                </Box>
                              </Box>
                            )}
                          </Box>
                        </SlideDown>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableNesting: StoryFn<typeof TableComponent> = (): JSX.Element => {
  return <TableNestingTemplate withSorting={false} />;
};

export const TableNestingWithSorting: StoryFn<typeof TableComponent> = (): JSX.Element => {
  return <TableNestingTemplate withSorting={true} />;
};

export default TableMeta;
