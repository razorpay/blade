import { VoiceMotion } from '../voice';
import type { FreshVoiceTune } from '../types';
import { voiceBottomLight } from '../../RazorSenseChat/voiceComps';

const tune: FreshVoiceTune = voiceBottomLight.values;

describe('VoiceMotion', () => {
  it('morphs in over its `in` and out over its `out`, on its ease, and is at rest again at the end', () => {
    const motion = new VoiceMotion(8);
    for (let i = 0; i < Math.ceil(tune.morph.in * 100); i++) motion.morph(0.01, true, tune);
    expect(motion.m).toBeCloseTo(1, 5);
    let isBack = false;
    for (let i = 0; i < Math.ceil(tune.morph.out * 100) + 1; i++)
      isBack = motion.morph(0.01, false, tune);
    expect(isBack).toBe(true);
    expect(motion.m).toBe(0);
  });

  it('springs each blob up with the voice and back down in silence; the middle of the row moves first', () => {
    // (each syllable gives each blob a random share: held even here)
    const random = jest.spyOn(Math, 'random').mockReturnValue(0.5);
    const motion = new VoiceMotion(8);
    const bands = [1, 1, 1, 1];
    let s = 0;
    for (let i = 0; i < 30; i++) motion.react(1 / 60, (s += 1 / 60), 0.9, bands, tune);
    const middle = motion.env[3];
    const end = motion.env[0];
    expect(middle).toBeGreaterThan(0.05);
    // (the ends hear it late, by their distance out)
    expect(middle).toBeGreaterThan(end);
    for (let i = 0; i < 240; i++) motion.react(1 / 60, (s += 1 / 60), 0, [0, 0, 0, 0], tune);
    expect(Math.abs(motion.env[3])).toBeLessThan(0.02);
    expect(motion.a).toBeLessThan(0.01);
    random.mockRestore();
  });

  it('goes to rest at once', () => {
    const motion = new VoiceMotion(4);
    motion.morph(1, true, tune);
    motion.react(0.1, 0.1, 1, [1, 1, 1, 1], tune);
    motion.reset();
    expect(motion.m).toBe(0);
    expect(motion.u).toBe(0);
    expect(Array.from(motion.env)).toEqual([0, 0, 0, 0]);
  });
});
