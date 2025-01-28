import type { StoryFn, Meta } from '@storybook/react';
import type { TableData } from '../../types';
import { Table as TableComponent } from '../../Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from '../../TableHeader';
import { TableBody, TableRow, TableCell } from '../../TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from '../../TableFooter';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Amount } from '~components/Amount';
import { Code } from '~components/Typography';
import { Badge } from '~components/Badge';
import { IconButton } from '~components/Button/IconButton';
import { CopyIcon, TrashIcon } from '~components/Icons';

export default {
  title: 'Components/Table/API',
  component: TableHeaderRow,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableHeaderRow props here"
          componentName="TableHeaderRow"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableHeaderRow>;

const nodes: Item[] = [
  ...Array.from({ length: 5 }, (_, i) => ({
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

const TableTemplate: StoryFn<typeof TableComponent> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent data={data} selectionType="multiple">
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow {...args}>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow
                  key={index}
                  item={tableItem}
                  hoverActions={
                    <>
                      <IconButton
                        accessibilityLabel="Copy"
                        isHighlighted
                        icon={CopyIcon}
                        onClick={() => console.log('copy', tableItem)}
                      />
                      <IconButton
                        accessibilityLabel="Delete"
                        isHighlighted
                        icon={TrashIcon}
                        onClick={() => console.log('delete', tableItem)}
                      />
                    </>
                  }
                >
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
                          : 'default'
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
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableHoverActions = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableHoverActions.storyName = 'TableHoverActions';
