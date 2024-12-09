import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { Move } from '.';
import type { MoveProps } from '.';
import { Sandbox } from '~utils/storybook/Sandbox';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { InternalCardExample } from '../Card/Card.stories';
import { Text } from '~components/Typography';
import {
  Card,
  CardBody,
  CardFooter,
  CardFooterTrailing,
  CardHeader,
  CardHeaderBadge,
  CardHeaderCounter,
  CardHeaderIcon,
  CardHeaderLeading,
  CardHeaderTrailing,
} from '~components/Card';
import { CheckCircleIcon } from '~components/Icons';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Move"
      componentDescription="Move Motion Component (TODO)"
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
  title: 'Motion/Move',
  component: Move,
  tags: ['autodocs'],
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<MoveProps>;

const MoveTemplate: StoryFn<typeof Move> = (args) => {
  const [isVisible, setIsVisible] = React.useState(true);
  return (
    <Box minHeight="350px">
      <Button marginBottom="spacing.4" onClick={() => setIsVisible(!isVisible)}>
        Toggle Move
      </Button>
      <Move {...args} isVisible={isVisible} />
    </Box>
  );
};

export const Default = MoveTemplate.bind({});
Default.args = {
  children: <InternalCardExample />,
};
