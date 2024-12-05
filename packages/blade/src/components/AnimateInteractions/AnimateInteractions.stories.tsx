import React from 'react';
import type { Meta, StoryFn } from '@storybook/react';
import { Title } from '@storybook/addon-docs';
import { AnimateInteractions } from './';
import type { AnimateInteractionsProps } from './';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Fade } from '~components/Fade';
import { Move } from '~components/Move';
import { Heading, Text } from '~components/Typography';
import { Card, CardBody } from '~components/Card';
import { ExternalLinkIcon } from '~components/Icons';
import { Scale } from '~components/Scale';
import { AnimateInteractionsSandbox } from '~components/BaseMotion/docs/codeExamples';

const Page = (): React.ReactElement => {
  return (
    <StoryPageWrapper
      componentName="AnimateInteractions"
      componentDescription="AnimateInteractions is a component that allows you to animate child components based on interactions on parent. This is similar to doing `.parent:hover .child {}` styling in CSS."
    >
      <Title>Usage</Title>
      <AnimateInteractionsSandbox />
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
  return (
    <Box minHeight="200px">
      <AnimateInteractions {...args} />
    </Box>
  );
};

export const Default = AnimateInteractionsTemplate.bind({});
Default.args = {
  motionTriggers: ['hover'],
  children: (
    <Box display="flex" flexDirection="row" gap="spacing.4">
      <Text>Hover me for magic</Text>
      <Fade motionTriggers={['on-animate-interactions']}>
        <b>I appear depending on interaction on parent container</b>
      </Fade>
    </Box>
  ),
};

export const AnimateChildOnCardHover = AnimateInteractionsTemplate.bind({});
AnimateChildOnCardHover.args = {
  motionTriggers: ['hover'],
  children: (
    <Card width="400px" padding="spacing.0" backgroundColor="surface.background.gray.moderate">
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
              Hover over this card to see how AnimateInteractions component helps in animating child
              based on interactions on parent
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
  ),
};

export const ShowOverlayOnImageHover = AnimateInteractionsTemplate.bind({});
ShowOverlayOnImageHover.args = {
  motionTriggers: ['hover'],
  children: (
    <Box
      position="relative"
      width="300px"
      height="300px"
      borderRadius="medium"
      elevation="midRaised"
      overflow="hidden"
    >
      <img
        src="https://live.staticflickr.com/65535/54142149265_a0cf25efa4_b.jpg"
        width=""
        height="300px"
        alt="Hubble Takes a Look at Tangled Galaxies"
      />
      <Fade motionTriggers={['on-animate-interactions']}>
        <Box
          display="flex"
          position="absolute"
          top="spacing.0"
          left="spacing.0"
          width="100%"
          height="100%"
          alignItems="center"
          justifyContent="center"
          backgroundColor="overlay.background.subtle"
        >
          <Button
            icon={ExternalLinkIcon}
            iconPosition="right"
            target="_blank"
            href="https://www.flickr.com/photos/nasahubble/"
          >
            Open NASA Gallery
          </Button>
        </Box>
      </Fade>
    </Box>
  ),
};

export const ScaleOnParentHoverAndFocus = AnimateInteractionsTemplate.bind({});
ScaleOnParentHoverAndFocus.args = {
  motionTriggers: ['hover', 'focus'],
  children: (
    <Card
      width="400px"
      padding="spacing.0"
      backgroundColor="surface.background.gray.moderate"
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onClick={() => {}}
    >
      <CardBody>
        <Box overflow="auto">
          <Box padding="spacing.6">
            <Heading as="h2" size="large">
              NASA Hubble Gallery
            </Heading>

            <Box display="flex" gap="spacing.4" marginTop="spacing.4">
              <Box flex="2">
                <Text>
                  Hover over this card or press tab and focus on it to see how AnimateInteractions
                  component helps in animating child based on interactions on parent
                </Text>
              </Box>

              <Box>
                <Scale motionTriggers={['on-animate-interactions']}>
                  <img
                    src="https://live.staticflickr.com/65535/54142149265_a0cf25efa4_b.jpg"
                    width=""
                    height="140px"
                    alt="Hubble Takes a Look at Tangled Galaxies"
                  />
                </Scale>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardBody>
    </Card>
  ),
};
