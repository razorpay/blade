import type { StoryFn, Meta } from '@storybook/react';
import React from 'react';
import { ListView } from '../ListView';
import { ListViewFilters } from '../ListViewFilters';
import type { ListViewProps } from '../types';
import { FilterChipGroup } from '../FilterChipGroup';
import { Heading } from '~components/Typography/Heading';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { QuickFilter, QuickFilterGroup } from '~components/QuickFilters';
import { Counter } from '~components/Counter';
import { FilterChipSelectInput, Dropdown, DropdownOverlay } from '~components/Dropdown';
import { ActionList, ActionListItem } from '~components/ActionList';
import { FilterChipDatePicker } from '~components/DatePicker';
import {
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableFooter,
  TableFooterRow,
  TableFooterCell,
} from '~components/Table';
import type { TableData } from '~components/Table/types';
import { Button } from '~components/Button';
import { IconButton } from '~components/Button/IconButton';
import { Badge } from '~components/Badge';
import { CheckIcon, CloseIcon } from '~components/Icons';
import { Code } from '~components/Typography/Code';
import { TableEditableCell } from '~components/Table/TableEditableCell';
import { Amount } from '~components/Amount';
import { Box } from '~components/Box';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="ListView"
      componentDescription="List View is a pattern"
      apiDecisionLink={null}
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=100413-32686&t=n9A7LztwEkIsly3v-0"
    >
      <Heading size="large">Usage</Heading>
      <Sandbox showConsole>
        {`
        import { ListView } from '@razorpay/blade/components';
import { Table } from '../../Table/docs/BasicTable.stories';
import type { TableData from '~components/Table';
import { CheckIcon } from '~components/Icons';
        
        function App() {
          return (
            <ListView > Hi, from ray! </ListView>
          )
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Patterns/ListView',
  component: ListView,
  tags: ['autodocs'],
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ListViewProps>;

const nodes: Item[] = [
  ...Array.from({ length: 8 }, (_, i) => ({
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

const ListViewTemplate: StoryFn<typeof ListView> = (args) => {
  const [value, setSelectedValue] = React.useState<string[]>([]);
  const handleOnClick = (name: string): void => {
    if (value.includes(name)) {
      setSelectedValue(value.filter((val) => val !== name));
    } else {
      setSelectedValue([...value, name]);
    }
  };
  const isSelected = (name: string): boolean => value.includes(name);
  return (
    <Box backgroundColor="surface.background.gray.intense">
      <ListView>
        <ListViewFilters
          quickFilters={
            <QuickFilterGroup selectionType="single" defaultValue="Captured">
              <QuickFilter
                title="Captured"
                value="Captured"
                trailing={<Counter value={234} color="positive" />}
              />
              <QuickFilter
                title="Failed"
                value="Failed"
                trailing={<Counter value={234} color="negative" />}
              />
              <QuickFilter
                title="Pending"
                value="Pending"
                trailing={<Counter value={234} color="neutral" />}
              />
            </QuickFilterGroup>
          }
          onSearchChange={(value) => console.log(value)}
          numberOfSelectedFilters={2}
        >
          <FilterChipGroup>
            <Dropdown selectionType="multiple">
              <FilterChipSelectInput
                label="Filter Chip"
                value={value}
                onClearButtonClick={(value) => {
                  console.log('value', value);
                  setSelectedValue([]);
                }}
              />
              <DropdownOverlay>
                <ActionList>
                  <ActionListItem
                    onClick={({ name }) => {
                      handleOnClick(name);
                    }}
                    isSelected={isSelected('latest-added')}
                    title="Latest Added"
                    value="latest-added"
                  />
                  <ActionListItem
                    onClick={({ name }) => {
                      handleOnClick(name);
                    }}
                    isSelected={isSelected('latest-invoice')}
                    title="Latest Invoice"
                    value="latest-invoice"
                  />

                  <ActionListItem
                    onClick={({ name }) => {
                      handleOnClick(name);
                    }}
                    isSelected={isSelected('oldest-due-date')}
                    title="Oldest Due Date"
                    value="oldest-due-date"
                  />
                </ActionList>
              </DropdownOverlay>
            </Dropdown>
            <FilterChipDatePicker label="Date" selectionType="range" />
          </FilterChipGroup>
        </ListViewFilters>
        <Table
          {...args}
          data={data}
          defaultSelectedIds={['1', '3']}
          onSelectionChange={console.log}
          isFirstColumnSticky
          selectionType="single"
        >
          {(tableData) => (
            <>
              <TableHeader>
                <TableHeaderRow>
                  <TableHeaderCell headerKey="PAYMENT_ID">ID</TableHeaderCell>
                  <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
                  <TableHeaderCell headerKey="ACCOUNT">Account</TableHeaderCell>
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
                    hoverActions={
                      <>
                        <Button variant="tertiary" size="xsmall">
                          View Details
                        </Button>
                        <IconButton
                          icon={CheckIcon}
                          isHighlighted
                          accessibilityLabel="Approve"
                          onClick={() => {
                            console.log('Approved', tableItem.id);
                          }}
                        />
                        <IconButton
                          icon={CloseIcon}
                          isHighlighted
                          accessibilityLabel="Reject"
                          onClick={() => {
                            console.log('Rejected', tableItem.id);
                          }}
                        />
                      </>
                    }
                    onClick={() => {
                      console.log('where');
                    }}
                  >
                    <TableCell>
                      <Code size="medium">{tableItem.paymentId}</Code>
                    </TableCell>
                    <TableEditableCell
                      accessibilityLabel="Amount"
                      placeholder="Enter text"
                      successText="Amount is valid"
                    />
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
                  <TableFooterCell>-</TableFooterCell>
                  <TableFooterCell>
                    <Amount value={10} />
                  </TableFooterCell>
                </TableFooterRow>
              </TableFooter>
            </>
          )}
        </Table>
      </ListView>
    </Box>
  );
};

export const Default = ListViewTemplate.bind({});
Default.storyName = 'Default';
// Default.args
