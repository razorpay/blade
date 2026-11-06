import type { FreshDoc, FreshPlayer } from '../RazorSenseEngine';

/**
 * The chat's RazorSense, as flow 9 plays it (rz62 oneTick, ported by the RazorSense system to one canvas: ray ds/make_chat.py).
 * The comp has three groups: two pages of the thinking comp (main, B) and the typing strip (T); each page has its own clock.
 *   thinking   a page loops 0 -> A; each pass's last `loopXf` s dissolves (smoothstep, added) into the other page from 0
 *   answer     the page hurries to A (x `catchup`), then plays on at the surge's speed: the drop, the surge to the chat input
 *   idle       held at the comp's end as the strip behind the chat input (its path on its own clock, calm), and typing cross-fades it
 *              into the typing strip by the typing strength (light: its own snappier tune, dark: the landing's)
 *   again      a new question starts thinking on the other page while idle fades
 * Pages sit where flow 9's chat has them (its origins()): thinking on its slot near the top, idle on the chat bar's middle
 * across and the window's bottom.
 */
type Tune = {
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
  drift?: number;
  pathBack?: number;
  up?: number;
  calm?: boolean;
  calmAt?: number;
  calmWander?: number;
  calmT?: number;
};

type ChatMotion = {
  think: { speed: number };
  surge: { speed: number; catchup: number };
  one: { loopXf: number };
  ltyp: Tune;
  rtl: Tune;
};

type ChatTimes = {
  A: number;
  land: number;
  settle: number;
  dur: number;
  tyDur: number;
  per: number;
  sweep: [number, number];
  pages: { main: string[]; B: string[] };
  type: string;
};

type Page = {
  g: string;
  op: number;
  to: number;
  spd: number;
  t: number;
  al: number;
  pt: number | null;
  pu: number;
  pos: '' | 'think' | 'surge' | 'bottom';
  xy: [number, number] | null;
};

/**
 * The comp (CSS px at scale 1): its size, its thinking slot's middle, and its chat bar's middle across and top (flow 9's chat bar
 * sits 111 px above the window's bottom, the comp's bottom edge).
 */
const COMP = { w: 1512, h: 982, slot: [380, 173.65], box: 787, barTop: 982 - 111 };
/** flow 9's chat (measured, CSS px): its thinking slot's middle (from the window's middle across, from its top down) */
const SLOT = [-352, 176.95];
/** the chat panel's offset in flow 9's window */
const CLIP = [6, 48];

/** where the chat's parts are, in the chat panel's CSS px: the thinking slot's middle, the chat input's middle across and top */
type ChatAnchors = { thinking: [number, number]; input: [number, number] };

/** flow 9's own chat, for a panel this big: its chat bar centred across the window 111 px above the bottom, its thinking slot */
const flow9Anchors = (width: number, height: number): ChatAnchors => {
  const W = width + CLIP[0] * 2;
  const H = height + CLIP[1] + CLIP[0];
  return {
    thinking: [W / 2 + SLOT[0] - CLIP[0], SLOT[1] - CLIP[1]],
    input: [W / 2 - CLIP[0], H - 111 - CLIP[1]],
  };
};

const smooth01 = (u: number): number => {
  const v = Math.min(1, Math.max(0, u));
  return v * v * (3 - 2 * v);
};

const page = (g: string): Page => ({
  g,
  op: 0,
  to: 0,
  spd: 0,
  t: 0,
  al: 0,
  pt: null,
  pu: 1,
  pos: '',
  xy: null,
});

const getChatSetup = (doc: FreshDoc): { times: ChatTimes; motion: ChatMotion } | null => {
  const times = doc.ui?.dsChat as ChatTimes | undefined;
  const motion = doc.ui?.freshChat as ChatMotion | undefined;
  return times && motion ? { times, motion } : null;
};

class ChatDriver {
  public state: '' | 'think' | 'surge' | 'idle' = '';
  /** the typing surge's strength on idle (0-1) */
  public a = 0;

  private readonly C: ChatTimes;
  private readonly M: ChatMotion;
  private readonly isDark: boolean;
  private readonly P2: [Page, Page] = [page('main'), page('B')];
  private readonly RT: Page = page('T');
  private O: { think: [number, number]; bottom: [number, number] } = {
    think: [0, 0],
    bottom: [0, 0],
  };

  private dx = 0;
  private dy = 0;
  private t = 0;
  private alive = 0;
  private main = 0;
  private xf = 0;
  private pend = false;
  private pendT = 0;
  private self: Page | null = null;
  private V = 0;
  private Vto = 0;
  private Vspd = 1;
  private ralive = 0;
  private path = 0;
  private pspd = 1;
  private pclk = 0;
  private calmK: number | null = null;
  private v = 0;
  private R = 0;
  private ph = 0;
  private last = -1e9;
  private first = 0;
  private rate = 0;

  constructor(setup: { times: ChatTimes; motion: ChatMotion }, isDark: boolean) {
    this.C = setup.times;
    this.M = setup.motion;
    this.isDark = isDark;
    this.RT.t = this.C.tyDur;
  }

  /**
   * Where the pages go (the comp's top-left, in the panel's CSS px): thinking with the comp's slot on the thinking anchor, idle
   * with the comp's chat bar on the chat input; `scale` is the comp's (as drawn), `room` what withRoom gave it (CSS px at
   * scale 1: the comp's top-left sits that much further up and left).
   */
  public setAnchors(anchors: ChatAnchors, scale: number, room = { x: 0, y: 0 }): void {
    const rx = room.x * scale;
    const ry = room.y * scale;
    this.O = {
      think: [
        anchors.thinking[0] - COMP.slot[0] * scale - rx,
        anchors.thinking[1] - COMP.slot[1] * scale - ry,
      ],
      bottom: [
        anchors.input[0] - COMP.box * scale - rx,
        anchors.input[1] - COMP.barTop * scale - ry,
      ],
    };
  }

  /** a new question: thinking starts on the page least seen (the other one, and idle, fade where they are) */
  public think(): void {
    if (this.state === 'think') {
      // asked again before the answer's surge began (thinking, idle, thinking): it keeps thinking
      this.pend = false;
      return;
    }
    const n = this.fresh();
    const g = this.P2[n];
    this.state = 'think';
    this.t = 0;
    this.alive = 0;
    this.main = n;
    this.xf = 0;
    this.pend = false;
    g.pos = 'think';
    this.opSet(g, 0);
    this.opTo(g, 1, 0.3);
    g.t = 0;
    g.al = 0;
  }

  /** the answer is in: the thinking hurries to its turn and surges down and settles to idle (nowMs: performance.now()) */
  public answer(nowMs: number): void {
    if (this.state === 'think' && !this.pend) {
      this.pend = true;
      this.pendT = nowMs;
    }
  }

  /** a key typed in the chat input (s: now, in seconds); counts only while idle */
  public hit(s: number): void {
    if (this.state !== 'idle') return;
    if (s - this.last > this.tune().hold) this.first = s;
    this.last = s;
    this.rate += 1;
  }

  /** moves everything on by dt (s) and draws that moment (unless shouldDraw is false) */
  public step(player: FreshPlayer, dt: number, nowMs: number, shouldDraw = true): void {
    const C = this.C;
    const M = this.M;
    const s = nowMs / 1000;
    const dur = C.dur;
    if (this.state === 'think' || this.state === 'surge' || this.state === 'idle') {
      const a = this.P2[this.main];
      const b = this.P2[1 - this.main];
      if (this.state === 'think') {
        const hurry = this.pend
          ? 1 + (Math.max(1, M.surge.catchup) - 1) * Math.min(1, (nowMs - this.pendT) / 300)
          : 1;
        const k = Math.max(0.01, M.think.speed) * hurry;
        this.t += dt * k;
        this.alive += dt * k;
        const X = Math.max(0.05, Math.min(+M.one.loopXf || 0.6, C.A * 0.45));
        if (!this.pend && !this.xf && this.t >= C.A - X) {
          this.xf = 1;
          b.pos = 'think';
          this.opSet(b, 0);
        }
        if (this.xf) {
          const u = this.t - (C.A - X);
          if (u >= X) {
            // b is the loop now
            this.main = 1 - this.main;
            this.t = u;
            this.xf = 0;
            this.opSet(b, 1);
            this.opSet(a, 0);
            a.pos = '';
          } else {
            const e = smooth01(u / X);
            this.opSet(a, 1 - e);
            this.opSet(b, e);
            b.t = u;
            b.al = this.alive;
          }
        }
        if (this.pend && !this.xf && this.t >= C.A) {
          // the answer: on from A, the same page
          this.t = C.A;
          this.state = 'surge';
          this.pend = false;
          this.dx = this.O.think[0] - this.O.bottom[0];
          this.dy = this.O.think[1] - this.O.bottom[1];
          this.P2[this.main].pos = 'surge';
        }
      } else {
        const k = Math.max(0.01, M.surge.speed);
        this.t = Math.min(dur, this.t + dt * k);
        this.alive += dt * k;
      }
      if (this.state === 'surge' && this.t >= C.settle) {
        // its strip stays: the page plays on to its end and holds, drifting
        this.self = this.P2[this.main];
        this.self.pos = 'bottom';
        this.state = 'idle';
        this.ralive = this.alive;
        this.path = this.alive;
        this.a = 0;
        this.v = 0;
        this.R = 0;
        this.pclk = 0;
        this.calmK = null;
        this.V = 1;
        this.Vto = 1;
      }
      const m = this.P2[this.main];
      if (
        (m.op > 0 || m.to > 0) &&
        m !== this.self &&
        (this.state === 'think' || this.state === 'surge')
      ) {
        m.t = this.t;
        m.al = this.alive;
      }
    }
    this.idle(dt, s, dur);
    for (const g of [...this.P2, this.RT]) {
      if (g.op !== g.to) {
        const st = g.spd * dt;
        g.op = g.op < g.to ? Math.min(g.to, g.op + st) : Math.max(g.to, g.op - st);
      }
    }
    if (shouldDraw) this.draw(player);
  }

  /** idle: the strip held at the comp's end; typing cross-fades it into the typing surge */
  private idle(dt: number, s: number, dur: number): void {
    const M = this.M;
    if (this.V !== this.Vto) {
      this.V =
        this.V < this.Vto
          ? Math.min(this.Vto, this.V + this.Vspd * dt)
          : Math.max(this.Vto, this.V - this.Vspd * dt);
    }
    if (this.self && this.V <= 0 && this.Vto <= 0 && this.state !== 'idle') {
      this.opSet(this.self, 0);
      this.self = null;
      this.opSet(this.RT, 0);
    }
    if (!(this.V > 0 || (this.self && (this.self.op > 0 || this.RT.op > 0)))) return;
    const L = this.tune();
    const isTyping = s - this.last < L.hold;
    const rIn = isTyping ? smooth01((s - this.first - L.rhythmAfter) / 1.5) : 0;
    this.R +=
      (rIn - this.R) * (1 - Math.exp(-dt / (rIn > this.R ? 0.6 : Math.max(0.2, L.simmer / 3))));
    this.ph += dt * 2 * Math.PI * L.rhythmSpeed * (0.35 + 0.65 * this.R);
    this.rate *= Math.exp(-dt);
    const swell = 0.5 - 0.5 * Math.cos(this.ph);
    const pk = isTyping ? L.pulse * Math.exp(-Math.max(0, s - this.first) / 0.9) : 0;
    const target =
      isTyping && this.state === 'idle'
        ? Math.min(
            1,
            L.level +
              Math.max(0, L.peak - L.level) * Math.min(1, pk + this.R * L.rhythm * swell) +
              L.react * Math.min(1.25, this.rate / 8),
          )
        : 0;
    const tau = target >= this.a ? L.rise : isTyping ? Math.max(L.rise, L.fall) : L.simmer;
    const w = 3.9 / Math.max(0.05, tau);
    const n = Math.ceil(dt / 0.004);
    const h = dt / Math.max(1, n);
    for (let i = 0; i < n; i++) {
      this.v += (w * w * (target - this.a) - 2 * w * this.v) * h;
      this.a += this.v * h;
    }
    this.a = Math.max(0, Math.min(1, this.a));
    if (this.a <= 0 && this.v < 0) this.v = 0;
    const drift = Math.max(0.05, L.drift ?? 1);
    this.ralive += dt * drift;
    this.pspd +=
      (1 - this.pspd) *
      (1 - Math.exp(-dt / (this.pspd > 1 ? 0.25 : Math.max(0.05, L.pathBack ?? 2.2) / 3)));
    const R = M.rtl;
    if (R?.calm) {
      // its path shift lingers in the calm part of its cycle, wandering a little round it
      const per = this.C.per;
      this.pclk += dt * drift;
      if (this.calmK == null) this.calmK = Math.round(this.path / per - (R.calmAt ?? 0.43));
      const tg =
        per *
        (this.calmK +
          (R.calmAt ?? 0.43) +
          (R.calmWander ?? 0.05) *
            Math.sin((2 * Math.PI * this.pclk) / Math.max(2, R.calmT ?? 14)));
      this.path += (tg - this.path) * (1 - Math.exp(-dt / 0.9));
    } else {
      this.path += dt * drift * this.pspd;
    }
    const pairs: [Page | null, number][] = [
      [this.self, this.V * (1 - this.a)],
      [this.RT, this.V * this.a],
    ];
    for (const [g, op] of pairs) {
      if (!g) continue;
      this.opSet(g, op);
      if (!(op > 5e-4)) continue;
      // light's strip: no upward drift; dark's as made
      g.pu = !this.isDark && M.rtl ? +(M.rtl.up ?? 1) : 1;
      g.pt = this.path;
      g.t = g === this.self ? Math.min(dur, this.t) : this.C.tyDur;
      g.al = this.ralive;
    }
  }

  /** onto the canvas: each page a group added (plus-lighter), its comps on its clock; the big bands only through their sweep */
  private draw(player: FreshPlayer): void {
    const C = this.C;
    const sw = (g: Page): number => (g.t > C.sweep[0] && g.t < C.sweep[1] ? 1 : 0);
    for (const g of [...this.P2, this.RT]) {
      if (g === this.RT) g.pos = 'bottom';
      if (g.pos === 'think') g.xy = this.O.think;
      else if (g.pos === 'bottom') g.xy = this.O.bottom;
      else if (g.pos === 'surge') {
        const u = smooth01((this.t - C.A) / Math.max(0.05, C.land - C.A));
        const k = 1 - u;
        g.xy = [this.O.bottom[0] + this.dx * k, this.O.bottom[1] + this.dy * k];
      }
      player.group(g.g, {
        op: g.op,
        blend: 'add',
        dx: g.xy ? g.xy[0] : 0,
        dy: g.xy ? g.xy[1] : 0,
      });
    }
    const [A, B] = this.P2;
    player.comp('root', { pt: A.pt, pu: A.pu });
    player.comp('bigbands', { op: sw(A), pt: A.pt, pu: A.pu });
    player.comp('c3', { pt: A.pt, pu: A.pu });
    player.comp('b_root', { t: B.t, al: B.al, pt: B.pt, pu: B.pu });
    player.comp('b_big', { t: B.t, al: B.al, op: sw(B), pt: B.pt, pu: B.pu });
    player.comp('b_c3', { t: B.t, al: B.al, pt: B.pt, pu: B.pu });
    player.comp(C.type, { t: this.RT.t, al: this.RT.al, pt: this.RT.pt, pu: this.RT.pu });
    player.seek(A.t, A.al);
  }

  private tune(): Tune {
    // light: its own, snappier strength (rtl); dark: the landing's (ltyp)
    return this.isDark ? this.M.ltyp : { ...this.M.ltyp, ...this.M.rtl };
  }

  /** the page least seen (the other, if showing, fades out where it is; so does idle) */
  private fresh(): number {
    const n =
      this.self === this.P2[0]
        ? 1
        : this.self === this.P2[1]
        ? 0
        : this.P2[0].op <= this.P2[1].op
        ? 0
        : 1;
    const g = this.P2[1 - n];
    if (g.op > 0 && g !== this.self) {
      this.opTo(g, 0, 0.3);
      g.pos = '';
    }
    if (this.V > 0) {
      this.vTo(0, 0.3);
    }
    return n;
  }

  private opTo(g: Page, to: number, d: number): void {
    g.to = to;
    g.spd = d > 0 ? 1 / d : 1e9;
  }

  private opSet(g: Page, v: number): void {
    g.op = v;
    g.to = v;
  }

  private vTo(to: number, d: number): void {
    this.Vto = to;
    this.Vspd = d > 0 ? 1 / d : 1e9;
  }
}

export { ChatDriver, getChatSetup, flow9Anchors };
export type { ChatAnchors };
export type { ChatMotion, ChatTimes };
