/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-extraneous-dependencies */
import type { StoryFn } from '@storybook/react';
import { within, waitFor, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import React from 'react';
import { Fade } from '~components/Fade';
import { Badge } from '~components/Badge';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Move } from '~components/Move';
import { Slide } from '~components/Slide';
import { Card, CardBody } from '~components/Card';
import { Heading, Text } from '~components/Typography';
import { ExternalLinkIcon } from '~components/Icons';
import { AnimateInteractions } from '~components/AnimateInteractions';
import { Scale } from '~components/Scale';
import { Stagger } from '~components/Stagger';
import { Chip, ChipGroup } from '~components/Chip';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const InitialLoad: StoryFn = (): React.ReactElement => {
  return (
    <Box>
      <Fade>
        <Badge testID="badge" color="positive">
          Fade Badge
        </Badge>
      </Fade>

      <Move>
        <Button testID="button">Move Button</Button>
      </Move>

      <Slide>
        <Card testID="card">
          <CardBody>
            <Text>Slide Card</Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
};

InitialLoad.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  // Check badge is fading in to visibility
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 1'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(0px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(0%)'));
};

export const ControlledVisibility: StoryFn = (): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsVisible(!isVisible)}>Toggle Animation</Button>
      <Fade isVisible={isVisible}>
        <Badge marginTop="spacing.4" color="positive" testID="badge">
          Test Badge Motion
        </Badge>
      </Fade>

      <Move isVisible={isVisible}>
        <Button testID="button">Move Button</Button>
      </Move>

      <Slide isVisible={isVisible}>
        <Card testID="card">
          <CardBody>
            <Text>Slide Card</Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
};

ControlledVisibility.play = async ({ canvasElement }) => {
  const { getByRole, getByTestId } = within(canvasElement);
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 0'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(100vh)'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 1'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(0px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(0%)'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 0'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(100vh)'));
};

export const OnlyInAnimation: StoryFn = (): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsVisible(!isVisible)}>Toggle Animation</Button>
      <Fade type="in" isVisible={isVisible}>
        <Badge marginTop="spacing.4" color="positive" testID="badge">
          Test Badge Motion
        </Badge>
      </Fade>

      <Move type="in" isVisible={isVisible}>
        <Button testID="button">Move Button</Button>
      </Move>

      <Slide type="in" isVisible={isVisible}>
        <Card testID="card">
          <CardBody>
            <Text>Slide Card</Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
};

OnlyInAnimation.play = async ({ canvasElement }) => {
  const { getByRole, getByTestId } = within(canvasElement);
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 0'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(100vh)'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 1'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(0px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(0%)'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  // we're not adding waitFor here and kept sleep timer smaller than animation duration to ensure elements are not animating out
  await sleep(10);
  await expect(getByTestId('badge')).toHaveStyle('opacity: 0');
  await expect(getByTestId('button').style.transform).toBe('translateY(16px)');
  await expect(getByTestId('card').style.transform).toBe('translateY(100vh)');
};

export const OnlyOutAnimation: StoryFn = (): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <Box>
      <Button onClick={() => setIsVisible(!isVisible)}>Toggle Animation</Button>
      <Fade type="out" isVisible={isVisible}>
        <Badge marginTop="spacing.4" color="positive" testID="badge">
          Test Badge Motion
        </Badge>
      </Fade>

      <Move type="out" isVisible={isVisible}>
        <Button testID="button">Move Button</Button>
      </Move>

      <Slide type="out" isVisible={isVisible}>
        <Card testID="card">
          <CardBody>
            <Text>Slide Card</Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
};

OnlyOutAnimation.play = async ({ canvasElement }) => {
  const { getByRole, getByTestId } = within(canvasElement);
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 0'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(100vh)'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await sleep(10);
  await expect(getByTestId('badge')).toHaveStyle('opacity: 1');
  await expect(getByTestId('button').style.transform).toBe('translateY(0px)');
  await expect(getByTestId('card').style.transform).toBe('translateY(0%)');

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 0'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(100vh)'));
};

export const UnmountOnHidden: StoryFn = (): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <Box testID="layout" backgroundColor="surface.background.gray.intense">
      <Button onClick={() => setIsVisible(!isVisible)}>Toggle Animation</Button>
      <Fade shouldUnmountWhenHidden isVisible={isVisible}>
        <Badge marginTop="spacing.4" color="positive" testID="badge">
          Test Badge Motion
        </Badge>
      </Fade>

      <Move shouldUnmountWhenHidden isVisible={isVisible}>
        <Button testID="button">Move Button</Button>
      </Move>

      <Slide shouldUnmountWhenHidden isVisible={isVisible}>
        <Card testID="card">
          <CardBody>
            <Text>Slide Card</Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
};

UnmountOnHidden.play = async ({ canvasElement }) => {
  const { getByRole, getByTestId, queryByTestId } = within(canvasElement);
  await waitFor(() => expect(queryByTestId('badge')).not.toBeInTheDocument());
  await waitFor(() => expect(queryByTestId('button')).not.toBeInTheDocument());
  await waitFor(() => expect(queryByTestId('card')).not.toBeInTheDocument());
  await expect(getByTestId('layout').clientHeight).toBeLessThan(50);

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 1'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(0px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(0%)'));
  await waitFor(() => expect(getByTestId('layout').clientHeight).not.toBeLessThan(50));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('badge')).toHaveStyle('opacity: 0'));
  await waitFor(() => expect(getByTestId('button').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(100vh)'));
  await waitFor(() => expect(getByTestId('layout').clientHeight).toBeLessThan(50));
};

export const SlideDirection: StoryFn = (): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <Box testID="layout" backgroundColor="surface.background.gray.intense">
      <Button onClick={() => setIsVisible(!isVisible)}>Toggle Animation</Button>

      <Slide direction={{ enter: 'right', exit: 'top' }} fromOffset="100%" isVisible={isVisible}>
        <Card testID="card">
          <CardBody>
            <Text>Slide Card</Text>
          </CardBody>
        </Card>
      </Slide>
    </Box>
  );
};

SlideDirection.play = async ({ canvasElement }) => {
  const { getByRole, getByTestId } = within(canvasElement);
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateX(100%)'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(0%)'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateX(100%)'));
};

export const ScaleOnHover: StoryFn = (): React.ReactElement => {
  return (
    <Scale>
      <Text testID="scale-text">
        Hover over this card to see how AnimateInteractions component helps in animating child based
        on interactions on parent
      </Text>
    </Scale>
  );
};

ScaleOnHover.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  // await waitFor(() => expect(getByTestId('move-box').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('scale-text').style.transform).toBe('none'));

  await userEvent.hover(getByTestId('scale-text'));
  await sleep(800);
  await waitFor(() => expect(getByTestId('scale-text').style.transform).toBe('scale(1.05)'));
  await userEvent.unhover(getByTestId('scale-text'));
  await sleep(800);
  await waitFor(() => expect(getByTestId('scale-text').style.transform).toBe('none'));
};

export const InViewAnimation: StoryFn = (): React.ReactElement => {
  return (
    <Box
      testID="layout"
      height="500px"
      overflow="auto"
      backgroundColor="surface.background.gray.intense"
    >
      <Box height="600px">Scroll</Box>
      <Box id="slide-container">
        <Slide direction="right" motionTriggers={['in-view']}>
          <Card testID="card">
            <CardBody>
              <Text>Slide Card</Text>
            </CardBody>
          </Card>
        </Slide>
      </Box>
    </Box>
  );
};

InViewAnimation.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  await waitFor(() => expect(getByTestId('card')).toHaveStyle('transform: none'));

  await sleep(1000);
  canvasElement.querySelector('#slide-container')?.scrollIntoView();
  await sleep(800);
  await waitFor(() => expect(getByTestId('card').style.transform).toBe('translateY(0%)'));
};

export const MoveOnParentInteraction: StoryFn = (): React.ReactElement => {
  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Card
        testID="card"
        width="400px"
        padding="spacing.0"
        backgroundColor="surface.background.gray.moderate"
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
              <Fade>
                <Text testID="initial-load-text">
                  Hover over this card to see how AnimateInteractions component helps in animating
                  child based on interactions on parent
                </Text>
              </Fade>
            </Box>

            <Move motionTriggers={['on-animate-interactions']}>
              <Box
                display="flex"
                gap="spacing.4"
                justifyContent="flex-end"
                padding={['spacing.4', 'spacing.6']}
                elevation="highRaised"
                testID="move-box"
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
    </AnimateInteractions>
  );
};

MoveOnParentInteraction.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  await waitFor(() => expect(getByTestId('move-box').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('initial-load-text')).toHaveStyle('opacity: 1'));

  await userEvent.hover(getByTestId('card'));
  await sleep(800);
  await waitFor(() => expect(getByTestId('move-box').style.transform).toBe('translateY(0px)'));
  await userEvent.unhover(getByTestId('card'));
};

export const ScaleOnParentInteraction: StoryFn = (): React.ReactElement => {
  return (
    <AnimateInteractions motionTriggers={['hover']}>
      <Card
        testID="card"
        width="400px"
        padding="spacing.0"
        backgroundColor="surface.background.gray.moderate"
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
              <Scale motionTriggers={['on-animate-interactions']}>
                <Text testID="scale-text">
                  Hover over this card to see how AnimateInteractions component helps in animating
                  child based on interactions on parent
                </Text>
              </Scale>
            </Box>
          </Box>
        </CardBody>
      </Card>
    </AnimateInteractions>
  );
};

ScaleOnParentInteraction.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  // await waitFor(() => expect(getByTestId('move-box').style.transform).toBe('translateY(16px)'));
  await waitFor(() => expect(getByTestId('scale-text').style.transform).toBe('none'));

  await userEvent.hover(getByTestId('card'));
  await sleep(1000);
  await waitFor(() => expect(getByTestId('scale-text').style.transform).toBe('scale(1.05)'));
  await userEvent.unhover(getByTestId('card'));
  await sleep(1000);
  await waitFor(() => expect(getByTestId('scale-text').style.transform).toBe('none'));
};

export const StaggerChildren: StoryFn = (): React.ReactElement => {
  const [isVisible, setIsVisible] = React.useState(true);
  return (
    <Box>
      <Button onClick={() => setIsVisible(!isVisible)}>Toggle Animation</Button>
      <Stagger isVisible={isVisible}>
        <ChipGroup label="Account Information" selectionType="multiple">
          {[
            'Business Type: Freelance',
            'Account Status: Activated',
            'Test Mode: Disabled',
            'Primary Product: Banking',
            'Business Type: Freelance 2',
            'Account Status: Activated 2',
            'Test Mode: Disabled 2',
            'Primary Product: Banking 2',
            'Business Type: Freelance 3',
            'Account Status: Activated 3',
            'Test Mode: Disabled 3',
            'Primary Product: Banking 3',
          ].map((chipLabel, index) => {
            return (
              <Fade key={index}>
                <Chip
                  testID={`chip-testid-${index}`}
                  value={chipLabel.toLowerCase().replace(/ /g, '-')}
                >
                  {chipLabel}
                </Chip>
              </Fade>
            );
          })}
        </ChipGroup>
      </Stagger>
    </Box>
  );
};

StaggerChildren.play = async ({ canvasElement }) => {
  const { getByTestId, getByRole } = within(canvasElement);
  // tests that last element was still invisible when first element appeared
  await waitFor(() => expect(getByTestId('chip-testid-0')).toHaveStyle('opacity: 1'));
  await expect(getByTestId('chip-testid-11')).toHaveStyle('opacity: 0');
  await waitFor(() => expect(getByTestId('chip-testid-11')).toHaveStyle('opacity: 1'));

  await userEvent.click(getByRole('button', { name: 'Toggle Animation' }));

  await sleep(1000);
  await waitFor(() => expect(getByTestId('chip-testid-0')).toHaveStyle('opacity: 0'));
};

export default {
  title: 'Components/Interaction Tests/Motion Presets',
  parameters: {
    controls: {
      disable: true,
    },
    a11y: { disable: true },
    essentials: { disable: true },
    actions: { disable: true },
  },
};
