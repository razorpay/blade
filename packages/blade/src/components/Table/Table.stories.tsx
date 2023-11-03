import type { ComponentStory, Meta } from '@storybook/react';
import type { TableProps } from './Table';
import { Table as TableComponent } from './Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from './TableHeader';
import { TableBody, TableRow, TableCell } from './TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from './TableFooter';
import { TableToolbarActions, TableToolbar } from './TableToolbar';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';

export default {
  title: 'Components/Table',
  component: TableComponent,
  args: {
    selectionType: 'multiple',
    cellDensity: 'normal',
  },
  argTypes: {
    ...getStyledPropsArgTypes(),
  },
  parameters: {
    docs: {
      page: () => <StoryPageWrapper componentDescription="" componentName="Table" />,
    },
  },
} as Meta<TableProps>;

const nodes = [
  {
    id: '0',
    name: 'Operating System',
    deadline: new Date(2020, 1, 15),
    type: 'SETUP',
    isComplete: true,
    _hasContent: false,
  },
  {
    id: '1',
    name: 'VSCode',
    deadline: new Date(2020, 1, 17),
    type: 'SETUP',
    isComplete: true,
    _hasContent: false,
  },
  {
    id: '2',
    name: 'JavaScript',
    deadline: new Date(2020, 2, 28),
    type: 'LEARN',
    isComplete: true,
    _hasContent: true,
  },
  {
    id: '3',
    name: 'React',
    deadline: new Date(2020, 3, 8),
    type: 'LEARN',
    isComplete: false,
    _hasContent: true,
  },
  {
    id: '4',
    name: 'Git',
    deadline: new Date(2020, 4, 28),
    type: 'SETUP',
    isComplete: false,
    _hasContent: false,
  },
  {
    id: '5',
    name: 'Node',
    deadline: new Date(2020, 5, 18),
    type: 'LEARN',
    isComplete: true,
    _hasContent: true,
  },
  {
    id: '6',
    name: 'GraphQL',
    deadline: new Date(2020, 6, 30),
    type: 'LEARN',
    isComplete: false,
    _hasContent: true,
  },
];
const data = {
  nodes,
  pageInfo: {
    totalPages: 4,
  },
};

const TableTemplate: ComponentStory<typeof TableComponent> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.level1.lowContrast"
      padding="spacing.5"
      height="300px"
      overflow="auto"
    >
      <TableComponent
        {...args}
        data={data}
        onSelectionChange={({ values }) => console.log('Selected Rows:', values)}
      >
        <TableToolbar>
          <TableToolbarActions>
            <Button variant="secondary" marginRight="spacing.2">
              Export
            </Button>
            <Button>Payout</Button>
          </TableToolbarActions>
        </TableToolbar>
        <TableHeader>
          <TableHeaderRow>
            <TableHeaderCell>Task</TableHeaderCell>
            <TableHeaderCell>Deadline</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Complete</TableHeaderCell>
          </TableHeaderRow>
        </TableHeader>
        <TableBody>
          {data.nodes.map((tableItem, index) => (
            <TableRow key={index} item={tableItem}>
              <TableCell>{tableItem.name}</TableCell>
              <TableCell>
                {tableItem.deadline.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </TableCell>
              <TableCell>{tableItem.type}</TableCell>
              <TableCell>{tableItem.isComplete.toString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableFooterRow>
            {args.selectionType === 'multiple' && <TableFooterCell>-</TableFooterCell>}
            <TableFooterCell>-</TableFooterCell>
            <TableFooterCell>-</TableFooterCell>
            <TableFooterCell>-</TableFooterCell>
            <TableFooterCell>-</TableFooterCell>
          </TableFooterRow>
        </TableFooter>
      </TableComponent>
    </Box>
  );
};

export const Table = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Table.storyName = 'Default';
