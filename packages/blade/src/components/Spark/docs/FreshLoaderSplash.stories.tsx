import type { StoryFn, Meta } from '@storybook/react-vite';
import React, { useState } from 'react';
import type { ReactElement } from 'react';
import { FreshLoaderSplash } from '../FreshLoaderSplash';
import type { FreshLoaderSplashProps } from '../FreshLoaderSplash';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

const Page = (): ReactElement => {
  return (
    <StoryPageWrapper
      componentName="FreshLoaderSplash"
      componentDescription="RazorSense's loading splash: the Razorpay glyph loops while the page loads, then grows and fades to the plain background. Like RazorSense it follows Blade's color scheme: switch light and dark with Color Scheme in the toolbar. One of the Fresh RazorSense components, which ship next to RazorSense and leave it as it is."
    />
  );
};

export default {
  title: 'Components/RazorSense/Fresh Loader Splash',
  component: FreshLoaderSplash,
  args: {
    isLoading: true,
    scale: 1,
    isPaused: false,
  },
  argTypes: {
    scale: { control: { type: 'range', min: 0.75, max: 1.25, step: 0.05 } },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: Page,
    },
  },
} as Meta<FreshLoaderSplashProps>;

/**
 * Light or dark: Color Scheme in the toolbar. The glyph loops while `isLoading` is true. "Finish loading" sets it to false: the glyph finishes its loop, grows and fades
 * out, then `onComplete` is called.
 */
const FreshLoaderSplashTemplate: StoryFn<typeof FreshLoaderSplash> = (args) => {
  const [run, setRun] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const replay = (): void => {
    setIsLoading(true);
    setIsComplete(false);
    setRun((n) => n + 1);
  };
  return (
    <Box position="relative" width="100%" height="100vh">
      <FreshLoaderSplash
        key={run}
        {...args}
        isLoading={isLoading && args.isLoading !== false}
        onComplete={() => setIsComplete(true)}
      />
      <Box
        position="absolute"
        bottom="spacing.5"
        left="spacing.5"
        display="flex"
        gap="spacing.4"
        alignItems="center"
      >
        <Button
          size="small"
          variant="secondary"
          isDisabled={!isLoading}
          onClick={() => setIsLoading(false)}
        >
          Finish loading
        </Button>
        <Button size="small" variant="tertiary" onClick={replay}>
          Replay
        </Button>
        <Text size="small" color="surface.text.gray.muted">
          {isComplete ? 'onComplete fired' : isLoading ? 'Loading' : 'Finishing'}
        </Text>
      </Box>
    </Box>
  );
};

export const Default = FreshLoaderSplashTemplate.bind({});
Default.storyName = 'Default';
