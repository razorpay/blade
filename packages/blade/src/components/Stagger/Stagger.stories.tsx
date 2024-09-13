import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Stagger } from './';
import type { StaggerProps } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { InternalCardExample } from '../Card/Card.stories';
import { Fade } from '~components/Fade';
import { Move } from '~components/Move';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Stagger"
      componentDescription="Stagger Motion Component (TODO)"
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
  title: 'Motion/Stagger',
  component: Stagger,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<StaggerProps>;

const StaggerTemplate: StoryFn<typeof Stagger> = (args) => {
  const [isVisible, setIsVisible] = React.useState(true);
  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Stagger
      </Button>
      <Stagger {...args} isVisible={isVisible}>
        {args.children}
      </Stagger>
    </Box>
  );
};

export const Default = StaggerTemplate.bind({});
Default.args = {
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <Fade>
        <InternalCardExample />
      </Fade>
      <Fade>
        <InternalCardExample />
      </Fade>
      <Fade>
        <InternalCardExample />
      </Fade>
    </Box>
  ),
};

export const MoveStagger = StaggerTemplate.bind({});
MoveStagger.args = {
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
      <Move>
        <InternalCardExample />
      </Move>
    </Box>
  ),
};
