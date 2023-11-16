import type { ComponentStory, Meta } from '@storybook/react';
import type { TableProps } from './Table';
import { Table as TableComponent } from './Table';
import { TableHeader, TableHeaderRow, TableHeaderCell } from './TableHeader';
import { TableBody, TableRow, TableCell } from './TableBody';
import { TableFooter, TableFooterRow, TableFooterCell } from './TableFooter';
import { TablePagination } from './TablePagination';
import { TableToolbarActions, TableToolbar } from './TableToolbar';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { useTheme } from '~utils';
import { Amount } from '~components/Amount';
import { Code, Text } from '~components/Typography';
import { Badge } from '~components/Badge';

export default {
  title: 'Components/Table',
  component: TableComponent,
  args: {
    selectionType: undefined,
    rowDensity: 'normal',
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
    id: '23',
    name: 'Jest',
    deadline: new Date(2021, 10, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '0',
    name: 'Operating System',
    deadline: new Date(2020, 1, 15),
    type: 'SETUP',
    isComplete: true,
  },
  {
    id: '38',
    name: 'React Native',
    deadline: new Date(2023, 1, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '34',
    name: 'Machine Learning',
    deadline: new Date(2022, 9, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '19',
    name: 'TypeScript',
    deadline: new Date(2021, 6, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '48',
    name: 'Swift',
    deadline: new Date(2023, 11, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '11',
    name: 'Databases',
    deadline: new Date(2020, 11, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '24',
    name: 'Testing Library',
    deadline: new Date(2021, 11, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '2',
    name: 'JavaScript',
    deadline: new Date(2020, 2, 28),
    type: 'LEARN',
    isComplete: true,
  },
  {
    id: '16',
    name: 'Angular',
    deadline: new Date(2021, 3, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '31',
    name: 'Google Cloud Platform',
    deadline: new Date(2022, 6, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '27',
    name: 'Scrum',
    deadline: new Date(2022, 2, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '35',
    name: 'TensorFlow',
    deadline: new Date(2022, 10, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '43',
    name: 'WebAssembly',
    deadline: new Date(2023, 6, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '50',
    name: 'Go (Golang)',
    deadline: new Date(2024, 1, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '8',
    name: 'CSS',
    deadline: new Date(2020, 8, 20),
    type: 'LEARN',
    isComplete: true,
  },
  {
    id: '3',
    name: 'React',
    deadline: new Date(2020, 3, 8),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '47',
    name: 'AR/VR Development',
    deadline: new Date(2023, 10, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '29',
    name: 'AWS',
    deadline: new Date(2022, 4, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '6',
    name: 'GraphQL',
    deadline: new Date(2020, 6, 30),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '41',
    name: 'Ethical Hacking',
    deadline: new Date(2023, 4, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '42',
    name: 'UX/UI Design',
    deadline: new Date(2023, 5, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '12',
    name: 'SQL',
    deadline: new Date(2020, 11, 30),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '45',
    name: 'GraphQL Apollo Server',
    deadline: new Date(2023, 8, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '39',
    name: 'Flutter',
    deadline: new Date(2023, 2, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '36',
    name: 'PyTorch',
    deadline: new Date(2022, 11, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '46',
    name: 'Raspberry Pi',
    deadline: new Date(2023, 9, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '30',
    name: 'Azure',
    deadline: new Date(2022, 5, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '14',
    name: 'Flask',
    deadline: new Date(2021, 1, 20),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '37',
    name: 'Data Science',
    deadline: new Date(2023, 0, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '21',
    name: 'Docker',
    deadline: new Date(2021, 8, 5),
    type: 'SETUP',
    isComplete: false,
  },
  {
    id: '33',
    name: 'Rust',
    deadline: new Date(2022, 8, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '15',
    name: 'RESTful APIs',
    deadline: new Date(2021, 2, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '18',
    name: 'Webpack',
    deadline: new Date(2021, 5, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '44',
    name: 'Serverless Architecture',
    deadline: new Date(2023, 7, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '4',
    name: 'Git',
    deadline: new Date(2020, 4, 28),
    type: 'SETUP',
    isComplete: false,
  },
  {
    id: '26',
    name: 'Agile Methodology',
    deadline: new Date(2022, 1, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '32',
    name: 'Blockchain',
    deadline: new Date(2022, 7, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '22',
    name: 'Kubernetes',
    deadline: new Date(2021, 9, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '49',
    name: 'Kotlin',
    deadline: new Date(2024, 0, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '7',
    name: 'HTML',
    deadline: new Date(2020, 7, 15),
    type: 'LEARN',
    isComplete: true,
  },
  {
    id: '25',
    name: 'CI/CD',
    deadline: new Date(2022, 0, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '5',
    name: 'Node',
    deadline: new Date(2020, 5, 18),
    type: 'LEARN',
    isComplete: true,
  },
  {
    id: '9',
    name: 'SASS',
    deadline: new Date(2020, 9, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '17',
    name: 'Vue.js',
    deadline: new Date(2021, 4, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '10',
    name: 'Responsive Design',
    deadline: new Date(2020, 10, 5),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '1',
    name: 'VSCode',
    deadline: new Date(2020, 1, 17),
    type: 'SETUP',
    isComplete: true,
  },
  {
    id: '13',
    name: 'Python',
    deadline: new Date(2021, 0, 10),
    type: 'LEARN',
    isComplete: true,
  },
  {
    id: '20',
    name: 'MongoDB',
    deadline: new Date(2021, 7, 25),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '28',
    name: 'DevOps',
    deadline: new Date(2022, 3, 15),
    type: 'LEARN',
    isComplete: false,
  },
  {
    id: '40',
    name: 'Cybersecurity',
    deadline: new Date(2023, 3, 15),
    type: 'LEARN',
    isComplete: false,
  },
];

const nodes2 = [
  ...Array.from({ length: 200 }, (_, i) => ({
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

const data = {
  nodes: nodes2,
};

const TableTemplate: ComponentStory<typeof TableComponent> = ({ ...args }) => {
  const { platform } = useTheme();
  const onMobile = platform === 'onMobile';
  return (
    <Box
      backgroundColor="surface.background.level2.lowContrast"
      padding="spacing.5"
      overflow="auto"
    >
      <TableComponent
        {...args}
        data={data}
        onSelectionChange={({ values }) => console.log('Selected Rows:', values)}
        sortFunctions={{
          ID: (array) => array.sort((a, b) => a.id - b.id),
          AMOUNT: (array) => array.sort((a, b) => a.amount - b.amount),
          ACCOUNT: (array) => array.sort((a, b) => a.account - b.account),
          PAYMENT_ID: (array) => array.sort((a, b) => a.paymentId.localeCompare(b.paymentId)),
          DATE: (array) => array.sort((a, b) => a.date.getTime() - b.date.getTime()),
          METHOD: (array) => array.sort((a, b) => a.method.localeCompare(b.method)),
          STATUS: (array) => array.sort((a, b) => a.status.localeCompare(b.status)),
        }}
        onSortChange={({ sortKey, isSortReversed }) =>
          console.log('Sort Key:', sortKey, 'Sort Reversed:', isSortReversed)
        }
        toolbar={
          <TableToolbar>
            <TableToolbarActions>
              <Button variant="secondary" marginRight="spacing.2" isFullWidth={onMobile}>
                Export
              </Button>
              <Button isFullWidth={onMobile}>Payout</Button>
            </TableToolbarActions>
          </TableToolbar>
        }
        pagination={
          <TablePagination
            onPageChange={console.log}
            defaultPageSize={10}
            onPageSizeChange={console.log}
            showPageSizePicker
            showPageNumberSelector
          />
        }
        // height="400px"
        // gridTemplateColumns="100px 1fr 1fr 1fr 1fr"
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
                <TableRow key={index} item={tableItem} index={index}>
                  <TableCell>
                    <Code size="medium">{tableItem.paymentId}</Code>
                  </TableCell>
                  <TableCell>
                    <Amount value={tableItem.amount as number} />
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
                {args.selectionType === 'multiple' && <TableFooterCell>-</TableFooterCell>}
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

export const Table = TableTemplate.bind({});
// Need to do this because of storybook's weird naming convention, More details here: https://storybook.js.org/docs/react/writing-stories/naming-components-and-hierarchy#single-story-hoisting
Table.storyName = 'Default';
