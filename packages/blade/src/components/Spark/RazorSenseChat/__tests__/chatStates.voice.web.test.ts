import { ChatStates } from '../chatStates';
import type { ChatStateInputs } from '../chatStates';
import type { ChatAnchors, ChatDriver } from '../chatDriver';
import type { FreshDoc, FreshEngine } from '../../RazorSenseEngine';

// On its still (jsdom: no WebGL2) nothing reads the page's voiceStream at all. Where it animates, the chat's states (ChatStates, for
// RazorSenseChat and RazorSenseBottomWave) read it through voice.ts's tapVoice: checked here on a stand-in engine, driver and
// AudioContext, so the rule is held where the reading is: only while listening (and online), never opening the microphone.

// the voice look, stood in for: it morphs all the way in or out in one frame
jest.mock('../voiceBottom', () => ({
  VoiceBottom: class {
    public motion = {
      u: 0,
      reset(): void {
        this.u = 0;
      },
    };

    public look = { shape: 'voice' };

    public compose = (doc: unknown): unknown => doc;

    public frame(_dt: number, _s: number, want: boolean): void {
      this.motion.u = want ? 1 : 0;
    }
  },
}));

/** an AudioContext stand-in: each made is kept, with what was asked of it */
const contexts: FakeAudioContext[] = [];
class FakeAudioContext {
  public state = 'running';
  public sampleRate = 48000;
  public readonly source = { connect: jest.fn(), disconnect: jest.fn() };
  public createMediaStreamSource = jest.fn((_stream: MediaStream) => this.source);
  public createAnalyser = jest.fn(() => ({
    fftSize: 0,
    smoothingTimeConstant: 0,
    frequencyBinCount: 1024,
    getFloatTimeDomainData: jest.fn(),
    getByteFrequencyData: jest.fn(),
  }));

  public close = jest.fn(() => Promise.resolve());
  public resume = jest.fn(() => Promise.resolve());

  constructor() {
    contexts.push(this);
  }
}

/** ten microtask turns: enough for the voice look's dynamic import to land */
const flush = (): Promise<void> =>
  Array.from({ length: 10 }).reduce<Promise<void>>(
    (turn) => turn.then(() => undefined),
    Promise.resolve(),
  );

describe('ChatStates: the page’s voiceStream', () => {
  const audioWindow = window as Window & { AudioContext?: unknown };
  const ownAudioContext = audioWindow.AudioContext;
  const getUserMedia = jest.fn();
  const hadMediaDevices = 'mediaDevices' in navigator;

  beforeEach(() => {
    contexts.length = 0;
    audioWindow.AudioContext = FakeAudioContext;
    if (!hadMediaDevices) {
      Object.defineProperty(navigator, 'mediaDevices', {
        value: { getUserMedia },
        configurable: true,
      });
    } else {
      jest.spyOn(navigator.mediaDevices, 'getUserMedia').mockImplementation(getUserMedia);
    }
  });

  afterEach(() => {
    audioWindow.AudioContext = ownAudioContext;
    if (!hadMediaDevices) delete (navigator as { mediaDevices?: unknown }).mediaDevices;
    jest.restoreAllMocks();
    getUserMedia.mockReset();
  });

  /** a chat at rest on its strip (thinking done), one frame at a time */
  const setup = (): {
    run: (inputs: ChatStateInputs, frames?: number) => void;
    engine: { load: jest.Mock; player: { look: jest.Mock; tools: unknown } };
    states: ChatStates;
  } => {
    const engine = { load: jest.fn(() => true), player: { look: jest.fn(), tools: {} } };
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
    const states = new ChatStates(
      (engine as unknown) as FreshEngine,
      ({} as unknown) as FreshDoc,
      {},
      'light',
      1,
    );
    let now = 1000;
    const run = (inputs: ChatStateInputs, frames = 1): void => {
      states.inputs = inputs;
      for (let i = 0; i < frames; i++) states.frame(1 / 60, (now += 1000 / 60), driver, anchors);
    };
    return { run, engine, states };
  };

  const makeStream = (): { stream: MediaStream; stop: jest.Mock } => {
    const stop = jest.fn();
    const stream = ({ id: 'page-mic', getTracks: () => [{ stop }] } as unknown) as MediaStream;
    return { stream, stop };
  };

  it('isn’t read while not listening, nor while listening offline', async () => {
    const { run, engine, states } = setup();
    const { stream } = makeStream();
    run({ isOffline: false, isListening: false, voiceStream: stream }, 30);
    await flush();
    run({ isOffline: false, isListening: false, voiceStream: stream }, 30);
    // (offline wins over listening: the voice look isn't wanted)
    run({ isOffline: true, isListening: true, voiceStream: stream }, 2);
    await flush();
    run({ isOffline: true, isListening: true, voiceStream: stream }, 30);
    expect(contexts).toHaveLength(0);
    // (nor was the voice look loaded on the engine)
    expect(engine.load).not.toHaveBeenCalled();
    states.destroy();
  });

  it('is read while listening (one analyser for it), and let go of once it’s back at rest, never stopped', async () => {
    const { run, engine, states } = setup();
    const { stream, stop } = makeStream();
    const listening = { isOffline: false, isListening: true, voiceStream: stream };
    // (the voice look's chunk loads the first time it listens)
    run(listening);
    await flush();
    run(listening, 30);
    expect(engine.player.look).toHaveBeenCalledWith({ shape: 'voice' });
    expect(contexts).toHaveLength(1);
    const [context] = contexts;
    expect(context.createMediaStreamSource).toHaveBeenCalledTimes(1);
    expect(context.createMediaStreamSource).toHaveBeenCalledWith(stream);
    expect(context.close).not.toHaveBeenCalled();

    // not listening: once the voice look is back at rest, its analyser goes (the stream itself is the page's)
    run({ isOffline: false, isListening: false, voiceStream: stream }, 30);
    expect(engine.player.look).toHaveBeenLastCalledWith(null);
    expect(context.source.disconnect).toHaveBeenCalled();
    expect(context.close).toHaveBeenCalledTimes(1);
    expect(contexts).toHaveLength(1);
    expect(stop).not.toHaveBeenCalled();
    expect(getUserMedia).not.toHaveBeenCalled();
    states.destroy();
  });

  it('says only the strip is drawn at rest, not while listening or while the voice look goes down (the chat’s rest crop)', async () => {
    const { run, states } = setup();
    const { stream } = makeStream();
    run({ isOffline: false, isListening: false });
    expect(states.isStripOnly()).toBe(true);
    run({ isOffline: false, isListening: true, voiceStream: stream });
    expect(states.isStripOnly()).toBe(false);
    await flush();
    run({ isOffline: false, isListening: true, voiceStream: stream }, 10);
    expect(states.isStripOnly()).toBe(false);
    // (listening stopped: the voice look is still loaded until it's back at rest)
    states.inputs = { isOffline: false, isListening: false, voiceStream: stream };
    expect(states.isStripOnly()).toBe(false);
    run({ isOffline: false, isListening: false, voiceStream: stream }, 30);
    expect(states.isStripOnly()).toBe(true);
    states.destroy();
  });

  it('is let go of at once when it goes offline while listening', async () => {
    const { run, states } = setup();
    const { stream, stop } = makeStream();
    run({ isOffline: false, isListening: true, voiceStream: stream });
    await flush();
    run({ isOffline: false, isListening: true, voiceStream: stream }, 5);
    expect(contexts).toHaveLength(1);
    run({ isOffline: true, isListening: true, voiceStream: stream });
    expect(contexts[0].close).toHaveBeenCalledTimes(1);
    run({ isOffline: true, isListening: true, voiceStream: stream }, 30);
    expect(contexts).toHaveLength(1);
    expect(stop).not.toHaveBeenCalled();
    states.destroy();
  });

  it('listening without a stream: nothing is read (the voice look as in silence)', async () => {
    const { run, engine, states } = setup();
    run({ isOffline: false, isListening: true });
    await flush();
    run({ isOffline: false, isListening: true }, 30);
    expect(engine.player.look).toHaveBeenCalledWith({ shape: 'voice' });
    expect(contexts).toHaveLength(0);
    expect(getUserMedia).not.toHaveBeenCalled();
    states.destroy();
  });
});
