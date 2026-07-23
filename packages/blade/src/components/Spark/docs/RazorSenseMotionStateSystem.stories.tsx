/* eslint-disable react/react-in-jsx-scope */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  RazorSense,
  RazorSenseSequence,
  defineRazorSenseSequence,
  razorSenseLoginToDashboardJourney,
  razorSenseThreePhaseLoadingJourney,
  useRazorSenseController,
} from '../';
import type {
  RazorSenseController,
  RazorSenseControllerEvent,
  RazorSenseControllerSnapshot,
  RazorSenseInterruptionPolicy,
  RazorSenseSequenceEvent,
  RazorSenseState,
  RazorSenseTransition,
} from '../';
import { Badge } from '~components/Badge';
import { BladeProvider, useTheme } from '~components/BladeProvider';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Card, CardBody } from '~components/Card';
import { TextInput } from '~components/Input/TextInput';
import { Heading, Text } from '~components/Typography';
import { bladeTheme } from '~tokens/theme';

const ASSETS_PATH = '/assets/spark';
const RAZOR_SENSE_STATES = [
  'idle',
  'typing',
  'thinking',
  'working',
  'loading',
  'success',
  'caution',
  'regret',
] as const;

const STATE_LABELS: Readonly<Record<RazorSenseState, string>> = {
  idle: 'Idle',
  typing: 'Typing',
  thinking: 'Thinking',
  working: 'Working',
  loading: 'Loading',
  success: 'Success',
  caution: 'Caution',
  regret: 'Regret',
};

const STATE_DESCRIPTIONS: Readonly<Record<RazorSenseState, string>> = {
  idle: 'Available and ready for input.',
  typing: 'The product is receiving or composing input.',
  thinking: 'The system is reasoning before it can act.',
  working: 'A longer-running operation is actively progressing.',
  loading: 'A bounded resource or surface is preparing.',
  success: 'A meaningful outcome has completed.',
  caution: 'The product needs attention before continuing.',
  regret: 'The requested outcome could not be completed.',
};

const AI_RESPONSE_SEQUENCE = defineRazorSenseSequence({
  id: 'storybook.razorsense.ai-response.v1',
  steps: [
    { id: 'typing', state: 'typing', playback: 'once' },
    { id: 'thinking', state: 'thinking', playback: 'once' },
    { id: 'working', state: 'working', playback: 'once' },
    { id: 'outcome', state: 'success', playback: 'once' },
  ],
  endBehavior: 'hold',
});

const AI_CORRECTION_SEQUENCE = defineRazorSenseSequence({
  id: 'storybook.razorsense.ai-correction.v1',
  steps: [
    { id: 'correction-received', state: 'typing', playback: 'once' },
    { id: 'scope-check', state: 'caution', playback: 'once' },
    { id: 'rethinking', state: 'thinking', playback: 'once' },
    { id: 'reworking', state: 'working', playback: 'once' },
    { id: 'corrected-outcome', state: 'success', playback: 'once' },
  ],
  endBehavior: 'hold',
});

const AI_RECOVERY_SEQUENCE = defineRazorSenseSequence({
  id: 'storybook.razorsense.ai-recovery.v1',
  steps: [
    { id: 'retry-thinking', state: 'thinking', playback: 'once' },
    { id: 'retry-working', state: 'working', playback: 'once' },
    { id: 'retry-success', state: 'success', playback: 'once' },
  ],
  endBehavior: 'hold',
});

export default {
  title: 'Components/RazorSense',
  component: RazorSense,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: true },
  },
} as Meta<typeof RazorSense>;

type StoryShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  maxWidth?: string;
};

const StoryShell = ({
  eyebrow,
  title,
  description,
  children,
  maxWidth = '1200px',
}: StoryShellProps): ReactElement => (
  <Box minHeight="100vh" backgroundColor="surface.background.gray.subtle" padding="spacing.8">
    <Box maxWidth={maxWidth} marginX="auto">
      <Text size="small" weight="semibold" color="surface.text.primary.normal">
        {eyebrow}
      </Text>
      <Heading size="2xlarge" marginTop="spacing.2">
        {title}
      </Heading>
      <Text
        size="medium"
        color="surface.text.gray.muted"
        marginTop="spacing.3"
        marginBottom="spacing.7"
        maxWidth="840px"
      >
        {description}
      </Text>
      {children}
    </Box>
  </Box>
);

type VisualFrameProps = {
  children: ReactNode;
  height?: string;
  aspectRatio?: string;
  testID?: string;
};

const VisualFrame = ({
  children,
  height = '440px',
  aspectRatio,
  testID,
}: VisualFrameProps): ReactElement => {
  const frame = (
    <Box
      position="relative"
      width="100%"
      height={aspectRatio ? '100%' : height}
      borderRadius="large"
      overflow="hidden"
      boxShadow="highRaised"
      backgroundColor="surface.background.gray.moderate"
      testID={testID}
    >
      {children}
    </Box>
  );

  return aspectRatio ? <div style={{ width: '100%', aspectRatio }}>{frame}</div> : frame;
};

const StatePicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: RazorSenseState;
  onChange: (state: RazorSenseState) => void;
}): ReactElement => (
  <Box>
    <Text size="small" weight="semibold" marginBottom="spacing.3">
      {label}: {STATE_LABELS[value]}
    </Text>
    <Box display="flex" gap="spacing.2" flexWrap="wrap">
      {RAZOR_SENSE_STATES.map((state) => (
        <Button
          key={state}
          size="xsmall"
          variant={state === value ? 'primary' : 'secondary'}
          onClick={() => onChange(state)}
        >
          {STATE_LABELS[state]}
        </Button>
      ))}
    </Box>
  </Box>
);

const formatEvent = (
  event: RazorSenseControllerEvent | RazorSenseSequenceEvent<string>,
): string => {
  const details = (event as unknown) as Record<string, unknown>;
  return [event.type, details.stepId, details.reason, details.status]
    .filter((value) => value !== undefined)
    .join(' · ');
};

const EventLog = ({ events }: { events: readonly string[] }): ReactElement => (
  <Box
    padding="spacing.4"
    borderWidth="thin"
    borderColor="surface.border.gray.muted"
    borderRadius="medium"
    backgroundColor="surface.background.gray.moderate"
    minHeight="116px"
  >
    <Text size="small" weight="semibold" marginBottom="spacing.2">
      Lifecycle events
    </Text>
    {events.length === 0 ? (
      <Text size="small" color="surface.text.gray.muted">
        Events appear here in deterministic delivery order.
      </Text>
    ) : (
      events.slice(-6).map((event, index) => (
        <Text key={`${event}-${index}`} size="small" color="surface.text.gray.muted">
          {index + 1}. {event}
        </Text>
      ))
    )}
  </Box>
);

const useControllerEventLog = (controller: RazorSenseController): readonly string[] => {
  const [events, setEvents] = useState<readonly string[]>([]);

  useEffect(
    () =>
      controller.subscribeEvents((event) => {
        setEvents((current) => [...current.slice(-7), formatEvent(event)]);
      }),
    [controller],
  );

  return events;
};

const useControllerSnapshot = (controller: RazorSenseController): RazorSenseControllerSnapshot =>
  useSyncExternalStore(controller.subscribe, controller.getSnapshot, controller.getSnapshot);

export const SemanticStatesGallery: StoryFn<typeof RazorSense> = () => (
  <StoryShell
    eyebrow="SEMANTIC STATES"
    title="Product intent, rendered consistently."
    description="The gallery uses the public state vocabulary. Each tile is an independent calibration surface; product UI should normally use one persistent instance for the journey, not one instance per message or status row."
  >
    <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="spacing.5">
      {RAZOR_SENSE_STATES.map((state) => (
        <Card key={state} padding="spacing.0" elevation="lowRaised">
          <CardBody>
            <Box position="relative" height="220px" overflow="hidden">
              <RazorSense
                state={state}
                assetsPath={ASSETS_PATH}
                width="100%"
                height="100%"
                accessibilityLabel={`${STATE_LABELS[state]} RazorSense state`}
              />
            </Box>
            <Box padding="spacing.4">
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Heading size="medium">{STATE_LABELS[state]}</Heading>
                <Badge color={state === 'regret' ? 'negative' : 'neutral'} size="small">
                  {state}
                </Badge>
              </Box>
              <Text size="small" color="surface.text.gray.muted" marginTop="spacing.2">
                {STATE_DESCRIPTIONS[state]}
              </Text>
            </Box>
          </CardBody>
        </Card>
      ))}
    </Box>
  </StoryShell>
);

type TransitionPairLabArgs = {
  fromState: RazorSenseState;
  toState: RazorSenseState;
  transition: 'automatic' | 'cut' | 'gentle';
};

const TransitionPairLabStory = ({
  fromState: initialFrom,
  toState: initialTo,
  transition,
}: TransitionPairLabArgs): ReactElement => {
  const [fromState, setFromState] = useState(initialFrom);
  const [toState, setToState] = useState(initialTo);
  const [currentState, setCurrentState] = useState(initialFrom);
  const [replayKey, setReplayKey] = useState(0);
  const [events, setEvents] = useState<readonly string[]>([]);
  const resolvedTransition: RazorSenseTransition =
    transition === 'gentle' ? { duration: 'duration.gentle' } : transition;

  useEffect(() => {
    setFromState(initialFrom);
    setCurrentState(initialFrom);
  }, [initialFrom]);

  useEffect(() => setToState(initialTo), [initialTo]);

  const reset = (): void => {
    setReplayKey((value) => value + 1);
    setCurrentState(fromState);
  };

  const play = (): void => {
    setReplayKey((value) => value + 1);
    setCurrentState(toState);
  };

  return (
    <StoryShell
      eyebrow="TRANSITION LAB"
      title="Every semantic edge, one persistent host."
      description="Choose any source and destination. Reset establishes the source; Play asks Blade to prepare the destination, preserve the outgoing frame, and resolve the registered cross-renderer transition."
    >
      <Box display="grid" gridTemplateColumns="minmax(0, 2fr) minmax(320px, 1fr)" gap="spacing.6">
        <VisualFrame>
          <RazorSense
            state={currentState}
            replayKey={replayKey}
            transition={resolvedTransition}
            assetsPath={ASSETS_PATH}
            width="100%"
            height="100%"
            onReady={(event) => setEvents((items) => [...items, formatEvent(event)])}
            onTransitionStart={(event) => setEvents((items) => [...items, formatEvent(event)])}
            onTransitionComplete={(event) => setEvents((items) => [...items, formatEvent(event)])}
          />
        </VisualFrame>
        <Box display="flex" flexDirection="column" gap="spacing.5">
          <StatePicker label="From" value={fromState} onChange={setFromState} />
          <StatePicker label="To" value={toState} onChange={setToState} />
          <Box display="flex" gap="spacing.3">
            <Button variant="secondary" onClick={reset}>
              Reset to source
            </Button>
            <Button onClick={play}>Play transition</Button>
          </Box>
          <EventLog events={events} />
        </Box>
      </Box>
    </StoryShell>
  );
};

export const TransitionPairLab: StoryFn<TransitionPairLabArgs> = TransitionPairLabStory;
TransitionPairLab.args = {
  fromState: 'idle',
  toState: 'thinking',
  transition: 'automatic',
};
TransitionPairLab.argTypes = {
  fromState: { control: 'select', options: RAZOR_SENSE_STATES },
  toState: { control: 'select', options: RAZOR_SENSE_STATES },
  transition: { control: 'inline-radio', options: ['automatic', 'cut', 'gentle'] },
};

type SequenceBuilderArgs = {
  middleState: Extract<RazorSenseState, 'thinking' | 'working' | 'loading'>;
  outcomeState: Extract<RazorSenseState, 'success' | 'caution' | 'regret'>;
  interruptionPolicy: RazorSenseInterruptionPolicy;
};

const SequenceBuilderStory = ({
  middleState,
  outcomeState,
  interruptionPolicy,
}: SequenceBuilderArgs): ReactElement => {
  const [runId, setRunId] = useState(1);
  const [events, setEvents] = useState<readonly string[]>([]);
  const sequence = useMemo(
    () =>
      defineRazorSenseSequence({
        id: `storybook.razorsense.builder.${middleState}.${outcomeState}.v1`,
        steps: [
          { id: 'receive', state: 'typing', playback: 'once' },
          { id: 'process', state: middleState, playback: 'once' },
          { id: 'finish', state: outcomeState, playback: 'once' },
        ],
        endBehavior: 'hold',
      }),
    [middleState, outcomeState],
  );

  return (
    <StoryShell
      eyebrow="DECLARATIVE SEQUENCE"
      title="Readable steps without consumer timers."
      description="Controls change intent, not media internals. Blade owns preparation, playback, transition overlap, completion, interruption, and cleanup for every step."
    >
      <Box display="grid" gridTemplateColumns="minmax(0, 2fr) minmax(300px, 1fr)" gap="spacing.6">
        <VisualFrame>
          <RazorSenseSequence
            sequence={sequence}
            runId={runId}
            interruptionPolicy={interruptionPolicy}
            assetsPath={ASSETS_PATH}
            accessibilityLabel="Processing request"
            onEvent={(event) => setEvents((items) => [...items.slice(-7), formatEvent(event)])}
          />
        </VisualFrame>
        <Box display="flex" flexDirection="column" gap="spacing.4">
          <Box display="flex" gap="spacing.2" flexWrap="wrap">
            {sequence.steps.map((step, index) => (
              <Badge
                key={step.id}
                color={index === sequence.steps.length - 1 ? 'primary' : 'neutral'}
              >
                {index + 1}. {step.id}
              </Badge>
            ))}
          </Box>
          <Button onClick={() => setRunId((value) => value + 1)}>Run sequence again</Button>
          <EventLog events={events} />
        </Box>
      </Box>
    </StoryShell>
  );
};

export const SequenceBuilder: StoryFn<SequenceBuilderArgs> = SequenceBuilderStory;
SequenceBuilder.args = {
  middleState: 'thinking',
  outcomeState: 'success',
  interruptionPolicy: 'replace',
};
SequenceBuilder.argTypes = {
  middleState: { control: 'select', options: ['thinking', 'working', 'loading'] },
  outcomeState: { control: 'select', options: ['success', 'caution', 'regret'] },
  interruptionPolicy: {
    control: 'inline-radio',
    options: ['replace', 'queue', 'finish-current'],
  },
};

const CHAT_STEP_COPY: Readonly<Record<string, string>> = {
  typing: 'Receiving your request',
  thinking: 'Planning the safest route',
  working: 'Checking settlement activity',
  outcome: 'Insight ready',
  'correction-received': 'Correction received',
  'scope-check': 'Reviewing changed constraints',
  rethinking: 'Replanning with your correction',
  reworking: 'Recomputing the result',
  'corrected-outcome': 'Corrected insight ready',
  'retry-thinking': 'Rechecking the failed step',
  'retry-working': 'Trying the operation again',
  'retry-success': 'Recovery complete',
};

const ChatBubble = ({
  sender,
  children,
}: {
  sender: 'You' | 'Ray';
  children: ReactNode;
}): ReactElement => (
  <Box
    alignSelf={sender === 'You' ? 'flex-end' : 'flex-start'}
    maxWidth="78%"
    backgroundColor={
      sender === 'You' ? 'surface.background.gray.intense' : 'surface.background.gray.moderate'
    }
    borderRadius="medium"
    padding="spacing.4"
  >
    <Text size="small" weight="semibold" color="surface.text.gray.muted">
      {sender}
    </Text>
    <Text size="medium" marginTop="spacing.1">
      {children}
    </Text>
  </Box>
);

const AIChatExperience = ({ isInterruptible }: { isInterruptible: boolean }): ReactElement => {
  const controller = useRazorSenseController({ initialState: 'idle' });
  const snapshot = useControllerSnapshot(controller);
  const events = useControllerEventLog(controller);
  const runCountRef = useRef(0);
  const [draft, setDraft] = useState('Why did settlements improve this week?');
  const [question, setQuestion] = useState('Ask Ray about your business.');
  const [answer, setAnswer] = useState('Ready when you are.');
  const [phaseCopy, setPhaseCopy] = useState('Idle');

  useEffect(
    () =>
      controller.subscribeEvents((event) => {
        if (event.type === 'step-start') {
          setPhaseCopy(CHAT_STEP_COPY[event.stepId] ?? event.stepId);
        } else if (event.type === 'run-complete') {
          setAnswer(
            'Settlements improved 12% because retry recovery increased and bank-side latency fell.',
          );
        } else if (event.type === 'error') {
          setAnswer(
            'I could not complete that pass. Retry keeps the same visual host and context.',
          );
        }
      }),
    [controller],
  );

  const playSequence = useCallback(
    (
      sequence:
        | typeof AI_RESPONSE_SEQUENCE
        | typeof AI_CORRECTION_SEQUENCE
        | typeof AI_RECOVERY_SEQUENCE,
    ) => {
      runCountRef.current += 1;
      const command = controller.playSequence(sequence, {
        interruptionPolicy: 'replace',
        runId: `chat-run-${runCountRef.current}`,
      });
      void command.completed.catch(() => undefined);
    },
    [controller],
  );

  const send = (): void => {
    setQuestion(draft || 'Why did settlements improve this week?');
    setAnswer('Working on your answer…');
    playSequence(AI_RESPONSE_SEQUENCE);
  };

  const interrupt = (): void => {
    setQuestion('Only compare domestic settlements.');
    setAnswer('Updating the active request without remounting the visual system…');
    playSequence(AI_CORRECTION_SEQUENCE);
  };

  const showCaution = (): void => {
    setPhaseCopy('Action needed');
    setAnswer('The reporting window is incomplete. Confirm the date range before continuing.');
    const command = controller.play(
      { state: 'caution' },
      { playback: 'once', interruptionPolicy: 'replace' },
    );
    void command.completed.catch(() => undefined);
  };

  const recover = (): void => {
    setAnswer('Retrying with the corrected reporting window…');
    playSequence(AI_RECOVERY_SEQUENCE);
  };

  return (
    <StoryShell
      eyebrow={isInterruptible ? 'AI CHAT · INTERRUPTION' : 'AI CHAT · COMPLETE JOURNEY'}
      title={
        isInterruptible
          ? 'New intent replaces stale work.'
          : 'One visual system, one response lifecycle.'
      }
      description="RazorSense is a companion status, never the only status. The same persistent instance moves through idle, typing, thinking, working, and outcome while the chat exposes readable text and controls."
      maxWidth="1080px"
    >
      <Card padding="spacing.0" elevation="highRaised">
        <CardBody>
          <Box position="relative" height="240px" overflow="hidden">
            <RazorSense
              controller={controller}
              assetsPath={ASSETS_PATH}
              width="100%"
              height="100%"
              accessibilityLabel={phaseCopy}
            />
            <Box
              position="absolute"
              top="spacing.5"
              left="spacing.5"
              backgroundColor="surface.background.gray.moderate"
              padding="spacing.3"
              borderRadius="medium"
            >
              <Text size="small" weight="semibold">
                {phaseCopy}
              </Text>
              <Text size="small" color="surface.text.gray.muted">
                {snapshot.status} · queue {snapshot.queueLength}
              </Text>
            </Box>
          </Box>
          <Box padding="spacing.6" display="flex" flexDirection="column" gap="spacing.4">
            <ChatBubble sender="You">{question}</ChatBubble>
            <ChatBubble sender="Ray">{answer}</ChatBubble>
            <TextInput
              label="Message"
              value={draft}
              placeholder="Ask Ray about your business"
              onChange={({ value }) => setDraft(value)}
            />
            <Box display="flex" gap="spacing.3" flexWrap="wrap">
              <Button onClick={send}>Run response</Button>
              {isInterruptible ? (
                <Button variant="secondary" onClick={interrupt}>
                  Send correction now
                </Button>
              ) : null}
              <Button variant="tertiary" onClick={showCaution}>
                Show caution
              </Button>
              <Button variant="tertiary" onClick={recover}>
                Retry and recover
              </Button>
            </Box>
            <EventLog events={events} />
          </Box>
        </CardBody>
      </Card>
    </StoryShell>
  );
};

export const AIChatJourney: StoryFn<typeof RazorSense> = () => (
  <AIChatExperience isInterruptible={false} />
);

export const InterruptedAIChatJourney: StoryFn<typeof RazorSense> = () => (
  <AIChatExperience isInterruptible />
);

const LoginForeground = (): ReactElement => (
  <Box position="relative" width="100%" height="100%">
    <Box
      position="absolute"
      left="32px"
      bottom="38px"
      width="48%"
      display="flex"
      flexDirection="column"
      gap="spacing.3"
    >
      <Heading size="large" color="surface.text.primary.normal">
        Join 8 million businesses that trust Razorpay to supercharge their business
      </Heading>
      <Text size="small" color="surface.text.gray.muted">
        + 100+ payment methods &nbsp;&nbsp; + Easy integration &nbsp;&nbsp; + Powerful dashboard
      </Text>
    </Box>
    <Box
      position="absolute"
      top="0px"
      right="0px"
      width="42%"
      height="100%"
      backgroundColor="surface.background.gray.moderate"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding="spacing.8"
    >
      <Box width="100%" maxWidth="360px">
        <Text size="small" weight="semibold" color="surface.text.primary.normal">
          ↗ Razorpay
        </Text>
        <Heading size="xlarge" marginTop="spacing.5">
          Get started with your email or phone number
        </Heading>
        <TextInput
          label="Email or phone number"
          placeholder="you@company.com"
          marginTop="spacing.6"
        />
        <Button isFullWidth marginTop="spacing.4">
          Continue
        </Button>
        <Text size="small" color="surface.text.gray.muted" marginTop="spacing.5">
          By continuing, you agree to our terms and privacy policy.
        </Text>
      </Box>
    </Box>
  </Box>
);

const DashboardForeground = (): ReactElement => (
  <Box width="100%" height="100%" position="relative">
    <div
      data-razor-sense-journey-copy
      style={{
        position: 'absolute',
        top: '48%',
        left: '50%',
        zIndex: 2,
        opacity: 0,
        transform: 'translate(-50%, 8px)',
        whiteSpace: 'nowrap',
      }}
    >
      <Heading size="large">Let&apos;s start your journey.</Heading>
    </div>
    <div data-razor-sense-dashboard-shell style={{ opacity: 0 }}>
      <Box
        height="48px"
        backgroundColor="surface.background.gray.intense"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        paddingX="spacing.6"
      >
        <Text size="small" weight="semibold" color="surface.text.onSea.onSubtle">
          ✣ Ray AI
        </Text>
        <Box display="flex" gap="spacing.7">
          {['Payments', 'Neobanking', 'Payroll', 'Partners'].map((item) => (
            <Text key={item} size="small" color="surface.text.onSea.onSubtle">
              {item}
            </Text>
          ))}
        </Box>
      </Box>
    </div>
    <div
      style={{
        position: 'absolute',
        top: 145,
        left: '50%',
        width: 'min(560px, calc(100% - 32px))',
        transform: 'translateX(-50%)',
      }}
    >
      <div data-razor-sense-dashboard-content style={{ opacity: 0 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Text size="small" color="surface.text.gray.muted">
            Hello, Ashok
          </Text>
          <Heading size="xlarge" marginTop="spacing.2">
            ✣ What can I do for you today?
          </Heading>
          <Box
            width="100%"
            minHeight="92px"
            marginTop="spacing.5"
            padding="spacing.4"
            borderRadius="medium"
            borderWidth="thin"
            borderColor="surface.border.primary.normal"
            backgroundColor="surface.background.gray.moderate"
            boxShadow="lowRaised"
          >
            <Text size="small" color="surface.text.gray.muted">
              What will get my next settlement?
            </Text>
            <Box display="flex" justifyContent="space-between" marginTop="spacing.5">
              <Text size="xsmall" color="surface.text.gray.muted">
                + Upload file
              </Text>
              <Badge color="primary">↑</Badge>
            </Box>
          </Box>
          <Box display="flex" gap="spacing.2" marginTop="spacing.3">
            {['Payments', 'Settlements', 'Manage account', 'Support'].map((item) => (
              <Badge key={item} color="neutral">
                {item}
              </Badge>
            ))}
          </Box>
        </Box>
      </div>
      <div data-razor-sense-dashboard-cards style={{ opacity: 0 }}>
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, minmax(0, 1fr))"
          gap="spacing.3"
          marginTop="spacing.8"
        >
          {[
            ['Payments', '₹5.6L'],
            ['Success rate', '98%'],
            ['Settlements', '₹3.26L'],
          ].map(([label, value]) => (
            <Box
              key={label}
              backgroundColor="surface.background.gray.moderate"
              borderRadius="medium"
              padding="spacing.4"
              borderWidth="thin"
              borderColor="surface.border.gray.muted"
              boxShadow="lowRaised"
            >
              <Text size="xsmall" color="surface.text.gray.muted">
                {label}
              </Text>
              <Heading size="medium" marginTop="spacing.2">
                {value}
              </Heading>
            </Box>
          ))}
        </Box>
      </div>
    </div>
  </Box>
);

const LoginToDashboardExperience = (): ReactElement => {
  const [runId, setRunId] = useState(1);
  const [events, setEvents] = useState<readonly string[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  return (
    <StoryShell
      eyebrow="AUTHORED APPLICATION JOURNEY"
      title="Login becomes the dashboard."
      description="The built-in sequence owns the timestamped rail collapse, three loading phases, material expansion, and foreground cues reconstructed from the 24 fps reference. The application supplies semantic source and destination slots instead of coordinating masks, timecodes, or preload timing."
      maxWidth="1320px"
    >
      <VisualFrame aspectRatio="16 / 9" testID="login-to-dashboard-journey">
        <RazorSenseSequence
          sequence={razorSenseLoginToDashboardJourney}
          runId={runId}
          isPaused={isPaused}
          assetsPath={ASSETS_PATH}
          accessibilityLabel="Signing you in"
          foreground={{ source: <LoginForeground />, destination: <DashboardForeground /> }}
          onEvent={(event) => setEvents((items) => [...items.slice(-7), formatEvent(event)])}
        />
      </VisualFrame>
      <Box
        display="grid"
        gridTemplateColumns="auto auto minmax(0, 1fr)"
        gap="spacing.4"
        marginTop="spacing.5"
      >
        <Button
          onClick={() => {
            setEvents([]);
            setIsPaused(false);
            setRunId((value) => value + 1);
          }}
        >
          Replay authored journey
        </Button>
        <Button variant="secondary" onClick={() => setIsPaused((value) => !value)}>
          {isPaused ? 'Resume journey' : 'Pause journey'}
        </Button>
        <EventLog events={events} />
      </Box>
    </StoryShell>
  );
};

export const LoginToDashboardJourney: StoryFn<typeof RazorSenseSequence> = () => (
  <LoginToDashboardExperience />
);

export const ThreePhaseLoading: StoryFn<typeof RazorSenseSequence> = () => {
  const [runId, setRunId] = useState(1);
  const [events, setEvents] = useState<readonly string[]>([]);

  return (
    <StoryShell
      eyebrow="BRANDED LOADING"
      title="Three phases, one authored cadence."
      description="Each phase is a typed sequence step. The preset retains its calibrated frames and Blade advances at safe media boundaries."
      maxWidth="960px"
    >
      <VisualFrame>
        <RazorSenseSequence
          sequence={razorSenseThreePhaseLoadingJourney}
          runId={runId}
          assetsPath={ASSETS_PATH}
          accessibilityLabel="Preparing your dashboard"
          onEvent={(event) => setEvents((items) => [...items.slice(-7), formatEvent(event)])}
        />
      </VisualFrame>
      <Box
        display="grid"
        gridTemplateColumns="auto minmax(0, 1fr)"
        gap="spacing.4"
        marginTop="spacing.5"
      >
        <Button onClick={() => setRunId((value) => value + 1)}>Replay three phases</Button>
        <EventLog events={events} />
      </Box>
    </StoryShell>
  );
};

type BrandedPresetSurfaceProps = {
  title: string;
  description: string;
  preset: 'rippleWave' | 'bottomWave' | 'success';
};

const BrandedPresetSurface = ({
  title,
  description,
  preset,
}: BrandedPresetSurfaceProps): ReactElement => {
  const [replayKey, setReplayKey] = useState(1);

  return (
    <StoryShell eyebrow="BRANDED PRESET" title={title} description={description} maxWidth="960px">
      <VisualFrame>
        <RazorSense
          preset={preset}
          playback="once"
          endBehavior="hold"
          replayKey={replayKey}
          assetsPath={ASSETS_PATH}
          width="100%"
          height="100%"
          accessibilityLabel={title}
        />
      </VisualFrame>
      <Button marginTop="spacing.5" onClick={() => setReplayKey((value) => value + 1)}>
        Replay preset
      </Button>
    </StoryShell>
  );
};

export const RippleWave: StoryFn<typeof RazorSense> = () => (
  <BrandedPresetSurface
    preset="rippleWave"
    title="Ripple wave remains a first-class preset."
    description="Use it for a rare branded reveal. The declarative API preserves the existing shader program while adding playback, terminal hold, readiness, and cleanup semantics."
  />
);

export const BottomWave: StoryFn<typeof RazorSense> = () => (
  <BrandedPresetSurface
    preset="bottomWave"
    title="Bottom wave, without compatibility glue."
    description="The visual stays available as a durable preset. Blade owns its finite playback and terminal frame; consumers do not seek or fade the underlying source."
  />
);

export const SuccessAnimation: StoryFn<typeof RazorSense> = () => (
  <BrandedPresetSurface
    preset="success"
    title="Success for meaningful completion."
    description="This one-shot is appropriate for a consequential result, not every minor successful action. Pair it with explicit result text and preserve the held terminal frame."
  />
);

export const OneShotTerminalHold: StoryFn<typeof RazorSense> = () => {
  const [replayKey, setReplayKey] = useState(1);
  const [status, setStatus] = useState('Playing the authored audio wave');

  return (
    <StoryShell
      eyebrow="PLAYBACK · ONCE + HOLD"
      title="The final decoded frame is a stable product state."
      description="Audio wave is finite and intentionally not loop-safe. Once playback completes, Blade seeks to the calibrated terminal frame and holds it until the next product state."
      maxWidth="960px"
    >
      <VisualFrame>
        <RazorSense
          preset="audioWave"
          playback="once"
          endBehavior="hold"
          replayKey={replayKey}
          assetsPath={ASSETS_PATH}
          width="100%"
          height="100%"
          accessibilityLabel={status}
          onPlaybackComplete={() => setStatus('Audio wave complete; terminal frame held')}
        />
      </VisualFrame>
      <Box display="flex" alignItems="center" gap="spacing.4" marginTop="spacing.5">
        <Button
          onClick={() => {
            setStatus('Playing the authored audio wave');
            setReplayKey((value) => value + 1);
          }}
        >
          Replay once
        </Button>
        <Text size="small" color="surface.text.gray.muted">
          {status}
        </Text>
      </Box>
    </StoryShell>
  );
};

export const LoopingAnimation: StoryFn<typeof RazorSense> = () => (
  <StoryShell
    eyebrow="PLAYBACK · LOOP"
    title="Loop only where the program has a safe seam."
    description="Thinking uses its registered source crossfade. The consumer selects semantic playback; Blade owns seam timing and never asks application code to rewind media."
    maxWidth="960px"
  >
    <VisualFrame>
      <RazorSense
        state="thinking"
        playback="loop"
        assetsPath={ASSETS_PATH}
        width="100%"
        height="100%"
        accessibilityLabel="Thinking"
      />
    </VisualFrame>
  </StoryShell>
);

export const ManualPauseResume: StoryFn<typeof RazorSense> = () => {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <StoryShell
      eyebrow="PLAYBACK CONTROL"
      title="Pause freezes the active visual and its lifecycle clock."
      description="The host remains mounted. Pause and resume affect shader, media, transition, hold, and cue clocks together so the workflow cannot drift out of sync."
      maxWidth="960px"
    >
      <VisualFrame>
        <RazorSense
          state="thinking"
          playback="loop"
          isPaused={isPaused}
          assetsPath={ASSETS_PATH}
          width="100%"
          height="100%"
          accessibilityLabel={isPaused ? 'Thinking paused' : 'Thinking'}
        />
      </VisualFrame>
      <Box display="flex" alignItems="center" gap="spacing.4" marginTop="spacing.5">
        <Button onClick={() => setIsPaused((value) => !value)}>
          {isPaused ? 'Resume animation' : 'Pause animation'}
        </Button>
        <Badge color={isPaused ? 'notice' : 'positive'}>{isPaused ? 'Paused' : 'Running'}</Badge>
      </Box>
    </StoryShell>
  );
};

const AppearanceSurface = (): ReactElement => {
  const { colorScheme, setColorScheme } = useTheme();
  return (
    <StoryShell
      eyebrow="APPEARANCE"
      title="Theme changes do not flash the wrong material."
      description="The nearest BladeProvider owns appearance. RazorSense prepares the matching dark or light program and preserves the outgoing frame until it is ready."
      maxWidth="960px"
    >
      <VisualFrame>
        <RazorSense
          state="working"
          playback="loop"
          assetsPath={ASSETS_PATH}
          width="100%"
          height="100%"
          accessibilityLabel={`Working in ${colorScheme} appearance`}
        />
      </VisualFrame>
      <Box display="flex" alignItems="center" gap="spacing.4" marginTop="spacing.5">
        <Button onClick={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}>
          Switch to {colorScheme === 'light' ? 'dark' : 'light'}
        </Button>
        <Text size="small" color="surface.text.gray.muted">
          Current provider: {colorScheme}
        </Text>
      </Box>
    </StoryShell>
  );
};

export const LightToDarkTransition: StoryFn<typeof RazorSense> = () => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    <AppearanceSurface />
  </BladeProvider>
);

const usePrefersReducedMotion = (): boolean => {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined'
      ? false
      : window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (): void => setMatches(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return matches;
};

export const ReducedMotionBehavior: StoryFn<typeof RazorSense> = () => {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [completion, setCompletion] = useState('Waiting for the runtime result');

  return (
    <StoryShell
      eyebrow="ACCESSIBILITY · REDUCED MOTION"
      title="The semantic state remains; continuous motion does not."
      description="Enable reduced-motion emulation in the browser or operating system. Blade selects the calibrated representative frame, resolves finite playback once, and keeps the same accessible status."
      maxWidth="960px"
    >
      <VisualFrame>
        <RazorSense
          state="thinking"
          playback="once"
          assetsPath={ASSETS_PATH}
          width="100%"
          height="100%"
          accessibilityLabel="Thinking"
          onPlaybackComplete={(event) => setCompletion(`Completed: ${event.reason}`)}
        />
      </VisualFrame>
      <Box display="flex" gap="spacing.3" alignItems="center" marginTop="spacing.5">
        <Badge color={prefersReducedMotion ? 'positive' : 'neutral'}>
          prefers-reduced-motion: {prefersReducedMotion ? 'reduce' : 'no-preference'}
        </Badge>
        <Text size="small" color="surface.text.gray.muted">
          {completion}
        </Text>
      </Box>
    </StoryShell>
  );
};

ReducedMotionBehavior.parameters = {
  docs: {
    description: {
      story:
        'Use browser or operating-system reduced-motion emulation. The story reports the active media query and the public completion reason.',
    },
  },
};

export const MobileLayoutAndCropping: StoryFn<typeof RazorSense> = () => {
  const [state, setState] = useState<RazorSenseState>('typing');

  return (
    <StoryShell
      eyebrow="MOBILE"
      title="A deliberate responsive crop."
      description="The public state API is unchanged on a narrow surface. Emotional states select calibrated portrait media; operational states preserve their full-resolution authored source and Blade owns the crop, lifecycle, and foreground-safe composition."
      maxWidth="720px"
    >
      <Box
        display="grid"
        gridTemplateColumns={{ base: 'minmax(0, 1fr)', m: '360px minmax(220px, 1fr)' }}
        gap="spacing.6"
      >
        <VisualFrame height="640px">
          <RazorSense
            state={state}
            assetsPath={ASSETS_PATH}
            width="100%"
            height="100%"
            accessibilityLabel={`${STATE_LABELS[state]} on mobile`}
          />
          <Box position="absolute" top="spacing.5" left="spacing.5" right="spacing.5">
            <Card elevation="lowRaised">
              <CardBody>
                <Text size="small" weight="semibold">
                  Ray AI
                </Text>
                <Heading size="large" marginTop="spacing.2">
                  What can I do for you?
                </Heading>
              </CardBody>
            </Card>
          </Box>
        </VisualFrame>
        <StatePicker label="Mobile state" value={state} onChange={setState} />
      </Box>
    </StoryShell>
  );
};

MobileLayoutAndCropping.parameters = {
  viewport: { defaultViewport: 'mobile1' },
};

export const RapidStateReplacement: StoryFn<typeof RazorSense> = () => {
  const controller = useRazorSenseController({ initialState: 'idle' });
  const snapshot = useControllerSnapshot(controller);
  const events = useControllerEventLog(controller);

  const replaceRapidly = (): void => {
    RAZOR_SENSE_STATES.forEach((state) => {
      const command = controller.play(
        { state },
        { playback: 'once', interruptionPolicy: 'replace' },
      );
      void command.completed.catch(() => undefined);
    });
  };

  return (
    <StoryShell
      eyebrow="INTERRUPTION · REPLACE"
      title="Only the latest intent can win the race."
      description="One click issues eight synchronous state requests. Stale preparation and callbacks are cancelled; the final Regret occurrence is the only request allowed to settle."
      maxWidth="960px"
    >
      <VisualFrame>
        <RazorSense
          controller={controller}
          assetsPath={ASSETS_PATH}
          width="100%"
          height="100%"
          accessibilityLabel={`Current state ${
            'state' in snapshot.target ? snapshot.target.state : snapshot.target.preset
          }`}
        />
      </VisualFrame>
      <Box
        display="grid"
        gridTemplateColumns="auto minmax(0, 1fr)"
        gap="spacing.4"
        marginTop="spacing.5"
      >
        <Box>
          <Button onClick={replaceRapidly}>Issue 8 replacements</Button>
          <Text size="small" color="surface.text.gray.muted" marginTop="spacing.3">
            Status: {snapshot.status} · Queue: {snapshot.queueLength}
          </Text>
        </Box>
        <EventLog events={events} />
      </Box>
    </StoryShell>
  );
};

export const QueueAndFinishCurrent: StoryFn<typeof RazorSense> = () => {
  const controller = useRazorSenseController({ initialState: 'idle' });
  const snapshot = useControllerSnapshot(controller);
  const events = useControllerEventLog(controller);

  const play = (
    state: RazorSenseState,
    interruptionPolicy: RazorSenseInterruptionPolicy,
    playback: 'once' | 'loop' = 'once',
  ): void => {
    const command = controller.play(
      { state },
      playback === 'loop'
        ? { playback: 'loop', interruptionPolicy }
        : { playback: 'once', interruptionPolicy },
    );
    void command.completed.catch(() => undefined);
  };

  return (
    <StoryShell
      eyebrow="INTERRUPTION · QUEUE + FINISH CURRENT"
      title="Application intent chooses the boundary policy."
      description="Queue waits behind the current occurrence. Finish current requests a safe iteration or terminal boundary before the new intent begins. Neither path asks the app to watch media time."
      maxWidth="1040px"
    >
      <VisualFrame>
        <RazorSense
          controller={controller}
          assetsPath={ASSETS_PATH}
          width="100%"
          height="100%"
          accessibilityLabel="Interruption policy demonstration"
        />
      </VisualFrame>
      <Box display="flex" gap="spacing.3" flexWrap="wrap" marginTop="spacing.5">
        <Button onClick={() => play('thinking', 'replace', 'loop')}>Start thinking loop</Button>
        <Button variant="secondary" onClick={() => play('success', 'queue')}>
          Queue success
        </Button>
        <Button variant="secondary" onClick={() => play('caution', 'finish-current')}>
          Finish current, then caution
        </Button>
        <Button
          variant="tertiary"
          onClick={() => controller.cancel({ scope: 'all', reason: 'Story reset' })}
        >
          Cancel all
        </Button>
      </Box>
      <Text size="small" color="surface.text.gray.muted" marginY="spacing.3">
        Runtime: {snapshot.status} · queued requests: {snapshot.queueLength}
      </Text>
      <EventLog events={events} />
    </StoryShell>
  );
};

export const AssetAndWebGLFailure: StoryFn<typeof RazorSense> = () => {
  const webGLHostRef = useRef<HTMLDivElement>(null);
  const [assetReplayKey, setAssetReplayKey] = useState(1);
  const [assetAssetsPath, setAssetAssetsPath] = useState(ASSETS_PATH);
  const [assetStatus, setAssetStatus] = useState(
    'Calibrated output is ready. Trigger a failed replacement to verify retention.',
  );
  const [webGLStatus, setWebGLStatus] = useState('Renderer is healthy');

  const loseContext = (): void => {
    const canvas = webGLHostRef.current?.querySelector('canvas');
    if (!canvas) {
      setWebGLStatus('No active WebGL canvas yet; wait for readiness and try again');
      return;
    }
    canvas.dispatchEvent(new Event('webglcontextlost', { cancelable: true }));
    setWebGLStatus('Synthetic webglcontextlost dispatched; fallback should remain visible');
  };

  return (
    <StoryShell
      eyebrow="DEGRADED OUTPUT"
      title="Failure retains a calibrated visual and explicit status."
      description="The left fixture first decodes a calibrated frame, then requests a missing replacement so the last valid output can remain visible. The right fixture dispatches the browser's WebGL context-loss event through the mounted public component."
    >
      <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="spacing.5">
        <Card padding="spacing.0">
          <CardBody>
            <Box position="relative" height="320px" overflow="hidden">
              <RazorSense
                preset="audioWave"
                playback="once"
                replayKey={assetReplayKey}
                assetsPath={assetAssetsPath}
                width="100%"
                height="100%"
                accessibilityLabel="Asset failure fallback"
                onError={(error) => setAssetStatus(error.message)}
              />
            </Box>
            <Box padding="spacing.4">
              <Heading size="medium">Asset failure</Heading>
              <Text size="small" color="surface.text.gray.muted" marginY="spacing.3">
                {assetStatus}
              </Text>
              <Button
                variant="secondary"
                onClick={() => {
                  setAssetStatus('Requesting a deliberately missing replacement asset');
                  setAssetAssetsPath('/__razorsense-missing-assets__');
                  setAssetReplayKey((value) => value + 1);
                }}
              >
                Trigger asset failure
              </Button>
              <Button
                variant="tertiary"
                marginLeft="spacing.3"
                onClick={() => {
                  setAssetStatus('Restoring calibrated assets');
                  setAssetAssetsPath(ASSETS_PATH);
                  setAssetReplayKey((value) => value + 1);
                }}
              >
                Restore assets
              </Button>
            </Box>
          </CardBody>
        </Card>
        <Card padding="spacing.0">
          <CardBody>
            <div ref={webGLHostRef}>
              <Box position="relative" height="320px" overflow="hidden">
                <RazorSense
                  state="working"
                  playback="loop"
                  assetsPath={ASSETS_PATH}
                  width="100%"
                  height="100%"
                  accessibilityLabel="WebGL failure fallback"
                  onError={(error) => setWebGLStatus(error.message)}
                />
              </Box>
            </div>
            <Box padding="spacing.4">
              <Heading size="medium">WebGL context loss</Heading>
              <Text size="small" color="surface.text.gray.muted" marginY="spacing.3">
                {webGLStatus}
              </Text>
              <Button variant="secondary" onClick={loseContext}>
                Lose WebGL context
              </Button>
            </Box>
          </CardBody>
        </Card>
      </Box>
    </StoryShell>
  );
};

export const MultipleMountedInstances: StoryFn<typeof RazorSense> = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [metrics, setMetrics] = useState({
    hosts: 0,
    admittedRenderers: 0,
    videos: 0,
    playingVideos: 0,
  });
  const instanceStates = ['idle', 'thinking', 'working', 'success', 'caution', 'regret'] as const;

  const refreshMetrics = (): void => {
    const root = rootRef.current;
    const videos = Array.from(root?.querySelectorAll('video') ?? []);
    setMetrics({
      hosts: root?.querySelectorAll('[data-razor-sense-presentation-host]').length ?? 0,
      admittedRenderers:
        root?.querySelectorAll('[data-razor-sense-runtime-admitted="true"]').length ?? 0,
      videos: videos.length,
      playingVideos: videos.filter((video) => !video.paused && video.readyState >= 2).length,
    });
  };

  return (
    <StoryShell
      eyebrow="RESOURCE SCHEDULING"
      title="Many mounted surfaces, bounded active resources."
      description="This stress fixture mounts six independent product regions. Blade admits at most four active renderers and at most two WebGL families, disposes legacy work when it loses admission, releases direct-video sources when cold, and keeps calibrated static output for deferred instances."
    >
      <Box display="flex" alignItems="center" gap="spacing.4" marginBottom="spacing.5">
        <Button onClick={refreshMetrics}>Measure active resources</Button>
        <Badge color="neutral">6 mounted</Badge>
        <Text size="small" color="surface.text.gray.muted">
          {metrics.hosts} hosts · {metrics.admittedRenderers} admitted renderers · {metrics.videos}{' '}
          DOM videos · {metrics.playingVideos} playing
        </Text>
      </Box>
      <div ref={rootRef}>
        <Box display="grid" gridTemplateColumns="repeat(2, minmax(0, 1fr))" gap="spacing.5">
          {instanceStates.map((state) => (
            <Card key={state} padding="spacing.0">
              <CardBody>
                <Box position="relative" height="260px" overflow="hidden">
                  <RazorSense
                    state={state}
                    assetsPath={ASSETS_PATH}
                    width="100%"
                    height="100%"
                    accessibilityLabel={`${STATE_LABELS[state]} independent surface`}
                  />
                </Box>
                <Box padding="spacing.3">
                  <Text size="small" weight="semibold">
                    {STATE_LABELS[state]} region
                  </Text>
                </Box>
              </CardBody>
            </Card>
          ))}
        </Box>
      </div>
      <Text size="small" color="surface.text.gray.muted" marginTop="spacing.5">
        Product guidance: prefer one persistent instance per workflow. Never mount one instance per
        chat message, table row, or repeated loading cell.
      </Text>
    </StoryShell>
  );
};
