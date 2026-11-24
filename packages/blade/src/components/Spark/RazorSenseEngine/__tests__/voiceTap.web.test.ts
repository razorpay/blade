import { releaseVoice, tapVoice } from '../voice';

// A stream with no audio (the page hands in a video-only stream): its audio context is closed, not left open, and the stream isn't
// tried again each frame (the PR review: an AudioContext made before createMediaStreamSource threw was never closed).

const contexts: { closed: boolean }[] = [];
const analyserReads = jest.fn();
class FakeAudioContext {
  public state = 'running';
  public sampleRate = 48000;
  public closed = false;

  constructor() {
    contexts.push(this);
  }

  public createMediaStreamSource(stream: MediaStream): unknown {
    if (!stream.getAudioTracks().length) throw new Error('no audio track');
    return { connect: () => undefined, disconnect: () => undefined };
  }

  public createAnalyser(): unknown {
    return {
      fftSize: 0,
      smoothingTimeConstant: 0,
      frequencyBinCount: 1024,
      getFloatTimeDomainData: analyserReads,
      getByteFrequencyData: () => undefined,
    };
  }

  public close(): Promise<void> {
    this.closed = true;
    return Promise.resolve();
  }

  public resume(): Promise<void> {
    return Promise.resolve();
  }
}

const streamOf = (hasAudio: boolean): MediaStream =>
  (({ getAudioTracks: () => (hasAudio ? [{}] : []) } as unknown) as MediaStream);

describe('tapVoice', () => {
  const own = (window as { AudioContext?: unknown }).AudioContext;
  beforeEach(() => {
    contexts.length = 0;
    (window as { AudioContext?: unknown }).AudioContext = FakeAudioContext;
  });
  afterEach(() => {
    (window as { AudioContext?: unknown }).AudioContext = own;
  });

  it('a stream with no audio: its context is closed, and it isn’t tried again', () => {
    const stream = streamOf(false);
    for (let i = 0; i < 60; i++) expect(tapVoice(stream)).toBeNull();
    expect(contexts).toHaveLength(1);
    expect(contexts[0].closed).toBe(true);
  });

  it('a stream with audio: one context, shared, closed when the last user lets go', () => {
    const stream = streamOf(true);
    const a = tapVoice(stream);
    const b = tapVoice(stream);
    expect(a).not.toBeNull();
    expect(b).toBe(a);
    expect(contexts).toHaveLength(1);
    releaseVoice(stream, a!);
    expect(contexts[0].closed).toBe(false);
    releaseVoice(stream, b!);
    expect(contexts[0].closed).toBe(true);
  });

  it('the page stops its stream’s tracks but leaves listening on: its context closed then, read as silence, closed once', () => {
    const track = Object.assign(new EventTarget(), { readyState: 'live' as MediaStreamTrackState });
    const stream = (Object.assign(new EventTarget(), {
      getAudioTracks: () => [track],
    }) as unknown) as MediaStream;
    const tap = tapVoice(stream);
    expect(tap).not.toBeNull();
    expect(contexts[0].closed).toBe(false);
    track.readyState = 'ended';
    track.dispatchEvent(new Event('ended'));
    expect(contexts[0].closed).toBe(true);
    expect(tap!.read(1000).lvl).toBe(0);
    // (listening ends later: let go of it as usual, nothing closed twice)
    expect(() => releaseVoice(stream, tap!)).not.toThrow();
  });

  it('two components on one stream read its analyser once a frame (their own performance.now() differs; the frame doesn’t)', () => {
    const stream = streamOf(true);
    const a = tapVoice(stream)!;
    const b = tapVoice(stream)!;
    const timeline = Object.getOwnPropertyDescriptor(document, 'timeline');
    Object.defineProperty(document, 'timeline', {
      value: { currentTime: 1000 },
      configurable: true,
    });
    analyserReads.mockClear();
    a.read(1000.4);
    b.read(1001.3);
    expect(analyserReads).toHaveBeenCalledTimes(1);
    Object.defineProperty(document, 'timeline', {
      value: { currentTime: 1016.7 },
      configurable: true,
    });
    a.read(1016.9);
    b.read(1017.6);
    expect(analyserReads).toHaveBeenCalledTimes(2);
    if (timeline) Object.defineProperty(document, 'timeline', timeline);
    else delete (document as { timeline?: unknown }).timeline;
    releaseVoice(stream, a);
    releaseVoice(stream, b);
  });
});
