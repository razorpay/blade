import {
  defineRazorSenseSequence,
  getRazorSenseSequenceDefinitionFingerprint,
} from '../defineRazorSenseSequence';
import {
  getRazorSenseBuiltInSequenceManifest,
  razorSenseLoginToDashboardJourney,
  razorSenseThreePhaseLoadingJourney,
} from '../razorSenseBuiltInSequences';

describe('defineRazorSenseSequence', () => {
  it('validates, clones, deeply freezes, and normalizes a sequence definition', () => {
    const input = {
      id: 'sequence-definition-freeze',
      steps: [
        {
          id: 'first',
          state: 'idle' as const,
          transition: { duration: 'duration.quick' as const },
        },
      ],
    };

    const definition = defineRazorSenseSequence(input);
    const equivalent = defineRazorSenseSequence({
      id: 'sequence-definition-freeze',
      steps: [
        {
          id: 'first',
          state: 'idle',
          playback: 'once',
          advance: 'on-complete',
          delayBeforeMs: 0,
          holdAfterMs: 0,
          transition: { duration: 'duration.quick' },
        },
      ],
      endBehavior: 'hold',
    });

    expect(definition).not.toBe(input);
    expect(definition.steps[0]).not.toBe(input.steps[0]);
    expect(Object.isFrozen(definition)).toBe(true);
    expect(Object.isFrozen(definition.steps)).toBe(true);
    expect(Object.isFrozen(definition.steps[0])).toBe(true);
    expect(Object.isFrozen(definition.steps[0].transition)).toBe(true);
    expect(getRazorSenseSequenceDefinitionFingerprint(definition)).toBe(
      getRazorSenseSequenceDefinitionFingerprint(equivalent),
    );
  });

  it('rejects renderer and compositor internals in consumer definitions', () => {
    expect(() =>
      defineRazorSenseSequence({
        id: 'sequence-definition-raw-internals',
        steps: [
          {
            id: 'first',
            state: 'idle',
            playback: 'once',
            mediaUrl: '/private.mp4',
            sourceTimeSeconds: 1.5,
            maskProgram: 'consumer-mask',
          },
        ],
      } as never),
    ).toThrow(/cannot contain media, timecode, mask, shader, callback, or compositor controls/i);
  });

  it('guards stable sequence ids from different definitions in development', () => {
    defineRazorSenseSequence({
      id: 'sequence-definition-id-collision',
      steps: [{ id: 'first', state: 'idle' }],
    });

    expect(() =>
      defineRazorSenseSequence({
        id: 'sequence-definition-id-collision',
        steps: [{ id: 'different', state: 'success' }],
      }),
    ).toThrow(/already registered with different steps/i);
  });
});

describe('RazorSense built-in sequences', () => {
  it('models three loader phases as distinct occurrences', () => {
    expect(razorSenseThreePhaseLoadingJourney.steps).toEqual([
      { id: 'phase-one', preset: 'compactLoader', playback: 'once' },
      { id: 'phase-two', preset: 'compactLoader', playback: 'once' },
      { id: 'phase-three', preset: 'compactLoader', playback: 'once' },
    ]);
    expect(new Set(razorSenseThreePhaseLoadingJourney.steps.map((step) => step.id)).size).toBe(3);
  });

  it('keeps calibrated login timing in a private manifest', () => {
    const manifest = getRazorSenseBuiltInSequenceManifest(razorSenseLoginToDashboardJourney);

    expect(manifest?.kind).toBe('login-to-dashboard');
    if (manifest?.kind !== 'login-to-dashboard') throw new Error('Missing login manifest');

    expect(manifest.authoredEdges).toEqual([
      { id: 'collapse-to-mark', startFrame: 149, endFrame: 171 },
      { id: 'expand-from-mark', startFrame: 296, endFrame: 330 },
    ]);
    expect(manifest.cues).toContainEqual({ cue: 'journey-copy-visible', sourceFrame: 305 });
    expect(manifest.cues).toContainEqual({ cue: 'dashboard-cards-visible', sourceFrame: 330 });
    expect(manifest.windows.find((window) => window.stepId === 'loader-three')).toEqual({
      stepId: 'loader-three',
      startFrame: 272,
      endFrame: 295,
      playbackRate: 1.5,
      sourceStartFrame: 0,
      sourceEndFrame: 35,
    });
    expect(Object.isFrozen(manifest)).toBe(true);
    expect(Object.isFrozen(manifest.cues)).toBe(true);
  });
});
