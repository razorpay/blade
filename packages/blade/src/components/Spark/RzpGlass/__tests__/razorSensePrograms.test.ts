import type {
  RazorSenseController,
  RazorSenseControllerPlayOptions,
  RazorSensePreset,
  RazorSenseSequenceStep,
  RazorSenseTarget,
} from '../razorSenseMotionTypes';
import { RazorSenseError } from '../razorSenseMotionTypes';
import {
  RAZOR_SENSE_PROGRAMS,
  RAZOR_SENSE_TRANSITION_REGISTRY,
  isValidRazorSenseTransition,
  resolveRazorSensePlayback,
  resolveRazorSenseTransition,
  validateRazorSenseSequenceDefinition,
} from '../razorSensePrograms';

const expectPlaybackError = (callback: () => void, code: RazorSenseError['code']): void => {
  try {
    callback();
    throw new Error(`Expected RazorSenseError with code ${code}`);
  } catch (error: unknown) {
    expect(error).toBeInstanceOf(RazorSenseError);
    expect((error as RazorSenseError).code).toBe(code);
  }
};

const verifyTypeContracts = (): void => {
  const legacyPreset: RazorSensePreset = 'circleSlideUp';
  const brandedPreset: RazorSensePreset = 'audioWave';
  const validAudioStep: RazorSenseSequenceStep = {
    id: 'audio',
    preset: 'audioWave',
    playback: 'once',
  };

  // @ts-expect-error audioWave is a one-shot preset.
  const invalidAudioLoop: RazorSenseSequenceStep = {
    id: 'audio-loop',
    preset: 'audioWave',
    playback: 'loop',
    advance: 'manual',
  };

  const controller = (undefined as unknown) as RazorSenseController;
  const broadTarget = (undefined as unknown) as RazorSenseTarget;
  controller.play(broadTarget, { playback: 'once' });
  // @ts-expect-error A broad target can include a one-shot preset, so loop is unsafe.
  controller.play(broadTarget, { playback: 'loop' });

  type BroadPlayOptions = RazorSenseControllerPlayOptions<RazorSenseTarget>;
  const validBroadOptions: BroadPlayOptions = { playback: 'once' };
  // @ts-expect-error A broad target cannot promise loop support.
  const invalidBroadOptions: BroadPlayOptions = { playback: 'loop' };

  void [
    legacyPreset,
    brandedPreset,
    validAudioStep,
    invalidAudioLoop,
    validBroadOptions,
    invalidBroadOptions,
  ];
};

void verifyTypeContracts;

describe('RazorSense program foundation', () => {
  it('keeps manifest keys, ids, targets, and nested values immutable', () => {
    Object.entries(RAZOR_SENSE_PROGRAMS).forEach(([key, program]) => {
      expect(program.id).toBe(key);
      expect(Object.isFrozen(program)).toBe(true);
      expect(Object.isFrozen(program.target)).toBe(true);
      expect(Object.isFrozen(program.defaultPlayback)).toBe(true);
      expect(Object.isFrozen(program.supportedPlaybacks)).toBe(true);
      expect(Object.isFrozen(program.representativeStills)).toBe(true);
      expect(Object.isFrozen(program.representativeStills.light)).toBe(true);
      expect(Object.isFrozen(program.representativeStills.light.desktop)).toBe(true);
      expect(Object.isFrozen(program.safeSeam)).toBe(true);
      expect(Object.isFrozen(program.terminalFrame)).toBe(true);

      if ('state' in program.target) expect(key).toBe(`state:${program.target.state}`);
      else expect(key).toBe(`preset:${program.target.preset}`);
    });
  });

  it('provides executable renderer identities and one shared still per branded source', () => {
    const success = RAZOR_SENSE_PROGRAMS['preset:success'];
    const audioWave = RAZOR_SENSE_PROGRAMS['preset:audioWave'];
    expect(success.rendererFamily).toBe('legacy');
    if (success.rendererFamily === 'legacy') expect(success.legacyPreset).toBe('circleSlideUp');
    expect(audioWave.rendererFamily).toBe('authored');
    if (audioWave.rendererFamily === 'authored') {
      expect(audioWave.authoredAssetKey).toBe('audioWave');
    }

    const expectedFiles = {
      'preset:rippleWave': 'razorsense-stills/ripple-wave.png',
      'preset:success': 'razorsense-stills/success.png',
      'preset:audioWave': 'razorsense-stills/audio-wave.png',
    } as const;
    Object.entries(expectedFiles).forEach(([id, expectedFile]) => {
      const stills = RAZOR_SENSE_PROGRAMS[id as keyof typeof expectedFiles].representativeStills;
      expect(
        new Set([
          stills.light.desktop.file,
          stills.light.mobile.file,
          stills.dark.desktop.file,
          stills.dark.mobile.file,
        ]),
      ).toEqual(new Set([expectedFile]));
    });
  });

  it('holds bottomWave once and resolves terminal media at the last decodable frame', () => {
    expect(RAZOR_SENSE_PROGRAMS['preset:bottomWave'].defaultPlayback).toEqual({
      playback: 'once',
      endBehavior: 'hold',
    });

    const authoredPrograms = [
      RAZOR_SENSE_PROGRAMS['state:idle'],
      RAZOR_SENSE_PROGRAMS['state:typing'],
      RAZOR_SENSE_PROGRAMS['state:thinking'],
      RAZOR_SENSE_PROGRAMS['state:loading'],
      RAZOR_SENSE_PROGRAMS['preset:bottomWave'],
      RAZOR_SENSE_PROGRAMS['preset:compactLoader'],
      RAZOR_SENSE_PROGRAMS['preset:audioWave'],
    ];
    authoredPrograms.forEach((program) => {
      expect(program.terminalFrame).toEqual({ kind: 'source-end', frameOffsetFromEnd: 1 });
    });
  });

  it('rejects every invalid runtime playback combination', () => {
    expectPlaybackError(
      () => resolveRazorSensePlayback({ state: 'typing' }, null as never),
      'invalid-playback',
    );
    expectPlaybackError(
      () => resolveRazorSensePlayback({ state: 'typing' }, { playback: 'unsupported' } as never),
      'invalid-playback',
    );
    expectPlaybackError(
      () => resolveRazorSensePlayback({ preset: 'success' }, { playback: 'loop' } as never),
      'unsupported-playback',
    );
    expectPlaybackError(
      () =>
        resolveRazorSensePlayback({ state: 'typing' }, {
          playback: 'once',
          repeatCount: 1,
        } as never),
      'invalid-repeat-count',
    );
    expectPlaybackError(
      () =>
        resolveRazorSensePlayback({ state: 'typing' }, {
          playback: 'repeat',
          repeatCount: -1,
        } as never),
      'invalid-repeat-count',
    );
    expectPlaybackError(
      () =>
        resolveRazorSensePlayback({ state: 'thinking' }, {
          playback: 'loop',
          endBehavior: 'hold',
        } as never),
      'invalid-playback',
    );
    expectPlaybackError(
      () =>
        resolveRazorSensePlayback({ state: 'typing' }, {
          playback: 'once',
          endBehavior: 'invalid',
        } as never),
      'invalid-end-behavior',
    );
    expectPlaybackError(
      () =>
        resolveRazorSensePlayback({ state: 'typing' }, {
          playback: 'automatic',
          repeatCount: 1,
        } as never),
      'invalid-playback',
    );
    expectPlaybackError(
      () =>
        resolveRazorSensePlayback({ state: 'typing' }, {
          playback: 'once',
          shaderUniform: 1,
        } as never),
      'invalid-playback',
    );
  });

  it('uses a sound transition predicate and validates one-shot sequence presets', () => {
    expect(isValidRazorSenseTransition(undefined)).toBe(false);
    expect(isValidRazorSenseTransition({ duration: 'duration.quick' })).toBe(true);
    expect(isValidRazorSenseTransition({ duration: 'duration.quick', easing: 'linear' })).toBe(
      false,
    );

    const result = validateRazorSenseSequenceDefinition({
      id: 'invalid-audio-loop',
      steps: [
        {
          id: 'audio',
          preset: 'audioWave',
          playback: 'loop',
          advance: 'manual',
        },
      ],
    });
    expect(result).toMatchObject({
      valid: false,
      issues: expect.arrayContaining([
        expect.objectContaining({ code: 'unsupported-playback', path: 'steps[0].playback' }),
      ]),
    });

    const invalidStepEndBehavior = validateRazorSenseSequenceDefinition({
      id: 'invalid-step-end',
      steps: [{ id: 'typing', state: 'typing', endBehavior: 'hold' }],
    });
    expect(invalidStepEndBehavior.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'invalid-end-behavior', path: 'steps[0].endBehavior' }),
      ]),
    );

    const manualWithoutController = validateRazorSenseSequenceDefinition(
      {
        id: 'manual-without-controller',
        steps: [{ id: 'thinking', state: 'thinking', playback: 'loop', advance: 'manual' }],
      },
      { hasController: false },
    );
    expect(manualWithoutController.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'manual-advance-requires-controller',
          path: 'steps[0].advance',
        }),
      ]),
    );
  });

  it('registers a frozen transition strategy for every program pair', () => {
    const programIds = Object.keys(RAZOR_SENSE_PROGRAMS);
    expect(Object.keys(RAZOR_SENSE_TRANSITION_REGISTRY)).toHaveLength(
      programIds.length * programIds.length,
    );
    programIds.forEach((from) =>
      programIds.forEach((to) => {
        const descriptor = RAZOR_SENSE_TRANSITION_REGISTRY[`${from}->${to}`];
        expect(descriptor).toBeDefined();
        expect(Object.isFrozen(descriptor)).toBe(true);
        expect(descriptor).toMatchObject({ from, to });
      }),
    );

    const registered = resolveRazorSenseTransition(
      { state: 'thinking' },
      { state: 'success' },
      'automatic',
    );
    const overridden = resolveRazorSenseTransition(
      { state: 'thinking' },
      { state: 'success' },
      { duration: 'duration.quick' },
    );
    expect(
      resolveRazorSenseTransition({ state: 'thinking' }, { state: 'typing' }, 'automatic'),
    ).toMatchObject({
      strategy: 'material-morph',
      duration: 'duration.2xgentle',
      overlap: 1,
    });
    expect(
      resolveRazorSenseTransition({ state: 'idle' }, { preset: 'compactLoader' }, 'automatic'),
    ).toMatchObject({
      strategy: 'material-morph',
      duration: 'duration.2xgentle',
    });
    expect(overridden).toMatchObject({
      strategy: registered.strategy,
      easing: registered.easing,
      overlap: registered.overlap,
      duration: 'duration.quick',
    });
    expect(
      resolveRazorSenseTransition({ state: 'thinking' }, { state: 'success' }, 'cut'),
    ).toMatchObject({ strategy: 'cut', overlap: 0 });
  });
});
