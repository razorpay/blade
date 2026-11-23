/**
 * The Voice 2.0 story's voice: the stream a page hands RazorSense while it listens (`voiceStream`). Either the page's own microphone
 * (as an app's dictation has it), or speechtest's made-up sentence (send/razorsense-blade/voice-*: page.js fakeRead), played as tones
 * in the four pitch bands RazorSense reads, so it can be seen without a microphone. Nothing here plays out loud.
 */

/** a made-up sentence: words of 2-5 syllables, a beat between words, a breath every 7 words (the same every loop), as speechtest's */
type Syllable = { t0: number; d: number; a: number; b: [number, number, number, number] };
const SENTENCE = ((): { syllables: Syllable[]; length: number } => {
  let seed = 7;
  const rnd = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const syllables: Syllable[] = [];
  let t = 0.3;
  for (let w = 0; w < 26; w++) {
    const n = 2 + Math.floor(rnd() * 4);
    for (let i = 0; i < n; i++) {
      const d = 0.11 + rnd() * 0.13;
      const isVowel = rnd() < 0.7;
      syllables.push({
        t0: t,
        d,
        a: 0.55 + rnd() * 0.45,
        b: isVowel
          ? [0.9 + rnd() * 0.1, 0.5 + rnd() * 0.5, 0.2 + rnd() * 0.4, 0.1 + rnd() * 0.3]
          : [0.3, 0.4, 0.6 + rnd() * 0.4, 0.7 + rnd() * 0.3],
      });
      t += d + 0.02 + rnd() * 0.04;
    }
    t += w % 7 === 6 ? 0.9 : 0.12 + rnd() * 0.18;
  }
  return { syllables, length: t + 0.6 };
})();

/** the made-up sentence at time t (s): its level and each band's (0-1) */
const sentenceAt = (time: number, bands: number[]): number => {
  const t = time % SENTENCE.length;
  let level = 0;
  bands.fill(0);
  for (const q of SENTENCE.syllables) {
    const u = (t - q.t0) / q.d;
    if (u <= 0 || u >= 1) continue;
    const e =
      Math.sin(Math.PI * Math.min(1, u * 1.6)) ** 0.8 *
      (u > 0.62 ? 1 - (u - 0.62) / 0.38 : 1) *
      q.a;
    level = Math.max(level, e);
    for (let k = 0; k < 4; k++) bands[k] = Math.max(bands[k], e * q.b[k]);
  }
  return level;
};

type StoryVoice = { stream: MediaStream; stop: () => void };

/**
 * The analyser RazorSense reads it with (voice.ts's VoiceTap, as speechtest's micRead): a 2048-point FFT, Blackman-windowed, its bytes
 * -100 to -30 dB; the level from the samples' RMS (-60 dB nothing, -12 dB full); each band's bytes averaged and held against its own
 * peak (from 0.2, falling over 3 s, never under 0.08), times the level's square root.
 */
const FFT = 2048;
const DB_MIN = -100;
const DB_RANGE = 70;
const EDGES = [90, 250, 600, 1500, 4000];
/** a Blackman-windowed sine in its own bin, and the next two either side (of its amplitude) */
const LOBE = [0.21, 0.125, 0.02];
/** the level's own tones: above the bands, so they move the level and no band (Hz) */
const LEVEL_HZ = [5000, 9000];
/** the envelope's steps (s) */
const STEP = 0.001;
/** the first part, while the analyser's band peaks still fall to their floor (0.2 to 0.08 over 2.75 s) */
const FIRST = 3;
/** a stream's way from one audio context into another (s, measured in Chrome) */
const LATENCY = 0.04;

/**
 * One pitch band of the voice as the analyser sees it: sines at every fifth bin inside its bins (none within reach of the next band),
 * each with a bin of its own, so the bins it lights are the same in every frame. `amp` is the sines' amplitude that reads `v`.
 */
const bandOf = (sampleRate: number, k: number): { bins: number[]; amp: (v: number) => number } => {
  const hz = sampleRate / FFT;
  const lo = Math.floor(EDGES[k] / hz);
  const hi = Math.ceil(EDGES[k + 1] / hz);
  const bins: number[] = [];
  for (let c = lo + 3; c <= hi - 4; c += 5) bins.push(c);
  if (!bins.length) bins.push(Math.round((lo + hi - 1) / 2));
  const lit = new Float64Array(hi - lo);
  for (const c of bins) {
    for (let d = -2; d <= 2; d++) {
      const i = c + d - lo;
      if (i >= 0 && i < lit.length) lit[i] += LOBE[Math.abs(d)];
    }
  }
  // the band's reading at each amplitude (dB, 0.05 dB apart): what the analyser makes of it, byte by byte
  const read = (db: number): number => {
    let sum = 0;
    for (const q of lit) {
      if (q > 0) {
        const byte = Math.floor((255 / DB_RANGE) * (db + 20 * Math.log10(q) - DB_MIN));
        sum += Math.min(255, Math.max(0, byte));
      }
    }
    return sum / lit.length / 255;
  };
  const DB0 = -160;
  const table = Float64Array.from({ length: 3201 }, (_, i) => read(DB0 + i * 0.05));
  const amp = (v: number): number => {
    if (!(v > 0)) return 0;
    let a = 0;
    let b = table.length - 1;
    if (table[b] < v) return 10 ** ((DB0 + b * 0.05) / 20);
    while (b - a > 1) {
      const c = Math.floor((a + b) / 2);
      if (table[c] >= v) b = c;
      else a = c;
    }
    const f = (v - table[a]) / Math.max(1e-9, table[b] - table[a]);
    return 10 ** ((DB0 + (a + f) * 0.05) / 20);
  };
  return { bins, amp };
};

/** a loop of one FFT's length: a sine at the middle of each of these bins (phases from `rnd`), each of amplitude 1 */
const tones = (bins: number[], rnd: () => number): Float32Array => {
  const out = new Float32Array(FFT);
  for (const c of bins) {
    const ph = 2 * Math.PI * rnd();
    for (let n = 0; n < FFT; n++) out[n] += Math.sin((2 * Math.PI * c * n) / FFT + ph);
  }
  return out;
};

/**
 * speechtest's made-up sentence as a stream (call it from a click: audio starts on one). Made so that RazorSense, reading it as it
 * reads a microphone, sees what speechtest's own fake source gave its tuning: the level fakeRead's level, each band fakeRead's band, at
 * the sentence's own time. Each band is tones in its own bins, the level tones of its own above them, each at the amplitude the
 * analyser reads back as that number (its bytes worked out bin by bin); played half an analyser window early, so the reading is centred
 * on the sentence's time. Baked once into buffers (its first 3 s, while the bands' peaks start high, then the whole sentence, looped).
 */
const makeSentenceVoice = (): StoryVoice | null => {
  const Ctx =
    window.AudioContext ??
    ((window as unknown) as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const out = ctx.createMediaStreamDestination();
  const sr = ctx.sampleRate;
  const hz = sr / FFT;
  let seed = 11;
  const rnd = (): number => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const bands = [0, 1, 2, 3].map((k) => bandOf(sr, k));
  const bandTones = bands.map((b) => tones(b.bins, rnd));
  const levelBins: number[] = [];
  for (let c = Math.ceil(LEVEL_HZ[0] / hz); c <= Math.floor(LEVEL_HZ[1] / hz); c += 2)
    levelBins.push(c);
  const levelTones = tones(levelBins, rnd);
  // (the level's tones at RMS 1)
  const levelK = 1 / Math.sqrt(levelBins.length / 2);
  // played this far ahead (s): half the analyser's window, and the stream's way into the page's own audio context
  const lead = FFT / 2 / sr + LATENCY;
  const steps = Math.ceil(SENTENCE.length / STEP);
  const half = Math.round(FFT / 2 / sr / STEP);
  // the sentence as it should read, each step: its level and bands at the time that step is heard
  const want = [0, 1, 2, 3, 4].map(() => new Float64Array(steps + 1));
  const b = [0, 0, 0, 0];
  for (let j = 0; j <= steps; j++) {
    want[4][j] = sentenceAt(j * STEP + lead, b);
    for (let k = 0; k < 4; k++) want[k][j] = b[k];
  }
  // the level played: the analyser's RMS is the mean power over its window, louder than the level's own mean where it rises and
  // falls, so it's corrected a few times till the reading is the sentence's
  const power = (x: number): number => (x > 0 ? 10 ** ((48 * x - 60) / 10) : 0);
  const played = Float64Array.from(want[4]);
  const sum = new Float64Array(steps + 2);
  for (let pass = 0; pass < 8; pass++) {
    for (let j = 0; j <= steps; j++) sum[j + 1] = sum[j] + power(played[j]);
    for (let j = 0; j <= steps; j++) {
      const a = Math.max(0, j - half);
      const z = Math.min(steps + 1, j + half);
      const mean = (sum[z] - sum[a]) / (z - a);
      const read = mean > 0 ? Math.min(1, Math.max(0, (10 * Math.log10(mean) + 60) / 48)) : 0;
      if (want[4][j] > 0 || played[j] > 0)
        played[j] = Math.min(1.5, played[j] + 0.7 * (want[4][j] - read));
    }
  }
  /** the amplitudes over one time through: each band's sines, and the level's tones, every STEP s */
  const envelope = (isFirst: boolean): Float32Array[] => {
    const amps = [0, 1, 2, 3, 4].map(() => new Float32Array(steps + 1));
    for (let j = 0; j <= steps; j++) {
      const e = want[4][j];
      // the bands' peaks as the analyser has them: 0.2 falling to 0.08 the first time through, 0.08 after
      const peak = isFirst ? Math.max(0.08, 0.2 * Math.exp(-(j * STEP) / 3)) : 0.08;
      let bandPower = 0;
      for (let k = 0; k < 4; k++) {
        // band = (reading / peak) x sqrt(level): the reading that gives fakeRead's band
        const a = e > 0 ? bands[k].amp((peak * want[k][j]) / Math.sqrt(e)) : 0;
        amps[k][j] = a;
        bandPower += (bands[k].bins.length / 2) * a * a;
      }
      // the level's tones: the rest of the RMS
      amps[4][j] = Math.sqrt(Math.max(0, power(played[j]) - bandPower)) * levelK;
    }
    return amps;
  };
  const bake = (isFirst: boolean, seconds: number): AudioBuffer => {
    const amps = envelope(isFirst);
    const n = Math.ceil(seconds * sr);
    const buffer = ctx.createBuffer(1, n, sr);
    const data = buffer.getChannelData(0);
    const src = [...bandTones, levelTones];
    for (let i = 0; i < n; i++) {
      const u = i / sr / STEP;
      const j = Math.min(steps - 1, Math.floor(u));
      const f = u - j;
      let x = 0;
      for (let q = 0; q < 5; q++)
        x += (amps[q][j] + (amps[q][j + 1] - amps[q][j]) * f) * src[q][i % FFT];
      data[i] = x;
    }
    return buffer;
  };
  const first = ctx.createBufferSource();
  first.buffer = bake(true, FIRST);
  const loop = ctx.createBufferSource();
  loop.buffer = bake(false, SENTENCE.length);
  loop.loop = true;
  first.connect(out);
  loop.connect(out);
  const t0 = ctx.currentTime + 0.02;
  first.start(t0);
  // (the loop takes over where the first part ends, from there in the sentence, then loops it whole)
  loop.start(t0 + FIRST, FIRST);
  return {
    stream: out.stream,
    stop: () => {
      ctx.close().catch(() => undefined);
    },
  };
};

/** the page's own microphone (the browser asks first): null if it's refused or there's none */
const makeMicVoice = async (): Promise<StoryVoice | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    });
    return { stream, stop: () => stream.getTracks().forEach((track) => track.stop()) };
  } catch {
    return null;
  }
};

export { makeMicVoice, makeSentenceVoice };
export type { StoryVoice };
