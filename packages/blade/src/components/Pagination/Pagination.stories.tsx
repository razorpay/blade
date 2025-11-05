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
          const [currentPage, setCurrentPage] = useState(0);
          
          return (
            <Pagination
              totalPages={100}
              currentPage={currentPage}
              onPageChange={({ page }) => setCurrentPage(page)}
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
    currentPage: 0,
    defaultCurrentPage: 0,
    defaultPageSize: 10,
    showPageSizePicker: false,
    showPageNumberSelector: false,
    showLabel: false,
    isDisabled: false,
    onPageChange: ({ page }: { page: number }): void => {
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
    totalItemCount: {
      control: 'number',
      description:
        'Total number of items. Used to calculate totalPages when totalPages is not provided.',
    },
    currentPage: {
      control: 'number',
      description: 'Current active page (0-indexed). When provided, component is controlled.',
    },
    defaultCurrentPage: {
      control: 'number',
      description: 'Default page when uncontrolled (0-indexed).',
    },
    defaultPageSize: {
      control: 'select',
      options: [10, 25, 50],
      description: 'The default page size.',
    },
    currentPageSize: {
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
  return (
    <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
      <PaginationComponent {...args} />
    </Box>
  );
};

export const Default = PaginationTemplate.bind({});
Default.args = {
  totalPages: 10,
};

export const WithPageNumberSelector = PaginationTemplate.bind({});
WithPageNumberSelector.args = {
  totalPages: 100,
  showPageNumberSelector: true,
  currentPage: 5,
};
WithPageNumberSelector.storyName = 'With Page Number Selector';

export const WithPageSizePicker = PaginationTemplate.bind({});
WithPageSizePicker.args = {
  totalPages: 50,
  showPageSizePicker: true,
  defaultPageSize: 25,
};
WithPageSizePicker.storyName = 'With Page Size Picker';

export const WithLabel = PaginationTemplate.bind({});
WithLabel.args = {
  totalPages: 100,
  showLabel: true,
  label: 'Showing 1-10 of 100 items',
  currentPage: 0,
  currentPageSize: 10,
};
WithLabel.storyName = 'With Label';

export const WithAllFeatures = PaginationTemplate.bind({});
WithAllFeatures.args = {
  totalPages: 1000,
  currentPage: 5,
  showPageSizePicker: true,
  showPageNumberSelector: true,
  showLabel: true,
  defaultPageSize: 25,
};
WithAllFeatures.storyName = 'With All Features';

export const Controlled = PaginationTemplate.bind({});
Controlled.args = {
  totalPages: 50,
  currentPage: 2,
  currentPageSize: 25,
  showPageSizePicker: true,
  showPageNumberSelector: true,
};
Controlled.storyName = 'Controlled Mode';

const ControlledExample = (): React.ReactElement => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <Box padding="spacing.4" backgroundColor="surface.background.gray.intense">
      <Text marginBottom="spacing.4">
        Current Page: {currentPage + 1}, Page Size: {pageSize}
      </Text>
      <PaginationComponent
        totalPages={100}
        currentPage={currentPage}
        currentPageSize={pageSize}
        onPageChange={({ page }) => setCurrentPage(page)}
        onPageSizeChange={({ pageSize: newSize }) => setPageSize(newSize)}
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
        defaultCurrentPage={0}
        defaultPageSize={10}
        onPageChange={({ page }) => console.log('Page changed:', page)}
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

export const WithTotalItemCount = PaginationTemplate.bind({});
WithTotalItemCount.args = {
  totalItemCount: 1000,
  defaultPageSize: 10,
  showPageNumberSelector: true,
  showLabel: true,
};
WithTotalItemCount.storyName = 'With Total Item Count';

export const Disabled = PaginationTemplate.bind({});
Disabled.args = {
  totalPages: 10,
  isDisabled: true,
  showPageSizePicker: true,
  showPageNumberSelector: true,
};
Disabled.storyName = 'Disabled State';

export const LargePageCount = PaginationTemplate.bind({});
LargePageCount.args = {
  totalPages: 1000,
  currentPage: 500,
  showPageNumberSelector: true,
  showLabel: true,
};
LargePageCount.storyName = 'Large Page Count';

export const SmallPageCount = PaginationTemplate.bind({});
SmallPageCount.args = {
  totalPages: 3,
  showPageNumberSelector: true,
};
SmallPageCount.storyName = 'Small Page Count';
