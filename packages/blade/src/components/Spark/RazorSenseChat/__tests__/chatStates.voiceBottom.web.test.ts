import { ChatStates } from '../chatStates';
import { chatLight } from '../comps';
import { voiceBottomLight } from '../voiceComps';
import type { VoiceBottom } from '../voiceBottom';
import type { ChatAnchors, ChatDriver } from '../chatDriver';
import type { FreshDoc, FreshEngine, FreshKey, FreshStops } from '../../RazorSenseEngine';
import type { FreshShapeFrame } from '../../RazorSenseEngine/types';

// The voice bottom's hand-over on the chat's engine (ChatStates with the real VoiceBottom), on a stand-in engine, driver and
// AudioContext: listening, the strip page's Comp 3 takes the row and, at full voice, the voice look's Colorama (the strip's own
// colour gone); off, it morphs back and the strip page itself is loaded again at m 0. Only the strip at rest's Comp 3 changes.

type Call = ['load', FreshDoc] | ['look', unknown];

/** an analyser on a loud voice (-12 dB: the level full), or on silence */
let isLoud = true;
const reads = jest.fn();
class FakeAudioContext {
  public state = 'running';
  public sampleRate = 48000;
  public createMediaStreamSource = (): unknown => ({ connect: jest.fn(), disconnect: jest.fn() });
  public createAnalyser = (): unknown => ({
    fftSize: 0,
    smoothingTimeConstant: 0,
    frequencyBinCount: 1024,
    getFloatTimeDomainData: (a: Float32Array): void => {
      reads();
      a.fill(isLoud ? 0.25 : 0);
    },
    getByteFrequencyData: (a: Uint8Array): void => {
      a.fill(isLoud ? 200 : 0);
    },
  });

  public close = (): Promise<void> => Promise.resolve();
  public resume = (): Promise<void> => Promise.resolve();
}

/** ten microtask turns: enough for the voice look's dynamic import to land */
const flush = (): Promise<void> =>
  Array.from({ length: 10 }).reduce<Promise<void>>(
    (turn) => turn.then(() => undefined),
    Promise.resolve(),
  );

const VOICE_STOPS = voiceBottomLight.colours[0].v as FreshStops;
const REST_STOPS: FreshStops = [
  { p: 0, c: '#000000' },
  { p: 1, c: '#ffffff' },
];

describe('ChatStates: the voice bottom’s hand-over', () => {
  const audioWindow = window as Window & { AudioContext?: unknown };
  const ownAudioContext = audioWindow.AudioContext;
  beforeEach(() => {
    isLoud = true;
    reads.mockReset();
    audioWindow.AudioContext = FakeAudioContext;
  });
  afterEach(() => {
    audioWindow.AudioContext = ownAudioContext;
  });

  const setup = (): {
    states: ChatStates;
    calls: Call[];
    run: (isListening: boolean, frames?: number) => void;
    voice: () => VoiceBottom;
  } => {
    const calls: Call[] = [];
    const engine = {
      load: jest.fn((exp: { doc: FreshDoc }) => {
        calls.push(['load', exp.doc]);
        return true;
      }),
      player: {
        look: jest.fn((hook: unknown) => calls.push(['look', hook])),
        tools: {
          evalTrack: (keys: FreshKey[]): unknown => keys[0].v,
          lerpStops: (a: FreshStops, b: FreshStops, w: number): FreshStops =>
            w >= 1 ? b : w <= 0 ? a : a,
        },
      },
    };
    const driver = ({
      setDrop: jest.fn(),
      isAtRest: () => true,
      restComp: () => 'c3',
      clearOutcome: jest.fn(),
      playOutcome: jest.fn(),
    } as unknown) as ChatDriver;
    const anchors = ({
      bar: { top: 600, width: 840, height: 60 },
      leaveAt: 800,
    } as unknown) as ChatAnchors;
    const states = new ChatStates((engine as unknown) as FreshEngine, chatLight, {}, 'light', 1);
    const stream = ({ id: 'page-mic' } as unknown) as MediaStream;
    let now = 1000;
    const run = (isListening: boolean, frames = 1): void => {
      states.inputs = { isOffline: false, isListening, voiceStream: stream };
      for (let i = 0; i < frames; i++) states.frame(1 / 60, (now += 1000 / 60), driver, anchors);
    };
    const voice = (): VoiceBottom => ((states as unknown) as { voice: VoiceBottom }).voice;
    return { states, calls, run, voice };
  };

  const rowIn = (d: FreshDoc, comp: string): boolean => {
    const entry = ((d.stack as { id: string; doc: FreshDoc }[] | undefined) ?? []).find(
      (e) => e.id === comp,
    );
    return ((entry?.doc.shapes as { id: string }[] | undefined) ?? []).some((s) => s.id === 'vx0');
  };
  const blob = (): FreshShapeFrame => ({
    ...(JSON.parse(JSON.stringify(voiceBottomLight.tpl)) as FreshShapeFrame),
    id: 'vx3',
    sx: 1,
    sy: 1,
    op: 1,
  });

  it('listening: at full voice the strip page’s Comp 3 is the voice look (the row up, its Colorama the voice’s), the rest untouched', async () => {
    const { states, calls, run, voice } = setup();
    run(true);
    await flush();
    run(true, 90);
    const { motion, look } = voice();
    expect(motion.m).toBeCloseTo(1, 6);
    // (the strip page with the row in its Comp 3, and the look)
    const loaded = calls.filter((c): c is ['load', FreshDoc] => c[0] === 'load').pop();
    expect(loaded && rowIn(loaded[1], 'c3')).toBe(true);
    expect(loaded && rowIn(loaded[1], 'b_c3')).toBe(false);
    expect(calls[calls.length - 1]).toEqual(['look', look]);
    // the row drawn, and on the strip's top edge
    const o = blob();
    look.shape?.(o, 'c3', 0);
    expect(o.op).toBeGreaterThan(0);
    expect(o.sy).toBeGreaterThan(voiceBottomLight.values.look.rest);
    // Comp 3's Colorama: the voice look's, all the way (the strip's own colour gone at full voice)
    const P = look.params?.({ stops: REST_STOPS, cInGam: 1 }, 'c3', 0);
    expect(P?.stops).toEqual(VOICE_STOPS);
    // (the other strip page, and every other comp, as they are)
    const other = blob();
    look.shape?.(other, 'b_c3', 0);
    expect(other).toEqual(blob());
    expect(look.params?.({ stops: REST_STOPS }, 'root', 0).stops).toBe(REST_STOPS);
    states.destroy();
  });

  it('listening in silence: the strip breathes in its own colour, the voice’s only its silent share (speechtest 2’s scol)', async () => {
    isLoud = false;
    const { states, run, voice } = setup();
    run(true);
    await flush();
    run(true, 90);
    const { look } = voice();
    const P = look.params?.({ stops: REST_STOPS, cInGam: 1 }, 'c3', 0);
    // (lerpStops here: the voice's only at 1; in silence it's scol = 3% of the way)
    expect(P?.stops).toBe(REST_STOPS);
    expect(((voice() as unknown) as { cm: number }).cm).toBeCloseTo(
      voiceBottomLight.values.look.scol,
      6,
    );
    states.destroy();
  });

  it('off: read no more, it morphs back, and the strip page itself is loaded again at m 0', async () => {
    const { states, calls, run, voice } = setup();
    run(true);
    await flush();
    run(true, 90);
    const before = reads.mock.calls.length;
    run(false, 20);
    expect(voice().motion.m).toBeGreaterThan(0);
    // (on the way out the voice isn't read: the row falls in silence, as speechtest 2 has it)
    expect(reads.mock.calls.length).toBe(before);
    run(false, 60);
    expect(voice().motion.u).toBe(0);
    const loads = calls.filter((c) => c[0] === 'load');
    expect(loads[loads.length - 1]).toEqual(['load', chatLight]);
    expect(calls[calls.length - 1]).toEqual(['load', chatLight]);
    expect(calls).toContainEqual(['look', null]);
    states.destroy();
  });
});
