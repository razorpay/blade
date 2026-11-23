import { BackgroundStates } from '../backgroundStates';
import { chatBackgroundDark } from '../comps';
import { voiceDashboardDark } from '../voiceComps';
import type { VoiceDashboard } from '../voiceDashboard';
import type { FreshDoc, FreshEngine, FreshKey, FreshStops } from '../../RazorSenseEngine';
import type { FreshShapeFrame } from '../../RazorSenseEngine/types';

// The voice dashboard's hand-over on the chat background's engine (BackgroundStates with the real VoiceDashboard), on a stand-in
// engine that keeps what it's asked: listening, the remnant morphs into the voice tab and is gone at m 1 (every shape the rest strip
// has is drawn at the voice tab's numbers, and the base's typing layer, stacked on the voice tab, is held at 0, never drawn over it);
// off, it morphs back and the rest strip itself is swapped back in at m 0.

type Call = ['load', FreshDoc] | ['look', unknown] | ['comp', string, { op?: number | null }];

const ROOM = { x: 376, y: 301 };
/** the chat background's LIFT (52 CSS px) in comp px: the voice look comes down by it */
const DROP = 104;

const setup = (): {
  states: BackgroundStates;
  calls: Call[];
  run: (isListening: boolean, frames?: number, voiceStream?: MediaStream) => void;
  voice: () => VoiceDashboard;
} => {
  const calls: Call[] = [];
  const engine = {
    load: jest.fn((exp: { doc: FreshDoc }) => {
      calls.push(['load', exp.doc]);
      return true;
    }),
    player: {
      look: jest.fn((hook: unknown) => calls.push(['look', hook])),
      comp: jest.fn((id: string, o: { op?: number | null }) => calls.push(['comp', id, o])),
      fade: jest.fn(),
      tools: {
        evalTrack: (keys: FreshKey[]): unknown => keys[0].v,
        lerpStops: (a: FreshStops, b: FreshStops, w: number): FreshStops => (w < 0.5 ? a : b),
      },
    },
  };
  const states = new BackgroundStates(
    (engine as unknown) as FreshEngine,
    chatBackgroundDark,
    {},
    'dark',
    ROOM,
    () => undefined,
  );
  let now = 1000;
  const run = (isListening: boolean, frames = 1, voiceStream?: MediaStream): void => {
    for (let i = 0; i < frames; i++) {
      states.frame(1 / 60, (now += 1000 / 60), { isOffline: false, isListening, voiceStream });
    }
  };
  const voice = (): VoiceDashboard => ((states as unknown) as { voice: VoiceDashboard }).voice;
  return { states, calls, run, voice };
};

/** ten microtask turns: enough for the voice look's dynamic import to land */
const flush = (): Promise<void> =>
  Array.from({ length: 10 }).reduce<Promise<void>>(
    (turn) => turn.then(() => undefined),
    Promise.resolve(),
  );

/** the shape as the engine hands it to the look: the voice tab's own numbers for that frame */
const frameOf = (id: string): FreshShapeFrame => {
  const shape = (voiceDashboardDark.doc.shapes as FreshShapeFrame[]).find((s) => s.id === id);
  return JSON.parse(JSON.stringify(shape)) as FreshShapeFrame;
};
const restOf = (id: string): FreshShapeFrame => {
  const shape = (chatBackgroundDark.shapes as FreshShapeFrame[]).find((s) => s.id === id);
  if (!shape) throw new Error(`the rest strip has no ${id}`);
  return shape;
};

const lastIndex = (calls: Call[], is: (c: Call) => boolean): number => {
  for (let i = calls.length - 1; i >= 0; i--) if (is(calls[i])) return i;
  return -1;
};
const isLoadOf = (doc: (d: FreshDoc) => boolean) => (c: Call): boolean =>
  c[0] === 'load' && doc(c[1]);
const isVoiceTab = (d: FreshDoc): boolean =>
  ((d.shapes as FreshShapeFrame[]) ?? []).some((s) => s.id === 'vx0');
const isTypingAtZero = (c: Call): boolean => c[0] === 'comp' && c[1] === 'ty' && c[2].op === 0;

describe('BackgroundStates: the voice dashboard’s hand-over', () => {
  it('listening: at m 1 the rest strip is gone (its shapes at the voice tab’s numbers, its typing layer held at 0)', async () => {
    const { states, calls, run, voice } = setup();
    run(true);
    await flush();
    run(true, 70);
    expect(voice().motion.m).toBeCloseTo(1, 6);
    // (the voice tab on the engine, with its look, and the base's typing layer stacked on it held at 0 after it)
    const loaded = lastIndex(calls, isLoadOf(isVoiceTab));
    expect(loaded).toBeGreaterThanOrEqual(0);
    expect(lastIndex(calls, isTypingAtZero)).toBeGreaterThan(loaded);
    expect(lastIndex(calls, (c) => c[0] === 'look' && c[1] === voice().look)).toBeGreaterThan(
      loaded,
    );
    // every shape of the rest strip: the voice tab's numbers, none of the rest's left (its blur, its drift, its path shift)
    const { look } = voice();
    const L = voiceDashboardDark.values.look;
    for (const id of ['s4', 's5']) {
      const o = frameOf(id);
      const voiceOwn = frameOf(id);
      look.shape?.(o, 'root', 0);
      for (const k of ['x', 'sx', 'sy', 'bh', 'bv', 'psA', 'alD', 'brA'] as const) {
        expect(o[k]).toBe(voiceOwn[k]);
      }
      expect(o.pts).toEqual(voiceOwn.pts);
      // (where speechtest has it on its chat box: its own dy, and the strip's lift taken back)
      expect(o.y).toBeCloseTo(voiceOwn.y + L.dy + DROP, 6);
    }
    // (and they're not the rest strip's: its blur and path shift are its own)
    expect(restOf('s4').bh).not.toBe(frameOf('s4').bh);
    expect(restOf('s4').psA).not.toBe(frameOf('s4').psA);
    states.destroy();
  });

  it('off: it morphs back to the rest strip’s own numbers, and the rest strip itself is swapped back in at m 0', async () => {
    const { states, calls, run, voice } = setup();
    run(true);
    await flush();
    run(true, 70);
    run(false, 20);
    // (on the way out: between the two)
    const m = voice().motion.m;
    expect(m).toBeGreaterThan(0.05);
    expect(m).toBeLessThan(0.95);
    run(false, 60);
    expect(voice().motion.u).toBe(0);
    // the base on the engine again, no look, its typing layer at 0
    const back = lastIndex(
      calls,
      isLoadOf((d) => d === chatBackgroundDark),
    );
    const voiceTab = lastIndex(calls, isLoadOf(isVoiceTab));
    expect(back).toBeGreaterThan(voiceTab);
    expect(lastIndex(calls, (c) => c[0] === 'look' && c[1] === null)).toBeGreaterThan(voiceTab);
    expect(lastIndex(calls, isTypingAtZero)).toBeGreaterThan(back);
    // and the look at m 0 is the rest strip, number for number (so the swap is the same picture)
    voice().motion.m = 0;
    const o = frameOf('s4');
    voice().look.shape?.(o, 'root', 0);
    const rest = restOf('s4');
    for (const k of ['x', 'y', 'sx', 'sy', 'bh', 'bv', 'psA', 'alD'] as const) {
      expect(o[k]).toBeCloseTo(rest[k] as number, 9);
    }
    (o.pts ?? []).forEach((p, i) => {
      expect(p.x).toBeCloseTo(rest.pts?.[i].x ?? NaN, 9);
      expect(p.y).toBeCloseTo(rest.pts?.[i].y ?? NaN, 9);
    });
    states.destroy();
  });

  it('reduced motion: settled listening, the voice tab with the base’s typing layer held at 0 (nothing else holds it there)', async () => {
    const { states, calls, voice } = setup();
    const inputs = { isOffline: false, isListening: true };
    states.settle(inputs, () => states.settle(inputs, () => undefined));
    await flush();
    expect(voice().motion.m).toBe(1);
    const loaded = lastIndex(calls, isLoadOf(isVoiceTab));
    expect(loaded).toBeGreaterThanOrEqual(0);
    expect(lastIndex(calls, isTypingAtZero)).toBeGreaterThan(loaded);
    states.destroy();
  });

  describe('the page’s voice', () => {
    const audioWindow = window as Window & { AudioContext?: unknown };
    const ownAudioContext = audioWindow.AudioContext;
    const reads = jest.fn();
    class FakeAudioContext {
      public state = 'running';
      public sampleRate = 48000;
      public createMediaStreamSource = (): unknown => ({
        connect: jest.fn(),
        disconnect: jest.fn(),
      });
      public createAnalyser = (): unknown => ({
        fftSize: 0,
        smoothingTimeConstant: 0,
        frequencyBinCount: 1024,
        getFloatTimeDomainData: (a: Float32Array): void => {
          reads();
          a.fill(0.25);
        },
        getByteFrequencyData: (a: Uint8Array): void => {
          a.fill(200);
        },
      });

      public close = (): Promise<void> => Promise.resolve();
      public resume = (): Promise<void> => Promise.resolve();
    }
    beforeEach(() => {
      reads.mockReset();
      audioWindow.AudioContext = FakeAudioContext;
    });
    afterEach(() => {
      audioWindow.AudioContext = ownAudioContext;
    });

    it('is read only while listening: on the way out the row falls in silence, as speechtest has it', async () => {
      const { states, run, voice } = setup();
      const stream = ({ id: 'page-mic' } as unknown) as MediaStream;
      run(true, 1, stream);
      await flush();
      run(true, 70, stream);
      expect(reads).toHaveBeenCalled();
      // (the voice in: the row up)
      expect(voice().motion.a).toBeGreaterThan(0.5);
      const before = reads.mock.calls.length;
      run(false, 20, stream);
      expect(voice().motion.m).toBeGreaterThan(0);
      expect(reads.mock.calls.length).toBe(before);
      // (silence in: the follow falls)
      expect(voice().motion.a).toBeLessThan(0.5);
      states.destroy();
    });
  });
});
