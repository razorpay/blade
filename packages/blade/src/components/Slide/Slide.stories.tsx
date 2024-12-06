import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Slide } from '.';
import type { SlideProps } from '.';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { InternalCardExample } from '../Card/Card.stories';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Slide"
      componentDescription="Slide Motion Component (TODO)"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
    >
      <Title>Usage</Title>
      <Sandbox>
        {`
        const todo = 'todo';
        `}
      </Sandbox>
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Slide',
  component: Slide,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<SlideProps>;

const SlideTemplate: StoryFn<typeof Slide> = (args) => {
  const [isVisible, setIsVisible] = React.useState(true);

  return (
    <Box backgroundColor="surface.background.gray.intense">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Slide
      </Button>
      <Slide {...args} isVisible={isVisible} />
    </Box>
  );
};

export const Default = SlideTemplate.bind({});
Default.args = {
  children: <InternalCardExample />,
  direction: { enter: 'bottom', exit: 'left' },
};
