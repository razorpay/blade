/**
 * How strongly RazorSense answers typing, as flow 9's landing does it (rz62 landTick): shared by the chat background's typing
 * surge and the chat's bottom wave (flow 10 types the landing's way there too).
 *
 * The strength is a critically damped spring towards a target: while typing (keys within `hold` s) the target is `level`, plus a
 * pulse at each burst's start (`pulse` of the way to `peak`, dissipating over ~1 s); typing on for `rhythmAfter` s, it swells between
 * level and peak at `rhythmSpeed` Hz (`rhythm` deep); a quick typist lifts it a little (`react`). It rises over `rise` s, dips while
 * typing over `fall` s, and dies down over `simmer` s once typing stops. Never a jump per key.
 * While it is up, the breathing runs livelier (x `liven`) and the path drift holds still (`pathPause`), easing back to speed over
 * `pathBack` s; the shapes grow by `grow` (the caller draws that).
 */
type TypingTune = {
  level: number;
  pulse: number;
  rise: number;
  fall: number;
  hold: number;
  simmer: number;
  react: number;
  rhythmAfter: number;
  rhythm: number;
  peak: number;
  rhythmSpeed: number;
  /** the clocks' speed @default 1 */
  drift?: number;
  /** @default 1 */
  liven?: number;
  /** @default 0 */
  grow?: number;
  /** @default 0 */
  pathPause?: number;
  /** @default 2.2 */
  pathBack?: number;
};

const smooth01 = (u: number): number => {
  const v = Math.min(1, Math.max(0, u));
  return v * v * (3 - 2 * v);
};

class TypingStrength {
  /** the strength (0-1) */
  public a = 0;

  private v = 0;
  private R = 0;
  private ph = 0;
  private last = -1e9;
  private first = 0;
  private rate = 0;
  private pathSpeed = 1;

  /** a key typed (s: now, in seconds) */
  public hit(s: number, tune: TypingTune): void {
    if (s - this.last > tune.hold) this.first = s;
    this.last = s;
    this.rate += 1;
  }

  /** the strength moved on by dt (s) to now (s); not `isOn`, its target is 0 (typing doesn't count) */
  public step(dt: number, s: number, tune: TypingTune, isOn = true): void {
    const T = tune;
    const isTyping = s - this.last < T.hold;
    const rIn = isTyping ? smooth01((s - this.first - T.rhythmAfter) / 1.5) : 0;
    this.R +=
      (rIn - this.R) * (1 - Math.exp(-dt / (rIn > this.R ? 0.6 : Math.max(0.2, T.simmer / 3))));
    this.ph += dt * 2 * Math.PI * T.rhythmSpeed * (0.35 + 0.65 * this.R);
    this.rate *= Math.exp(-dt);
    const swell = 0.5 - 0.5 * Math.cos(this.ph);
    const pk = isTyping ? T.pulse * Math.exp(-Math.max(0, s - this.first) / 0.9) : 0;
    const up = Math.min(1, pk + this.R * T.rhythm * swell);
    const target =
      isTyping && isOn
        ? Math.min(
            1,
            T.level + Math.max(0, T.peak - T.level) * up + T.react * Math.min(1.25, this.rate / 8),
          )
        : 0;
    // up over `rise`; while typing its dips a little slower (`fall`); stopped, `simmer`
    const tau = target >= this.a ? T.rise : isTyping ? Math.max(T.rise, T.fall) : T.simmer;
    const w = 3.9 / Math.max(0.05, tau);
    const n = Math.ceil(dt / 0.004);
    const h = dt / Math.max(1, n);
    for (let i = 0; i < n; i++) {
      this.v += (w * w * (target - this.a) - 2 * w * this.v) * h;
      this.a += this.v * h;
    }
    this.a = Math.max(0, Math.min(1, this.a));
    if (this.a <= 0 && this.v < 0) this.v = 0;
  }

  /**
   * How far the clocks go in dt (s) at this strength: the breathing (livelier with it) and the path (held while it's up, back up to
   * speed over `pathBack` s)
   */
  public clocks(dt: number, tune: TypingTune): { alive: number; path: number } {
    const drift = Math.max(0.05, tune.drift ?? 1);
    const sp = drift * (1 + ((tune.liven ?? 1) - 1) * this.a);
    const pt = 1 - (tune.pathPause ?? 0) * smooth01(this.a / Math.max(0.05, tune.level));
    this.pathSpeed +=
      (pt - this.pathSpeed) *
      (1 - Math.exp(-dt / (pt < this.pathSpeed ? 0.25 : Math.max(0.05, tune.pathBack ?? 2.2) / 3)));
    return { alive: dt * sp, path: dt * drift * this.pathSpeed };
  }

  /** the size it grows the shapes to (1: none), rounded as flow 9 rounds it */
  public grow(tune: TypingTune): number {
    return Math.round((1 + (tune.grow ?? 0) * this.a) * 1e4) / 1e4;
  }

  /** back to rest (the spring and the rhythm; the clocks carry on) */
  public reset(): void {
    this.a = 0;
    this.v = 0;
    this.R = 0;
  }
}

export { TypingStrength, smooth01 };
export type { TypingTune };
