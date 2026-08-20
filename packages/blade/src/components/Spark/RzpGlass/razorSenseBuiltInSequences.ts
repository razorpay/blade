import { defineRazorSenseSequence } from './defineRazorSenseSequence';
import type { RazorSenseSequenceDefinition } from './razorSenseMotionTypes';

type RazorSenseLoginCue =
  | 'collapse-start'
  | 'form-covered'
  | 'loader-visible'
  | 'loader-one-complete'
  | 'loader-two-complete'
  | 'dashboard-reveal-start'
  | 'journey-copy-visible'
  | 'dashboard-shell-visible'
  | 'dashboard-content-visible'
  | 'dashboard-cards-visible';

type RazorSenseLoginForegroundSlot = 'source' | 'destination';

type RazorSenseLoginStepId =
  | 'login-ambient'
  | 'loader-one'
  | 'loader-two'
  | 'loader-three'
  | 'dashboard-ambient';

type RazorSenseThreePhaseLoadingStepId = 'phase-one' | 'phase-two' | 'phase-three';

type RazorSenseLoginTimelineCue = Readonly<{
  cue: RazorSenseLoginCue;
  sourceFrame: number;
}>;

type RazorSenseLoginTimelineWindow = Readonly<{
  stepId: RazorSenseLoginStepId;
  startFrame: number;
  endFrame: number;
  playbackRate?: number;
  sourceStartFrame?: number;
  sourceEndFrame?: number;
}>;

type RazorSenseBuiltInSequenceManifest =
  | Readonly<{
      kind: 'login-to-dashboard';
      sourceFramesPerSecond: 24;
      sourceEndFrame: 384;
      foregroundSlots: readonly RazorSenseLoginForegroundSlot[];
      statusLabel: 'Signing you in';
      authoredEdges: readonly [
        Readonly<{ id: 'collapse-to-mark'; startFrame: 149; endFrame: 171 }>,
        Readonly<{ id: 'expand-from-mark'; startFrame: 296; endFrame: 330 }>,
      ];
      windows: readonly RazorSenseLoginTimelineWindow[];
      cues: readonly RazorSenseLoginTimelineCue[];
    }>
  | Readonly<{
      kind: 'three-phase-loading';
      sourceFramesPerSecond: 24;
      sourceStartFrame: 0;
      sourceEndFrame: 74;
      stepIds: readonly RazorSenseThreePhaseLoadingStepId[];
    }>;

const razorSenseLoginToDashboardJourney = defineRazorSenseSequence<
  RazorSenseLoginCue,
  RazorSenseLoginForegroundSlot
>({
  id: 'razorsense.login-to-dashboard.v1',
  steps: [
    { id: 'login-ambient', state: 'idle', playback: 'once' },
    { id: 'loader-one', preset: 'compactLoader', playback: 'once' },
    { id: 'loader-two', preset: 'compactLoader', playback: 'once' },
    { id: 'loader-three', preset: 'compactLoader', playback: 'once' },
    { id: 'dashboard-ambient', state: 'idle', playback: 'once' },
  ],
  endBehavior: 'hold',
});

const razorSenseThreePhaseLoadingJourney = defineRazorSenseSequence({
  id: 'razorsense.three-phase-loading.v1',
  steps: [
    { id: 'phase-one', preset: 'compactLoader', playback: 'once' },
    { id: 'phase-two', preset: 'compactLoader', playback: 'once' },
    { id: 'phase-three', preset: 'compactLoader', playback: 'once' },
  ],
  endBehavior: 'hold',
});

const LOGIN_TO_DASHBOARD_MANIFEST: RazorSenseBuiltInSequenceManifest = {
  kind: 'login-to-dashboard',
  sourceFramesPerSecond: 24,
  sourceEndFrame: 384,
  foregroundSlots: ['source', 'destination'],
  statusLabel: 'Signing you in',
  authoredEdges: [
    { id: 'collapse-to-mark', startFrame: 149, endFrame: 171 },
    { id: 'expand-from-mark', startFrame: 296, endFrame: 330 },
  ],
  windows: [
    { stepId: 'login-ambient', startFrame: 0, endFrame: 171 },
    {
      stepId: 'loader-one',
      startFrame: 172,
      endFrame: 221,
      playbackRate: 1.5,
      sourceStartFrame: 0,
      sourceEndFrame: 74,
    },
    {
      stepId: 'loader-two',
      startFrame: 222,
      endFrame: 271,
      playbackRate: 1.5,
      sourceStartFrame: 0,
      sourceEndFrame: 74,
    },
    {
      stepId: 'loader-three',
      startFrame: 272,
      endFrame: 295,
      playbackRate: 1.5,
      sourceStartFrame: 0,
      sourceEndFrame: 35,
    },
    { stepId: 'dashboard-ambient', startFrame: 296, endFrame: 384 },
  ],
  cues: [
    { cue: 'collapse-start', sourceFrame: 149 },
    { cue: 'form-covered', sourceFrame: 159 },
    { cue: 'loader-visible', sourceFrame: 170 },
    { cue: 'loader-one-complete', sourceFrame: 221 },
    { cue: 'loader-two-complete', sourceFrame: 271 },
    { cue: 'dashboard-reveal-start', sourceFrame: 296 },
    { cue: 'journey-copy-visible', sourceFrame: 305 },
    { cue: 'dashboard-shell-visible', sourceFrame: 317 },
    { cue: 'dashboard-content-visible', sourceFrame: 324 },
    { cue: 'dashboard-cards-visible', sourceFrame: 330 },
  ],
};

const THREE_PHASE_LOADING_MANIFEST: RazorSenseBuiltInSequenceManifest = {
  kind: 'three-phase-loading',
  sourceFramesPerSecond: 24,
  sourceStartFrame: 0,
  sourceEndFrame: 74,
  stepIds: ['phase-one', 'phase-two', 'phase-three'],
};

const deepFreeze = <Value>(value: Value): Value => {
  if (typeof value !== 'object' || value === null || Object.isFrozen(value)) return value;
  Reflect.ownKeys(value).forEach((key) => deepFreeze(value[key as keyof typeof value]));
  return Object.freeze(value);
};

const manifestsByDefinition = new WeakMap<
  RazorSenseSequenceDefinition<string, string>,
  RazorSenseBuiltInSequenceManifest
>([
  [razorSenseLoginToDashboardJourney, deepFreeze(LOGIN_TO_DASHBOARD_MANIFEST)],
  [razorSenseThreePhaseLoadingJourney, deepFreeze(THREE_PHASE_LOADING_MANIFEST)],
]);

/** @internal Used by the presentation host; never export this from Blade's public barrel. */
const getRazorSenseBuiltInSequenceManifest = (
  definition: RazorSenseSequenceDefinition<string, string>,
): RazorSenseBuiltInSequenceManifest | undefined => manifestsByDefinition.get(definition);

export {
  getRazorSenseBuiltInSequenceManifest,
  razorSenseLoginToDashboardJourney,
  razorSenseThreePhaseLoadingJourney,
};

export type { RazorSenseLoginCue, RazorSenseLoginForegroundSlot };
