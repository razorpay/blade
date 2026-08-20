import type { RazorSenseEmotionalMode, RazorSenseMode, RazorSenseOperationalMode } from './modes';
import type { RzpGlassPreset } from './presets';
import { RazorSenseError } from './razorSenseMotionTypes';
import type { DurationString, EasingString } from '~tokens/global';
import type {
  RazorSenseBrandedPreset,
  RazorSenseEndBehavior,
  RazorSenseErrorCode,
  RazorSenseExplicitPlayback,
  RazorSensePlaybackProps,
  RazorSenseRendererFamily,
  RazorSenseSequenceDefinition,
  RazorSenseState,
  RazorSenseStateTarget,
  RazorSenseTarget,
  RazorSensePresetTarget,
  RazorSenseTransition,
} from './razorSenseMotionTypes';

type RazorSenseProgramIdFor<Target extends RazorSenseTarget> = Target extends {
  state: RazorSenseState;
}
  ? `state:${Target['state']}`
  : Target extends { preset: RazorSenseBrandedPreset }
  ? `preset:${Target['preset']}`
  : never;

type RazorSenseProgramId = RazorSenseProgramIdFor<RazorSenseTarget>;

type RazorSenseAppearance = 'light' | 'dark';
type RazorSenseViewport = 'desktop' | 'mobile';

type RazorSenseRepresentativeStill = Readonly<{
  file: string;
  objectPosition: 'center' | 'center bottom';
}>;

type RazorSenseRepresentativeStills = Readonly<
  Record<RazorSenseAppearance, Readonly<Record<RazorSenseViewport, RazorSenseRepresentativeStill>>>
>;

type RazorSenseSafeSeam =
  | {
      readonly kind: 'source-loop';
      readonly startTimeSeconds: number;
      readonly endTimeSeconds: number;
    }
  | {
      readonly kind: 'source-crossfade';
      readonly startTimeSeconds: number;
      readonly endTimeSeconds: number;
      readonly overlapSeconds: number;
    }
  | {
      /** A finite source's final decoded frame is the interruption/iteration boundary. */
      readonly kind: 'terminal-boundary';
      readonly timeSeconds?: number;
    }
  | {
      /** The renderer adapter reports the calibrated iteration boundary. */
      readonly kind: 'renderer-iteration';
    };

type RazorSenseTerminalFrame =
  | {
      readonly kind: 'source-time';
      readonly timeSeconds: number;
    }
  | {
      readonly kind: 'source-end';
      /** Avoids seeking beyond the last decodable frame. */
      readonly frameOffsetFromEnd: number;
    }
  | {
      readonly kind: 'renderer-terminal';
    };

type RazorSenseResolvedPlaybackPlan =
  | {
      readonly playback: 'once';
      readonly endBehavior: RazorSenseEndBehavior;
    }
  | {
      readonly playback: 'repeat';
      readonly repeatCount: number;
      readonly endBehavior: RazorSenseEndBehavior;
    }
  | {
      readonly playback: 'loop';
    };

type RazorSenseProgramDescriptorBase<Target extends RazorSenseTarget> = {
  readonly id: RazorSenseProgramIdFor<Target>;
  readonly target: Readonly<Target>;
  readonly defaultPlayback: RazorSenseResolvedPlaybackPlan;
  readonly supportedPlaybacks: readonly RazorSenseExplicitPlayback[];
  readonly representativeStills: RazorSenseRepresentativeStills;
  readonly safeSeam: RazorSenseSafeSeam;
  readonly terminalFrame: RazorSenseTerminalFrame;
  /** Families the persistent host may transition to without exposing an empty frame. */
  readonly compatibleRendererFamilies: readonly RazorSenseRendererFamily[];
};

type RazorSenseDirectVideoAssetKey = 'audioWave' | 'bottomWave';
type RazorSenseAuthoredAssetKey = RazorSenseOperationalMode | RazorSenseDirectVideoAssetKey;
type RazorSenseAuthoredProgramIdentity =
  | {
      [Mode in RazorSenseOperationalMode]: {
        readonly rendererFamily: 'authored';
        readonly authoredAssetKey: Mode;
        readonly visualMode: Mode;
        readonly legacyPreset?: never;
      };
    }[RazorSenseOperationalMode]
  | {
      readonly rendererFamily: 'authored';
      readonly authoredAssetKey: RazorSenseDirectVideoAssetKey;
      readonly directVideoSources: Readonly<Record<RazorSenseAppearance, string>>;
      readonly visualMode?: never;
      readonly legacyPreset?: never;
    };

type RazorSenseEmotionalProgramIdentity = {
  readonly rendererFamily: 'emotional';
  readonly visualMode: RazorSenseEmotionalMode;
  readonly authoredAssetKey?: never;
  readonly legacyPreset?: never;
};

type RazorSenseLegacyRendererPreset = Extract<RzpGlassPreset, 'rippleWave' | 'circleSlideUp'>;
type RazorSenseLegacyProgramIdentity = {
  readonly rendererFamily: 'legacy';
  readonly legacyPreset: RazorSenseLegacyRendererPreset;
  readonly authoredAssetKey?: never;
  readonly visualMode?: never;
};

type RazorSenseProgramDescriptor<
  Target extends RazorSenseTarget = RazorSenseTarget
> = RazorSenseProgramDescriptorBase<Target> &
  (
    | RazorSenseAuthoredProgramIdentity
    | RazorSenseEmotionalProgramIdentity
    | RazorSenseLegacyProgramIdentity
  );

type RazorSenseProgramManifest = Readonly<
  {
    [State in RazorSenseState as `state:${State}`]: RazorSenseProgramDescriptor<
      RazorSenseStateTarget<State>
    >;
  } &
    {
      [Preset in RazorSenseBrandedPreset as `preset:${Preset}`]: RazorSenseProgramDescriptor<
        RazorSensePresetTarget<Preset>
      >;
    }
>;

type RazorSenseTransitionStrategy =
  | 'program-continuation'
  | 'authored-crossfade'
  | 'material-morph'
  | 'semantic-crossfade'
  | 'cross-renderer-fade'
  | 'cut';

type RazorSenseTransitionDescriptor = Readonly<{
  from: RazorSenseProgramId;
  to: RazorSenseProgramId;
  strategy: RazorSenseTransitionStrategy;
  duration: DurationString;
  easing: EasingString;
  /** Fraction of the transition for which outgoing and incoming renderers overlap. */
  overlap: number;
}>;

type RazorSenseTransitionRegistry = Readonly<Record<string, RazorSenseTransitionDescriptor>>;

type RazorSenseSequenceValidationIssueCode =
  | 'empty-sequence-id'
  | 'empty-sequence'
  | 'empty-step-id'
  | 'duplicate-step-id'
  | 'invalid-target'
  | 'invalid-playback'
  | 'unsupported-playback'
  | 'invalid-repeat-count'
  | 'invalid-delay'
  | 'invalid-hold'
  | 'invalid-advance'
  | 'invalid-transition'
  | 'manual-advance-requires-controller'
  | 'invalid-end-behavior';

type RazorSenseSequenceValidationIssue = {
  code: RazorSenseSequenceValidationIssueCode;
  path: string;
  message: string;
};

type RazorSenseSequenceValidationResult = {
  valid: boolean;
  issues: readonly RazorSenseSequenceValidationIssue[];
};

type RazorSenseSequenceValidationOptions = {
  /** Omit for definition-only validation. Pass false when validating a mounted binding. */
  hasController?: boolean;
};

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

const RAZOR_SENSE_BRANDED_PRESETS = [
  'rippleWave',
  'bottomWave',
  'success',
  'compactLoader',
  'audioWave',
] as const;

const RAZOR_SENSE_RENDERER_FAMILIES = ['authored', 'emotional', 'legacy'] as const;
const ALL_PLAYBACKS = ['once', 'repeat', 'loop'] as const;
const FINITE_PLAYBACKS = ['once', 'repeat'] as const;
const ONE_SHOT_PLAYBACK = ['once'] as const;
const TRANSITION_DURATION_TOKENS: ReadonlySet<string> = new Set([
  'duration.2xquick',
  'duration.xquick',
  'duration.quick',
  'duration.moderate',
  'duration.xmoderate',
  'duration.gentle',
  'duration.xgentle',
  'duration.2xgentle',
]);

const RAZOR_SENSE_STATE_TO_MODE: Readonly<Record<RazorSenseState, RazorSenseMode>> = Object.freeze({
  idle: 'neutral',
  typing: 'typing',
  thinking: 'thinking',
  working: 'calm',
  loading: 'loading',
  success: 'joyful',
  caution: 'caution',
  regret: 'regret',
});

const OPERATIONAL_MODES: ReadonlySet<RazorSenseMode> = new Set([
  'neutral',
  'typing',
  'thinking',
  'loading',
]);

const MODE_REPRESENTATIVE_PHASE_SECONDS: Readonly<Record<RazorSenseMode, number>> = Object.freeze({
  neutral: 5.8,
  typing: 1.96,
  thinking: 2.25,
  loading: 1.5,
  calm: 2.48,
  // The source tail intentionally dissolves away; 0.5s is the last calibrated
  // material frame and therefore the deterministic terminal hold.
  joyful: 0.5,
  caution: 1.22,
  regret: 1.97,
});

const freezeStill = (still: RazorSenseRepresentativeStill): RazorSenseRepresentativeStill =>
  Object.freeze(still);

const createModeRepresentativeStills = (mode: RazorSenseMode): RazorSenseRepresentativeStills => {
  const mobileViewport = OPERATIONAL_MODES.has(mode) ? 'desktop' : 'mobile';
  const objectPosition = mode === 'typing' ? 'center bottom' : 'center';
  const file = (viewport: RazorSenseViewport, appearance: RazorSenseAppearance): string =>
    `razorsense-stills/${viewport}-${appearance}-${mode}.png`;

  return Object.freeze({
    light: Object.freeze({
      desktop: freezeStill({ file: file('desktop', 'light'), objectPosition }),
      mobile: freezeStill({ file: file(mobileViewport, 'light'), objectPosition }),
    }),
    dark: Object.freeze({
      desktop: freezeStill({ file: file('desktop', 'dark'), objectPosition }),
      mobile: freezeStill({ file: file(mobileViewport, 'dark'), objectPosition }),
    }),
  });
};

const createProgramRepresentativeStills = (
  fileName: string,
  objectPosition: RazorSenseRepresentativeStill['objectPosition'] = 'center',
): RazorSenseRepresentativeStills => {
  const still = freezeStill({ file: `razorsense-stills/${fileName}`, objectPosition });

  return Object.freeze({
    light: Object.freeze({
      desktop: still,
      mobile: still,
    }),
    dark: Object.freeze({
      desktop: still,
      mobile: still,
    }),
  });
};

const createBottomWaveRepresentativeStills = (): RazorSenseRepresentativeStills => {
  // These phase-matched frames are byte-verified against the authoritative
  // ten-second light and dark Bottom Wave masters (see performance baseline).
  const light = freezeStill({
    file: 'razorsense-stills/desktop-light-typing.png',
    objectPosition: 'center bottom',
  });
  const dark = freezeStill({
    file: 'razorsense-stills/desktop-dark-typing.png',
    objectPosition: 'center bottom',
  });

  return Object.freeze({
    light: Object.freeze({ desktop: light, mobile: light }),
    dark: Object.freeze({ desktop: dark, mobile: dark }),
  });
};

const freezeRepresentativeStills = (
  stills: RazorSenseRepresentativeStills,
): RazorSenseRepresentativeStills =>
  Object.freeze({
    light: Object.freeze({
      desktop: freezeStill({ ...stills.light.desktop }),
      mobile: freezeStill({ ...stills.light.mobile }),
    }),
    dark: Object.freeze({
      desktop: freezeStill({ ...stills.dark.desktop }),
      mobile: freezeStill({ ...stills.dark.mobile }),
    }),
  });

const freezeProgram = <Target extends RazorSenseTarget>(
  program: RazorSenseProgramDescriptor<Target>,
): RazorSenseProgramDescriptor<Target> =>
  Object.freeze({
    ...program,
    target: Object.freeze({ ...program.target }),
    defaultPlayback: Object.freeze(program.defaultPlayback),
    supportedPlaybacks: Object.freeze([...program.supportedPlaybacks]),
    representativeStills: freezeRepresentativeStills(program.representativeStills),
    safeSeam: Object.freeze(program.safeSeam),
    terminalFrame: Object.freeze(program.terminalFrame),
    compatibleRendererFamilies: Object.freeze([...program.compatibleRendererFamilies]),
  });

const loopPlayback = (): RazorSenseResolvedPlaybackPlan => ({ playback: 'loop' });
const oncePlayback = (): RazorSenseResolvedPlaybackPlan => ({
  playback: 'once',
  endBehavior: 'hold',
});

const sourceEndTerminalFrame = (): RazorSenseTerminalFrame => ({
  kind: 'source-end',
  frameOffsetFromEnd: 1,
});

const terminalBoundary = (): RazorSenseSafeSeam => ({ kind: 'terminal-boundary' });

const RAZOR_SENSE_PROGRAMS: RazorSenseProgramManifest = Object.freeze({
  'state:idle': freezeProgram<RazorSenseStateTarget<'idle'>>({
    id: 'state:idle',
    target: { state: 'idle' },
    rendererFamily: 'authored',
    authoredAssetKey: 'neutral',
    visualMode: 'neutral',
    defaultPlayback: loopPlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('neutral'),
    safeSeam: { kind: 'source-loop', startTimeSeconds: 0, endTimeSeconds: 8.708 },
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'state:typing': freezeProgram<RazorSenseStateTarget<'typing'>>({
    id: 'state:typing',
    target: { state: 'typing' },
    rendererFamily: 'authored',
    authoredAssetKey: 'typing',
    visualMode: 'typing',
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createBottomWaveRepresentativeStills(),
    safeSeam: terminalBoundary(),
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'state:thinking': freezeProgram<RazorSenseStateTarget<'thinking'>>({
    id: 'state:thinking',
    target: { state: 'thinking' },
    rendererFamily: 'authored',
    authoredAssetKey: 'thinking',
    visualMode: 'thinking',
    defaultPlayback: loopPlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('thinking'),
    safeSeam: {
      kind: 'source-crossfade',
      startTimeSeconds: 0,
      endTimeSeconds: 4.5,
      overlapSeconds: 0.6,
    },
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'state:working': freezeProgram<RazorSenseStateTarget<'working'>>({
    id: 'state:working',
    target: { state: 'working' },
    rendererFamily: 'emotional',
    visualMode: 'calm',
    defaultPlayback: loopPlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('calm'),
    safeSeam: { kind: 'renderer-iteration' },
    terminalFrame: { kind: 'renderer-terminal' },
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'state:loading': freezeProgram<RazorSenseStateTarget<'loading'>>({
    id: 'state:loading',
    target: { state: 'loading' },
    rendererFamily: 'authored',
    authoredAssetKey: 'loading',
    visualMode: 'loading',
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('loading'),
    safeSeam: terminalBoundary(),
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'state:success': freezeProgram<RazorSenseStateTarget<'success'>>({
    id: 'state:success',
    target: { state: 'success' },
    rendererFamily: 'emotional',
    visualMode: 'joyful',
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('joyful'),
    safeSeam: { kind: 'renderer-iteration' },
    terminalFrame: { kind: 'renderer-terminal' },
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'state:caution': freezeProgram<RazorSenseStateTarget<'caution'>>({
    id: 'state:caution',
    target: { state: 'caution' },
    rendererFamily: 'emotional',
    visualMode: 'caution',
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('caution'),
    safeSeam: { kind: 'renderer-iteration' },
    terminalFrame: { kind: 'renderer-terminal' },
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'state:regret': freezeProgram<RazorSenseStateTarget<'regret'>>({
    id: 'state:regret',
    target: { state: 'regret' },
    rendererFamily: 'emotional',
    visualMode: 'regret',
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('regret'),
    safeSeam: { kind: 'renderer-iteration' },
    terminalFrame: { kind: 'renderer-terminal' },
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'preset:rippleWave': freezeProgram<RazorSensePresetTarget<'rippleWave'>>({
    id: 'preset:rippleWave',
    target: { preset: 'rippleWave' },
    rendererFamily: 'legacy',
    legacyPreset: 'rippleWave',
    defaultPlayback: loopPlayback(),
    supportedPlaybacks: ALL_PLAYBACKS,
    representativeStills: createProgramRepresentativeStills('ripple-wave.png'),
    safeSeam: { kind: 'renderer-iteration' },
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'preset:bottomWave': freezeProgram<RazorSensePresetTarget<'bottomWave'>>({
    id: 'preset:bottomWave',
    target: { preset: 'bottomWave' },
    rendererFamily: 'authored',
    authoredAssetKey: 'bottomWave',
    directVideoSources: Object.freeze({
      light: 'razorsense-presets/bottom-wave.mp4',
      dark: 'razorsense-presets/bottom-wave-dark.mp4',
    }),
    // The 10s, 25fps reference stays finite until a source-loop seam is authored.
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: FINITE_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('typing'),
    safeSeam: terminalBoundary(),
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'preset:success': freezeProgram<RazorSensePresetTarget<'success'>>({
    id: 'preset:success',
    target: { preset: 'success' },
    rendererFamily: 'legacy',
    legacyPreset: 'circleSlideUp',
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: ONE_SHOT_PLAYBACK,
    representativeStills: createProgramRepresentativeStills('success.png'),
    safeSeam: { kind: 'terminal-boundary', timeSeconds: 0.75 },
    terminalFrame: { kind: 'source-time', timeSeconds: 0.75 },
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'preset:compactLoader': freezeProgram<RazorSensePresetTarget<'compactLoader'>>({
    id: 'preset:compactLoader',
    target: { preset: 'compactLoader' },
    rendererFamily: 'authored',
    authoredAssetKey: 'loading',
    visualMode: 'loading',
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: FINITE_PLAYBACKS,
    representativeStills: createModeRepresentativeStills('loading'),
    safeSeam: terminalBoundary(),
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
  'preset:audioWave': freezeProgram<RazorSensePresetTarget<'audioWave'>>({
    id: 'preset:audioWave',
    target: { preset: 'audioWave' },
    rendererFamily: 'authored',
    authoredAssetKey: 'audioWave',
    directVideoSources: Object.freeze({
      light: 'razorsense-presets/audio-wave.mp4',
      dark: 'razorsense-presets/audio-wave.mp4',
    }),
    defaultPlayback: oncePlayback(),
    supportedPlaybacks: ONE_SHOT_PLAYBACK,
    representativeStills: createProgramRepresentativeStills('audio-wave.png'),
    safeSeam: terminalBoundary(),
    terminalFrame: sourceEndTerminalFrame(),
    compatibleRendererFamilies: RAZOR_SENSE_RENDERER_FAMILIES,
  }),
});

const RAZOR_SENSE_PROGRAM_IDS = Object.freeze(
  Object.keys(RAZOR_SENSE_PROGRAMS) as RazorSenseProgramId[],
);

const getRazorSenseDirectVideoSource = (
  program: RazorSenseProgramDescriptor,
  appearance: RazorSenseAppearance,
): string | undefined =>
  program.rendererFamily === 'authored' && 'directVideoSources' in program
    ? program.directVideoSources[appearance]
    : undefined;

const createTransitionDescriptor = (
  from: RazorSenseProgramId,
  to: RazorSenseProgramId,
): RazorSenseTransitionDescriptor => {
  const outgoing = RAZOR_SENSE_PROGRAMS[from];
  const incoming = RAZOR_SENSE_PROGRAMS[to];
  if (from === to) {
    return Object.freeze({
      from,
      to,
      strategy: 'program-continuation',
      duration: 'duration.quick',
      easing: 'easing.standard',
      overlap: 1,
    });
  }
  if (outgoing.rendererFamily === 'emotional' && incoming.rendererFamily === 'emotional') {
    return Object.freeze({
      from,
      to,
      strategy: 'material-morph',
      duration: 'duration.2xgentle',
      easing: 'easing.standard',
      overlap: 1,
    });
  }
  const isThinkingTypingPair =
    (from === 'state:thinking' && to === 'state:typing') ||
    (from === 'state:typing' && to === 'state:thinking');
  const isFieldLoaderPair =
    outgoing.rendererFamily === 'authored' &&
    incoming.rendererFamily === 'authored' &&
    ((outgoing.visualMode === 'neutral' && incoming.visualMode === 'loading') ||
      (outgoing.visualMode === 'loading' && incoming.visualMode === 'neutral'));
  if (isThinkingTypingPair || isFieldLoaderPair) {
    return Object.freeze({
      from,
      to,
      strategy: 'material-morph',
      duration: 'duration.2xgentle',
      easing: 'easing.standard',
      overlap: 1,
    });
  }
  if (outgoing.rendererFamily === 'authored' && incoming.rendererFamily === 'authored') {
    return Object.freeze({
      from,
      to,
      strategy: 'authored-crossfade',
      duration: 'duration.gentle',
      easing: 'easing.standard',
      overlap: 1,
    });
  }
  if (
    (outgoing.rendererFamily === 'authored' || outgoing.rendererFamily === 'emotional') &&
    (incoming.rendererFamily === 'authored' || incoming.rendererFamily === 'emotional')
  ) {
    return Object.freeze({
      from,
      to,
      strategy: 'semantic-crossfade',
      duration: 'duration.2xgentle',
      easing: 'easing.standard',
      overlap: 1,
    });
  }
  return Object.freeze({
    from,
    to,
    strategy: 'cross-renderer-fade',
    duration: 'duration.gentle',
    easing: 'easing.standard',
    overlap: 1,
  });
};

const RAZOR_SENSE_TRANSITION_REGISTRY: RazorSenseTransitionRegistry = Object.freeze(
  Object.fromEntries(
    RAZOR_SENSE_PROGRAM_IDS.flatMap((from) =>
      RAZOR_SENSE_PROGRAM_IDS.map((to) => [`${from}->${to}`, createTransitionDescriptor(from, to)]),
    ),
  ),
);

const STATE_SET: ReadonlySet<string> = new Set(RAZOR_SENSE_STATES);
const PRESET_SET: ReadonlySet<string> = new Set(RAZOR_SENSE_BRANDED_PRESETS);

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isRazorSenseState = (value: unknown): value is RazorSenseState =>
  typeof value === 'string' && STATE_SET.has(value);

const isRazorSenseBrandedPreset = (value: unknown): value is RazorSenseBrandedPreset =>
  typeof value === 'string' && PRESET_SET.has(value);

const isRazorSenseTarget = (value: unknown): value is RazorSenseTarget => {
  if (!isObject(value)) return false;
  const hasStateValue = value.state !== undefined;
  const hasPresetValue = value.preset !== undefined;
  if (hasStateValue === hasPresetValue) return false;
  return hasStateValue ? isRazorSenseState(value.state) : isRazorSenseBrandedPreset(value.preset);
};

const readRazorSenseTarget = (value: unknown): RazorSenseTarget | undefined => {
  if (!isRazorSenseTarget(value)) return undefined;
  return 'state' in value && value.state !== undefined
    ? { state: value.state }
    : { preset: value.preset };
};

const getRazorSenseProgramId = <Target extends RazorSenseTarget>(
  target: Target,
): RazorSenseProgramIdFor<Target> =>
  ('state' in target && target.state !== undefined
    ? `state:${target.state}`
    : `preset:${target.preset}`) as RazorSenseProgramIdFor<Target>;

const getRazorSenseProgram = <Target extends RazorSenseTarget>(
  target: Target,
): RazorSenseProgramDescriptor<Target> => {
  if (!isRazorSenseTarget(target)) {
    throw new RazorSenseError('RazorSense target must contain exactly one known state or preset.', {
      code: 'invalid-target',
      recoverable: false,
      originalError: target,
    });
  }
  return RAZOR_SENSE_PROGRAMS[
    getRazorSenseProgramId(target) as RazorSenseProgramId
  ] as RazorSenseProgramDescriptor<Target>;
};

const resolveRazorSenseTransition = (
  previousTarget: RazorSenseTarget | undefined,
  target: RazorSenseTarget,
  transition: RazorSenseTransition,
): RazorSenseTransitionDescriptor => {
  const to = getRazorSenseProgramId(target) as RazorSenseProgramId;
  const from = previousTarget
    ? (getRazorSenseProgramId(previousTarget) as RazorSenseProgramId)
    : to;
  const registered = RAZOR_SENSE_TRANSITION_REGISTRY[`${from}->${to}`];
  if (transition === 'cut') {
    return Object.freeze({
      ...registered,
      strategy: 'cut',
      duration: 'duration.2xquick',
      overlap: 0,
    });
  }
  if (typeof transition === 'object') {
    return Object.freeze({ ...registered, duration: transition.duration });
  }
  return registered;
};

const getRazorSenseModeForState = (state: RazorSenseState): RazorSenseMode =>
  RAZOR_SENSE_STATE_TO_MODE[state];

const isValidRazorSenseRepeatCount = (repeatCount: unknown): repeatCount is number =>
  typeof repeatCount === 'number' && Number.isSafeInteger(repeatCount) && repeatCount >= 0;

const assertValidRazorSenseRepeatCount: (repeatCount: unknown) => asserts repeatCount is number = (
  repeatCount,
) => {
  if (isValidRazorSenseRepeatCount(repeatCount)) return;
  throw new RazorSenseError(
    'RazorSense repeatCount must be a non-negative safe integer. It counts iterations after the first.',
    {
      code: 'invalid-repeat-count',
      recoverable: false,
      originalError: repeatCount,
    },
  );
};

const isRazorSensePlaybackSupported = (
  target: RazorSenseTarget,
  playback: RazorSensePlaybackProps['playback'] = 'automatic',
): boolean =>
  playback === undefined ||
  playback === 'automatic' ||
  getRazorSenseProgram(target).supportedPlaybacks.includes(playback);

type RazorSensePlaybackValidationErrorCode = Extract<
  RazorSenseErrorCode,
  'invalid-playback' | 'invalid-repeat-count' | 'invalid-end-behavior' | 'unsupported-playback'
>;

const throwPlaybackValidationError = (
  target: RazorSenseTarget,
  program: RazorSenseProgramDescriptor,
  code: RazorSensePlaybackValidationErrorCode,
  message: string,
  originalError: unknown,
): never => {
  throw new RazorSenseError(message, {
    code,
    recoverable: false,
    target,
    rendererFamily: program.rendererFamily,
    originalError,
  });
};

const isValidEndBehavior = (value: unknown): value is RazorSenseEndBehavior =>
  value === 'hold' || value === 'reset-to-start';

const PLAYBACK_PROP_KEYS: ReadonlySet<string> = new Set(['playback', 'repeatCount', 'endBehavior']);

const resolveRazorSensePlayback = (
  target: RazorSenseTarget,
  playbackProps: RazorSensePlaybackProps = {},
): RazorSenseResolvedPlaybackPlan => {
  const program = getRazorSenseProgram(target);
  const rawPlaybackProps: unknown = playbackProps;
  if (!isObject(rawPlaybackProps) || Array.isArray(rawPlaybackProps)) {
    return throwPlaybackValidationError(
      target,
      program,
      'invalid-playback',
      'RazorSense playback options must be an object.',
      rawPlaybackProps,
    );
  }

  const unexpectedKeys = Object.keys(rawPlaybackProps).filter(
    (key) => !PLAYBACK_PROP_KEYS.has(key),
  );
  if (unexpectedKeys.length > 0) {
    return throwPlaybackValidationError(
      target,
      program,
      'invalid-playback',
      `RazorSense playback options contain unsupported fields: ${unexpectedKeys.join(', ')}.`,
      rawPlaybackProps,
    );
  }

  const playback = rawPlaybackProps.playback ?? 'automatic';
  const repeatCount = rawPlaybackProps.repeatCount;
  const endBehavior = rawPlaybackProps.endBehavior;
  const assertSupported = (explicitPlayback: RazorSenseExplicitPlayback): void => {
    if (program.supportedPlaybacks.includes(explicitPlayback)) return;
    throwPlaybackValidationError(
      target,
      program,
      'unsupported-playback',
      `RazorSense ${getRazorSenseProgramId(
        target,
      )} does not support playback="${explicitPlayback}".`,
      rawPlaybackProps,
    );
  };

  if (playback === 'automatic') {
    if (repeatCount !== undefined || endBehavior !== undefined) {
      return throwPlaybackValidationError(
        target,
        program,
        'invalid-playback',
        'RazorSense automatic playback cannot declare repeatCount or endBehavior.',
        rawPlaybackProps,
      );
    }
    return program.defaultPlayback;
  }

  if (playback === 'loop') {
    if (repeatCount !== undefined || endBehavior !== undefined) {
      return throwPlaybackValidationError(
        target,
        program,
        'invalid-playback',
        'RazorSense loop playback cannot declare repeatCount or endBehavior.',
        rawPlaybackProps,
      );
    }
    assertSupported(playback);
    return Object.freeze({ playback: 'loop' });
  }

  if (playback === 'repeat') {
    if (!isValidRazorSenseRepeatCount(repeatCount)) {
      return throwPlaybackValidationError(
        target,
        program,
        'invalid-repeat-count',
        'RazorSense repeatCount must be a non-negative safe integer.',
        repeatCount,
      );
    }
    if (endBehavior !== undefined && !isValidEndBehavior(endBehavior)) {
      return throwPlaybackValidationError(
        target,
        program,
        'invalid-end-behavior',
        'RazorSense endBehavior must be hold or reset-to-start.',
        endBehavior,
      );
    }
    assertSupported(playback);
    return Object.freeze({
      playback,
      repeatCount,
      endBehavior: endBehavior ?? 'hold',
    });
  }

  if (playback !== 'once') {
    return throwPlaybackValidationError(
      target,
      program,
      'invalid-playback',
      'RazorSense playback must be automatic, once, repeat, or loop.',
      playback,
    );
  }
  if (repeatCount !== undefined) {
    return throwPlaybackValidationError(
      target,
      program,
      'invalid-repeat-count',
      'RazorSense repeatCount is valid only when playback="repeat".',
      repeatCount,
    );
  }
  if (endBehavior !== undefined && !isValidEndBehavior(endBehavior)) {
    return throwPlaybackValidationError(
      target,
      program,
      'invalid-end-behavior',
      'RazorSense endBehavior must be hold or reset-to-start.',
      endBehavior,
    );
  }
  assertSupported(playback);
  return Object.freeze({
    playback: 'once',
    endBehavior: endBehavior ?? 'hold',
  });
};

const isNonNegativeFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const isValidRazorSenseTransition = (value: unknown): value is RazorSenseTransition =>
  value === 'automatic' ||
  value === 'cut' ||
  (isObject(value) &&
    !Array.isArray(value) &&
    Object.keys(value).length === 1 &&
    Object.prototype.hasOwnProperty.call(value, 'duration') &&
    typeof value.duration === 'string' &&
    TRANSITION_DURATION_TOKENS.has(value.duration));

const validateRazorSenseSequenceDefinition = (
  definition: unknown,
  options: RazorSenseSequenceValidationOptions = {},
): RazorSenseSequenceValidationResult => {
  const issues: RazorSenseSequenceValidationIssue[] = [];
  if (!isObject(definition)) {
    return {
      valid: false,
      issues: [
        {
          code: 'empty-sequence',
          path: 'sequence',
          message: 'RazorSense sequence must be an object with an id and at least one step.',
        },
      ],
    };
  }

  if (typeof definition.id !== 'string' || definition.id.trim().length === 0) {
    issues.push({
      code: 'empty-sequence-id',
      path: 'id',
      message: 'RazorSense sequence id must be a non-empty string.',
    });
  }
  if (
    definition.endBehavior !== undefined &&
    definition.endBehavior !== 'hold' &&
    definition.endBehavior !== 'reset-to-start'
  ) {
    issues.push({
      code: 'invalid-end-behavior',
      path: 'endBehavior',
      message: 'Sequence endBehavior must be hold or reset-to-start.',
    });
  }
  if (!Array.isArray(definition.steps) || definition.steps.length === 0) {
    issues.push({
      code: 'empty-sequence',
      path: 'steps',
      message: 'RazorSense sequence must contain at least one step.',
    });
    return { valid: false, issues };
  }

  const stepIds = new Set<string>();
  definition.steps.forEach((step, index) => {
    const path = `steps[${index}]`;
    if (!isObject(step)) {
      issues.push({
        code: 'invalid-target',
        path,
        message: 'RazorSense sequence step must be an object.',
      });
      return;
    }

    if (typeof step.id !== 'string' || step.id.trim().length === 0) {
      issues.push({
        code: 'empty-step-id',
        path: `${path}.id`,
        message: 'Every RazorSense sequence step needs a non-empty id.',
      });
    } else if (stepIds.has(step.id)) {
      issues.push({
        code: 'duplicate-step-id',
        path: `${path}.id`,
        message: `RazorSense sequence step id "${step.id}" is duplicated.`,
      });
    } else {
      stepIds.add(step.id);
    }

    const target = readRazorSenseTarget(step);
    if (!target) {
      issues.push({
        code: 'invalid-target',
        path,
        message: 'Step must contain exactly one known state or preset.',
      });
    }

    if (step.delayBeforeMs !== undefined && !isNonNegativeFiniteNumber(step.delayBeforeMs)) {
      issues.push({
        code: 'invalid-delay',
        path: `${path}.delayBeforeMs`,
        message: 'delayBeforeMs must be a non-negative finite number.',
      });
    }
    if (step.holdAfterMs !== undefined && !isNonNegativeFiniteNumber(step.holdAfterMs)) {
      issues.push({
        code: 'invalid-hold',
        path: `${path}.holdAfterMs`,
        message: 'holdAfterMs must be a non-negative finite number.',
      });
    }
    if (step.transition !== undefined && !isValidRazorSenseTransition(step.transition)) {
      issues.push({
        code: 'invalid-transition',
        path: `${path}.transition`,
        message: 'transition must be automatic, cut, or a Blade motion-duration token override.',
      });
    }
    if (step.endBehavior !== undefined) {
      issues.push({
        code: 'invalid-end-behavior',
        path: `${path}.endBehavior`,
        message: 'Sequence endBehavior belongs on the sequence definition, not an individual step.',
      });
    }

    const playback = step.playback ?? 'once';
    if (playback !== 'once' && playback !== 'repeat' && playback !== 'loop') {
      issues.push({
        code: 'invalid-playback',
        path: `${path}.playback`,
        message: 'Sequence playback must be once, repeat, or loop.',
      });
      return;
    }
    if (target && !isRazorSensePlaybackSupported(target, playback)) {
      issues.push({
        code: 'unsupported-playback',
        path: `${path}.playback`,
        message: `${getRazorSenseProgramId(target)} does not support playback="${playback}".`,
      });
    }
    if (playback === 'repeat' && !isValidRazorSenseRepeatCount(step.repeatCount)) {
      issues.push({
        code: 'invalid-repeat-count',
        path: `${path}.repeatCount`,
        message: 'repeatCount must be a non-negative safe integer.',
      });
    }
    if (playback !== 'repeat' && step.repeatCount !== undefined) {
      issues.push({
        code: 'invalid-repeat-count',
        path: `${path}.repeatCount`,
        message: 'repeatCount is valid only when playback="repeat".',
      });
    }
    if (playback === 'loop') {
      if (step.advance !== 'manual') {
        issues.push({
          code: 'invalid-advance',
          path: `${path}.advance`,
          message: 'A looping sequence step must use advance="manual".',
        });
      }
      if (step.holdAfterMs !== undefined) {
        issues.push({
          code: 'invalid-hold',
          path: `${path}.holdAfterMs`,
          message: 'A looping sequence step cannot declare holdAfterMs.',
        });
      }
    } else if (
      step.advance !== undefined &&
      step.advance !== 'manual' &&
      step.advance !== 'on-complete'
    ) {
      issues.push({
        code: 'invalid-advance',
        path: `${path}.advance`,
        message: 'Finite steps use advance="on-complete" or advance="manual".',
      });
    }
    if (options.hasController === false && step.advance === 'manual') {
      issues.push({
        code: 'manual-advance-requires-controller',
        path: `${path}.advance`,
        message: 'A manual-advance step needs a bound sequence controller.',
      });
    }
  });

  return { valid: issues.length === 0, issues };
};

const assertValidRazorSenseSequenceDefinition: (
  definition: unknown,
  options?: RazorSenseSequenceValidationOptions,
) => asserts definition is RazorSenseSequenceDefinition = (definition, options) => {
  const result = validateRazorSenseSequenceDefinition(definition, options);
  if (result.valid) return;
  throw new RazorSenseError(
    `Invalid RazorSense sequence definition: ${result.issues
      .map((issue) => `${issue.path}: ${issue.message}`)
      .join(' ')}`,
    {
      code: 'invalid-sequence-definition',
      recoverable: false,
      originalError: result.issues,
    },
  );
};

export {
  getRazorSenseDirectVideoSource,
  MODE_REPRESENTATIVE_PHASE_SECONDS,
  RAZOR_SENSE_BRANDED_PRESETS,
  RAZOR_SENSE_PROGRAMS,
  RAZOR_SENSE_RENDERER_FAMILIES,
  RAZOR_SENSE_STATES,
  RAZOR_SENSE_STATE_TO_MODE,
  RAZOR_SENSE_TRANSITION_REGISTRY,
  assertValidRazorSenseRepeatCount,
  assertValidRazorSenseSequenceDefinition,
  getRazorSenseModeForState,
  getRazorSenseProgram,
  getRazorSenseProgramId,
  isRazorSenseBrandedPreset,
  isRazorSensePlaybackSupported,
  isRazorSenseState,
  isRazorSenseTarget,
  isValidRazorSenseTransition,
  isValidRazorSenseRepeatCount,
  resolveRazorSensePlayback,
  resolveRazorSenseTransition,
  validateRazorSenseSequenceDefinition,
};

export type {
  RazorSenseAppearance,
  RazorSenseAuthoredAssetKey,
  RazorSenseLegacyRendererPreset,
  RazorSenseProgramDescriptor,
  RazorSenseProgramId,
  RazorSenseProgramIdFor,
  RazorSenseProgramManifest,
  RazorSenseRepresentativeStill,
  RazorSenseRepresentativeStills,
  RazorSenseResolvedPlaybackPlan,
  RazorSenseSafeSeam,
  RazorSenseSequenceValidationIssue,
  RazorSenseSequenceValidationIssueCode,
  RazorSenseSequenceValidationOptions,
  RazorSenseSequenceValidationResult,
  RazorSenseTerminalFrame,
  RazorSenseTransitionDescriptor,
  RazorSenseTransitionRegistry,
  RazorSenseTransitionStrategy,
  RazorSenseViewport,
};
