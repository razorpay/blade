/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * RayPlayer
 *
 * The component's own Ray, drawn by Ray Studio's engine: his rest, canon scripts (Look around, the hop off and back onto
 * the surface), the typing watch, the hover look and the coin flip. The states that have a film are drawn by the film
 * instead; the director (RayMount) hands him over at rest, where both draw the same frame.
 */
import { RayCore, CANON, SHARED, TUNES } from './engine';
import { create as createCap } from './engine/shared/rayCap';
import type { WatchPose } from './rayPoses';
import { LEAN_BACK, REST_POSE, mixWatch, watchPoseAt } from './rayPoses';

const RC = RayCore as any;

const BODY_WIDTH = RC.BASE[2][0]; // his full width at rest (world units)
const ROOT_X = RC.LOOK.width / 2; // his spine's root: the middle of his floor edge
const SWAP_MS = 320; // a blend between two of his moves (the sidekick's ray.swapMs)
// canon Typing: back a bit (out-eased), held, then out to the caret (in-out), and straight back to rest
const LEAN_BACK_MS = 220;
const LEAN_HOLD_MS = 50;
const WATCH_OUT_MS = 700;
const WATCH_BACK_MS = 240;
const easeOut = RC.bezier([0, 0, 0.58, 1]);
const easeInOut = RC.bezier([0.42, 0, 0.58, 1]);
// the typing nudge (the dashboard's typing engine, V4, Figma 53:918, its tune in settings/ray-flow5-p.json ray-typing-v2x): with text in
// the box and nobody typing, he shifts right and looks straight at you, his eyes slide and dip to the caret on a light arc, straight at you
// again, and he goes back to watching. Each step [move ends, hold ends] ms with its ease; his eyes in his gaze (g across, v up -/ down +)
const NUDGE = {
  shift: 68.8, // Ray px right (27 page px)
  straight: { g: -0.08, v: -0.9 }, // eyes straight at you: centred, raised (53:918's eye places)
  look: { g: 0.75, v: 1 }, // how far from straight they slide (towards the caret) and dip
  arc: [0.25, 0.15], // the eyes' path bowing up and out on the way there and back (nArc 10 / nArcBack 6 page px)
  steps: [
    [350, 940, RC.bezier([0.73, 0, 0.26, 1])], // straight at you
    [1240, 1320, RC.bezier([0, 0.6, 0.58, 1])], // the look to the caret
    [1620, 1890, RC.bezier([0, 0.56, 0.58, 1])], // straight at you again
    [2340, 2340, RC.bezier([0.62, 0.02, 0.44, 0.98])], // back to watching
  ] as [number, number, (u: number) => number][],
  cancelMs: 450, // typed during it: back to watching from wherever he is
};

// canon's hide.json: from rest he springs up and drops behind the surface (400 -> 1000 ms), then comes back up and lands (1600 -> 2500)
const HOP_OUT: [number, number] = [400, 1000];
const HOP_IN: [number, number] = [1600, 2500];

type Frame = Record<string, any>;
type Source =
  | { kind: 'rest'; t0: number; blend: number }
  | { kind: 'frame'; t0: number; blend: number; frame: Frame }
  | {
      kind: 'nap';
      t0: number;
      blend: number;
      phase: NapPhase;
      phaseT0: number;
      alarmAt: number | null;
      lastNear: number;
      flipQueued: boolean;
    }
  | { kind: 'watch'; t0: number; blend: number }
  | {
      kind: 'script';
      name: string;
      t0: number;
      blend: number;
      loop?: boolean;
      off?: number;
      end?: number;
      done?: () => void;
      fired?: boolean;
    };

type NapPhase = 'doze' | 'asleep' | 'wake' | 'awake';

// the sleep cycle: flow 9's Nightcap (NAP9 on its idle engine), here on canon Sleep (the script Nightcap 2 plays) and Nightcap 2's soft cap.
// Found asleep (the first time, he wakes by himself after 10 s); a pointer near him wakes him; awake, cap on, he looks around with his
// eyes, his body going a little of the way; with nobody near for a minute he nods off again. A click: awake, the coin flip (the toss, cap
// on); asleep, he wakes first and flips once his eyes are open. (the user, 2026-10-30: "Ray will just be there sleeping … wakes up in
// 10 seconds … only wake up on bringing the mouse to him but happens every minute, till then he just looks around")
const NAP = {
  dozeFrom: 603, // canon Sleep: the cap's on, he starts to doze
  holdAt: 9800, // asleep: the pose he sleeps in
  wakeFrom: 11303, // the wake
  wakeTo: 12700, // awake, eyes open (canon lifts the cap at 12854: here it stays on)
  breath: { amt: 0.024, ms: 5000 }, // asleep, slower and deeper (canon's)
  alarmMs: 10000, // the first sleep: he wakes by himself after this
  dozeAfterMs: 60000, // awake with nobody near this long: he nods off
  flipAfterWakeMs: 230, // a click while asleep: the flip once his eyes are up
  bodyShare: 0.3, // awake, he looks around: his eyes all the way, his body this much (napLook)
  cap: { off: 0, a: 1 }, // the cap, seated
};

type Look = {
  /** The pointer in his world, or null when it's away: the hover look. */
  pointer: [number, number] | null;
  /** Where the caret is, from his middle (-1 far left .. 0.15 just past him), or null when he isn't watching. */
  gaze: number | null;
  /** Whether the hover look is on at all. */
  hover: boolean;
  /** Asleep or dozing: the pointer where it really is (a pointer near him wakes him). */
  near?: [number, number] | null;
};

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));
const smooth = (u: number): number => u * u * (3 - 2 * u);
const lerp = (a: number | undefined, b: number | undefined, u: number, d = 0): number =>
  (a ?? d) + ((b ?? d) - (a ?? d)) * u;
const NO_CORNERS = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

/** One of his frames into another: his pose (corners too), his eyes' places; their shapes switch halfway. */
const mixFrames = (a: Frame, b: Frame, u: number): Frame => {
  const pa = a.pose ?? {};
  const pb = b.pose ?? {};
  const pose: Record<string, any> = { ...pb };
  for (const k of ['squash', 'lean', 'bend', 'x', 'y', 'turn', 'tilt'])
    pose[k] = lerp(pa[k], pb[k], u);
  pose.volume = lerp(pa.volume, pb.volume, u, 1);
  const ca = pa.corners ?? NO_CORNERS;
  const cb = pb.corners ?? NO_CORNERS;
  pose.corners = cb.map((c: number[], i: number) => [
    lerp(ca[i][0], c[0], u),
    lerp(ca[i][1], c[1], u),
  ]);
  const eyeOff = (
    b.eyeOff ?? [
      [0, 0],
      [0, 0],
    ]
  ).map((o: number[], j: number) => o.map((v, i) => lerp(((a.eyeOff ?? [])[j] ?? [])[i], v, u)));
  return { ...b, pose, eyeOff, eyes: u < 0.5 ? a.eyes : b.eyes };
};

/** His gaze held on a point (the caret): canon's hover gaze, the lean left to the watch frames. */
const gazeAt = (H: any, gx: number, gy: number, dt: number): void => {
  const k = 1 - Math.exp(-dt / 140);
  H.in = true;
  H.amt += (1 - H.amt) * (1 - Math.exp(-dt / 160));
  H.g += (gx - H.g) * k;
  H.v += (gy - H.v) * k;
  H.lean += (0 - H.lean) * (1 - Math.exp(-dt / RC.HOVER.leanMs));
};

// the watch pose as numbers, for its spring: x, volume, then each corner's x and y
const toVec = (p: WatchPose): number[] => [p.x, p.volume, ...p.corners.flat()];
const fromVec = (v: number[]): WatchPose => ({
  x: v[0],
  volume: v[1],
  corners: [0, 1, 2, 3].map((i) => [v[2 + i * 2], v[3 + i * 2]] as [number, number]),
});

// the flip module keeps state of its own; the player's copy runs on the page itself
const pageStore = {
  getItem: (key: string): string | null => {
    const tune = (TUNES as Record<string, unknown>)[key];
    return tune ? JSON.stringify(tune) : null;
  },
  setItem: (): void => undefined,
  removeItem: (): void => undefined,
};
const pageHost = (): unknown => ({
  env: {
    document,
    window,
    location,
    parent: window.parent,
    navigator,
    localStorage: pageStore, // the user's tunes (Nightcap 2's cap: its colours and swing)
    fetch: () => Promise.resolve({ ok: false, json: () => Promise.resolve(null) }),
    addEventListener: window.addEventListener.bind(window),
    removeEventListener: window.removeEventListener.bind(window),
    requestAnimationFrame: window.requestAnimationFrame.bind(window),
    cancelAnimationFrame: window.cancelAnimationFrame.bind(window),
    setTimeout: window.setTimeout.bind(window),
    clearTimeout: window.clearTimeout.bind(window),
    setInterval: window.setInterval.bind(window),
    clearInterval: window.clearInterval.bind(window),
  },
  innerWidth: window.innerWidth,
  innerHeight: window.innerHeight,
  devicePixelRatio: window.devicePixelRatio,
  mod: (): never => {
    throw new Error('[Ray] the flip has no shared modules of its own');
  },
});

class RayPlayer {
  readonly canvas: HTMLCanvasElement;
  mode: 'light' | 'dark' = 'light';
  /** The last frame drawn, everything laid over it. */
  last: Frame | null = null;

  private readonly ctx: CanvasRenderingContext2D;
  private view = { scale: 1, ox: 0, oy: 0 };
  private src: Source;
  private from: Frame | null = null;
  private fromT = 0;
  private base: Frame | null = null;
  private readonly sims: Record<string, any> = {};
  private readonly hover = RC.hoverInit();
  private readonly flip: any = (SHARED as any).rayFlip(pageHost());
  private readonly cap: any = createCap(pageHost() as any);
  private readonly napHover = RC.hoverInit();
  private caretU = 0.5;
  private nudgeState: {
    t0: number;
    dir: number;
    cancel: { t0: number; dx: number; g: number; v: number } | null;
  } | null = null;
  private nudgeNow: { dx: number; g: number; v: number } | null = null;
  /** When his last nudge ended (the next comes the same wait after it). */
  nudgeEndedAt = 0;
  private watchVec: number[] | null = null;
  private watchVel: number[] = [];
  private pending: (() => void) | null = null;
  private drawn = false;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
    this.ctx = this.canvas.getContext('2d')!;
    this.src = { kind: 'rest', t0: performance.now(), blend: 0 };
    this.flip.flipPrepare(); // the flip's physics made in the page's idle time, not on the click (one for every Ray on the page)
  }

  /** The stage (CSS px) at the page's pixel density; his base-left corner at `left`, his floor at `floor`, `width` wide. */
  place(
    stageWidth: number,
    stageHeight: number,
    left: number,
    floor: number,
    width: number,
    dpr: number,
  ): void {
    const cw = Math.round(stageWidth * dpr);
    const ch = Math.round(stageHeight * dpr);
    if (this.canvas.width !== cw || this.canvas.height !== ch) {
      this.canvas.width = cw;
      this.canvas.height = ch;
    }
    const scale = (width * dpr) / BODY_WIDTH;
    this.view = { scale, ox: left * dpr + ROOT_X * scale, oy: floor * dpr };
  }

  /** A point on the page (CSS px from the stage's corner) in his world, for the hover look. */
  toWorld(x: number, y: number, dpr: number): [number, number] {
    return RC.toWorld(this.view, [x * dpr, y * dpr]);
  }

  /** Development only: the flip module's state. */
  get flipState(): any {
    return this.flip.COINFLIP;
  }

  /** The flip has his body (a coin it flicked may still be falling after he's back). */
  get isFlipping(): boolean {
    return Boolean(this.flip.COINFLIP.on && !this.flip.COINFLIP.backed);
  }

  /** His rest: breathing, blinking. From what he was doing over `blend` ms (0: at once, as a film hands him back). */
  rest(blend = SWAP_MS): void {
    this.play({ kind: 'rest', t0: performance.now(), blend });
  }

  /** One frame exactly as a film last drew him: a handoff's gap, till the next film has drawn. */
  hold(frame: Frame): void {
    this.from = null;
    this.src = { kind: 'frame', t0: performance.now(), blend: 0, frame };
  }

  /** A canon script (Look around loops). */
  script(name: string, options: { loop?: boolean; blend?: number; done?: () => void } = {}): void {
    this.play({
      kind: 'script',
      name,
      t0: performance.now(),
      blend: options.blend ?? SWAP_MS,
      ...options,
    });
  }

  /** The hop: up and down behind the surface ('out'), or up out of it and landing ('in'). */
  hop(way: 'out' | 'in', done: () => void): void {
    const [off, end] = way === 'out' ? HOP_OUT : HOP_IN;
    this.play({
      kind: 'script',
      name: 'hide',
      t0: performance.now(),
      blend: way === 'out' ? 140 : 0,
      off,
      end,
      done,
    });
  }

  /** The typing watch: back a bit, then out to the caret, his body following it along the watch frames. */
  watch(): void {
    this.watchVec = null;
    this.play({ kind: 'watch', t0: performance.now(), blend: 140 });
  }

  /** The nudge, while he's watching (`gaze`: where the caret is, as his gaze reads it). */
  nudge(gaze: number): void {
    if (this.src.kind === 'watch')
      this.nudgeState = { t0: performance.now(), dir: gaze < 0 ? -1 : 1, cancel: null };
  }

  /** Typed during the nudge: back to watching from wherever he is. */
  cancelNudge(): void {
    const N = this.nudgeState;
    if (!N || N.cancel || !this.nudgeNow) return;
    N.cancel = { t0: performance.now(), ...this.nudgeNow };
  }

  get isNudging(): boolean {
    return Boolean(this.nudgeState);
  }

  /** Back to rest from watching. */
  unwatch(): void {
    this.rest(WATCH_BACK_MS);
  }

  /** Where the caret is along the box, 0 (left) .. 1 (right). */
  setCaret(u: number): void {
    this.caretU = clamp01(u);
  }

  /** The sleep cycle: found asleep (with the first sleep's alarm), or coming in awake. His cap stays on from here. */
  nap(asleep: boolean): void {
    this.cap.capMsg({ ray: 'cap', on: true });
    const now = performance.now();
    this.play({
      kind: 'nap',
      t0: now,
      blend: asleep ? 0 : SWAP_MS,
      phase: asleep ? 'asleep' : 'awake',
      phaseT0: now,
      alarmAt: asleep ? now + NAP.alarmMs : null,
      lastNear: now,
      flipQueued: false,
    });
  }

  /** His cap, as a film is asked to wear it ({ ray: 'cap' }): on, with its look, once the sleep cycle has put it on. */
  get capAsk(): { ray: 'cap'; on: boolean; q?: Record<string, unknown> } {
    const { CAP } = this.cap;
    return CAP.on ? { ray: 'cap', on: true, q: { ...CAP.q } } : { ray: 'cap', on: false };
  }

  /** What the sleep cycle is doing, or null when he isn't in it. */
  get napPhase(): NapPhase | null {
    return this.src.kind === 'nap' ? this.src.phase : null;
  }

  /** A click on him: the coin flip, or another coin while one is still up; asleep, he wakes first. */
  click(): void {
    if (this.isFlipping) {
      this.flip.flipSpam();
      return;
    }
    const S = this.src;
    const toss = Boolean(this.cap.CAP.on); // with the cap on it's the toss (no catch, no roll on his head)
    if (S.kind === 'nap' && S.phase !== 'awake') {
      S.flipQueued = true;
      if (S.phase !== 'wake') this.napTo(S, 'wake', performance.now(), 200);
      return;
    }
    if (this.base) this.flip.flipStart(this.base, toss); // (a flicked coin still falling keeps falling)
  }

  /** One frame: his move, the look laid over it, the flip over that, drawn. */
  tick(now: number, dt: number, look: Look): void {
    const flipping = this.isFlipping;
    if (flipping) this.src.t0 += dt; // his move holds while the flip plays over it
    this.nudgeNow = this.nudgeState && look.gaze != null ? this.nudgeAt(now, look.gaze) : null;
    let f = this.frameOf(now, dt);
    if (this.from) {
      const k = clamp01((now - this.fromT) / Math.max(1, this.src.blend));
      f = mixFrames(this.from, f, smooth(k));
      if (k >= 1) this.from = null;
    }
    this.base = f;

    const H = this.hover;
    const N = this.nudgeNow;
    const sleeping = this.src.kind === 'nap' && this.src.phase !== 'awake';
    if (this.src.kind === 'nap') this.napStep(this.src, now, dt, f, look.near ?? null);
    if (sleeping) {
      H.in = false;
      H.amt *= Math.exp(-dt / 120);
      H.lean *= Math.exp(-dt / RC.HOVER.leanMs);
    } else if (N && !flipping) {
      H.in = true;
      H.amt += (1 - H.amt) * (1 - Math.exp(-dt / 160));
      H.g = N.g;
      H.v = N.v;
      H.lean *= Math.exp(-dt / RC.HOVER.leanMs);
    } else if (!flipping && look.gaze != null) gazeAt(H, look.gaze, 0.55, dt);
    else if (!flipping && look.hover) RC.hoverStep(H, dt, f, look.pointer);
    else {
      H.in = false;
      H.amt *= Math.exp(-dt / (flipping ? 350 : 120));
      H.lean *= Math.exp(-dt / RC.HOVER.leanMs);
    }
    f = RC.withHover(f, H);
    if (this.flip.COINFLIP.on) f = this.flip.flipDraw(f, now).f;

    this.last = f;
    if (this.cap.CAP.on) {
      // Nightcap 2's soft cap: his head inside its cuff, the cap over him, its end swinging on its own springs
      RC.draw(this.ctx, this.cap.capFrame(f, { off: NAP.cap.off }), this.view, {
        mode: this.mode,
        clear: true,
        shadow: false,
      });
      this.cap.capDraw(this.ctx, f, this.view, this.mode, NAP.cap);
    } else RC.draw(this.ctx, f, this.view, { mode: this.mode, clear: true, shadow: false });
    this.drawn = true;
    const cb = this.pending;
    this.pending = null;
    cb?.();
  }

  clear(): void {
    if (!this.drawn) return;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawn = false;
  }

  // where the nudge has him: his body's shift right, his eyes' gaze; done, it's over (and the next one's wait starts)
  private nudgeAt(now: number, gaze: number): { dx: number; g: number; v: number } | null {
    const S = this.nudgeState!;
    const watching = { dx: 0, g: gaze, v: 0.55 };
    const straight = { dx: NUDGE.shift, g: NUDGE.straight.g, v: NUDGE.straight.v };
    const look = { dx: NUDGE.shift, g: NUDGE.straight.g + S.dir * NUDGE.look.g, v: NUDGE.look.v };
    const lerpN = (a: typeof watching, b: typeof watching, e: number, arc = 0): typeof watching => {
      const bow = arc * Math.sin(Math.PI * e); // up and out, towards the caret's side
      return {
        dx: a.dx + (b.dx - a.dx) * e,
        g: a.g + (b.g - a.g) * e + S.dir * 0.54 * bow,
        v: a.v + (b.v - a.v) * e - 0.84 * bow * 2,
      };
    };
    const done = (): null => {
      this.nudgeState = null;
      this.nudgeEndedAt = now;
      return null;
    };
    if (S.cancel) {
      const u = (now - S.cancel.t0) / NUDGE.cancelMs;
      return u >= 1 ? done() : lerpN(S.cancel, watching, NUDGE.steps[3][2](clamp01(u)));
    }
    const u = now - S.t0;
    const [s0, s1, s2, s3] = NUDGE.steps;
    if (u < s0[0]) return lerpN(watching, straight, s0[2](u / s0[0]));
    if (u < s0[1]) return straight;
    if (u < s1[0]) return lerpN(straight, look, s1[2]((u - s0[1]) / (s1[0] - s0[1])), NUDGE.arc[0]);
    if (u < s1[1]) return look;
    if (u < s2[0]) return lerpN(look, straight, s2[2]((u - s1[1]) / (s2[0] - s1[1])), NUDGE.arc[1]);
    if (u < s2[1]) return straight;
    if (u < s3[0]) return lerpN(straight, watching, s3[2]((u - s2[1]) / (s3[0] - s2[1])));
    return done();
  }

  // the sleep cycle's clock: the pointer near him, the first sleep's alarm, the minute alone, a click's flip once he's up
  private napStep(
    S: Extract<Source, { kind: 'nap' }>,
    now: number,
    dt: number,
    f: Frame,
    near: [number, number] | null,
  ): void {
    RC.hoverStep(this.napHover, dt, f, near);
    const isNear = Boolean(this.napHover.in);
    if (isNear) S.lastNear = now;
    if (
      (S.phase === 'doze' || S.phase === 'asleep') &&
      (isNear || (S.alarmAt != null && S.phase === 'asleep' && now >= S.alarmAt))
    )
      this.napTo(S, 'wake', now, 200);
    else if (
      S.phase === 'wake' &&
      S.flipQueued &&
      now - S.phaseT0 >= NAP.flipAfterWakeMs &&
      this.base
    ) {
      S.flipQueued = false;
      this.flip.flipStart(this.base, true);
    } else if (S.phase === 'awake' && now - S.lastNear >= NAP.dozeAfterMs && !this.isFlipping)
      this.napTo(S, 'doze', now, 500);
  }

  private napTo(
    S: Extract<Source, { kind: 'nap' }>,
    phase: NapPhase,
    now: number,
    blend: number,
  ): void {
    if (this.base && blend > 0) {
      this.from = this.base;
      this.fromT = now;
      S.blend = blend;
    }
    if (phase === 'wake') S.alarmAt = null; // (whatever woke him: only a pointer wakes him from now on)
    S.phase = phase;
    S.phaseT0 = now;
  }

  private napFrame(S: Extract<Source, { kind: 'nap' }>, now: number): Frame {
    const m = this.sim('sleep');
    const u = now - S.phaseT0;
    if (S.phase === 'doze') {
      const t = NAP.dozeFrom + u;
      if (t >= NAP.holdAt) this.napTo(S, 'asleep', now, 0);
      return RC.frameAt(m, Math.min(t, NAP.holdAt));
    }
    if (S.phase === 'asleep') {
      // the pose he sleeps in, his breath and the z's going on (canon's asleep stretch is 2.7 s and its breath 5 s: held, never wrapped)
      const f = RC.frameAt(m, NAP.holdAt);
      const breath = NAP.breath.amt * Math.sin((2 * Math.PI * u) / NAP.breath.ms);
      return {
        ...f,
        pose: { ...f.pose, squash: (f.pose.squash ?? 0) - breath },
        zzz: { v: 1, t: (f.zzz?.t ?? 0) + u },
      };
    }
    if (S.phase === 'wake') {
      const t = NAP.wakeFrom + u;
      if (t >= NAP.wakeTo) this.napTo(S, 'awake', now, 400);
      return RC.frameAt(m, Math.min(t, NAP.wakeTo));
    }
    // awake: Look around, his eyes all the way, his body a little
    const look = this.sim('look');
    const L = RC.frameAt(look, u % look.total);
    const P = L.pose ?? {};
    const k = NAP.bodyShare;
    const pose: Record<string, any> = { ...P };
    for (const n of ['squash', 'lean', 'bend', 'x', 'y']) pose[n] = (P[n] ?? 0) * k;
    pose.volume = 1 + ((P.volume ?? 1) - 1) * k;
    if (Array.isArray(P.corners))
      pose.corners = P.corners.map((c: number[]) => [c[0] * k, c[1] * k]);
    return { ...L, pose };
  }

  private play(src: Source): void {
    this.nudgeState = null;
    if (this.base && src.blend > 0) {
      this.from = this.base;
      this.fromT = performance.now();
    } else this.from = null;
    this.src = src;
  }

  private sim(name: string): any {
    return (this.sims[name] ??= RC.simulate((CANON as any)[name], { seed: 1 }));
  }

  private frameOf(now: number, dt: number): Frame {
    const S = this.src;
    const u = now - S.t0;
    if (S.kind === 'rest') return RC.idleFrame(u);
    if (S.kind === 'frame') return S.frame;
    if (S.kind === 'nap') return this.napFrame(S, now);
    if (S.kind === 'watch') return this.watchFrame(u, dt);
    const m = this.sim(S.name);
    const off = S.off ?? 0;
    const end = S.end != null ? Math.min(m.total, S.end) : m.total;
    let t = u + off;
    if (t >= end) {
      if (S.loop) t = off + ((t - off) % Math.max(1, end - off));
      else {
        t = end;
        if (!S.fired) {
          S.fired = true;
          this.pending = S.done ?? null;
        }
      }
    }
    return RC.frameAt(m, t);
  }

  private watchFrame(u: number, dt: number): Frame {
    const target = watchPoseAt(this.caretU);
    if (this.nudgeNow) target.x += this.nudgeNow.dx; // the nudge: from wherever he's watching, a shift right
    let pose: WatchPose;
    if (u < LEAN_BACK_MS) pose = mixWatch(REST_POSE, LEAN_BACK, easeOut(u / LEAN_BACK_MS));
    else if (u < LEAN_BACK_MS + LEAN_HOLD_MS) pose = LEAN_BACK;
    else if (u < LEAN_BACK_MS + LEAN_HOLD_MS + WATCH_OUT_MS)
      pose = mixWatch(
        LEAN_BACK,
        target,
        easeInOut((u - LEAN_BACK_MS - LEAN_HOLD_MS) / WATCH_OUT_MS),
      );
    else pose = this.follow(target, dt);
    const f = RC.keyFrame({ x: pose.x, corners: pose.corners });
    f.pose.volume = pose.volume;
    f.eyes = RC.idleFrame(u).eyes; // his blinks go on while he watches
    return f;
  }

  // his body after the caret on canon Typing's material (12.2 Hz, damping .953), stepped at 240 Hz
  private follow(target: WatchPose, dt: number): WatchPose {
    const goal = toVec(target);
    if (!this.watchVec) {
      this.watchVec = goal.slice();
      this.watchVel = goal.map(() => 0);
    }
    const { f, z } = RC.MATERIALS.typing;
    const w = 2 * Math.PI * f;
    const steps = Math.max(1, Math.ceil(dt / (1000 / 240)));
    const h = dt / 1000 / steps;
    const x = this.watchVec;
    const v = this.watchVel;
    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < x.length; i++) {
        v[i] += (w * w * (goal[i] - x[i]) - 2 * z * w * v[i]) * h;
        x[i] += v[i] * h;
      }
    }
    return fromVec(x);
  }
}

export { RayPlayer };
export type { Look };
