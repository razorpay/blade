import type { StoryFn, Meta } from '@storybook/react';
import { Pagination } from '../Pagination';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';

export default {
  title: 'Components/Pagination/API',
  component: Pagination,
  parameters: {
    docs: {
      page: () => (
        <StoryPageWrapper
          componentDescription="You can find a complete list of Pagination props here"
          componentName="Pagination"
          apiDecisionComponentName="Pagination"
        />
      ),
    },
  },
} as Meta<typeof Pagination>;

const PaginationTemplate: StoryFn<typeof Pagination> = ({ ...args }) => {
  return (
    <Box
      backgroundColor="surface.background.gray.intense"
      padding="spacing.5"
      overflow="auto"
      minHeight="200px"
    >
      <Box marginBottom="spacing.4">
        <Text>Check the props panel to see all available props and their descriptions.</Text>
      </Box>
      <Pagination {...args} />
    </Box>
  );
};

export const PaginationAPIStory = PaginationTemplate.bind({});
PaginationAPIStory.args = {
  totalPages: 100,
  selectedPage: 1,
  defaultSelectedPage: 1,
  defaultPageSize: 10,
  showPageSizePicker: true,
  showPageNumberSelector: true,
  showLabel: true,
  onSelectedPageChange: ({ page }: { page: number }): void => {
    console.log('Page changed:', page);
  },
  onPageSizeChange: ({ pageSize }: { pageSize: number }): void => {
    console.log('Page size changed:', pageSize);
  },
};
PaginationAPIStory.storyName = 'Pagination';
