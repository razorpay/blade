/* eslint-disable react/react-in-jsx-scope */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { RazorSense as RazorSenseComponent } from '../';
import type { RazorSenseMode } from '../';
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
  isReady: boolean;
  isFullyReady?: boolean;
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
  isReady,
  isFullyReady = isReady,
}: ScenarioRootProps): ReactElement => (
  <div
    data-razor-sense-scenario={scenario}
    data-scenario-ready={isReady ? 'true' : 'false'}
    data-scenario-fully-ready={isFullyReady ? 'true' : 'false'}
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
  onLoad?: () => void;
};

const RazorSenseFixture = ({
  mode,
  width,
  height,
  interactive,
  modeTransitionDuration,
  onLoad,
}: RazorSenseFixtureProps): ReactElement => (
  <Box position="relative" width={width} height={height} overflow="hidden">
    <RazorSenseComponent
      mode={mode}
      assetsPath={ASSETS_PATH}
      width={width}
      height={height}
      interactive={interactive}
      modeTransitionDuration={modeTransitionDuration}
      onLoad={onLoad}
    />
  </Box>
);

const useRapidMode = <Mode extends RazorSenseMode>(
  modes: readonly Mode[],
  intervalMs: number,
  isReady: boolean,
): Mode => {
  const [modeIndex, setModeIndex] = useState(0);

  useEffect(() => {
    if (!isReady) return undefined;

    const interval = window.setInterval(() => {
      setModeIndex((currentIndex) => (currentIndex + 1) % modes.length);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [intervalMs, isReady, modes.length]);

  return modes[modeIndex];
};

const useScenarioReadiness = (
  expectedCount: number,
): { isReady: boolean; markReady: (id: string) => void } => {
  const readyIDsRef = useRef(new Set<string>());
  const [readyCount, setReadyCount] = useState(0);

  const markReady = useCallback((id: string): void => {
    if (readyIDsRef.current.has(id)) return;
    readyIDsRef.current.add(id);
    setReadyCount(readyIDsRef.current.size);
  }, []);

  return { isReady: readyCount >= expectedCount, markReady };
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

const SingleModeScenario = ({ mode }: { mode: RazorSenseMode }): ReactElement => {
  const [isReady, setIsReady] = useState(false);

  return (
    <ScenarioRoot
      scenario={`current-${mode}`}
      currentMode={mode}
      mountedCount={1}
      isReady={isReady}
    >
      <RazorSenseFixture
        mode={mode}
        width={DEFAULT_SCENARIO_WIDTH}
        height={DEFAULT_SCENARIO_HEIGHT}
        onLoad={() => setIsReady(true)}
      />
    </ScenarioRoot>
  );
};

export const CurrentNeutral: StoryFn<typeof RazorSenseComponent> = () => (
  <SingleModeScenario mode="neutral" />
);

export const CurrentCalm: StoryFn<typeof RazorSenseComponent> = () => (
  <SingleModeScenario mode="calm" />
);

export const FourVisibleMixedInstances: StoryFn<typeof RazorSenseComponent> = () => {
  const { isReady, markReady } = useScenarioReadiness(MIXED_MODES.length);

  return (
    <ScenarioRoot
      scenario="four-visible-mixed-instances"
      mountedCount={4}
      height="640px"
      isReady={isReady}
    >
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
            onLoad={() => markReady(mode)}
          />
        ))}
      </Box>
    </ScenarioRoot>
  );
};

export const EightMountedInstances: StoryFn<typeof RazorSenseComponent> = () => {
  const visibleReadiness = useScenarioReadiness(ABOVE_FOLD_MODES.length);
  const fullReadiness = useScenarioReadiness(ABOVE_FOLD_MODES.length + BELOW_FOLD_MODES.length);

  return (
    <ScenarioRoot
      scenario="eight-mounted-six-below-fold"
      mountedCount={8}
      height="2120px"
      isReady={visibleReadiness.isReady}
      isFullyReady={fullReadiness.isReady}
    >
      <Box padding="spacing.4">
        <Box display="grid" gridTemplateColumns="repeat(2, 560px)" gap="spacing.4">
          {ABOVE_FOLD_MODES.map((mode) => (
            <RazorSenseFixture
              key={mode}
              mode={mode}
              width="560px"
              height="280px"
              interactive={false}
              onLoad={() => {
                visibleReadiness.markReady(mode);
                fullReadiness.markReady(`above-${mode}`);
              }}
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
              onLoad={() => fullReadiness.markReady(`below-${mode}`)}
            />
          ))}
        </Box>
      </Box>
    </ScenarioRoot>
  );
};

export const RapidOperationalChanges: StoryFn<typeof RazorSenseComponent> = () => {
  const [isReady, setIsReady] = useState(false);
  const mode = useRapidMode(RAPID_OPERATIONAL_MODES, 120, isReady);

  return (
    <ScenarioRoot
      scenario="rapid-operational-changes"
      currentMode={mode}
      mountedCount={1}
      isReady={isReady}
    >
      <RazorSenseFixture
        mode={mode}
        width={DEFAULT_SCENARIO_WIDTH}
        height={DEFAULT_SCENARIO_HEIGHT}
        interactive={false}
        modeTransitionDuration={0.08}
        onLoad={() => setIsReady(true)}
      />
    </ScenarioRoot>
  );
};

export const RapidEmotionalChanges: StoryFn<typeof RazorSenseComponent> = () => {
  const [isReady, setIsReady] = useState(false);
  const mode = useRapidMode(RAPID_EMOTIONAL_MODES, 180, isReady);

  return (
    <ScenarioRoot
      scenario="rapid-emotional-changes"
      currentMode={mode}
      mountedCount={1}
      isReady={isReady}
    >
      <RazorSenseFixture
        mode={mode}
        width={DEFAULT_SCENARIO_WIDTH}
        height={DEFAULT_SCENARIO_HEIGHT}
        interactive={false}
        modeTransitionDuration={0.12}
        onLoad={() => setIsReady(true)}
      />
    </ScenarioRoot>
  );
};

const ProviderAppearanceSurface = (): ReactElement => {
  const { colorScheme, setColorScheme } = useTheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isReady) return undefined;

    let nextColorScheme: 'light' | 'dark' = 'dark';
    const interval = window.setInterval(() => {
      setColorScheme(nextColorScheme);
      nextColorScheme = nextColorScheme === 'light' ? 'dark' : 'light';
    }, 500);

    return () => window.clearInterval(interval);
  }, [isReady, setColorScheme]);

  return (
    <ScenarioRoot
      scenario="provider-appearance-changes"
      colorScheme={colorScheme}
      mountedCount={1}
      isReady={isReady}
    >
      <RazorSenseFixture
        mode="neutral"
        width={DEFAULT_SCENARIO_WIDTH}
        height={DEFAULT_SCENARIO_HEIGHT}
        interactive={false}
        modeTransitionDuration={0.2}
        onLoad={() => setIsReady(true)}
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
  const { isReady, markReady } = useScenarioReadiness(2);

  return (
    <ScenarioRoot
      scenario="page-visibility"
      pageVisibility={pageVisibility}
      mountedCount={2}
      isReady={isReady}
    >
      <Box padding="spacing.4">
        <Box height="40px" display="flex" alignItems="center">
          <Text size="small" weight="semibold">
            Page visibility: {pageVisibility}
          </Text>
        </Box>
        <Box display="grid" gridTemplateColumns="repeat(2, 560px)" gap="spacing.4">
          <RazorSenseFixture
            mode="neutral"
            width="560px"
            height="600px"
            interactive={false}
            onLoad={() => markReady('neutral')}
          />
          <RazorSenseFixture
            mode="calm"
            width="560px"
            height="600px"
            interactive={false}
            onLoad={() => markReady('calm')}
          />
        </Box>
      </Box>
    </ScenarioRoot>
  );
};
