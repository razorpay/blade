import type { StoryFn, Meta } from '@storybook/react';
import type { TableProps, TableData, TableEditableCellProps } from '../../index';
import {
  Table as TableComponent,
  TableHeader,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
} from '../../index';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Code } from '~components/Typography';
import { TableEditableCell, TableEditableDropdownCell } from '~components/Table/TableEditableCell';
import { AutoComplete, SelectInput } from '~components/Input/DropdownInputTriggers';
import { ActionList, ActionListItem } from '~components/ActionList';
import { DropdownOverlay } from '~components/Dropdown';

export default {
  title: 'Components/Table/API',
  component: TableEditableCell,
  args: {},
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
    headerKey: {
      control: {
        disable: true,
      },
    },
    rowDensity: {
      options: ['comfortable', 'normal', 'compact'],
      control: {
        type: 'radio',
      },
      table: {
        category: 'TableProps',
      },
    },
  },
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of TableEditableCell props here"
          componentName="TableEditableCell"
          apiDecisionComponentName="Table"
        />
      ),
    },
  },
} as Meta<typeof TableEditableCell>;

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

type TableTemplateProps = TableEditableCellProps & { rowDensity: TableProps<never>['rowDensity'] };

const TableTemplate: StoryFn<TableTemplateProps> = ({ rowDensity, ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="400px"
    >
      <TableComponent showBorderedCells data={data} rowDensity={rowDensity}>
        {(tableData) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Account</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableData.map((tableItem, index) => (
                <TableRow key={index} item={tableItem}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableEditableCell
                    {...args}
                    accessibilityLabel="Amount"
                    defaultValue={`${tableItem.amount}`}
                  />
                  <TableEditableCell
                    accessibilityLabel="Amount"
                    validationState="error"
                    placeholder="Account number"
                    errorText="Account number is invalid"
                  />
                  <TableEditableDropdownCell selectionType="multiple">
                    <AutoComplete
                      accessibilityLabel="Method"
                      validationState={args.validationState}
                      errorText="Invalid Method"
                      successText="Valid Method"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Mumbai" value="mumbai" />
                        <ActionListItem title="Pune" value="pune" />
                        <ActionListItem title="Bangalore" value="bangalore" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
                  <TableCell>
                    {tableItem.date?.toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                    })}
                  </TableCell>
                  <TableEditableDropdownCell>
                    <SelectInput
                      validationState={args.validationState}
                      accessibilityLabel="Status"
                      errorText="Invalid Status"
                      successText="Valid Status"
                    />
                    <DropdownOverlay>
                      <ActionList>
                        <ActionListItem title="Pending" value="pending" />
                        <ActionListItem title="Completed" value="completed" />
                        <ActionListItem title="Failed" value="failed" />
                      </ActionList>
                    </DropdownOverlay>
                  </TableEditableDropdownCell>
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
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const TableEditableCellStory = TableTemplate.bind({});
TableEditableCellStory.args = {
  rowDensity: 'normal',
};
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
TableEditableCellStory.storyName = 'TableEditableCell';
