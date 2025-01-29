import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { InternalCardExample } from '../Card/InternalCardExample';
import { Elevate } from './';
import type { ElevateProps } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { ElevateSandbox } from '~components/BaseMotion/docs/codeExamples';
import { AnimateInteractions } from '~components/AnimateInteractions';
import { Card, CardBody } from '~components/Card';
import { Heading, Text } from '~components/Typography';
import { Move } from '~components/Move';
import { ExternalLinkIcon } from '~components/Icons';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="Elevate"
      componentDescription="Elevate component animates over CSS `box-shadow` property and allows you to highlight component by adding shadow"
      figmaURL="https://www.figma.com/proto/jubmQL9Z8V7881ayUD95ps/Blade-DSL?type=design&node-id=74864-85897&t=CvaYT53LNc4OYVKa-1&scaling=min-zoom&page-id=21689%3A381614&mode=design"
      note="Elevate component animates over box-shadow so adding this to text components would create a broken experience. Make sure to use it on block components like Card, Box, etx"
      apiDecisionLink="https://github.com/razorpay/blade/blob/master/rfcs/2024-08-21-motion-presets.md"
    >
      <Title>Usage</Title>
      <ElevateSandbox />
    </StoryPageWrapper>
  );
};

export default {
  title: 'Motion/Elevate',
  component: Elevate,
  tags: ['autodocs'],
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    docs: {
      page: Page,
    },
  },
} as Meta<ElevateProps>;

const ControlledElevateTemplate: StoryFn<typeof Elevate> = (args) => {
  const [isHighlighted, setIsHighlighted] = React.useState(false);
  return (
    <Box>
      <Button marginBottom="spacing.4" onClick={() => setIsHighlighted(!isHighlighted)}>
        Toggle Elevate
      </Button>
      <Box>
        <Elevate {...args} isHighlighted={isHighlighted} />
      </Box>
    </Box>
  );
};

const ElevateTemplate: StoryFn<typeof Elevate> = (args) => {
  return <Elevate {...args} />;
};

const MultipleElevateTemplate: StoryFn<typeof Elevate> = (args) => {
  return (
    <Box display="flex" gap="spacing.4">
      <Elevate {...args} />
      <Elevate {...args} />
      <Elevate {...args} />
    </Box>
  );
};

export const Default = ElevateTemplate.bind({});
Default.args = {
  children: <InternalCardExample elevation="none" />,
  motionTriggers: ['hover'],
};

export const MultipleCardsHover = MultipleElevateTemplate.bind({});
MultipleCardsHover.args = {
  children: <InternalCardExample elevation="none" />,
  motionTriggers: ['hover'],
};

export const Controlled = ControlledElevateTemplate.bind({});
Controlled.args = {
  children: <InternalCardExample elevation="none" />,
};

export const WithAnimateInteraction = (args: ElevateProps): React.ReactElement => {
  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Box display="contents">
        <Elevate {...args}>
          <Card
            width="400px"
            padding="spacing.0"
            backgroundColor="surface.background.gray.moderate"
            elevation="none"
          >
            <CardBody>
              <Box overflow="auto">
                <Box padding="spacing.6">
                  <Heading as="h2" weight="regular">
                    Payment Pages
                  </Heading>
                  <Heading marginY="spacing.4" size="large" as="h3">
                    Accept payments{' '}
                    <Heading size="large" as="span" color="surface.text.primary.normal">
                      without coding on a custom branded store
                    </Heading>
                  </Heading>
                  <Text>
                    Hover this card to see how you can add Elevate and AnimateInteractions both on a
                    component
                  </Text>
                </Box>

                <Move motionTriggers={['on-animate-interactions']}>
                  <Box
                    display="flex"
                    gap="spacing.4"
                    justifyContent="flex-end"
                    padding={['spacing.4', 'spacing.6']}
                    elevation="highRaised"
                  >
                    <Button variant="secondary" icon={ExternalLinkIcon} iconPosition="right">
                      Know More
                    </Button>
                    <Button>Sign Up</Button>
                  </Box>
                </Move>
              </Box>
            </CardBody>
          </Card>
        </Elevate>
      </Box>
    </AnimateInteractions>
  );
};
