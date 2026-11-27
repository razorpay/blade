import type { FreshBackgroundPlay } from '../RazorSenseEngine/types';

/** the login mirror's ease for its blends (smoothstep) */
const ease = (x: number): number => x * x * (3 - 2 * x);

/** `t` wrapped into [a, b) */
const wrap = (t: number, a: number, b: number): number => {
  const len = b - a;
  return t >= b || t < a ? a + ((((t - a) % len) + len) % len) : t;
};

/**
 * Default Paused 2.0's clocks, as the login mirror's tick() runs them (send/razorsense-blade/default-paused/mirror-panel.js): the
 * timeline looping a -> b, the alive clock (breath and drift, at its own speed) and the colour loop's own clock; and from them, each
 * frame, the loop's crossfade weight, the colour loop's blend over its wrap and each drifting comp's opacity. One object, changed in
 * place: nothing is made per frame.
 */
class BackgroundClock {
  /** the timeline (s): a -> b, looped */
  public t: number;

  /** the alive clock (s) */
  public alive = 0;

  /** the crossfade's weight (0-1): the loop's start ('fade' page) laid over its last moments */
  public fade = 0;

  /** the colour loop: whether it runs, its clock (s), the clock one loop back and the blend into it over the wrap (0-1) */
  public readonly isColourOn: boolean;

  public colourT: number;

  public colourBack: number;

  public colourBlend = 0;

  private readonly play: FreshBackgroundPlay;

  constructor(play: FreshBackgroundPlay) {
    this.play = play;
    this.t = play.loop.a;
    this.colourT = play.colour.a;
    this.colourBack = play.colour.a;
    this.isColourOn = play.colour.on && play.colour.b - play.colour.a > 0.1;
  }

  /** dt seconds on */
  public step(dt: number): void {
    const { loop, colour } = this.play;
    const speed = loop.speed || 1;
    const len = loop.b - loop.a;
    this.t += dt * speed;
    if (len > 0.05) this.t = wrap(this.t, loop.a, loop.b);
    this.alive += dt * speed * (this.play.alive || 1);
    if (this.isColourOn) {
      const cLen = colour.b - colour.a;
      this.colourT = wrap(this.colourT + dt * speed * (colour.speed || 1), colour.a, colour.b);
      const over = Math.min(colour.fade || 0, cLen * 0.5);
      this.colourBlend =
        over > 0.01 && this.colourT > colour.b - over
          ? ease((this.colourT - (colour.b - over)) / over)
          : 0;
      this.colourBack = Math.max(colour.a, this.colourT - cLen);
    }
    const f = loop.fade;
    this.fade =
      f > 0.01 && len > f && this.t >= loop.b - f && this.t < loop.b
        ? ease((this.t - (loop.b - f)) / f)
        : 0;
  }

  /** the opacity of the i-th drifting comp (Base first, then the 'SUb Bands' ones): two slow waves on the alive clock, its own phase */
  public opacity(i: number): number {
    const { depth, period } = this.play.opacity;
    const d = Math.max(0, Math.min(1, depth || 0));
    if (!(d > 0)) return 1;
    const p = Math.max(0.5, period || 6);
    const ph = i * 2.17 + 0.6;
    const al = this.alive;
    const n =
      0.62 * Math.sin((2 * Math.PI * al) / p + ph) +
      0.38 * Math.sin((2 * Math.PI * al) / (p * 1.618) + 2.3 * ph);
    return 1 - d * (0.5 + 0.5 * n);
  }
}

export { BackgroundClock };
