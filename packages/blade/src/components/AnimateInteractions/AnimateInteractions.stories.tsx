import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { AnimateInteractions } from './';
import type { AnimateInteractionsProps } from './';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { InternalCardExample } from '../Card/Card.stories';
import { Fade } from '~components/Fade';
import { Move } from '~components/Move';
import { Text } from '~components/Typography';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AnimateInteractions"
      componentDescription="AnimateInteractions Motion Component (TODO)"
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
  title: 'Motion/AnimateInteractions',
  component: AnimateInteractions,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<AnimateInteractionsProps>;

const AnimateInteractionsTemplate: StoryFn<typeof AnimateInteractions> = (args) => {
  const [isVisible, setIsVisible] = React.useState(true);
  return (
    <Box minHeight="350px">
      <AnimateInteractions>{args.children}</AnimateInteractions>
    </Box>
  );
};

export const Default = AnimateInteractionsTemplate.bind({});
Default.args = {
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <Text>Some Text in Box</Text>
      <Fade>
        <b>Some Fade on Hover</b>
      </Fade>
    </Box>
  ),
};

export const MoveAnimateInteractions = AnimateInteractionsTemplate.bind({});
MoveAnimateInteractions.args = {
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
