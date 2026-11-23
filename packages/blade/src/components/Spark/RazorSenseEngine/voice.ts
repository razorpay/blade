import { cubicBezier } from './ease';
import type { FreshVoiceTune } from './types';

/**
 * The voice looks' input and motion (speechtest's, as flow 10.5's voice9.js runs it): the page's own voice (a MediaStream it already
 * has: RazorSense never opens the mic) read as a level and four pitch bands, a spring per blob in the row, the voice travelling out
 * from the middle over its last 2 s, and the morph between rest and voice. Loaded with a voice look, the first time a component
 * listens.
 */

/** the pitch bands' edges (Hz): the level, then 90-250, 250-600, 600-1500, 1500-4000 */
const EDGES = [90, 250, 600, 1500, 4000];

/** A stream's analyser, shared by every component listening to it, and read at most once a frame (one analyser read, page-wide). */
class VoiceTap {
  public readonly level = { lvl: 0, bands: new Float32Array(4) };
  private readonly ctx: AudioContext;
  private readonly source: MediaStreamAudioSourceNode;
  private readonly analyser: AnalyserNode;
  private readonly time: Float32Array;
  private readonly freq: Uint8Array;
  private readonly norm = new Float32Array([0.2, 0.2, 0.2, 0.2]);
  private readAt = -1;
  private lastAt = 0;
  public users = 0;

  constructor(stream: MediaStream) {
    const Ctx: typeof AudioContext =
      window.AudioContext ??
      ((window as unknown) as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.source = this.ctx.createMediaStreamSource(stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    this.analyser.smoothingTimeConstant = 0.2;
    // (not connected on to the speakers: only read)
    this.source.connect(this.analyser);
    this.time = new Float32Array(this.analyser.fftSize);
    this.freq = new Uint8Array(this.analyser.frequencyBinCount);
    // (an audio context made after the page was interacted with starts running; one that didn't is asked once)
    if (this.ctx.state === 'suspended') void this.ctx.resume().catch(() => undefined);
  }

  /** the level (0-1: -60 dB nothing, -12 dB full) and each band against its own recent peak, at `now` (ms): read once a frame */
  public read(now: number): VoiceTap['level'] {
    if (now === this.readAt) return this.level;
    const dt = this.lastAt ? Math.min(0.05, (now - this.lastAt) / 1000) : 0;
    this.readAt = now;
    this.lastAt = now;
    const { analyser, time, freq, norm, level } = this;
    analyser.getFloatTimeDomainData(time);
    let sum = 0;
    for (let i = 0; i < time.length; i++) sum += time[i] * time[i];
    const db = 20 * Math.log10(Math.sqrt(sum / time.length) + 1e-9);
    const lvl = Math.min(1, Math.max(0, (db + 60) / 48));
    analyser.getByteFrequencyData(freq);
    const hz = this.ctx.sampleRate / 2 / freq.length;
    for (let k = 0; k < 4; k++) {
      let a = 0;
      let n = 0;
      for (let i = Math.floor(EDGES[k] / hz); i < Math.ceil(EDGES[k + 1] / hz); i++) {
        a += freq[i] / 255;
        n += 1;
      }
      const v = n ? a / n : 0;
      norm[k] = Math.max(norm[k] * Math.exp(-dt / 3), v, 0.08);
      level.bands[k] = Math.min(1, Math.max(0, v / norm[k])) * Math.sqrt(lvl);
    }
    level.lvl = lvl;
    return level;
  }

  public close(): void {
    this.source.disconnect();
    void this.ctx.close().catch(() => undefined);
  }
}

const taps = new WeakMap<MediaStream, VoiceTap>();

/** the stream's analyser (made on first use, shared after): null where the page has no Web Audio, or the stream no audio */
const tapVoice = (stream: MediaStream): VoiceTap | null => {
  let tap = taps.get(stream) ?? null;
  if (!tap) {
    try {
      tap = new VoiceTap(stream);
    } catch {
      return null;
    }
    taps.set(stream, tap);
  }
  tap.users += 1;
  return tap;
};

/** let go of it: the last one closes its audio context (the stream itself is the page's: never stopped here) */
const releaseVoice = (stream: MediaStream, tap: VoiceTap): void => {
  tap.users -= 1;
  if (tap.users > 0) return;
  taps.delete(stream);
  tap.close();
};

/** the voice's last 2 s: at up to 240 frames a second */
const HISTORY = 512;

/**
 * The voice look's motion: the morph (u -> m by its ease), the voice's follow (a), a spring per blob (env), and the history the row
 * reads late by each blob's distance out. Everything per frame is in place: nothing is allocated once it's made.
 */
class VoiceMotion {
  /** the morph's time (0 rest, 1 voice) and its eased value */
  public u = 0;
  public m = 0;
  /** the voice's level, followed */
  public a = 0;
  /** each blob's spring (its height share) */
  public readonly env: Float32Array;
  private readonly vel: Float32Array;
  private readonly rnd: Float32Array;
  private readonly rs: Float32Array;
  private slow = 0;
  private last = 0;
  private readonly hT = new Float64Array(HISTORY);
  private readonly hL = new Float32Array(HISTORY);
  private readonly hB = new Float32Array(HISTORY * 4);
  private hAt = 0;
  private hN = 0;

  /** blobs in the row */
  public readonly blobs: number;

  constructor(blobs: number) {
    this.blobs = blobs;
    this.env = new Float32Array(blobs);
    this.vel = new Float32Array(blobs);
    this.rnd = new Float32Array(blobs).fill(1);
    this.rs = new Float32Array(blobs).fill(1);
  }

  /** where blob i sits in the row: -1 (left end) to 1 (right end) */
  public rowU(i: number): number {
    return this.blobs < 2 ? 0 : -1 + (2 * i) / (this.blobs - 1);
  }

  /** the morph only (towards voice while `want`): true once it's back at rest */
  public morph(dt: number, want: boolean, tune: FreshVoiceTune): boolean {
    const M = tune.morph;
    this.u = Math.min(
      1,
      Math.max(0, this.u + (want ? dt / Math.max(0.05, M.in) : -dt / Math.max(0.05, M.out))),
    );
    this.m = cubicBezier(M.ease, this.u);
    return this.u <= 0;
  }

  /** at rest at once (offline, a send: the voice goes away at once) */
  public reset(): void {
    this.u = 0;
    this.m = 0;
    this.a = 0;
    this.env.fill(0);
    this.vel.fill(0);
    this.hN = 0;
  }

  /**
   * One frame of the voice (s: now, in seconds; `lvl` and `bands` the stream's, or silence): each blob's spring towards its share of
   * the level and its pitch band, late by its distance out (speechtest's react)
   */
  public react(
    dt: number,
    s: number,
    lvl: number,
    bands: ArrayLike<number> | null,
    tune: FreshVoiceTune,
  ): void {
    const V = tune.voice;
    const Lk = tune.look;
    const gated = (v: number): number =>
      Math.min(1, Math.max(0, (v - V.gate) / Math.max(0.05, 1 - V.gate))) * V.sens;
    const L = gated(lvl);
    this.slow += (L - this.slow) * (1 - Math.exp(-dt / 0.25));
    if (L - this.slow > 0.12 && s - this.last > 0.09) {
      // a syllable starting: each blob a new share (variety)
      this.last = s;
      for (let i = 0; i < this.blobs; i++) this.rnd[i] = 1 - V.live + V.live * 1.6 * Math.random();
    }
    // (the history: a ring, the last 2 s)
    const h = this.hAt;
    this.hT[h] = s;
    this.hL[h] = L;
    for (let k = 0; k < 4; k++) this.hB[h * 4 + k] = bands ? gated(bands[k]) : 0;
    this.hAt = (h + 1) % HISTORY;
    this.hN = Math.min(HISTORY, this.hN + 1);
    const zeta = 1 - 0.8 * V.bounce;
    for (let i = 0; i < this.blobs; i++) {
      this.rs[i] += (this.rnd[i] - this.rs[i]) * (1 - Math.exp(-dt / 0.08));
      const au = Math.abs(this.rowU(i));
      const j = this.at(s - au * Lk.travel);
      // the pitch across the row: the middle low, the ends high
      const kf = au * 3;
      const k0 = Math.min(2, Math.floor(kf));
      const B = this.hB;
      const bk = B[j * 4 + k0] + (B[j * 4 + k0 + 1] - B[j * 4 + k0]) * (kf - k0);
      const prof = 1 - Lk.bias * au ** 1.6;
      const target = ((1 - V.split) * this.hL[j] + V.split * bk) * this.rs[i] * prof;
      let e = this.env[i];
      let v = this.vel[i];
      const tau = target >= e ? V.attack : V.release;
      const w = 3.9 / Math.max(0.02, tau);
      const n = Math.max(1, Math.ceil(dt / 0.004));
      const step = dt / n;
      for (let q = 0; q < n; q++) {
        v += (w * w * (target - e) - 2 * zeta * w * v) * step;
        e += v * step;
      }
      this.env[i] = Math.max(-0.2, e);
      this.vel[i] = v;
    }
    this.a += (L - this.a) * (1 - Math.exp(-dt / Math.max(0.03, Lk.follow)));
  }

  /** the history's slot at time `want` (the newest one at or before it) */
  private at(want: number): number {
    const newest = (this.hAt - 1 + HISTORY) % HISTORY;
    let j = newest;
    for (let n = 1; n < this.hN; n++) {
      if (this.hT[j] <= want) break;
      const prev = (j - 1 + HISTORY) % HISTORY;
      j = prev;
    }
    return j;
  }
}

export { VoiceMotion, releaseVoice, tapVoice };
export type { VoiceTap };
