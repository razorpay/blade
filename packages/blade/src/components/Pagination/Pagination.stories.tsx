import type { StoryFn, Meta } from '@storybook/react-vite';
import { Title } from '@storybook/addon-docs/blocks';
import type { ReactElement } from 'react';
import React, { useState } from 'react';
import type { PaginationProps } from './types';
import { Pagination as PaginationComponent } from './Pagination';
import { Box } from '~components/Box';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableHeaderRow,
  TablePagination,
  TableRow,
} from '~components/Table';
import { Text } from '~components/Typography';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getBladeCommonEventArgTypes } from '~components/Box/BaseBox/storybookArgTypes';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentDescription="Pagination is a navigation component that allows users to navigate through multiple pages of content. It provides page number navigation, page size selection, and direct page jumping capabilities."
      componentName="Pagination"
      figmaURL="https://www.figma.com/design/jubmQL9Z8V7881ayUD95ps/Blade-DSL?node-id=75154-262065&m=dev"
    >
      <Title>Usage</Title>
      <Sandbox showConsole>
        {`
        import { Pagination } from '@razorpay/blade/components';
        import { useState } from 'react';
        
        function App() {
          const [selectedPage, setSelectedPage] = useState(1);
          
          return (
            <Pagination
              totalPages={100}
              selectedPage={selectedPage}
              onSelectedPageChange={({ page }) => setSelectedPage(page)}
              showPageNumberSelector
              showPageSizePicker
            />
          );
        }

        export default App;
      `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Components/Pagination',
  component: PaginationComponent,
  args: {
    totalPages: 100,
    selectedPage: 1,
    defaultSelectedPage: 1,
    defaultPageSize: 10,
    showPageSizePicker: false,
    showPageNumberSelector: false,
    showLabel: false,
    isDisabled: false,
    onSelectedPageChange: ({ page }: { page: number }): void => {
      console.log('Page changed:', page);
    },
    onPageSizeChange: ({ pageSize }: { pageSize: number }): void => {
      console.log('Page size changed:', pageSize);
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ...getBladeCommonEventArgTypes(),
    totalPages: {
      control: 'number',
      description: 'Total pages in the pagination',
    },
    selectedPage: {
      control: 'number',
      description: 'Current active page (1-indexed). When provided, component is controlled.',
    },
    defaultSelectedPage: {
      control: 'number',
      description: 'Default page when uncontrolled (1-indexed, where 1 is the first page).',
    },
    defaultPageSize: {
      control: 'select',
      options: [10, 25, 50],
      description: 'The default page size.',
    },
    pageSize: {
      control: 'select',
      options: [10, 25, 50],
      description: 'Current page size when controlled.',
    },
    showPageSizePicker: {
      control: 'boolean',
      description: 'Whether to show the page size picker.',
    },
    showPageNumberSelector: {
      control: 'boolean',
      description: 'Whether to show the page number selector.',
    },
    showLabel: {
      control: 'boolean',
      description: 'Whether to show the label.',
    },
    label: {
      control: 'text',
      description: 'Custom label text.',
    },
    isDisabled: {
      control: 'boolean',
      description: 'Whether the pagination component is disabled.',
    },
    totalItemCount: {
      control: 'number',
      description:
        'Total number of items being paginated. When all the items fit on a single page at the smallest page size, the pagination hides itself.',
    },
    showOnSinglePage: {
      control: 'boolean',
      description:
        'Whether to always render the pagination even when all items fit on a single page. Use it when rows load asynchronously or filters change the row count, so the footer does not shift the layout. Defaults to false (pagination hides).',
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<PaginationProps>;

const PaginationTemplate: StoryFn<typeof PaginationComponent> = ({ ...args }) => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 25 | 50>(10);
  const totalItems = 1000;

  return (
    <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
      <PaginationComponent
        {...args}
        selectedPage={selectedPage}
        pageSize={pageSize}
        totalPages={totalItems / pageSize}
        onSelectedPageChange={({ page }) => setSelectedPage(page)}
        onPageSizeChange={({ pageSize }) => setPageSize(pageSize as 10 | 25 | 50)}
      />
    </Box>
  );
};

export const Default = PaginationTemplate.bind({});
Default.args = {
  selectedPage: 1,
  showPageNumberSelector: true,
  showPageSizePicker: true,
  showLabel: true,
};

const ControlledExample = (): React.ReactElement => {
  const [selectedPage, setSelectedPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 25 | 50>(10);
  const totalItems = 1000;

  return (
    <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
      <Text marginBottom="spacing.4">
        Current Page: {selectedPage}, Page Size: {pageSize}
      </Text>
      <PaginationComponent
        totalPages={totalItems / pageSize}
        selectedPage={selectedPage}
        pageSize={pageSize}
        onSelectedPageChange={({ page }) => setSelectedPage(page)}
        onPageSizeChange={({ pageSize: newSize }) => setPageSize(newSize as 10 | 25 | 50)}
        showPageSizePicker
        showPageNumberSelector
        showLabel
      />
    </Box>
  );
};

export const ControlledExampleStory: StoryFn<typeof PaginationComponent> = () => {
  return <ControlledExample />;
};
ControlledExampleStory.storyName = 'Controlled Example';

const UncontrolledExample = (): React.ReactElement => {
  return (
    <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
      <PaginationComponent
        totalPages={100}
        defaultSelectedPage={1}
        defaultPageSize={10}
        onSelectedPageChange={({ page }) => console.log('Page changed:', page)}
        onPageSizeChange={({ pageSize }) => console.log('Page size changed:', pageSize)}
        showPageSizePicker
        showPageNumberSelector
        showLabel
      />
    </Box>
  );
};

export const UncontrolledExampleStory: StoryFn<typeof PaginationComponent> = () => {
  return <UncontrolledExample />;
};
UncontrolledExampleStory.storyName = 'Uncontrolled Example';

type PaymentItem = {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
};

const paymentNodes: PaymentItem[] = Array.from({ length: 5 }, (_, index) => ({
  id: (index + 1).toString(),
  paymentId: `rzp${(index + 1).toString().padStart(4, '0')}`,
  amount: (index + 1) * 1000,
  status: index % 2 === 0 ? 'Completed' : 'Pending',
}));

const PaginatedTable = (): React.ReactElement => {
  return (
    <Table
      data={{ nodes: paymentNodes }}
      pagination={
        <TablePagination
          onPageChange={({ page }) => console.log('Page changed:', page)}
          onPageSizeChange={({ pageSize }) => console.log('Page size changed:', pageSize)}
          defaultPageSize={10}
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
              <TableHeaderCell headerKey="AMOUNT">Amount</TableHeaderCell>
              <TableHeaderCell headerKey="STATUS">Status</TableHeaderCell>
            </TableHeaderRow>
          </TableHeader>
          <TableBody>
            {tableData.map((tableItem, index) => (
              <TableRow key={index} item={tableItem}>
                <TableCell>{tableItem.paymentId}</TableCell>
                <TableCell>{tableItem.amount}</TableCell>
                <TableCell>{tableItem.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </Table>
  );
};

const Demo = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}): React.ReactElement => {
  return (
    <Box>
      <Text marginBottom="spacing.3">
        <Text as="span" weight="semibold">
          {title}
        </Text>{' '}
        — {description}
      </Text>
      {children}
    </Box>
  );
};

const SinglePageExample = (): React.ReactElement => {
  return (
    <Box display="flex" flexDirection="column" gap="spacing.7" padding="spacing.4">
      <Demo
        title="Default"
        description="5 items already fit on one page, so the pagination renders nothing at all. The dashed outline marks the empty slot and is not part of the component."
      >
        <Box
          borderWidth="thin"
          borderStyle="dashed"
          borderColor="surface.border.gray.muted"
          borderRadius="medium"
          padding="spacing.4"
        >
          <PaginationComponent
            totalPages={1}
            totalItemCount={5}
            onSelectedPageChange={({ page }) => console.log('Page changed:', page)}
            showPageSizePicker
            showPageNumberSelector
            showLabel
          />
        </Box>
      </Demo>
      <Demo
        title="With showOnSinglePage"
        description="Same 5 items, but the pagination stays rendered. Use this when rows load asynchronously or filters change the row count, so the footer does not appear and disappear and shift the layout."
      >
        <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
          <PaginationComponent
            totalPages={1}
            totalItemCount={5}
            showOnSinglePage
            onSelectedPageChange={({ page }) => console.log('Page changed:', page)}
            showPageSizePicker
            showPageNumberSelector
            showLabel
          />
        </Box>
      </Demo>
      <Demo
        title="Inside a Table"
        description="TablePagination gets the same behaviour for free — 5 rows at 10 rows / page means no pagination footer is rendered."
      >
        <PaginatedTable />
      </Demo>
    </Box>
  );
};

export const HiddenOnSinglePage: StoryFn<typeof PaginationComponent> = () => {
  return <SinglePageExample />;
};
HiddenOnSinglePage.storyName = 'Hidden When All Items Fit On One Page';

export const Disabled = PaginationTemplate.bind({});
Disabled.args = {
  totalPages: 10,
  isDisabled: true,
  showPageSizePicker: true,
  showPageNumberSelector: true,
};
Disabled.storyName = 'Disabled State';
