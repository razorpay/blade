import type { StoryFn, Meta } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import type { ReactElement } from 'react';
import React, { useState } from 'react';
import type { PaginationProps } from './types';
import { Pagination as PaginationComponent } from './Pagination';
import { Box } from '~components/Box';
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

export const Disabled = PaginationTemplate.bind({});
Disabled.args = {
  totalPages: 10,
  isDisabled: true,
  showPageSizePicker: true,
  showPageNumberSelector: true,
};
Disabled.storyName = 'Disabled State';
