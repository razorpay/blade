import { VoiceMotion } from '../voice';
import type { FreshVoiceTune } from '../types';
import { voiceDashboardDark } from '../../RazorSenseChatBackground/voiceComps';
import { voiceBottomLight } from '../../RazorSenseChat/voiceComps';
import { speechtestFrames } from './fixtures/speechtestFrames';

// VoiceMotion against speechtest's own numbers (fixtures/speechtestFrames: the pack's page.js + hook.js in the live pages, frame by
// frame): the same made-up sentence, the same seed, the same 60 fps. Its morph, its follow and every blob's spring must be the page's.

/** speechtest's made-up sentence (page.js FAKE and fakeRead, as they are) */
const FAKE = ((): { S: { t0: number; d: number; a: number; b: number[] }[]; len: number } => {
  let sd = 7;
  const rnd = (): number => {
    sd = (sd * 16807) % 2147483647;
    return sd / 2147483647;
  };
  const S: { t0: number; d: number; a: number; b: number[] }[] = [];
  let t = 0.3;
  for (let w = 0; w < 26; w++) {
    const n = 2 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const d = 0.11 + rnd() * 0.13;
      const v = rnd() < 0.7;
      S.push({
        t0: t,
        d,
        a: 0.55 + rnd() * 0.45,
        b: v
          ? [0.9 + rnd() * 0.1, 0.5 + rnd() * 0.5, 0.2 + rnd() * 0.4, 0.1 + rnd() * 0.3]
          : [0.3, 0.4, 0.6 + rnd() * 0.4, 0.7 + rnd() * 0.3],
      });
      t += d + 0.02 + rnd() * 0.04;
    }
    t += w % 7 === 6 ? 0.9 : 0.12 + rnd() * 0.18;
  }
  return { S, len: t + 0.6 };
})();
const fakeRead = (time: number): { lvl: number; B: number[] } => {
  const t = time % FAKE.len;
  let lvl = 0;
  const B = [0, 0, 0, 0];
  for (const q of FAKE.S) {
    const u = (t - q.t0) / q.d;
    if (u <= 0 || u >= 1) continue;
    const e =
      Math.sin(Math.PI * Math.min(1, u * 1.6)) ** 0.8 *
      (u > 0.62 ? 1 - (u - 0.62) / 0.38 : 1) *
      q.a;
    lvl = Math.max(lvl, e);
    for (let k = 0; k < 4; k++) B[k] = Math.max(B[k], e * q.b[k]);
  }
  return { lvl, B };
};

/** the harness's Math.random from voice on (x 16807 mod 2^31 - 1, as the sentence's own) */
const seeded = (seed: number): (() => number) => {
  let a = seed;
  return () => {
    a = (a * 16807) % 2147483647;
    return a / 2147483647;
  };
};

describe('VoiceMotion against speechtest, frame by frame', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([
    [
      'the voice dashboard, dark (speechtest.html)',
      voiceDashboardDark.values,
      'voiceDashboardDark',
    ],
    ['the voice bottom, light (speechtest2.html)', voiceBottomLight.values, 'voiceBottomLight'],
  ] as const)('%s: the morph, the follow and each spring', (_name, tune: FreshVoiceTune, key) => {
    const { rows } = speechtestFrames[key];
    const { on, seed } = speechtestFrames;
    const random = seeded(seed);
    jest.spyOn(Math, 'random').mockImplementation(random);
    const motion = new VoiceMotion(rows[0].length - 4);
    // (the page's clock: 60 fps from 10 s, the voice on 20 frames in)
    const nowAt = (k: number): number => 10000 + k * (1000 / 60);
    let ft = 0;
    let at = 0;
    let worst = 0;
    const last = rows[rows.length - 1][0];
    for (let j = 0; j <= last; j++) {
      const now = nowAt(20 + j);
      const dt = Math.min(0.05, (now - nowAt(19 + j)) / 1000);
      const isOn = j < on;
      let lvl = 0;
      let bands: number[] | null = null;
      if (isOn) {
        ft += dt;
        const r = fakeRead(ft);
        lvl = r.lvl;
        bands = r.B;
      }
      motion.morph(dt, isOn, tune);
      motion.react(dt, now / 1000, lvl, bands, tune);
      if (rows[at][0] !== j) continue;
      const page = rows[at].slice(1);
      const ours = [motion.u, motion.m, motion.a, ...Array.from(motion.env)];
      for (let i = 0; i < page.length; i++) worst = Math.max(worst, Math.abs(page[i] - ours[i]));
      at += 1;
    }
    expect(at).toBe(rows.length);
    // (the page's numbers kept to 12 digits)
    expect(worst).toBeLessThan(1e-9);
  });
});
