/**
 * The Voice 2.0 story's voice: the stream a page hands RazorSense while it listens (`voiceStream`). Either the page's own microphone
 * (as an app's dictation has it), or speechtest's made-up sentence (send/razorsense-blade/voice-*: page.js fakeRead), played as noise
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

/** the bands' middles (Hz): 90-250, 250-600, 600-1500, 1500-4000 */
const BAND_HZ = [150, 390, 950, 2450];

type StoryVoice = { stream: MediaStream; stop: () => void };

/** speechtest's made-up sentence as a stream: noise through each band, at the sentence's levels (call it from a click: audio starts on one) */
const makeSentenceVoice = (): StoryVoice | null => {
  const Ctx =
    window.AudioContext ??
    ((window as unknown) as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  const ctx = new Ctx();
  const out = ctx.createMediaStreamDestination();
  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const gains = BAND_HZ.map((hz) => {
    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = hz;
    filter.Q.value = 1.4;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain).connect(out);
    source.start();
    return gain;
  });
  const bands = [0, 0, 0, 0];
  const started = ctx.currentTime;
  const timer = window.setInterval(() => {
    const level = sentenceAt(ctx.currentTime - started, bands);
    gains.forEach((g, k) => {
      g.gain.setTargetAtTime(1.6 * level * (0.25 + 0.75 * bands[k]), ctx.currentTime, 0.015);
    });
  }, 16);
  return {
    stream: out.stream,
    stop: () => {
      window.clearInterval(timer);
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
