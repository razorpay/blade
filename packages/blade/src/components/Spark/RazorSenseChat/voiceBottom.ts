import { voiceBottomDark, voiceBottomLight } from './voiceComps';
import { VoiceMotion } from '../RazorSenseEngine/voice';
import type {
  FreshDoc,
  FreshLook,
  FreshShapeFrame,
  FreshStops,
  FreshTools,
  FreshVoiceBottom,
} from '../RazorSenseEngine/types';

/**
 * The voice bottom (send/razorsense-blade/voice-bottom, speechtest2.html's tuning): while the page listens, the chat's bottom strip
 * grows a row of blobs on its top edge, each a pitch band of the page's voice, and takes the voice look's Colorama as the voice comes
 * in; silent, the strip breathes and sways, faint. Drawn as flow 10.5 draws it (voice9.js): the strip page itself, with the row in its
 * Comp 3, so at m 0 it's the strip as it was; only the row, the strip's swell and Comp 3's colour move with m (speechtest2's comp-aware
 * player hook, here the engine's look()). Its own chunk: loaded the first time the chat listens.
 */

type Shape = Record<string, unknown> & {
  id: string;
  x?: number;
  y?: number;
  s?: number;
  sx?: number;
  sy?: number;
  pts?: { x: number; y: number; ix?: number; iy?: number; ox?: number; oy?: number }[];
};

/** the page value it multiplies (as the studio's hook: unset, or 0, counts as 1) */
const gamOf = (v?: number): number => (v ? v : 1);

/** the strip's own id, in its Comp 3 */
const STRIP = 's2';

const ellipse = (rx: number, ry: number, k = 0.5523): NonNullable<Shape['pts']> => {
  const point = (
    x: number,
    y: number,
    ix: number,
    iy: number,
    ox: number,
    oy: number,
  ): NonNullable<Shape['pts']>[number] =>
    ({ x, y, ix, iy, ox, oy, sm: true, mir: 'both' } as NonNullable<Shape['pts']>[number]);
  return [
    point(0, -ry, -rx * k, 0, rx * k, 0),
    point(rx, 0, 0, -ry * k, 0, ry * k),
    point(0, ry, rx * k, 0, -rx * k, 0),
    point(-rx, 0, 0, ry * k, 0, -ry * k),
  ];
};

/** the strip's top edge (its first three points, their curves), without its drift: [x, y] pairs, comp px from the comp's middle, by x */
const edgeOf = (s: Shape): Float32Array => {
  const pts = s.pts ?? [];
  if (pts.length < 3) return new Float32Array(0);
  const k = s.s ?? 1;
  const sx = (s.sx ?? 1) * k;
  const sy = (s.sy ?? 1) * k;
  const at = pts.map((p) => ({
    x: (s.x ?? 0) + p.x * sx,
    y: (s.y ?? 0) + p.y * sy,
    ix: (p.ix ?? 0) * sx,
    iy: (p.iy ?? 0) * sy,
    ox: (p.ox ?? 0) * sx,
    oy: (p.oy ?? 0) * sy,
  }));
  const out: [number, number][] = [];
  for (const [a, b] of [
    [at[0], at[1]],
    [at[1], at[2]],
  ]) {
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      const bez = (p0: number, p1: number, p2: number, p3: number): number =>
        (1 - u) ** 3 * p0 + 3 * (1 - u) ** 2 * u * p1 + 3 * (1 - u) * u * u * p2 + u ** 3 * p3;
      out.push([bez(a.x, a.x + a.ox, b.x + b.ix, b.x), bez(a.y, a.y + a.oy, b.y + b.iy, b.y)]);
    }
  }
  out.sort((p, q) => p[0] - q[0]);
  return Float32Array.from(out.flat());
};

const edgeY = (E: Float32Array, x: number): number => {
  const n = E.length / 2;
  if (!n) return 0;
  if (x <= E[0]) return E[1];
  for (let i = 1; i < n; i++) {
    if (x <= E[i * 2]) {
      const f = (x - E[i * 2 - 2]) / Math.max(1e-6, E[i * 2] - E[i * 2 - 2]);
      return E[i * 2 - 1] + (E[i * 2 + 1] - E[i * 2 - 1]) * f;
    }
  }
  return E[n * 2 - 1];
};

type StackEntry = { id: string; doc: FreshDoc; [key: string]: unknown };

class VoiceBottom {
  public readonly data: FreshVoiceBottom;
  public readonly motion: VoiceMotion;
  public readonly look: FreshLook;
  /** the Comp 3 the row is in (the strip page's: c3 or b_c3) */
  private comp = '';
  private edge = new Float32Array(0);
  /** the chat input's middle across and half width, and how far its top is above flow's bar's (comp px) */
  private rowX = 0;
  private rowHL = 840;
  private readonly blobAt: Map<string, number>;
  private readonly bx: Float32Array;
  private readonly by: Float32Array;
  private readonly bsy: Float32Array;
  private readonly bsx: Float32Array;
  private readonly bop: Float32Array;
  // the strip this frame: its colour's share, breath, sway, swell, richness
  private cm = 0;
  private sbr = 0;
  private ssw = 0;
  private swell = 0;
  private rich = 0;

  private readonly tools: FreshTools;

  constructor(mode: 'light' | 'dark', tools: FreshTools) {
    this.tools = tools;
    this.data = mode === 'dark' ? voiceBottomDark : voiceBottomLight;
    const n = Math.max(1, Math.round(this.data.values.look.count));
    this.motion = new VoiceMotion(n);
    this.blobAt = new Map(Array.from({ length: n }, (_, i) => [`vx${i}`, i]));
    this.bx = new Float32Array(n);
    this.by = new Float32Array(n);
    this.bsy = new Float32Array(n);
    this.bsx = new Float32Array(n);
    this.bop = new Float32Array(n);
    this.look = { shape: this.shape, params: this.params };
  }

  /**
   * The chat's comp with the row in its strip page's Comp 3 (`comp`), each blob as wide as a chat input `inputWidth` comp px wide makes
   * it, the input's middle `inputX` comp px from the comp's middle, on the strip's top edge (made once a listen starts, as flow 10.5
   * makes its page)
   */
  public compose(doc: FreshDoc, comp: string, inputX: number, inputWidth: number): FreshDoc {
    const stack = (doc.stack as StackEntry[] | undefined) ?? [];
    const entry = stack.find((e) => e.id === comp);
    if (!entry) return doc;
    this.comp = comp;
    this.rowX = inputX;
    this.rowHL = inputWidth / 2;
    const shapes = (entry.doc.shapes as Shape[] | undefined) ?? [];
    const strip = shapes.find((s) => s.id === STRIP);
    this.edge = strip ? edgeOf(strip) : new Float32Array(0);
    const L = this.data.values.look;
    const n = this.motion.blobs;
    const span = 2 * this.rowHL * L.spread * L.len;
    const w = Math.max(30, (n < 2 ? span * 0.35 : span / (n - 1)) * L.bw);
    const { tpl } = this.data;
    const h = tpl.prm?.h ?? 400;
    const row = Array.from({ length: n }, (_, i) => ({
      ...(JSON.parse(JSON.stringify(tpl)) as Shape),
      id: `vx${i}`,
      name: `Voice · blob ${i + 1}`,
      sx: 1,
      sy: 1,
      s: 1,
      op: 1,
      on: true,
      prm: { ...tpl.prm, w, h },
      pts: ellipse(w / 2, h / 2),
    }));
    return {
      ...doc,
      stack: stack.map((e) =>
        e === entry ? { ...e, doc: { ...e.doc, shapes: [...shapes, ...row] } } : e,
      ),
    };
  }

  /** one frame: the morph towards the voice look while `want`, the page's voice into the row (s: now, in seconds) */
  public frame(
    dt: number,
    s: number,
    want: boolean,
    lvl: number,
    bands: ArrayLike<number> | null,
  ): void {
    const { motion: M } = this;
    const V = this.data.values;
    const L = V.look;
    M.morph(dt, want, V);
    M.react(dt, s, lvl, bands, V);
    const span = this.rowHL * L.spread * L.len;
    const X0 = this.rowX + L.dx;
    for (let i = 0; i < M.blobs; i++) {
      const u = M.rowU(i);
      const e = Math.max(0, M.env[i]);
      const ph = i * 2.39996;
      const x =
        X0 +
        u * span * (1 + L.push * M.a) +
        L.wander * (0.6 * Math.sin(s * 0.7 + ph) + 0.4 * Math.sin(s * 1.31 + 2 * ph));
      const eu = Math.min(1, Math.abs(x - X0) / Math.max(1, this.rowHL * L.len));
      this.bop[i] = 1 - L.efade * eu * eu * (3 - 2 * eu);
      this.bx[i] = x;
      this.by[i] = edgeY(this.edge, x) + L.dy;
      this.bsy[i] = L.rest * (1 - L.bias * Math.abs(u) ** 1.6) + L.height * e;
      this.bsx[i] = 1 + L.widen * e;
    }
    // (silence: the strip's own colour, coming in with the voice; a breath and a sway)
    const ca = Math.min(1, M.a / Math.max(0.02, L.cfull ?? 0.4));
    this.cm = M.m * (L.scol + (1 - L.scol) * ca);
    const bp = (2 * Math.PI * s) / Math.max(0.3, L.sper);
    this.sbr = L.sbr * Math.sin(bp) * M.m;
    this.ssw = L.ssw * Math.sin(bp * 0.61 + 1.3) * M.m;
    this.swell = L.swell * Math.min(1.5, M.a);
    this.rich = L.rich * Math.min(1, M.a) * M.m;
  }

  /** speechtest2's hook on the strip page's Comp 3: the strip swells and breathes, the row lies along its top edge */
  private shape = (o: FreshShapeFrame, comp: string): void => {
    if (comp !== this.comp) return;
    const { m } = this.motion;
    const L = this.data.values.look;
    if (o.id === STRIP) {
      o.sy *= 1 + this.swell * m + this.sbr;
      o.x += this.ssw;
      o.y -= L.lift * m;
      const b = 1 + (L.lsoft - 1) * m;
      o.bh *= b;
      o.bv *= b;
      return;
    }
    const i = this.blobAt.get(o.id);
    if (i === undefined) return;
    const a = this.bsy[i] * m;
    o.x = this.bx[i];
    o.y = this.by[i];
    o.sy *= a;
    o.sx *= this.bsx[i];
    o.op *= this.bop[i];
    o.bh *= L.soft;
    o.bv *= L.soft;
    if (a < 0.002) o.op = 0;
  };

  /** Comp 3's Colorama: its own line into the voice look's by cm, richer with the voice, its colour strength */
  private params: NonNullable<FreshLook['params']> = (P, comp, t) => {
    if (comp !== this.comp) return P;
    const { cm } = this;
    if (cm >= 1e-4 && P.stops) {
      const voice = this.tools.evalTrack(this.data.colours, t) as FreshStops;
      P.stops = this.tools.lerpStops(P.stops, voice, Math.min(1, cm));
    }
    if (this.rich > 0) P.cInGam = gamOf(P.cInGam) * (1 - 0.5 * this.rich);
    const gam = 1 / Math.max(0.1, this.data.cstr);
    if (gam !== 1) P.cInGam = gamOf(P.cInGam) * (1 + (gam - 1) * cm);
    return P;
  };
}

export { VoiceBottom };
