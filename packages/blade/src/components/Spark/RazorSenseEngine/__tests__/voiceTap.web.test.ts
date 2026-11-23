import { releaseVoice, tapVoice } from '../voice';

// A stream with no audio (the page hands in a video-only stream): its audio context is closed, not left open, and the stream isn't
// tried again each frame (the PR review: an AudioContext made before createMediaStreamSource threw was never closed).

const contexts: { closed: boolean }[] = [];
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
    return { fftSize: 0, smoothingTimeConstant: 0, frequencyBinCount: 1024 };
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
});
