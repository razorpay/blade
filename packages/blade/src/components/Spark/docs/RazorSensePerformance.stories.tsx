/* eslint-disable react/react-in-jsx-scope */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { RazorSense as RazorSenseComponent } from '../';
import type { RazorSenseMode } from '../RzpGlass';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import { Box } from '~components/Box';
import { Text } from '~components/Typography';
import { bladeTheme } from '~tokens/theme';

export default {
  title: 'Components/RazorSense/Performance',
  component: RazorSenseComponent,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta<typeof RazorSenseComponent>;

const ASSETS_PATH = '/assets/spark';
const DEFAULT_SCENARIO_WIDTH = '1200px';
const DEFAULT_SCENARIO_HEIGHT = '720px';

const MIXED_MODES = ['neutral', 'thinking', 'calm', 'joyful'] as const;
const ABOVE_FOLD_MODES = ['neutral', 'calm'] as const;
const BELOW_FOLD_MODES = ['typing', 'thinking', 'loading', 'joyful', 'caution', 'regret'] as const;
const RAPID_OPERATIONAL_MODES = ['neutral', 'typing', 'thinking', 'loading'] as const;
const RAPID_EMOTIONAL_MODES = ['calm', 'joyful', 'caution', 'regret'] as const;

type ScenarioRootProps = {
  scenario: string;
  children: ReactNode;
  width?: string;
  height?: string;
  currentMode?: RazorSenseMode;
  colorScheme?: 'light' | 'dark';
  pageVisibility?: DocumentVisibilityState;
  mountedCount?: number;
};

const ScenarioRoot = ({
  scenario,
  children,
  width = DEFAULT_SCENARIO_WIDTH,
  height = DEFAULT_SCENARIO_HEIGHT,
  currentMode,
  colorScheme,
  pageVisibility,
  mountedCount,
}: ScenarioRootProps): ReactElement => (
  <div
    data-razor-sense-scenario={scenario}
    data-current-mode={currentMode}
    data-color-scheme={colorScheme}
    data-page-visibility={pageVisibility}
    data-mounted-count={mountedCount}
  >
    <Box
      width={width}
      height={height}
      overflow="hidden"
      backgroundColor="surface.background.gray.subtle"
    >
      {children}
    </Box>
  </div>
);

type RazorSenseFixtureProps = {
  mode: RazorSenseMode;
  width: string;
  height: string;
  interactive?: boolean;
  modeTransitionDuration?: number;
};

const RazorSenseFixture = ({
  mode,
  width,
  height,
  interactive,
  modeTransitionDuration,
}: RazorSenseFixtureProps): ReactElement => (
  <Box position="relative" width={width} height={height} overflow="hidden">
    <RazorSenseComponent
      mode={mode}
      assetsPath={ASSETS_PATH}
      width={width}
      height={height}
      interactive={interactive}
      modeTransitionDuration={modeTransitionDuration}
    />
  </Box>
);

const useRapidMode = <Mode extends RazorSenseMode>(
  modes: readonly Mode[],
  intervalMs: number,
): Mode => {
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setModeIndex((currentIndex) => (currentIndex + 1) % modes.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs, modes.length]);

  return modes[modeIndex];
};

const usePageVisibility = (): DocumentVisibilityState => {
  const [pageVisibility, setPageVisibility] = useState<DocumentVisibilityState>(() =>
    typeof document === 'undefined' ? 'visible' : document.visibilityState,
  );

  useEffect(() => {
    const updatePageVisibility = (): void => setPageVisibility(document.visibilityState);

    document.addEventListener('visibilitychange', updatePageVisibility);
    return () => document.removeEventListener('visibilitychange', updatePageVisibility);
  }, []);

  return pageVisibility;
};

export const CurrentNeutral: StoryFn<typeof RazorSenseComponent> = () => (
  <ScenarioRoot scenario="current-neutral" currentMode="neutral" mountedCount={1}>
    <RazorSenseFixture
      mode="neutral"
      width={DEFAULT_SCENARIO_WIDTH}
      height={DEFAULT_SCENARIO_HEIGHT}
    />
  </ScenarioRoot>
);

export const CurrentCalm: StoryFn<typeof RazorSenseComponent> = () => (
  <ScenarioRoot scenario="current-calm" currentMode="calm" mountedCount={1}>
    <RazorSenseFixture
      mode="calm"
      width={DEFAULT_SCENARIO_WIDTH}
      height={DEFAULT_SCENARIO_HEIGHT}
    />
  </ScenarioRoot>
);

export const FourVisibleMixedInstances: StoryFn<typeof RazorSenseComponent> = () => (
  <ScenarioRoot scenario="four-visible-mixed-instances" mountedCount={4} height="640px">
    <Box
      display="grid"
      gridTemplateColumns="repeat(2, 560px)"
      gridTemplateRows="repeat(2, 280px)"
      gap="spacing.4"
      padding="spacing.4"
    >
      {MIXED_MODES.map((mode) => (
        <RazorSenseFixture
          key={mode}
          mode={mode}
          width="560px"
          height="280px"
          interactive={false}
        />
      ))}
    </Box>
  </ScenarioRoot>
);

export const EightMountedInstances: StoryFn<typeof RazorSenseComponent> = () => (
  <ScenarioRoot scenario="eight-mounted-six-below-fold" mountedCount={8} height="2120px">
    <Box padding="spacing.4">
      <Box display="grid" gridTemplateColumns="repeat(2, 560px)" gap="spacing.4">
        {ABOVE_FOLD_MODES.map((mode) => (
          <RazorSenseFixture
            key={mode}
            mode={mode}
            width="560px"
            height="280px"
            interactive={false}
          />
        ))}
      </Box>
      <Box height="960px" />
      <Box
        display="grid"
        gridTemplateColumns="repeat(2, 560px)"
        gridTemplateRows="repeat(3, 240px)"
        gap="spacing.4"
      >
        {BELOW_FOLD_MODES.map((mode) => (
          <RazorSenseFixture
            key={mode}
            mode={mode}
            width="560px"
            height="240px"
            interactive={false}
          />
        ))}
      </Box>
    </Box>
  </ScenarioRoot>
);

export const RapidOperationalChanges: StoryFn<typeof RazorSenseComponent> = () => {
  const mode = useRapidMode(RAPID_OPERATIONAL_MODES, 120);

  return (
    <ScenarioRoot scenario="rapid-operational-changes" currentMode={mode} mountedCount={1}>
      <RazorSenseFixture
        mode={mode}
        width={DEFAULT_SCENARIO_WIDTH}
        height={DEFAULT_SCENARIO_HEIGHT}
        interactive={false}
        modeTransitionDuration={0.08}
      />
    </ScenarioRoot>
  );
};

export const RapidEmotionalChanges: StoryFn<typeof RazorSenseComponent> = () => {
  const mode = useRapidMode(RAPID_EMOTIONAL_MODES, 180);

  return (
    <ScenarioRoot scenario="rapid-emotional-changes" currentMode={mode} mountedCount={1}>
      <RazorSenseFixture
        mode={mode}
        width={DEFAULT_SCENARIO_WIDTH}
        height={DEFAULT_SCENARIO_HEIGHT}
        interactive={false}
        modeTransitionDuration={0.12}
      />
    </ScenarioRoot>
  );
};

const ProviderAppearanceSurface = (): ReactElement => {
  const { colorScheme, setColorScheme } = useTheme();

  useEffect(() => {
    let nextColorScheme: 'light' | 'dark' = 'dark';
    const interval = window.setInterval(() => {
      setColorScheme(nextColorScheme);
      nextColorScheme = nextColorScheme === 'light' ? 'dark' : 'light';
    }, 500);

    return () => window.clearInterval(interval);
  }, [setColorScheme]);

  return (
    <ScenarioRoot scenario="provider-appearance-changes" colorScheme={colorScheme} mountedCount={1}>
      <RazorSenseFixture
        mode="neutral"
        width={DEFAULT_SCENARIO_WIDTH}
        height={DEFAULT_SCENARIO_HEIGHT}
        interactive={false}
        modeTransitionDuration={0.2}
      />
    </ScenarioRoot>
  );
};

export const ProviderAppearanceChanges: StoryFn<typeof RazorSenseComponent> = () => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    <ProviderAppearanceSurface />
  </BladeProvider>
);

export const PageVisibility: StoryFn<typeof RazorSenseComponent> = () => {
  const pageVisibility = usePageVisibility();

  return (
    <ScenarioRoot scenario="page-visibility" pageVisibility={pageVisibility} mountedCount={2}>
      <Box padding="spacing.4">
        <Box height="40px" display="flex" alignItems="center">
          <Text size="small" weight="semibold">
            Page visibility: {pageVisibility}
          </Text>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(2, 560px)" gap="spacing.4">
          <RazorSenseFixture mode="neutral" width="560px" height="600px" interactive={false} />
          <RazorSenseFixture mode="calm" width="560px" height="600px" interactive={false} />
        </Box>
      </Box>
    </ScenarioRoot>
  );
};
