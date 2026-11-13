import type { FreshDoc, FreshPlayer } from '../RazorSenseEngine';

/**
 * The chat's RazorSense, as flow 9 plays it (rz62 oneTick, ported by the RazorSense system to one canvas: ray ds/make_chat.py).
 * The comp has three groups: two pages of the thinking comp (main, B) and the typing strip (T); each page has its own clock.
 *   thinking   a page loops 0 -> A; each pass's last `loopXf` s dissolves (smoothstep, added) into the other page from 0
 *   answer     the page hurries to A (x `catchup`), then plays on at the surge's speed: the drop, the surge to the chat input
 *   idle       held at the comp's end as the strip behind the chat input (its path drifting on its own clock); typing lays the typing
 *              strip over it by the typing strength, as the landing does (flow 10): livelier, the path held while it's up, and every
 *              shape grown round the bottom under the strip's middle (the size boost, `grow`)
 *   again      a new question plays the surge backwards: the bottom wave rises from the chat input back up to the thinking slot,
 *              then thinks on (mid-surge, the page just turns round; the answer mid-rise turns it back down)
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
  liven?: number;
  pathPause?: number;
  grow?: number;
};

type ChatMotion = {
  /** what typing's size boost grows round (comp px from the comp's middle): the comp's bottom edge, under the strip's middle */
  growAt?: [number, number];
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

/**
 * The rise: the wave's hold and the faint part of the surge after its glide (back to `land`) go by in this long (s), so the glow
 * starts up at once; the glide up itself is at the surge's own speed.
 */
const RISE_TAIL = 0.6;
const RISE_XF = 0.3;

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

type ChatSetup = { times: ChatTimes; motion: ChatMotion };

const getChatSetup = (doc: FreshDoc): ChatSetup | null => {
  const times = doc.ui?.dsChat as ChatTimes | undefined;
  const motion = doc.ui?.freshChat as ChatMotion | undefined;
  return times && motion ? { times, motion } : null;
};

class ChatDriver {
  public state: '' | 'think' | 'surge' | 'rise' | 'idle' = '';
  /** the typing surge's strength on idle (0-1) */
  public a = 0;

  private readonly C: ChatTimes;
  private readonly M: ChatMotion;
  private readonly isDark: boolean;
  private readonly growAt: [number, number];
  /** typing's size boost as drawn (1: none); eases back once the chat leaves idle */
  private gw = 1;
  private readonly P2: [Page, Page] = [page('main'), page('B')];
  private readonly RT: Page = page('T');
  private O: { think: [number, number]; bottom: [number, number] } = {
    think: [0, 0],
    bottom: [0, 0],
  };

  private dx = 0;
  /** the rise's speed-up back to `land` (that part goes by in RISE_TAIL s) */
  private tailK = 1;
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
  private v = 0;
  private R = 0;
  private ph = 0;
  private last = -1e9;
  private first = 0;
  private rate = 0;

  constructor(setup: ChatSetup, isDark: boolean) {
    this.C = setup.times;
    this.M = setup.motion;
    this.growAt = setup.motion.growAt ?? [0, 0];
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

  /**
   * a new question: thinking starts on the page least seen (the other one fades where it is). Once the answer is in (surging
   * down, or settled to the bottom wave), it rises back up first: the surge, backwards.
   */
  public think(): void {
    if (this.state === 'think') {
      // asked again before the answer's surge began (thinking, idle, thinking): it keeps thinking
      this.pend = false;
      return;
    }
    if (this.state === 'rise') return;
    if (this.state === 'surge' || (this.state === 'idle' && this.self)) {
      this.rise();
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
    if (this.state === 'rise') {
      // in while it was rising: it turns back down
      this.state = 'surge';
      return;
    }
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
    if (
      this.state === 'think' ||
      this.state === 'surge' ||
      this.state === 'rise' ||
      this.state === 'idle'
    ) {
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
      } else if (this.state === 'rise') {
        // the surge backwards: from where the wave settled back to A, gliding up to the thinking slot over land -> A
        const k = Math.max(0.01, M.surge.speed) * (this.t > C.land ? this.tailK : 1);
        this.t = Math.max(C.A, this.t - dt * k);
        this.alive += dt * k;
        this.path += dt * Math.max(0.05, this.tune().drift ?? 1);
        this.P2[this.main].pt = this.path;
        if (this.t <= C.A) {
          // up at the thinking slot: thinking takes over, the risen page dissolving into the other page's start
          this.state = '';
          this.think();
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
        // (its path carries on from where the page had it: no jump)
        this.path = this.self.pt ?? this.alive;
        this.a = 0;
        this.v = 0;
        this.R = 0;
        this.V = 1;
        this.Vto = 1;
      }
      const m = this.P2[this.main];
      if (
        (m.op > 0 || m.to > 0) &&
        m !== this.self &&
        (this.state === 'think' || this.state === 'surge' || this.state === 'rise')
      ) {
        m.t = this.t;
        m.al = this.alive;
      }
    }
    this.idle(dt, s, dur);
    const gTo = this.state === 'idle' ? 1 + (this.tune().grow ?? 0) * this.a : 1;
    this.gw = this.state === 'idle' ? gTo : this.gw + (gTo - this.gw) * (1 - Math.exp(-dt / 0.3));
    for (const g of [...this.P2, this.RT]) {
      if (g.op !== g.to) {
        const st = g.spd * dt;
        g.op = g.op < g.to ? Math.min(g.to, g.op + st) : Math.max(g.to, g.op - st);
      }
    }
    if (shouldDraw) this.draw(player);
  }

  /** idle: the strip held at the comp's end; typing lays the typing surge over it (flow 10: the landing's way) */
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
    // the clocks: livelier with the strength; the path held while the pulse is up, back up to speed over `pathBack` s (flow 10,
    // as the landing). Its path drifts on otherwise (the comps' calm tune held it at one spot: Blade's wave keeps moving)
    const drift = Math.max(0.05, L.drift ?? 1);
    this.ralive += dt * drift * (1 + ((L.liven ?? 1) - 1) * this.a);
    const pt = 1 - (L.pathPause ?? 0) * smooth01(this.a / Math.max(0.05, L.level));
    this.pspd +=
      (pt - this.pspd) *
      (1 - Math.exp(-dt / (pt < this.pspd ? 0.25 : Math.max(0.05, L.pathBack ?? 2.2) / 3)));
    this.path += dt * drift * this.pspd;
    // the strip stays; the typing strip over it at the strength (flow 10: as the landing's two, no longer a cross-fade)
    const pairs: [Page | null, number][] = [
      [this.self, this.V],
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
        // (the typing strip lies over the idle one; the pages add up, as flow 9 lays its pages)
        blend: g === this.RT ? 'normal' : 'add',
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
    // typing's size boost (flow 10): every shape grown round the bottom under the strip's middle
    const gw = Math.round(this.gw * 1e4) / 1e4;
    player.shapes(gw, gw, this.growAt[0], this.growAt[1], 1);
    player.seek(A.t, A.al);
  }

  /**
   * a new question once the answer is in: the wave's own page plays the surge backwards, from where it is. Its strip un-forms
   * quickly (RISE_TAIL s back to `land`), then it glides back up to the thinking slot; mid-surge, the surging page turns round
   */
  private rise(): void {
    this.dx = this.O.think[0] - this.O.bottom[0];
    this.dy = this.O.think[1] - this.O.bottom[1];
    const speed = Math.max(0.01, this.M.surge.speed);
    if (this.state === 'surge') {
      // (its path carries on from where the page had it: no jump)
      this.path = this.P2[this.main].pt ?? this.alive;
      this.state = 'rise';
      this.tailK = Math.max(1, (this.t - this.C.land) / (RISE_TAIL * speed));
      return;
    }
    const g = this.self;
    if (!g) return;
    this.state = 'rise';
    this.main = this.P2.indexOf(g);
    this.self = null;
    this.t = Math.min(this.C.dur, this.t);
    this.tailK = Math.max(1, (this.t - this.C.land) / (RISE_TAIL * speed));
    this.alive = this.ralive;
    g.pos = 'surge';
    // (back to full, if typing had it cross-faded into the typing strip; the typing strip and idle go)
    this.opTo(g, 1, RISE_XF);
    this.opTo(this.RT, 0, RISE_XF);
    this.V = 0;
    this.Vto = 0;
  }

  private tune(): Tune {
    // the landing's strength in both modes (flow 10; light had its own snappier one, rtl, whose `up` it still keeps)
    return this.M.ltyp;
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
export type { ChatMotion, ChatSetup, ChatTimes };
