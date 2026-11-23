import { voiceDashboardDark, voiceDashboardLight } from './voiceComps';
import { VoiceMotion } from '../RazorSenseEngine/voice';
import type {
  FreshDoc,
  FreshKey,
  FreshLook,
  FreshShapeFrame,
  FreshStops,
  FreshTools,
  FreshVoiceDashboard,
} from '../RazorSenseEngine/types';

/**
 * The voice dashboard (send/razorsense-blade/voice-dashboard, speechtest.html's tuning): while the page listens, the chat background's
 * remnant morphs into the voice look, its line a row of blobs, each a pitch band of the page's voice. Drawn as flow 10.5 draws it: the
 * voice tab (its tuned Colorama, the row in it) takes the remnant's place on the same canvas at m 0, where it's the same picture, and
 * every shape both have goes from the remnant's to the voice's by m (speechtest's player hook, here the engine's look()). Back at m 0,
 * the remnant again. Its own chunk: loaded the first time a chat background listens.
 */

/** what a shape both docs have morphs (its numbers, its size and its points) */
const F = [
  'x',
  'y',
  'sx',
  'sy',
  's',
  'r',
  'bh',
  'bv',
  'lv',
  'lv2',
  'op',
  'psA',
  'psSp',
  'alD',
  'alSp',
  'brA',
  'gp',
  'gs',
  'ga',
] as const;

type Shape = Record<string, unknown> & {
  prm?: { w: number; h: number };
  pts?: FreshShapeFrame['pts'];
};

/** the page value it multiplies (as the studio's hook: unset, or 0, counts as 1) */
const gamOf = (v?: number): number => (v ? v : 1);

type Point = NonNullable<FreshShapeFrame['pts']>[number];
const lerpPoint = (p: Point, q: Point, w: number): Point => {
  const mix = (a = 0, b = 0): number => a + (b - a) * w;
  return {
    ...p,
    x: mix(p.x, q.x),
    y: mix(p.y, q.y),
    ix: mix(p.ix, q.ix),
    iy: mix(p.iy, q.iy),
    ox: mix(p.ox, q.ox),
    oy: mix(p.oy, q.oy),
  };
};

class VoiceDashboard {
  public readonly data: FreshVoiceDashboard;
  public readonly motion: VoiceMotion;
  /**
   * the voice tab with its row, for the engine (the component gives it its room), with the background's own typing layer stacked on
   * it as on the remnant: laid out the same way (its group's place round the chat input), and typing still pulses it
   */
  public readonly doc: FreshDoc;
  /** the engine's look while the voice tab is drawn */
  public readonly look: FreshLook;
  private readonly rest: {
    by: Record<string, Shape>;
    K: Record<string, FreshKey[]>;
    stops: FreshStops | undefined;
  };

  private readonly blobAt: Map<string, number>;
  // each blob, this frame (in place: nothing allocated per frame; doubles, as the page's numbers)
  private readonly bx: Float64Array;
  private readonly by: Float64Array;
  private readonly bsy: Float64Array;
  private readonly bsx: Float64Array;
  private readonly bop: Float64Array;
  private thick = 0;
  private rich = 0;
  /**
   * how far down the voice look goes as it comes in (comp px, by m): the component lifts its strip above where flow 9 has it (no
   * suggestion tray under its input); the voice look sits where speechtest and flow 10.5 have it on the chat box, its line just
   * under the box's top edge, the blobs rising from behind it
   */
  private readonly drop: number;

  private readonly tools: FreshTools;

  constructor(mode: 'light' | 'dark', restDoc: FreshDoc, tools: FreshTools, drop = 0) {
    this.tools = tools;
    this.drop = drop;
    this.data = mode === 'dark' ? voiceDashboardDark : voiceDashboardLight;
    this.doc = restDoc.stack ? { ...this.data.doc, stack: restDoc.stack } : this.data.doc;
    const n = this.data.blobs;
    this.motion = new VoiceMotion(n);
    this.blobAt = new Map(Array.from({ length: n }, (_, i) => [`vx${i}`, i]));
    this.bx = new Float64Array(n);
    this.by = new Float64Array(n);
    this.bsy = new Float64Array(n);
    this.bsx = new Float64Array(n);
    this.bop = new Float64Array(n);
    const shapes = (restDoc.shapes as Shape[] | undefined) ?? [];
    this.rest = {
      by: Object.fromEntries(shapes.map((s) => [s.id as string, s])),
      K: (restDoc.K as Record<string, FreshKey[]> | undefined) ?? {},
      stops: restDoc.p.stops as FreshStops | undefined,
    };
    this.look = { shape: this.shape, params: this.params };
  }

  /**
   * One frame: the morph towards the voice look while `want`, the page's voice (`lvl` and `bands`, null: silence) into each blob's
   * spring, and where each blob is (s: now, in seconds)
   */
  public frame(
    dt: number,
    s: number,
    want: boolean,
    lvl: number,
    bands: ArrayLike<number> | null,
  ): void {
    const { motion: M } = this;
    const { values: V, line } = this.data;
    const L = V.look;
    M.morph(dt, want, V);
    M.react(dt, s, lvl, bands, V);
    const span = line.hl * L.spread * L.len;
    const y = line.y + (L.dy + this.drop) * M.m;
    for (let i = 0; i < M.blobs; i++) {
      const u = M.rowU(i);
      const e = Math.max(0, M.env[i]);
      const ph = i * 2.39996;
      const x =
        line.x +
        u * span * (1 + L.push * M.a) +
        L.wander * (0.6 * Math.sin(s * 0.7 + ph) + 0.4 * Math.sin(s * 1.31 + 2 * ph));
      // (the edge fade: by how far out it is)
      const eu = Math.min(1, Math.abs(x - line.x) / Math.max(1, line.hl * L.len));
      this.bop[i] = 1 - L.efade * eu * eu * (3 - 2 * eu);
      this.bx[i] = x;
      this.by[i] = y;
      this.bsy[i] = L.rest * (1 - L.bias * Math.abs(u) ** 1.6) + L.height * e;
      this.bsx[i] = 1 + L.widen * e;
    }
    this.thick = L.line * (1 + L.thick * M.a) - 1;
    this.rich = L.rich * Math.min(1, M.a) * M.m;
  }

  /** speechtest's hook on each shape: the remnant's numbers by 1 - m, the line drawn out and thickened, the row laid along it */
  private shape = (o: FreshShapeFrame, comp: string, t: number): void => {
    // (the voice tab is the root; the typing layer on it is the background's own, as it is)
    if (comp !== 'root') return;
    const { m } = this.motion;
    const { line, values } = this.data;
    const L = values.look;
    const r = this.rest.by[o.id];
    if (r) {
      const w = 1 - m;
      if (w > 1e-4) {
        const K = this.rest.K;
        const o2 = o as Record<string, unknown>;
        for (const k of F) {
          const tr = K[`s:${o.id}:${k}`];
          const b = tr ? this.tools.evalTrack(tr, t) : r[k];
          const a = o2[k];
          if (typeof a === 'number' && typeof b === 'number') o2[k] = a + (b - a) * w;
        }
        if (r.prm && o.prm) {
          o.prm = {
            ...o.prm,
            w: o.prm.w + (r.prm.w - o.prm.w) * w,
            h: o.prm.h + (r.prm.h - o.prm.h) * w,
          };
        }
        const rp = r.pts;
        if (rp && o.pts && rp.length === o.pts.length)
          o.pts = o.pts.map((p, i) => lerpPoint(p, rp[i], w));
      }
      if (o.id === line.id && this.thick) {
        const k = 1 + this.thick * m;
        o.y += line.c * o.sy * (1 - k);
        o.sy *= k;
      }
      if (o.id === line.id) {
        const k = 1 + (L.len - 1) * m;
        const b = 1 + (L.lsoft - 1) * m;
        o.sx *= k;
        o.x = line.x + (o.x - line.x) * k;
        o.bh *= b;
        o.bv *= b;
      }
      // (the edge fade: the line's visible fill, its soft ends brought in)
      if (o.id === line.fill && L.efade) o.sx *= 1 - 0.3 * L.efade * m;
      o.y += (L.dy + this.drop) * m;
      return;
    }
    const i = this.blobAt.get(o.id);
    if (i !== undefined) {
      const a = this.bsy[i] * m;
      o.x = this.bx[i];
      o.y = this.by[i];
      o.sy *= a;
      o.sx *= this.bsx[i];
      o.op *= this.bop[i];
      o.bh *= L.soft;
      o.bv *= L.soft;
      if (a < 0.002) o.op = 0;
      return;
    }
    // (the voice tab's own blobs: the row stands in for them; dark's Colorama mask and its holder draw as made, where the look is)
    if (!o.id.startsWith('cm')) o.op = 0;
    else o.y += this.drop * m;
  };

  /** the Colorama: the remnant's line into the voice look's by m, richer with the voice, its colour strength */
  private params: NonNullable<FreshLook['params']> = (P, comp, t) => {
    if (comp !== 'root') return P;
    const { m } = this.motion;
    if (m < 0.9999 && P.stops) {
      const K = this.rest.K.stops;
      const rs = K?.length ? (this.tools.evalTrack(K, t) as FreshStops) : this.rest.stops;
      if (rs) P.stops = this.tools.lerpStops(rs, P.stops, m);
    }
    if (this.rich > 0) P.cInGam = gamOf(P.cInGam) * (1 - 0.5 * this.rich);
    const gam = 1 / Math.max(0.1, this.data.cstr);
    if (gam !== 1) P.cInGam = gamOf(P.cInGam) * (1 + (gam - 1) * m);
    return P;
  };
}

export { VoiceDashboard };
