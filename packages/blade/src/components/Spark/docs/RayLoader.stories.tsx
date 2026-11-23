import type { StoryFn, Meta } from '@storybook/react-vite';
import { Source } from '@storybook/addon-docs/blocks';
import React, { useState } from 'react';
import type { RayLoaderProps } from '../RayLoader';
import { RayLoader } from '../RayLoader';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import { Button } from '~components/Button';
import { Heading, Text } from '~components/Typography';
import { bladeTheme } from '~tokens/theme';

const USAGE = `import { RayLoader } from '@razorpay/blade/components';

function Page() {
  const [isReady, setIsReady] = React.useState(false);
  const [isLoaderDone, setIsLoaderDone] = React.useState(false);
  // ...setIsReady(true) once the page's data is in
  return isLoaderDone ? (
    <PageContent />
  ) : (
    <RayLoader isLoading={!isReady} onComplete={() => setIsLoaderDone(true)} />
  );
}`;

const Page = (): React.ReactElement => (
  <StoryPageWrapper
    componentName="RayLoader"
    componentDescription="The Ray loader (secondary). Ray charges up and dashes across while the page loads; when it's ready he slides on, turns round, jumps and drops through the floor, and onComplete is called. Its props mirror RazorSenseLoader's (isLoading, onComplete)."
    apiDecisionComponentName="Spark/Ray"
  >
    <Heading size="large">Usage</Heading>
    <Source code={USAGE} language="tsx" dark />
  </StoryPageWrapper>
);

export default {
  title: 'Components/RayLoader',
  component: RayLoader,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'radio', options: ['small', 'medium'] },
    ...getStyledPropsArgTypes(),
  },
  parameters: { docs: { page: Page } },
} as Meta<RayLoaderProps>;

// the story's own light / dark: its provider's setColorScheme, which themes it in place (the toolbar's switch mounts it again)
const SchemeSwitch = (): React.ReactElement => {
  const { colorScheme, setColorScheme } = useTheme();
  return (
    <Button
      size="small"
      variant="tertiary"
      onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
    >
      {colorScheme === 'dark' ? 'Switch to light' : 'Switch to dark'}
    </Button>
  );
};

const LoaderDemo = ({ size }: { size: RayLoaderProps['size'] }): React.ReactElement => {
  const [run, setRun] = useState(0); // a new loader for each Start (it plays once per mount)
  const [isShown, setIsShown] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const start = (): void => {
    setRun((r) => r + 1);
    setIsShown(true);
    setIsLoading(true);
    setIsComplete(false);
  };
  return (
    <Box display="flex" flexDirection="column" gap="spacing.5">
      <Box display="flex" gap="spacing.3" alignItems="center" flexWrap="wrap">
        <Button size="small" variant="secondary" onClick={start}>
          Start
        </Button>
        <Button
          size="small"
          variant="secondary"
          isDisabled={!isShown || !isLoading}
          onClick={() => setIsLoading(false)}
        >
          Finish
        </Button>
        <Button
          size="small"
          variant="secondary"
          isDisabled={!isShown || isComplete}
          onClick={() => setIsShown(false)}
        >
          Stop
        </Button>
        <SchemeSwitch />
        <Text size="small" color="surface.text.gray.muted">
          {!isShown
            ? 'Stopped: Start brings him back at his start'
            : isComplete
            ? 'onComplete: the page takes its place'
            : isLoading
            ? 'Loading…'
            : 'Loaded: he finishes'}
        </Text>
      </Box>
      <Box backgroundColor="surface.background.gray.intense" borderRadius="medium">
        {isShown ? (
          <RayLoader
            key={run}
            size={size}
            isLoading={isLoading}
            onComplete={() => setIsComplete(true)}
          />
        ) : (
          <Box height="192px" />
        )}
      </Box>
    </Box>
  );
};

/**
 * The Ray loader. Start: he charges and dashes, and holds the dash while loading. Finish (`isLoading={false}`): he slides on, turns
 * round, jumps and drops through the floor, then `onComplete`. Stop: the loader goes (unmounted mid-way); the next Start brings
 * him back at his start. The light / dark switch is here, not in the toolbar, so switching doesn't start him over.
 */
const RayLoaderTemplate: StoryFn<typeof RayLoader> = ({ size }) => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    <Box padding="spacing.8">
      <LoaderDemo size={size} />
    </Box>
  </BladeProvider>
);

export const RayLoaderSecondary = RayLoaderTemplate.bind({});
RayLoaderSecondary.storyName = 'Ray Loader (Secondary)';
RayLoaderSecondary.args = { size: 'medium' };
RayLoaderSecondary.parameters = { controls: { include: ['size'] } };
