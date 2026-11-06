import type { FreshDoc, FreshPlayer } from '../RazorSenseEngine';

/**
 * The chat background's typing surge, as flow 9 plays it on its landing (rz62 landTick): a strength between 0 (idle, drifting) and
 * 1 (the typing surge), shown as an exact cross-fade (the typing surge comp over idle at that opacity).
 *
 * The strength is a critically damped spring towards a target: while typing (keys within `hold` s) the target is `level`, plus a
 * pulse at each burst's start (`pulse` of the way to `peak`, dissipating over ~1 s); typing on for `rhythmAfter` s, it swells between
 * level and peak at `rhythmSpeed` Hz (`rhythm` deep); a quick typist lifts it a little (`react`). It rises over `rise` s, dips while
 * typing over `fall` s, and dies down over `simmer` s once typing stops. Never a jump per key.
 * While it is up, the breathing and drift run livelier (x `liven`), the shapes grow (`grow`) and the path drift holds still
 * (`pathPause`), easing back to speed over `pathBack` s. The timeline runs forward and back (its keys ease to a stop at both ends).
 */
type TypingSurgeTune = {
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
  drift: number;
  liven: number;
  grow: number;
  pathPause: number;
  pathBack: number;
};

type TypingSurgeSetup = { tune: TypingSurgeTune; centre: [number, number] };

const smooth01 = (u: number): number => {
  const v = Math.min(1, Math.max(0, u));
  return v * v * (3 - 2 * v);
};

const getTypingSurgeSetup = (doc: FreshDoc): TypingSurgeSetup | null => {
  const r = doc.ui?.freshChatBackground as TypingSurgeSetup | undefined;
  return r?.tune ? r : null;
};

class TypingSurge {
  /** the typing surge's strength (0-1) */
  public a = 0;

  private readonly tune: TypingSurgeTune;
  private readonly centre: [number, number];
  private v = 0;
  private R = 0;
  private ph = 0;
  private last = -1e9;
  private first = 0;
  private rate = 0;
  private clk = 0;
  private alive = 0;
  private path = 0;
  private pathSpeed = 1;
  /** the strip stretched to its chat input (x, y) round the input's middle (comp px from the comp's middle) */
  private stretch = { kx: 1, ky: 1, cx: 0, cy: 0 };

  constructor(setup: TypingSurgeSetup) {
    this.tune = setup.tune;
    this.centre = setup.centre;
  }

  /** the strip stretched kx across and ky down round (cx, cy) (comp px from the comp's middle); the bands keep their size */
  public setStretch(kx: number, ky: number, cx: number, cy: number): void {
    this.stretch = { kx, ky, cx, cy };
  }

  /**
   * The shapes: grown by g round the typing's centre (flow 9's landTick), then stretched round the chat input's middle. One
   * scale and one shift do both exactly; unstretched, it's flow 9's own call.
   */
  public pose(player: FreshPlayer, g: number): void {
    const { kx, ky, cx, cy } = this.stretch;
    const [gx, gy] = this.centre;
    if (kx === 1 && ky === 1) {
      player.shapes(g, g, gx, gy, 1);
      player.offset(0, 0);
      return;
    }
    player.shapes(kx * g, ky * g, 0, 0, 1);
    player.offset(kx * (1 - g) * gx + (1 - kx) * cx, ky * (1 - g) * gy + (1 - ky) * cy);
  }

  /** a key typed (s: now, in seconds) */
  public hit(s: number): void {
    if (s - this.last > this.tune.hold) this.first = s;
    this.last = s;
    this.rate += 1;
  }

  /** moves everything on by dt (s) and draws that moment */
  public step(player: FreshPlayer, dt: number, s: number, duration: number): void {
    const T = this.tune;
    const isTyping = s - this.last < T.hold;
    const rIn = isTyping ? smooth01((s - this.first - T.rhythmAfter) / 1.5) : 0;
    this.R +=
      (rIn - this.R) * (1 - Math.exp(-dt / (rIn > this.R ? 0.6 : Math.max(0.2, T.simmer / 3))));
    this.ph += dt * 2 * Math.PI * T.rhythmSpeed * (0.35 + 0.65 * this.R);
    this.rate *= Math.exp(-dt);
    const swell = 0.5 - 0.5 * Math.cos(this.ph);
    const pk = isTyping ? T.pulse * Math.exp(-Math.max(0, s - this.first) / 0.9) : 0;
    const up = Math.min(1, pk + this.R * T.rhythm * swell);
    const target = isTyping
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

    // the clocks: livelier with the strength; the path shift held while the pulse is up, back up to speed over `pathBack` s
    const sp = Math.max(0.05, T.drift) * (1 + (T.liven - 1) * this.a);
    this.clk += dt * sp;
    this.alive += dt * sp;
    const pt = 1 - T.pathPause * smooth01(this.a / Math.max(0.05, T.level));
    this.pathSpeed +=
      (pt - this.pathSpeed) *
      (1 - Math.exp(-dt / (pt < this.pathSpeed ? 0.25 : Math.max(0.05, T.pathBack) / 3)));
    this.path += dt * Math.max(0.05, T.drift) * this.pathSpeed;
    const g = Math.round((1 + T.grow * this.a) * 1e4) / 1e4;

    const u = this.clk % (2 * duration);
    const t = u <= duration ? u : 2 * duration - u;
    player.comp('ty', { op: this.a > 0.002 ? this.a : 0 });
    player.pathTime(this.path);
    this.pose(player, g);
    player.seek(t, this.alive);
  }
}

export { TypingSurge, getTypingSurgeSetup };
export type { TypingSurgeTune, TypingSurgeSetup };
