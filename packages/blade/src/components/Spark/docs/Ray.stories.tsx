import type { StoryFn, Meta } from '@storybook/react-vite';
import { Source } from '@storybook/addon-docs/blocks';
import React, { useEffect, useRef, useState } from 'react';
import type { RayProps, RayState, RayIdle } from '../Ray';
import { Ray } from '../Ray';
import type { Cycle } from '../Ray/rayIdles';
import { idleAt, idleChances, IDLE_CYCLE } from '../Ray/rayIdles';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ChatInput } from '~components/ChatInput';
import { Heading, Text } from '~components/Typography';

// (not a live Sandbox: those run the published package, and Ray isn't in it yet)
const USAGE = `import { Box, ChatInput, Ray } from '@razorpay/blade/components';

function Chat({ isAnswering, step, isDone }) {
  const inputRef = React.useRef(null);
  return (
    <>
      {/* the answer's row: its states, at rest between them, dropping out when it's done */}
      <Ray state={step} idle="rest" isVisible={!isDone} isInteractive={false} />

      {/* on the chat input: he sits above it, watches what's typed, hops off while it's answering */}
      <Box position="relative">
        <Box position="absolute" bottom="100%" right="spacing.10" zIndex={2}>
          <Ray idle="rotate" inputRef={inputRef} isVisible={!isAnswering} />
        </Box>
        <ChatInput ref={inputRef} placeholder="Ask Ray anything…" />
      </Box>
    </>
  );
}`;

const Page = (): React.ReactElement => (
  <StoryPageWrapper
    componentName="Ray"
    componentDescription="Ray, Razorpay's AI mascot. On the chat input he idles, watches what's typed, looks at the pointer and flips a coin when clicked; when a question is sent he hops off, and a second Ray in the answer's row plays its states (searching, calling, writing, working) until the answer is done."
    apiDecisionComponentName="Spark/Ray"
  >
    <Heading size="large">Usage</Heading>
    <Source code={USAGE} language="tsx" dark />
  </StoryPageWrapper>
);

export default {
  title: 'Components/Ray',
  component: Ray,
  tags: ['autodocs'],
  argTypes: {
    entrance: { control: 'radio', options: ['none', 'dash'] },
    state: { control: 'select', options: ['idle', 'searching', 'calling', 'writing', 'working'] },
    idle: {
      control: 'select',
      options: ['rotate', 'rest', 'coffee', 'look', 'cash', 'reading', 'sleep', 'time-of-day'],
    },
    size: { control: 'radio', options: ['small', 'medium'] },
    inputRef: { table: { disable: true } },
    ...getStyledPropsArgTypes(),
  },
  parameters: { docs: { page: Page } },
} as Meta<RayProps>;

/** Ray on the chat input's top edge, near its right end, as on the dashboard. He sits above it; what goes below his floor goes behind it. */
const OnChatInput = ({
  rayProps,
  onSubmit,
}: {
  rayProps: RayProps;
  onSubmit?: (value: string) => void;
}): React.ReactElement => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState('');
  return (
    <Box position="relative" width="100%" maxWidth="720px" marginTop="spacing.11">
      <Box position="absolute" bottom="100%" right="spacing.10" zIndex={2}>
        <Ray {...rayProps} inputRef={inputRef} />
      </Box>
      <Box position="relative" zIndex={1}>
        <ChatInput
          ref={inputRef}
          value={value}
          onChange={({ value: v }) => setValue(v ?? '')}
          onSubmit={({ value: v }) => {
            onSubmit?.(v);
            setValue('');
          }}
          placeholder="Ask Ray anything…"
        />
      </Box>
    </Box>
  );
};

const NAMES: Record<Cycle, string> = {
  coffee: 'Coffee',
  look: 'Look around',
  cash: 'Cash',
  reading: 'Reading box',
  sleep: 'Nightcap',
};
const clock = (hour: number): string =>
  `${hour % 12 === 0 ? 12 : hour % 12} ${hour < 12 ? 'am' : 'pm'}`;
const odds = (hour: number): string =>
  IDLE_CYCLE.map((i) => `${NAMES[i]} ${Math.round(idleChances(hour)[i] * 100)}%`).join(' · ');
const NOW = -1; // the `hour` control's "now": the real clock

/**
 * The Ray on the chat input: his idle, the typing look, the hover look, the coin flip, and the hop off (`isVisible={false}`, what
 * he does when a question is sent). The answer states aren't here: on the dashboard the Ray on the input hides while a
 * separate Ray in the answer's row plays them (see Answer row).
 *
 * `idle: time-of-day` picks his idle by the clock (the nightcap only and likeliest 9pm–6am, never Coffee then; Coffee likeliest
 * 7–10am). With it the `hour` control appears: Now is the real clock; another hour shows what he'd get then, by the same rules.
 */
const OnChatBoxTemplate: StoryFn<RayProps & { hour?: number }> = ({ hour = NOW, ...args }) => {
  const byClock = args.idle === 'time-of-day';
  const pretend = byClock && hour !== NOW;
  const [pick, setPick] = useState<{ hour: number; idle: Cycle } | null>(null);
  const current = pretend && pick?.hour === hour ? pick : null;
  if (pretend && !current) setPick({ hour, idle: idleAt(hour, Math.random, pick?.idle) }); // another hour: his pick for it
  const idle = pretend ? current?.idle ?? 'rest' : args.idle;
  return (
    <Box
      padding="spacing.10"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="spacing.6"
    >
      <OnChatInput rayProps={{ ...args, idle }} />
      <Text size="small" color="surface.text.gray.muted">
        Type to see him watch the caret. Move the pointer anywhere: he looks at it. Click him for a
        coin flip (click again while it&apos;s up for another).
      </Text>
      {byClock ? (
        <Box display="flex" flexDirection="column" alignItems="center" gap="spacing.3">
          <Text size="small">
            {current
              ? `At ${clock(hour)} he got ${NAMES[current.idle]}. The odds then: ${odds(hour)}`
              : `By your clock (${clock(new Date().getHours())}): ${odds(new Date().getHours())}`}
          </Text>
          {current ? (
            <Button
              size="small"
              variant="secondary"
              onClick={() => setPick({ hour, idle: idleAt(hour, Math.random, current.idle) })}
            >
              Pick again
            </Button>
          ) : null}
        </Box>
      ) : null}
    </Box>
  );
};

export const OnChatBox = OnChatBoxTemplate.bind({});
OnChatBox.storyName = 'On the chat box';
OnChatBox.args = {
  idle: 'rotate',
  size: 'medium',
  isVisible: true,
  isInteractive: true,
  hour: NOW,
};
OnChatBox.argTypes = {
  hour: {
    description: "Pretend it's this hour (for `idle: time-of-day`). Now uses the real clock.",
    options: [NOW, ...Array.from({ length: 24 }, (_, h) => h)],
    control: {
      type: 'select',
      labels: Object.fromEntries([
        [NOW, 'Now (your clock)'],
        ...Array.from({ length: 24 }, (_, h) => [h, clock(h)]),
      ]),
    },
    if: { arg: 'idle', eq: 'time-of-day' },
  },
};
OnChatBox.parameters = { controls: { exclude: ['state'] } };

/**
 * The landing: `entrance="dash"`. As he first appears he dashes in along the chat input from 200px inside its left edge, loads up,
 * brakes, hops into place and starts his idle. It plays once, when he mounts (Replay mounts him again); typing cuts it short.
 */
const LandingDashTemplate: StoryFn<typeof Ray> = (args) => {
  const [run, setRun] = useState(0);
  return (
    <Box
      padding="spacing.10"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="spacing.6"
    >
      <OnChatInput key={run} rayProps={{ ...args, entrance: 'dash' }} />
      <Button size="small" variant="secondary" onClick={() => setRun((r) => r + 1)}>
        Replay
      </Button>
    </Box>
  );
};

export const LandingDash = LandingDashTemplate.bind({});
LandingDash.storyName = 'Landing dash';
LandingDash.args = { idle: 'look', size: 'medium' };
LandingDash.parameters = { controls: { include: ['idle', 'size'] } };

const LABELS: Record<RayState, string> = {
  idle: 'Done',
  searching: 'Searching your settlements…',
  calling: 'Fetching your settlements…',
  writing: 'Writing a plan…',
  working: 'Putting things together',
};

/**
 * The Ray in an answer's row: `state` steps through the answer (each step handing over mid-move); `idle` back means the
 * answer's done (the last state plays its exit and he rests there, `idle="rest"`); `isVisible={false}` drops him out of the row.
 */
const AnswerRowTemplate: StoryFn<typeof Ray> = (args) => (
  <Box padding="spacing.10" paddingTop="spacing.11">
    <Box display="flex" alignItems="flex-end" gap="spacing.4" marginTop="spacing.8">
      <Ray {...args} />
      <Text size="small" color="surface.text.gray.muted">
        {LABELS[args.state ?? 'idle']}
      </Text>
    </Box>
  </Box>
);

export const AnswerRow = AnswerRowTemplate.bind({});
AnswerRow.storyName = 'Answer row';
AnswerRow.args = { state: 'searching', idle: 'rest', isVisible: true, isInteractive: false };
AnswerRow.parameters = { controls: { include: ['state', 'isVisible'] } };

/**
 * The dashboard's answer, as flow 9 plays it: asked, he hops off the chat input; the answer's row plays Searching ->
 * Calling -> Writing -> Working (each handing over mid-move), then its exit; he drops out of the row and comes back up
 * onto the chat input. Type a question and press Enter.
 */
const STEPS: [RayState, number][] = [
  ['searching', 3800],
  ['calling', 3200],
  ['writing', 1200],
  ['working', 3600],
];

const DashboardFlowTemplate: StoryFn<typeof Ray> = () => {
  const [asking, setAsking] = useState(false);
  const [rowState, setRowState] = useState<RayState>('idle');
  const [rowHidden, setRowHidden] = useState(true);
  const [rowOn, setRowOn] = useState(false);
  const [question, setQuestion] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const ask = (q: string): void => {
    if (asking || !q.trim()) return;
    timers.current.forEach(clearTimeout);
    setQuestion(q);
    setAsking(true); // he hops off the input
    const later = (ms: number, fn: () => void): void => {
      timers.current.push(setTimeout(fn, ms));
    };
    let at = 450; // the answer's row comes in after the hop, its first film bringing him in
    later(at, () => {
      setRowState('searching');
      setRowHidden(false);
      setRowOn(true);
    });
    STEPS.forEach(([s, hold], i) => {
      if (i > 0) later(at, () => setRowState(s));
      at += hold + 250;
    });
    later(at, () => setRowState('idle')); // the last film plays its whole exit, he rests ("Done")
    later(at + 2000, () => setRowHidden(true)); // he drops out of the row
    later(at + 2700, () => {
      setRowOn(false);
      setAsking(false); // and comes back up onto the input
    });
  };

  return (
    <Box
      padding="spacing.10"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="spacing.8"
    >
      <Box
        width="100%"
        maxWidth="720px"
        minHeight="160px"
        display="flex"
        flexDirection="column"
        gap="spacing.6"
      >
        {question ? (
          <Box
            alignSelf="flex-end"
            padding="spacing.4"
            borderRadius="medium"
            backgroundColor="surface.background.gray.moderate"
          >
            <Text>{question}</Text>
          </Box>
        ) : null}
        {rowOn ? (
          <Box display="flex" alignItems="flex-end" gap="spacing.4" marginTop="spacing.8">
            <Ray state={rowState} idle="rest" isVisible={!rowHidden} isInteractive={false} />
            <Text size="small" color="surface.text.gray.muted">
              {LABELS[rowState]}
            </Text>
          </Box>
        ) : null}
      </Box>
      <OnChatInput rayProps={{ idle: 'rotate', isVisible: !asking }} onSubmit={ask} />
    </Box>
  );
};

export const DashboardFlow = DashboardFlowTemplate.bind({});
DashboardFlow.storyName = 'Dashboard flow';
DashboardFlow.parameters = { controls: { disable: true } };

const IDLES: Exclude<RayIdle, 'rotate' | 'rest' | 'time-of-day'>[] = [
  'coffee',
  'look',
  'cash',
  'reading',
  'sleep',
];

/**
 * Every idle side by side. Each flips a coin when clicked: Look around and Cash at once; Reading box and Coffee first
 * finish what they're in the middle of (Coffee's sip and Cash's reload always play out first); Sleep wakes him first.
 */
const AllIdlesTemplate: StoryFn<typeof Ray> = () => (
  <Box padding="spacing.10" display="flex" flexWrap="wrap" gap="spacing.11" alignItems="flex-end">
    {IDLES.map((idle) => (
      <Box
        key={idle}
        width="220px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="spacing.4"
        paddingTop="spacing.10"
      >
        <Ray idle={idle} />
        <Text size="small" color="surface.text.gray.muted">
          {idle}
        </Text>
      </Box>
    ))}
  </Box>
);

export const AllIdles = AllIdlesTemplate.bind({});
AllIdles.storyName = 'All idles';
AllIdles.parameters = { controls: { disable: true } };
