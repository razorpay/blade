import { RazorSenseError } from './razorSenseMotionTypes';
import type {
  RazorSenseSequenceDefinition,
  RazorSenseSequenceStep,
  RazorSenseTransition,
} from './razorSenseMotionTypes';
import { assertValidRazorSenseSequenceDefinition } from './razorSensePrograms';

const SEQUENCE_KEYS = new Set(['id', 'steps', 'endBehavior']);
const STEP_KEYS = new Set([
  'id',
  'state',
  'preset',
  'playback',
  'repeatCount',
  'advance',
  'delayBeforeMs',
  'holdAfterMs',
  'transition',
]);
const TRANSITION_KEYS = new Set(['duration']);

const fingerprintsByDefinitionId = new Map<string, string>();

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const findUnknownKeys = (
  value: Record<string, unknown>,
  allowedKeys: ReadonlySet<string>,
): string[] => Object.keys(value).filter((key) => !allowedKeys.has(key));

const assertConsumerSafeShape = (
  definition: RazorSenseSequenceDefinition<string, string>,
): void => {
  const invalidPaths: string[] = findUnknownKeys(
    (definition as unknown) as Record<string, unknown>,
    SEQUENCE_KEYS,
  );

  definition.steps.forEach((step, index) => {
    findUnknownKeys((step as unknown) as Record<string, unknown>, STEP_KEYS).forEach((key) => {
      invalidPaths.push(`steps[${index}].${key}`);
    });

    if (isObject(step.transition)) {
      findUnknownKeys(step.transition, TRANSITION_KEYS).forEach((key) => {
        invalidPaths.push(`steps[${index}].transition.${key}`);
      });
    }
  });

  if (invalidPaths.length === 0) return;

  throw new RazorSenseError(
    `Invalid RazorSense sequence definition: unsupported fields ${invalidPaths.join(
      ', ',
    )}. Sequence definitions describe product intent and cannot contain media, timecode, mask, shader, callback, or compositor controls.`,
    {
      code: 'invalid-sequence-definition',
      recoverable: false,
      originalError: invalidPaths,
    },
  );
};

const assertValidDefinition: (
  definition: unknown,
) => asserts definition is RazorSenseSequenceDefinition<
  string,
  string
> = assertValidRazorSenseSequenceDefinition;

const assertSequenceDefinition: (
  definition: unknown,
) => asserts definition is RazorSenseSequenceDefinition<string, string> = (definition) => {
  assertValidDefinition(definition);
  assertConsumerSafeShape(definition);
};

const cloneTransition = (
  transition: RazorSenseTransition | undefined,
): RazorSenseTransition | undefined =>
  isObject(transition) ? { duration: transition.duration } : transition;

const cloneStep = (step: RazorSenseSequenceStep): RazorSenseSequenceStep =>
  (step.transition === undefined
    ? { ...step }
    : { ...step, transition: cloneTransition(step.transition) }) as RazorSenseSequenceStep;

const deepFreeze = <Value>(value: Value): Value => {
  if (!isObject(value) || Object.isFrozen(value)) return value;

  Reflect.ownKeys(value).forEach((key) => {
    deepFreeze(value[key as keyof typeof value]);
  });

  return Object.freeze(value);
};

const normalizeTransition = (
  transition: RazorSenseTransition | undefined,
): 'automatic' | 'cut' | { duration: string } => {
  if (transition === undefined || transition === 'automatic') return 'automatic';
  if (transition === 'cut') return 'cut';
  return { duration: transition.duration };
};

const createSequenceFingerprint = (
  definition: RazorSenseSequenceDefinition<string, string>,
): string =>
  JSON.stringify({
    id: definition.id,
    endBehavior: definition.endBehavior ?? 'hold',
    steps: definition.steps.map((step) => {
      const playback = step.playback ?? 'once';
      return {
        id: step.id,
        target:
          'state' in step && step.state !== undefined
            ? `state:${step.state}`
            : `preset:${step.preset}`,
        playback,
        repeatCount: playback === 'repeat' ? step.repeatCount : undefined,
        advance: step.advance ?? (playback === 'loop' ? 'manual' : 'on-complete'),
        delayBeforeMs: step.delayBeforeMs ?? 0,
        holdAfterMs: playback === 'loop' ? undefined : step.holdAfterMs ?? 0,
        transition: normalizeTransition(step.transition),
      };
    }),
  });

const registerDefinitionId = (id: string, fingerprint: string): void => {
  if (!__DEV__) return;

  const existingFingerprint = fingerprintsByDefinitionId.get(id);
  if (existingFingerprint === undefined) {
    fingerprintsByDefinitionId.set(id, fingerprint);
    return;
  }
  if (existingFingerprint === fingerprint) return;

  throw new RazorSenseError(
    `RazorSense sequence id "${id}" is already registered with different steps. Give each immutable sequence definition a stable, unique id.`,
    {
      code: 'invalid-sequence-definition',
      recoverable: false,
      originalError: {
        id,
        registeredFingerprint: existingFingerprint,
        receivedFingerprint: fingerprint,
      },
    },
  );
};

const getRazorSenseSequenceDefinitionFingerprint = (
  definition: RazorSenseSequenceDefinition<string, string>,
): string => {
  assertSequenceDefinition(definition);
  const fingerprint = createSequenceFingerprint(definition);
  registerDefinitionId(definition.id, fingerprint);
  return fingerprint;
};

/**
 * Validates, clones, and deeply freezes a consumer-safe RazorSense sequence definition.
 * Define sequences at module scope so their identity remains stable across renders.
 */
const defineRazorSenseSequence = <
  Cue extends string = never,
  ForegroundSlot extends string = never
>(
  definition: RazorSenseSequenceDefinition<Cue, ForegroundSlot>,
): RazorSenseSequenceDefinition<Cue, ForegroundSlot> => {
  assertSequenceDefinition(definition);

  const frozenDefinition = deepFreeze({
    id: definition.id,
    steps: definition.steps.map(cloneStep),
    ...(definition.endBehavior === undefined ? {} : { endBehavior: definition.endBehavior }),
  }) as RazorSenseSequenceDefinition<Cue, ForegroundSlot>;

  getRazorSenseSequenceDefinitionFingerprint(frozenDefinition);
  return frozenDefinition;
};

export { defineRazorSenseSequence, getRazorSenseSequenceDefinitionFingerprint };
