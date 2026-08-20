/* eslint-disable react/react-in-jsx-scope */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import type { ReactElement } from 'react';
import { RazorSense as RazorSenseComponent } from '../';
import {
  RAZOR_SENSE_EMOTIONAL_MODES,
  RAZOR_SENSE_MODE_LABELS,
  RAZOR_SENSE_MODES,
  RAZOR_SENSE_OPERATIONAL_MODES,
} from '../RzpGlass';
import type { RazorSenseEmotionalMode, RazorSenseMode } from '../RzpGlass';
import { MobileRazorSenseMood } from '../RzpGlass/RazorSenseMood';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import { Box } from '~components/Box';
import { BaseBox } from '~components/Box/BaseBox';
import { Heading, Text } from '~components/Typography';
import { bladeTheme } from '~tokens/theme';

export default {
  title: 'Components/RazorSense/Emotional Modes',
  component: RazorSenseComponent,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
} as Meta<typeof RazorSenseComponent>;

const ModePicker = <Mode extends RazorSenseMode>({
  mode,
  modes,
  onChange,
  colorScheme = 'light',
}: {
  mode: Mode;
  modes: readonly Mode[];
  onChange: (mode: Mode) => void;
  colorScheme?: 'light' | 'dark';
}): ReactElement => (
  <>
    <style>{`
      .razorsense-mode-button:focus-visible {
        outline: 2px solid rgba(44, 82, 224, 0.9);
        outline-offset: 3px;
      }
    `}</style>
    <Box
      position="absolute"
      top="0px"
      right="0px"
      bottom="0px"
      left="0px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex={1}
      pointerEvents="none"
    >
      <Box
        display="flex"
        width="calc(100% - 32px)"
        justifyContent="center"
        gap="6px"
        pointerEvents="auto"
      >
        {modes.map((candidate) => (
          <button
            key={candidate}
            className="razorsense-mode-button"
            type="button"
            aria-pressed={mode === candidate}
            onClick={() => onChange(candidate)}
            style={{
              minWidth: modes.length > 4 ? 110 : 126,
              height: 56,
              padding: modes.length > 4 ? '0 20px' : '0 30px',
              border: '1px solid rgba(255, 255, 255, 0.52)',
              borderRadius: 999,
              outline: 'none',
              background:
                colorScheme === 'dark'
                  ? mode === candidate
                    ? 'rgba(37, 49, 69, 0.94)'
                    : 'rgba(11, 17, 29, 0.62)'
                  : mode === candidate
                  ? 'rgba(250, 251, 252, 0.92)'
                  : 'rgba(226, 234, 247, 0.58)',
              color: colorScheme === 'dark' ? '#F6F8FB' : '#17181A',
              font: `500 ${modes.length > 4 ? 16 : 18}px/1 Inter, sans-serif`,
              boxShadow:
                mode === candidate
                  ? colorScheme === 'dark'
                    ? 'inset 0 1px 0 rgba(255,255,255,0.24), 0 8px 28px rgba(0,0,0,0.38)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.86), 0 5px 18px rgba(29,52,94,0.10)'
                  : colorScheme === 'dark'
                  ? 'inset 0 1px 0 rgba(255,255,255,0.10)'
                  : 'inset 0 1px 0 rgba(255,255,255,0.52)',
              cursor: 'pointer',
              backdropFilter: 'blur(6px) saturate(140%)',
              WebkitBackdropFilter: 'blur(6px) saturate(140%)',
              transition: '180ms ease background, 180ms ease box-shadow, 180ms ease transform',
            }}
          >
            {RAZOR_SENSE_MODE_LABELS[candidate]}
          </button>
        ))}
      </Box>
    </Box>
  </>
);

export const ModesPlayground: StoryFn<typeof RazorSenseComponent> = () => {
  const [mode, setMode] = useState<RazorSenseEmotionalMode>('calm');

  return (
    <Box minHeight="100vh" backgroundColor="surface.background.gray.subtle" padding="spacing.10">
      <Box maxWidth="1120px" marginX="auto">
        <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
          RAZORSENSE · EMOTIONAL MODES
        </Text>
        <Heading size="2xlarge" marginBottom="spacing.8">
          Alive at every touchpoint.
        </Heading>
        <Box
          position="relative"
          width="100%"
          height="361px"
          borderRadius="large"
          overflow="hidden"
          boxShadow="highRaised"
        >
          <RazorSenseComponent
            mode={mode}
            assetsPath="/assets/spark"
            width="100%"
            height="100%"
            modeTransitionDuration={1}
          />
          <ModePicker mode={mode} modes={RAZOR_SENSE_EMOTIONAL_MODES} onChange={setMode} />
        </Box>
        <Text size="medium" color="surface.text.gray.muted" marginTop="spacing.5">
          {RAZOR_SENSE_MODE_LABELS[mode]} — move the pointer through the field after four seconds to
          feel the surface respond.
        </Text>
      </Box>
    </Box>
  );
};

const CROSS_FAMILY_MODES = ['neutral', 'calm', 'thinking', 'joyful'] as const;

export const CrossFamilyTransitions: StoryFn<typeof RazorSenseComponent> = () => {
  const [mode, setMode] = useState<RazorSenseMode>('neutral');

  return (
    <Box minHeight="100vh" backgroundColor="surface.background.gray.subtle" padding="spacing.10">
      <Box maxWidth="1120px" marginX="auto">
        <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
          OPERATIONAL ↔ EMOTIONAL HANDOFF
        </Text>
        <Heading size="2xlarge" marginBottom="spacing.8">
          One continuous material surface.
        </Heading>
        <Box
          position="relative"
          width="100%"
          height="440px"
          borderRadius="large"
          overflow="hidden"
          boxShadow="highRaised"
        >
          <RazorSenseComponent
            mode={mode}
            assetsPath="/assets/spark"
            width="100%"
            height="100%"
            modeTransitionDuration={0.8}
          />
          <ModePicker mode={mode} modes={CROSS_FAMILY_MODES} onChange={setMode} />
        </Box>
      </Box>
    </Box>
  );
};

export const DarkModeSystem: StoryFn<typeof RazorSenseComponent> = () => {
  const [mode, setMode] = useState<RazorSenseMode>('neutral');

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <Box minHeight="100vh" backgroundColor="surface.background.gray.intense" padding="spacing.10">
        <Box maxWidth="1240px" marginX="auto">
          <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.2">
            RAZORSENSE · DARK MATERIAL SYSTEM
          </Text>
          <Heading size="2xlarge" marginBottom="spacing.3">
            Emissive glass on a charcoal stage.
          </Heading>
          <Text
            size="medium"
            color="surface.text.gray.muted"
            marginBottom="spacing.8"
            maxWidth="760px"
          >
            The nearest BladeProvider owns the appearance. Dark programs widen the aperture,
            separate silver refraction from the chromatic core, and protect the charcoal negative
            space.
          </Text>
          <Box
            position="relative"
            width="100%"
            height="440px"
            borderRadius="large"
            overflow="hidden"
            boxShadow="highRaised"
          >
            <RazorSenseComponent
              mode={mode}
              assetsPath="/assets/spark"
              width="100%"
              height="100%"
              modeTransitionDuration={0.8}
            />
            <ModePicker
              mode={mode}
              modes={RAZOR_SENSE_MODES}
              onChange={setMode}
              colorScheme="dark"
            />
          </Box>
          <Text size="medium" color="surface.text.gray.muted" marginTop="spacing.5">
            {RAZOR_SENSE_MODE_LABELS[mode]} · switch across operational and emotional programs
            without leaving the dark material.
          </Text>
        </Box>
      </Box>
    </BladeProvider>
  );
};

export const DarkApplication: StoryFn<typeof RazorSenseComponent> = () => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
    <BaseBox minHeight="100vh" padding="spacing.6" backgroundColor="#02020B">
      <BaseBox
        position="relative"
        maxWidth="1280px"
        height="calc(100vh - 48px)"
        minHeight="640px"
        marginX="auto"
        overflow="hidden"
        borderRadius="large"
        backgroundColor="#16181B"
        border="1px solid rgba(255,255,255,0.08)"
      >
        <BaseBox
          height="64px"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          paddingX="spacing.6"
          position="relative"
          zIndex={3}
          backgroundColor="rgba(5, 6, 10, 0.96)"
          borderBottom="1px solid #292B2D"
        >
          <Box display="flex" alignItems="center" gap="spacing.7">
            <Text size="large" weight="bold" color="surface.text.staticWhite.normal">
              Razorpay
            </Text>
            <Text size="small" weight="semibold" color="feedback.text.positive.intense">
              ✣ Ray AI
            </Text>
            <Text size="small" color="surface.text.gray.muted">
              Payments
            </Text>
            <Text size="small" color="surface.text.gray.muted">
              Banking+
            </Text>
          </Box>
          <BaseBox
            paddingX="spacing.4"
            paddingY="spacing.3"
            borderRadius="medium"
            backgroundColor="#242729"
            border="1px solid #3A3D40"
          >
            <Text size="small" color="surface.text.gray.muted">
              Search in payments
            </Text>
          </BaseBox>
        </BaseBox>

        <Box position="absolute" top="64px" right="0px" bottom="0px" left="0px">
          {/* No mode prop: this is the normal/default authored Neutral path in dark appearance. */}
          <RazorSenseComponent
            assetsPath="/assets/spark"
            width="100%"
            height="100%"
            modeTransitionDuration={0.8}
          />
        </Box>

        <BaseBox
          position="absolute"
          top="64px"
          bottom="0px"
          left="0px"
          width="64px"
          zIndex={2}
          backgroundColor="rgba(31,33,35,0.94)"
          borderRight="1px solid #383A3C"
        />

        <Box
          position="relative"
          zIndex={2}
          marginLeft="64px"
          height="calc(100% - 64px)"
          display="flex"
          flexDirection="column"
          alignItems="center"
          paddingTop="spacing.10"
        >
          <Text size="large" color="surface.text.gray.muted" marginBottom="spacing.2">
            Hello, Niharika
          </Text>
          <Heading size="2xlarge" color="surface.text.staticWhite.normal">
            What can I do for you today?
          </Heading>

          <BaseBox
            width="60%"
            minWidth="620px"
            marginTop="spacing.7"
            padding="spacing.5"
            borderRadius="large"
            backgroundColor="rgba(35,39,40,0.97)"
            border="1px solid rgba(255,255,255,0.14)"
            elevation="highRaised"
          >
            <Text size="medium" color="surface.text.gray.muted">
              Ask Ray anything related to Razorpay
            </Text>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              marginTop="spacing.7"
            >
              <Text size="small" color="surface.text.staticWhite.normal">
                + Upload file
              </Text>
              <BaseBox
                width="36px"
                height="36px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="medium"
                backgroundColor="#17427D"
              >
                <Text color="surface.text.staticWhite.normal">↑</Text>
              </BaseBox>
            </Box>
          </BaseBox>

          <Box display="flex" gap="spacing.3" marginTop="spacing.4">
            {['Payments', 'Settlements', 'Manage Account', 'Support'].map((label) => (
              <BaseBox
                key={label}
                paddingX="spacing.4"
                paddingY="spacing.2"
                borderRadius="medium"
                backgroundColor="rgba(35,39,40,0.95)"
                border="1px solid #45484A"
              >
                <Text size="small" color="surface.text.staticWhite.normal">
                  {label}
                </Text>
              </BaseBox>
            ))}
          </Box>

          <Box
            width="78%"
            display="grid"
            gridTemplateColumns="repeat(3, 1fr)"
            gap="spacing.4"
            marginTop="spacing.10"
          >
            {[
              ['International Payments', 'Payments in 160+ currencies are now enabled'],
              ['Collected Payments', '₹5.6L'],
              ['Settlement', '₹3.26L'],
            ].map(([label, value]) => (
              <BaseBox
                key={label}
                minHeight="124px"
                padding="spacing.5"
                borderRadius="large"
                backgroundColor="rgba(35,39,40,0.95)"
                border="1px solid #383B3D"
              >
                <Text size="small" color="surface.text.gray.muted" marginBottom="spacing.3">
                  {label}
                </Text>
                <Text size="large" weight="semibold" color="surface.text.staticWhite.normal">
                  {value}
                </Text>
              </BaseBox>
            ))}
          </Box>
        </Box>
      </BaseBox>
    </BaseBox>
  </BladeProvider>
);

const AppearanceTransitionSurface = (): ReactElement => {
  const { colorScheme, setColorScheme } = useTheme();
  const [mode, setMode] = useState<RazorSenseMode>('neutral');

  return (
    <Box minHeight="100vh" padding="spacing.8" backgroundColor="surface.background.gray.intense">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="spacing.6"
      >
        <Heading size="xlarge">Appearance transition probe</Heading>
        <button
          type="button"
          onClick={() => setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')}
          style={{
            minWidth: 156,
            height: 44,
            borderRadius: 999,
            border: '1px solid rgba(128,128,128,0.5)',
            background: colorScheme === 'dark' ? '#25292D' : '#FFFFFF',
            color: colorScheme === 'dark' ? '#FFFFFF' : '#17181A',
            cursor: 'pointer',
          }}
        >
          Switch to {colorScheme === 'dark' ? 'light' : 'dark'}
        </button>
      </Box>
      <Box position="relative" height="440px" overflow="hidden" borderRadius="large">
        <RazorSenseComponent
          mode={mode}
          assetsPath="/assets/spark"
          width="100%"
          height="100%"
          modeTransitionDuration={0.8}
        />
        <ModePicker
          mode={mode}
          modes={['neutral', 'typing', 'thinking', 'loading', 'calm']}
          onChange={setMode}
          colorScheme={colorScheme}
        />
      </Box>
    </Box>
  );
};

export const AppearanceTransition: StoryFn<typeof RazorSenseComponent> = () => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    <AppearanceTransitionSurface />
  </BladeProvider>
);

export const FourModes: StoryFn<typeof RazorSenseComponent> = () => (
  <Box backgroundColor="surface.background.gray.subtle" padding="spacing.8">
    <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="spacing.5">
      {RAZOR_SENSE_EMOTIONAL_MODES.map((mode) => (
        <Box key={mode}>
          <Text size="small" weight="semibold" marginBottom="spacing.2">
            {RAZOR_SENSE_MODE_LABELS[mode]}
          </Text>
          <Box position="relative" width="100%" height="220px" overflow="hidden">
            <RazorSenseComponent
              mode={mode}
              assetsPath="/assets/spark"
              width="100%"
              height="100%"
              isInteractive={false}
            />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

const REPRESENTATIVE_MODE_TIMES: Record<RazorSenseEmotionalMode, number> = {
  calm: 1.24,
  joyful: 0.49,
  caution: 0.61,
  regret: 0.98,
};

export const PhaseCalibration: StoryFn<typeof RazorSenseComponent> = () => (
  <Box backgroundColor="surface.background.gray.subtle" padding="spacing.8">
    <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="spacing.5">
      {RAZOR_SENSE_EMOTIONAL_MODES.map((mode) => (
        <Box key={mode}>
          <Text size="small" weight="semibold" marginBottom="spacing.2">
            {RAZOR_SENSE_MODE_LABELS[mode]} · locked at 25%
          </Text>
          <Box position="relative" width="100%" height="220px" overflow="hidden">
            <RazorSenseComponent
              mode={mode}
              assetsPath="/assets/spark"
              width="100%"
              height="100%"
              isPaused
              startTime={REPRESENTATIVE_MODE_TIMES[mode]}
              isInteractive={false}
            />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export const InteractionCalibration: StoryFn<typeof RazorSenseComponent> = () => (
  <Box
    minHeight="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    backgroundColor="surface.background.gray.subtle"
    padding="spacing.10"
  >
    <Box width="100%" maxWidth="1120px">
      <Text size="small" weight="semibold" marginBottom="spacing.2">
        CALM · MOTION LOCKED · POINTER ACTIVE AFTER FOUR SECONDS
      </Text>
      <Box position="relative" width="100%" height="361px" overflow="hidden" borderRadius="large">
        <RazorSenseComponent
          mode="calm"
          assetsPath="/assets/spark"
          width="100%"
          height="100%"
          isPaused
          startTime={REPRESENTATIVE_MODE_TIMES.calm}
        />
      </Box>
    </Box>
  </Box>
);

export const OperationalStates: StoryFn<typeof RazorSenseComponent> = () => (
  <Box backgroundColor="surface.background.gray.subtle" padding="spacing.8">
    <Box marginBottom="spacing.7">
      <Text size="small" weight="semibold" color="surface.text.gray.muted">
        AUTHORED NEUTRAL STATES
      </Text>
      <Heading size="2xlarge" marginTop="spacing.2">
        One glass language, four product rhythms.
      </Heading>
    </Box>
    <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="spacing.5">
      {RAZOR_SENSE_OPERATIONAL_MODES.map((mode) => (
        <Box key={mode}>
          <Text size="small" weight="semibold" marginBottom="spacing.2">
            {RAZOR_SENSE_MODE_LABELS[mode]}
          </Text>
          <Box
            position="relative"
            width="100%"
            height="280px"
            overflow="hidden"
            borderRadius="large"
          >
            <RazorSenseComponent
              mode={mode}
              assetsPath="/assets/spark"
              width="100%"
              height="100%"
              isInteractive={false}
            />
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export const ThinkingLifecycle: StoryFn<typeof RazorSenseComponent> = () => {
  const [paused, setPaused] = useState(false);

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="surface.background.gray.subtle"
      padding="spacing.10"
    >
      <Box position="relative" width="100%" maxWidth="1120px" height="440px" overflow="hidden">
        <RazorSenseComponent
          mode="thinking"
          assetsPath="/assets/spark"
          width="100%"
          height="100%"
          isPaused={paused}
        />
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            minWidth: 112,
            height: 44,
            padding: '0 20px',
            border: '1px solid rgba(255,255,255,0.62)',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.82)',
            color: '#17181A',
            font: '500 14px/1 Inter, sans-serif',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          {paused ? 'Resume Thinking' : 'Pause Thinking'}
        </button>
      </Box>
    </Box>
  );
};

const AGENT_COPY: Record<
  RazorSenseEmotionalMode,
  { eyebrow: string; title: string; steps: [string, string, string]; response: string }
> = {
  calm: {
    eyebrow: 'Working quietly',
    title: 'Understanding your request',
    steps: ['Reading account context', 'Checking recent activity', 'Preparing a response'],
    response: 'I’m gathering the details now. You can keep working while I do this.',
  },
  joyful: {
    eyebrow: 'Completed',
    title: 'Your workflow is ready',
    steps: ['Connected your account', 'Created the workflow', 'Ran a successful check'],
    response: 'Everything is set up and working. Your first run completed successfully.',
  },
  caution: {
    eyebrow: 'Needs a quick review',
    title: 'One detail needs attention',
    steps: [
      'Checked your configuration',
      'Found a permission mismatch',
      'Paused before publishing',
    ],
    response:
      'Review the highlighted permission before you continue. Nothing has been changed yet.',
  },
  regret: {
    eyebrow: 'Couldn’t complete',
    title: 'The request didn’t go through',
    steps: [
      'Started the request',
      'Lost the service connection',
      'Kept your existing setup unchanged',
    ],
    response: 'I couldn’t finish this safely. Your current setup is intact, and you can try again.',
  },
};

const AGENT_MODE_START_TIMES: Record<RazorSenseEmotionalMode, number> = {
  calm: 0,
  joyful: 0.8,
  caution: 0.8,
  regret: 1.4,
};

export const AgentResponse: StoryFn<typeof RazorSenseComponent> = () => {
  const [mode, setMode] = useState<RazorSenseEmotionalMode>('joyful');
  const copy = AGENT_COPY[mode];

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 48,
        background: '#F1F3F5',
        color: '#17181A',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div style={{ width: 960, maxWidth: '100%', margin: '0 auto' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <div
              style={{ color: '#62686D', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em' }}
            >
              PRODUCT APPLICATION
            </div>
            <div style={{ marginTop: 6, fontSize: 24, fontWeight: 650 }}>
              Agent response surface
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4 }}>
            {RAZOR_SENSE_EMOTIONAL_MODES.map((candidate) => (
              <button
                key={candidate}
                type="button"
                aria-pressed={mode === candidate}
                onClick={() => setMode(candidate)}
                style={{
                  height: 36,
                  padding: '0 16px',
                  border: '1px solid #D8DCDF',
                  borderRadius: 999,
                  background: mode === candidate ? '#17181A' : '#FFFFFF',
                  color: mode === candidate ? '#FFFFFF' : '#30363B',
                  font: '500 13px/1 Inter, sans-serif',
                  cursor: 'pointer',
                }}
              >
                {RAZOR_SENSE_MODE_LABELS[candidate]}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            position: 'relative',
            height: 560,
            overflow: 'hidden',
            border: '1px solid rgba(23, 24, 26, 0.08)',
            borderRadius: 20,
            background: '#FFFFFF',
            boxShadow: '0 18px 60px rgba(18, 24, 31, 0.10)',
          }}
        >
          <div style={{ position: 'absolute', inset: 0, opacity: mode === 'calm' ? 0.54 : 0.68 }}>
            <RazorSenseComponent
              mode={mode}
              assetsPath="/assets/spark"
              width="100%"
              height="100%"
              modeTransitionDuration={1}
              startTime={AGENT_MODE_START_TIMES[mode]}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.08))',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1, padding: 44 }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.66)',
                color: '#42484D',
                fontSize: 13,
                backdropFilter: 'blur(16px)',
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: 99, background: '#24C77B' }} />
              {copy.eyebrow}
            </div>
            <div style={{ width: 410, marginTop: 22 }}>
              <div style={{ fontSize: 34, fontWeight: 600, lineHeight: 1.08 }}>{copy.title}</div>
              <div style={{ marginTop: 24, display: 'grid', gap: 13 }}>
                {copy.steps.map((step, index) => (
                  <div
                    key={step}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14 }}
                  >
                    <span
                      style={{
                        display: 'grid',
                        width: 22,
                        height: 22,
                        placeItems: 'center',
                        borderRadius: 99,
                        background: index === 2 ? '#24C77B' : 'rgba(255,255,255,0.64)',
                        color: index === 2 ? '#FFFFFF' : '#4D555B',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {index + 1}
                    </span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              right: 28,
              bottom: 28,
              left: 28,
              zIndex: 2,
              padding: '18px 20px',
              border: '1px solid rgba(23,24,26,0.08)',
              borderRadius: 16,
              background: 'rgba(255,255,255,0.84)',
              boxShadow: '0 10px 36px rgba(18,24,31,0.10)',
              fontSize: 14,
              lineHeight: 1.5,
              backdropFilter: 'blur(18px)',
            }}
          >
            {copy.response}
          </div>
        </div>
      </div>
    </div>
  );
};

export const MobileReference: StoryFn<typeof RazorSenseComponent> = () => {
  const [mode, setMode] = useState<RazorSenseEmotionalMode>('calm');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#EEF1F4',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 360,
          height: 484,
          overflow: 'hidden',
          borderRadius: 24,
        }}
      >
        <MobileRazorSenseMood mode={mode} assetsPath="/assets/spark" width="360px" height="484px" />
        <div
          style={{
            position: 'absolute',
            top: 215,
            left: 13,
            display: 'flex',
            width: 334,
            height: 53,
            alignItems: 'center',
            justifyContent: 'space-around',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.30)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {RAZOR_SENSE_EMOTIONAL_MODES.map((candidate) => (
            <button
              key={candidate}
              type="button"
              aria-pressed={mode === candidate}
              onClick={() => setMode(candidate)}
              style={{
                width: 78,
                height: 42,
                border:
                  mode === candidate
                    ? '1.331px solid rgba(255,255,255,0.95)'
                    : '1.331px solid transparent',
                borderRadius: 999,
                background: mode === candidate ? 'rgba(255,255,255,0.85)' : 'transparent',
                color: '#17181A',
                opacity: mode === candidate ? 1 : 0.5,
                font: '500 12px/1 Inter, sans-serif',
                cursor: 'pointer',
                transition: '250ms ease opacity, 300ms ease background, 300ms ease border-color',
              }}
            >
              {RAZOR_SENSE_MODE_LABELS[candidate]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DarkMobileReference: StoryFn<typeof RazorSenseComponent> = () => {
  const [mode, setMode] = useState<RazorSenseEmotionalMode>('calm');

  return (
    <BladeProvider themeTokens={bladeTheme} colorScheme="dark">
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#16181B',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: 360,
            height: 484,
            overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 24,
            boxShadow: '0 24px 80px rgba(0,0,0,0.42)',
          }}
        >
          <MobileRazorSenseMood
            mode={mode}
            assetsPath="/assets/spark"
            width="360px"
            height="484px"
          />
          <div
            style={{
              position: 'absolute',
              top: 215,
              left: 13,
              display: 'flex',
              width: 334,
              height: 53,
              alignItems: 'center',
              justifyContent: 'space-around',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 999,
              background: 'rgba(8,12,18,0.48)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {RAZOR_SENSE_EMOTIONAL_MODES.map((candidate) => (
              <button
                key={candidate}
                type="button"
                aria-pressed={mode === candidate}
                onClick={() => setMode(candidate)}
                style={{
                  width: 78,
                  height: 42,
                  border:
                    mode === candidate
                      ? '1.331px solid rgba(255,255,255,0.74)'
                      : '1.331px solid transparent',
                  borderRadius: 999,
                  background: mode === candidate ? 'rgba(35,45,62,0.84)' : 'transparent',
                  color: '#F7F8FA',
                  opacity: mode === candidate ? 1 : 0.62,
                  font: '500 12px/1 Inter, sans-serif',
                  cursor: 'pointer',
                  transition: '250ms ease opacity, 300ms ease background, 300ms ease border-color',
                }}
              >
                {RAZOR_SENSE_MODE_LABELS[candidate]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </BladeProvider>
  );
};
