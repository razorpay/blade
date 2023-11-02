import type { ComponentStory, Meta } from '@storybook/react';
import type { TableProps } from './Table';
import { Table as TableComponent } from './Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from './TableHeader';
import { TableBody, TableRow, TableCell } from './TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from './TableFooter';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';

export default {
  title: 'Components/Table',
  component: TableComponent,
  args: {
    selectionType: 'multiple',
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
    nodes: null,
  },
  {
    id: '1',
    name: 'VSCode',
    deadline: new Date(2020, 1, 17),
    type: 'SETUP',
    isComplete: true,
    _hasContent: false,
    nodes: [],
  },
  {
    id: '2',
    name: 'JavaScript',
    deadline: new Date(2020, 2, 28),
    type: 'LEARN',
    isComplete: true,
    _hasContent: true,
    nodes: [
      {
        id: '22',
        name: 'Data Types',
        deadline: new Date(2020, 2, 20),
        type: 'LEARN',
        isComplete: true,
        _hasContent: true,
        nodes: [
          {
            id: '221',
            name: 'Strings',
            deadline: new Date(2020, 2, 18),
            type: 'LEARN',
            isComplete: true,
            _hasContent: false,
            nodes: null,
          },
          {
            id: '222',
            name: 'Numbers',
            deadline: new Date(2020, 2, 19),
            type: 'LEARN',
            isComplete: true,
            _hasContent: false,
            nodes: null,
          },
        ],
      },
      {
        id: '23',
        name: 'Objects',
        deadline: new Date(2020, 2, 22),
        type: 'LEARN',
        isComplete: true,
        _hasContent: true,
        nodes: [
          {
            id: '231',
            name: 'Object Methods',
            deadline: new Date(2020, 2, 20),
            type: 'LEARN',
            isComplete: true,
            _hasContent: false,
            nodes: null,
          },
          {
            id: '232',
            name: 'Garbage Collection',
            deadline: new Date(2020, 2, 21),
            type: 'LEARN',
            isComplete: true,
            _hasContent: false,
            nodes: null,
          },
        ],
      },
      {
        id: '24',
        name: 'Code Style',
        deadline: new Date(2020, 2, 23),
        type: 'LEARN',
        isComplete: true,
        _hasContent: false,
        nodes: [],
      },
    ],
  },
  {
    id: '3',
    name: 'React',
    deadline: new Date(2020, 3, 8),
    type: 'LEARN',
    isComplete: false,
    _hasContent: true,
    nodes: [
      {
        id: '31',
        name: 'Create React App',
        deadline: new Date(2020, 3, 1),
        type: 'SETUP',
        isComplete: true,
        _hasContent: false,
        nodes: null,
      },
      {
        id: '32',
        name: 'JSX',
        deadline: new Date(2020, 3, 1),
        type: 'LEARN',
        isComplete: true,
        _hasContent: false,
        nodes: null,
      },
      {
        id: '33',
        name: 'Components',
        deadline: new Date(2020, 4, 1),
        type: 'LEARN',
        isComplete: false,
        _hasContent: false,
        nodes: [],
      },
      {
        id: '34',
        name: 'Props',
        deadline: new Date(2020, 5, 1),
        type: 'LEARN',
        isComplete: false,
        _hasContent: false,
        nodes: null,
      },
      {
        id: '35',
        name: 'State',
        deadline: new Date(2020, 6, 1),
        type: 'LEARN',
        isComplete: false,
        _hasContent: false,
        nodes: [
          {
            id: '351',
            name: 'Remote State',
            deadline: new Date(2020, 7, 1),
            type: 'LEARN',
            isComplete: true,
            _hasContent: false,
            nodes: [],
          },
          {
            id: '352',
            name: 'Local State',
            deadline: new Date(2020, 7, 1),
            type: 'LEARN',
            isComplete: false,
            _hasContent: false,
            nodes: [],
          },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Git',
    deadline: new Date(2020, 4, 28),
    type: 'SETUP',
    isComplete: false,
    _hasContent: false,
    nodes: [],
  },
  {
    id: '5',
    name: 'Node',
    deadline: new Date(2020, 5, 18),
    type: 'LEARN',
    isComplete: true,
    _hasContent: true,
    nodes: [
      {
        id: '51',
        name: 'Express',
        deadline: new Date(2020, 5, 10),
        type: 'LEARN',
        isComplete: false,
        _hasContent: false,
        nodes: null,
      },
    ],
  },
  {
    id: '6',
    name: 'GraphQL',
    deadline: new Date(2020, 6, 30),
    type: 'LEARN',
    isComplete: false,
    _hasContent: true,
    nodes: [
      {
        id: '61',
        name: 'Queries and Mutations',
        deadline: new Date(2020, 6, 28),
        type: 'LEARN',
        isComplete: false,
        _hasContent: true,
        nodes: [
          {
            id: '611',
            name: 'Fields',
            deadline: new Date(2020, 6, 20),
            type: 'LEARN',
            isComplete: false,
            _hasContent: false,
            nodes: null,
          },
          {
            id: '612',
            name: 'Arguments',
            deadline: new Date(2020, 6, 21),
            type: 'LEARN',
            isComplete: false,
            _hasContent: false,
            nodes: null,
          },
          {
            id: '613',
            name: 'Aliases',
            deadline: new Date(2020, 6, 22),
            type: 'LEARN',
            isComplete: false,
            _hasContent: false,
            nodes: null,
          },
          {
            id: '614',
            name: 'Fragments',
            deadline: new Date(2020, 6, 23),
            type: 'LEARN',
            isComplete: false,
            _hasContent: true,
            nodes: [
              {
                id: '6141',
                name: 'Inline Fragments',
                deadline: new Date(2020, 6, 23),
                type: 'LEARN',
                isComplete: false,
                _hasContent: false,
                nodes: null,
              },
            ],
          },
          {
            id: '615',
            name: 'Variables',
            deadline: new Date(2020, 6, 24),
            type: 'LEARN',
            isComplete: false,
            _hasContent: false,
            nodes: null,
          },
          {
            id: '616',
            name: 'Directives',
            deadline: new Date(2020, 6, 25),
            type: 'LEARN',
            isComplete: false,
            _hasContent: false,
            nodes: null,
          },
        ],
      },
    ],
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
    <Box backgroundColor="surface.background.level1.lowContrast" padding="spacing.5">
      <TableComponent
        {...args}
        data={data}
        onSelectionChange={({ values }) => console.log('Selected Rows:', values)}
      >
        {(tableList) => (
          <>
            <TableHeader>
              <TableHeaderRow>
                <TableHeaderCell>Task</TableHeaderCell>
                <TableHeaderCell>Deadline</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Complete</TableHeaderCell>
                <TableHeaderCell>Tasks</TableHeaderCell>
              </TableHeaderRow>
            </TableHeader>
            <TableBody>
              {tableList.map((tableItem, index) => (
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
                  <TableCell>{tableItem.nodes?.length.toString()}</TableCell>
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
                <TableFooterCell>-</TableFooterCell>
              </TableFooterRow>
            </TableFooter>
          </>
        )}
      </TableComponent>
    </Box>
  );
};

export const Table = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Table.storyName = 'Default';
