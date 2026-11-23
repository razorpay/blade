import type { StoryFn, Meta } from '@storybook/react-vite';
import { Source } from '@storybook/addon-docs/blocks';
import React, { useEffect, useRef, useState } from 'react';
import type { RayProps, RayState, RayIdle, RayOutcome } from '../Ray';
import { Ray } from '../Ray';
import type { Cycle } from '../Ray/rayIdles';
import { idleAt, idleChances, IDLE_CYCLE } from '../Ray/rayIdles';
import StoryPageWrapper from '~utils/storybook/StoryPageWrapper';
import { getStyledPropsArgTypes } from '~components/Box/BaseBox/storybookArgTypes';
import { Box } from '~components/Box';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';
import { Button } from '~components/Button';
import { ChatInput } from '~components/ChatInput';
import { Heading, Text } from '~components/Typography';

// (not a live Sandbox: those run the published package, and Ray isn't in it yet)
const USAGE = `import { Box, ChatInput, Ray } from '@razorpay/blade/components';

function Chat({ isAnswering, step, isDone }) {
  const inputRef = React.useRef(null);
  return (
    <>
      {/* the answer's row: its states, at rest between them, dropping out when it's done (and the row closes up) */}
      <Ray state={step} idle="rest" isVisible={!isDone} shouldUnmountWhenHidden shouldReactToPointer={false} />

      {/* on the chat input: he sits above it, watches what's typed, hops off while it's answering */}
      <Box position="relative">
        <Box position="absolute" bottom="100%" right="spacing.10" zIndex={2}>
          <Ray idle="rotate" watchedInputRef={inputRef} isVisible={!isAnswering} />
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
    watchedInputRef: { table: { disable: true } },
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
        <Ray {...rayProps} watchedInputRef={inputRef} />
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
  shouldReactToPointer: true,
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
 * answer's done (the last state plays its exit and he rests there, `idle="rest"`); `isVisible={false}` drops him out of the row,
 * and with `shouldUnmountWhenHidden` his box goes too once he's out, so the label moves up into his place.
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
AnswerRow.args = {
  state: 'searching',
  idle: 'rest',
  isVisible: true,
  shouldUnmountWhenHidden: false,
  shouldReactToPointer: false,
};
AnswerRow.parameters = {
  controls: { include: ['state', 'isVisible', 'shouldUnmountWhenHidden'] },
};

/**
 * The dashboard's answer, as flow 10.5 plays it: asked, he hops off the chat input; the answer's Ray comes up out of its row and
 * plays Searching -> Calling -> Writing -> Working (each handing over mid-move). As it's done he drops out of the row as soon as
 * his laptop is put away, and the moment he's out of sight he comes back up onto the chat input and plays Success
 * (`outcome="success"`, cleared by the next question). Type a question and press Enter.
 */
const STEPS: [RayState, number][] = [
  ['searching', 3800],
  ['calling', 3200],
  ['writing', 1200],
  ['working', 3600],
];

// flow 10.5's timing (measured there): the answer's Ray comes up out of his row about half a second after the chat box's is out of
// sight (out at 467 ms); and as the answer's done he's out of sight about a second later (his laptop put away 600 ms into its exit,
// his exit cut there, then about 350 ms down at the answer row's 1.7x), when the chat box's comes back up at once
const ROW_IN_MS = 950;
const BACK_MS = 1000;

const DashboardFlowTemplate: StoryFn<typeof Ray> = () => {
  const [asking, setAsking] = useState(false);
  const [outcome, setOutcome] = useState<RayOutcome | undefined>(undefined);
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
    setOutcome(undefined); // (the next question clears the last one's)
    setAsking(true); // he hops off the input
    const later = (ms: number, fn: () => void): void => {
      timers.current.push(setTimeout(fn, ms));
    };
    let at = ROW_IN_MS; // the answer's row comes in after the hop, and he comes up out of it
    later(at, () => {
      setRowState('searching');
      setRowHidden(false);
      setRowOn(true);
    });
    STEPS.forEach(([s, hold], i) => {
      if (i > 0) later(at, () => setRowState(s));
      at += hold + 250;
    });
    later(at, () => {
      setRowState('idle'); // done: his film's exit, cut once its prop is away,
      setRowHidden(true); // and he drops out of the row from there
    });
    later(at + BACK_MS, () => {
      setRowOn(false);
      setAsking(false); // the moment he's out of sight he comes back up onto the input,
      setOutcome('success'); // and plays Success on his seat
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
            <Ray state={rowState} idle="rest" isVisible={!rowHidden} shouldReactToPointer={false} />
            <Text size="small" color="surface.text.gray.muted">
              {LABELS[rowState]}
            </Text>
          </Box>
        ) : null}
      </Box>
      <OnChatInput rayProps={{ idle: 'rotate', isVisible: !asking, outcome }} onSubmit={ask} />
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

/**
 * A made-up voice for the mic: a quiet buzz shaped into syllables, phrases and pauses, as a MediaStream (what a page's own mic
 * would hand him). Nothing is played out loud, and no real mic is opened.
 */
const makeVoice = (): { stream: MediaStream; stop: () => void } | null => {
  const Context: typeof AudioContext | undefined =
    window.AudioContext ??
    ((window as unknown) as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Context) return null;
  const ctx = new Context();
  const out = ctx.createMediaStreamDestination();
  const buzz = ctx.createOscillator();
  const gain = ctx.createGain();
  buzz.type = 'sawtooth';
  buzz.frequency.value = 140;
  gain.gain.value = 0;
  buzz.connect(gain).connect(out);
  buzz.start();
  let at = ctx.currentTime + 0.4;
  const plan = (): void => {
    // phrases of 4–9 syllables (120–260 ms each, 60–140 ms apart), a pause of 0.6–1.4 s between them, planned a few seconds ahead
    while (at < ctx.currentTime + 4) {
      const syllables = 4 + Math.floor(Math.random() * 6);
      for (let i = 0; i < syllables; i++) {
        const on = 0.12 + Math.random() * 0.14;
        gain.gain.setTargetAtTime(0.1 + Math.random() * 0.1, at, 0.02);
        buzz.frequency.setTargetAtTime(120 + Math.random() * 60, at, 0.05);
        gain.gain.setTargetAtTime(0, at + on, 0.03);
        at += on + 0.06 + Math.random() * 0.08;
      }
      at += 0.6 + Math.random() * 0.8;
    }
  };
  plan();
  const timer = window.setInterval(plan, 1000);
  return {
    stream: out.stream,
    stop: () => {
      window.clearInterval(timer);
      buzz.stop();
      ctx.close().catch(() => undefined);
    },
  };
};

/** An outcome that can be played again: cleared, then set again a moment later (Ray plays it each time it's set). */
const useReplay = (outcome: RayOutcome): [RayOutcome | undefined, () => void] => {
  const [value, setValue] = useState<RayOutcome | undefined>(outcome);
  const play = (): void => {
    setValue(undefined);
    window.setTimeout(() => setValue(outcome), 50);
  };
  return [value, play];
};

const StateColumn = ({
  name,
  children,
  control,
}: {
  name: string;
  children: React.ReactElement;
  control?: React.ReactElement;
}): React.ReactElement => (
  <Box
    width="200px"
    display="flex"
    flexDirection="column"
    alignItems="center"
    gap="spacing.4"
    paddingTop="spacing.11"
  >
    {children}
    <Text size="small" color="surface.text.gray.muted">
      {name}
    </Text>
    <Box minHeight="32px">{control}</Box>
  </Box>
);

const StatesRow = (): React.ReactElement => {
  const { colorScheme } = useTheme();
  const [success, playSuccess] = useReplay('success');
  const [error, playError] = useReplay('error');
  const [isOffline, setIsOffline] = useState(false);
  const [voice, setVoice] = useState<{ stream: MediaStream; stop: () => void } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const voiceRef = useRef(voice);
  voiceRef.current = voice;
  useEffect(() => () => voiceRef.current?.stop(), []);
  const toggleMic = (): void => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    if (!voice) setVoice(makeVoice()); // (made on the click: a page's audio starts with a gesture)
    setIsListening(true);
  };
  return (
    <Box
      padding="spacing.10"
      display="flex"
      flexWrap="wrap"
      gap="spacing.9"
      alignItems="flex-end"
      backgroundColor="surface.background.gray.intense"
      borderRadius="medium"
    >
      <StateColumn name="Base (rest)">
        <Ray idle="rest" />
      </StateColumn>
      <StateColumn
        name="Success"
        control={
          <Button size="small" variant="secondary" onClick={playSuccess}>
            Play again
          </Button>
        }
      >
        <Ray idle="rest" outcome={success} />
      </StateColumn>
      <StateColumn
        name="Error"
        control={
          <Button size="small" variant="secondary" onClick={playError}>
            Play again
          </Button>
        }
      >
        <Ray idle="rest" outcome={error} />
      </StateColumn>
      <StateColumn
        name="Offline"
        control={
          <Button size="small" variant="secondary" onClick={() => setIsOffline((v) => !v)}>
            {isOffline ? 'Back online' : 'Go offline'}
          </Button>
        }
      >
        <Ray idle="rest" isOffline={isOffline} />
      </StateColumn>
      <StateColumn
        name={colorScheme === 'dark' ? 'Mic (dark colours)' : 'Mic'}
        control={
          <Button size="small" variant="secondary" onClick={toggleMic}>
            {isListening ? 'Stop' : 'Start'}
          </Button>
        }
      >
        <Ray idle="rest" isListening={isListening} voiceStream={voice?.stream} />
      </StateColumn>
    </Box>
  );
};

/**
 * Every state that isn't an answer's, side by side: his base (rest); `outcome="success"` and `outcome="error"`, played once each time
 * they're set (Play again clears and sets them); `isOffline` (Go offline / Back online); and `isListening` with a `voiceStream`,
 * here a made-up voice (Start / Stop). The light / dark switch is here, not in the toolbar, so switching doesn't start them over.
 */
// the story's own light / dark: its provider's setColorScheme, which themes it again in place (a new `colorScheme` prop wouldn't:
// it's the provider's first scheme, and the toolbar's switch mounts every story again)
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

const StatesTemplate: StoryFn<typeof Ray> = () => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    <Box padding="spacing.8" display="flex" flexDirection="column" gap="spacing.6">
      <Box>
        <SchemeSwitch />
      </Box>
      <StatesRow />
    </Box>
  </BladeProvider>
);

export const States = StatesTemplate.bind({});
States.storyName = 'States';
States.parameters = { controls: { disable: true } };
