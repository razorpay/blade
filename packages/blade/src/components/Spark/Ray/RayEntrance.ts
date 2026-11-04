/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * RayEntrance
 *
 * The landing dash (the dashboard's intro, flow 9's intro9.js with the user's tune, settings/ray-flow9-intro.json): he's found a
 * way along the surface to the left, loads up (a squash, leaning back), dashes in (stretched, leaning into it, still facing left:
 * the user, 2026-10-29, "he'll always face left"), brakes, crouches and hops in place, lands with a squash and settles, at rest.
 * It's drawn on a canvas of its own, wide enough for the run, and his idle takes him on from rest when it's over.
 */
import { RayCore } from './engine';

const RC = RayCore as any;

const BODY_WIDTH = RC.BASE[2][0]; // his full width at rest (world units)
const ROOT_X = RC.LOOK.width / 2;
const HOP_PX = 53; // the hop's height (page px on the dashboard, where he's 48 px wide; it scales with him)
const FADE_MS = 550; // he fades in as he's found, rising 8 px

type Place = { width: number; boxHeight: number; distance: number; dpr: number };

// flow 9's intro script (intro9.js:89-101), its tune: wait .15 s, load .44, dash 1.34, crouch .2, the hop's air, its land and settle
const script = (D: number, k: number): { script: any; end: number } => {
  const h = HOP_PX * k;
  const air = Math.max(120, 2000 * Math.sqrt((2 * h) / 8000) * 0.86);
  const tL = 2130 + air;
  const keys = [
    { t: 0, hold: 150, pose: { x: -D, face: 'left' } },
    {
      t: 590,
      ease: [0.42, 0, 0.58, 1],
      pose: { x: -D - 8 * k, face: 'left', squash: 0.18, lean: 6 },
    }, // loads up
    {
      t: 1930,
      ease: [0.75, 0, 0.3, 1],
      gait: 'walk',
      walk: { cadence: 0, lift: 0, squash: -0.18, lean: 9, vref: Math.max(1, D / 1.34) },
      pose: { x: 0, face: 'left', squash: 0.1, lean: -6 },
    }, // the dash, braking
    { t: 2130, ease: 'standard', pose: { x: 0, face: 'left', squash: 0.23, lean: 0 } }, // the crouch
    { t: tL, jump: { h }, pose: { x: 0, face: 'left', squash: 0 } }, // the hop
    { t: tL + 70, ease: 'out', pose: { x: 0, face: 'left', squash: 0.24 } }, // landing
    { t: tL + 490, ease: 'gentle', pose: { x: 0, face: 'left', squash: 0 } }, // settled
  ];
  return { script: { keys, mood: 'neutral' }, end: tL + 870 };
};

class RayEntrance {
  readonly canvas: HTMLCanvasElement;
  mode: 'light' | 'dark' = 'light';
  private readonly ctx: CanvasRenderingContext2D;
  private readonly sim: any;
  private readonly end: number;
  private readonly view: { scale: number; ox: number; oy: number };
  private t0 = 0;

  constructor({ width: w, boxHeight, distance, dpr }: Place) {
    const k = BODY_WIDTH / RC.FIG / w; // Ray px per CSS px
    const { script: s, end } = script(distance * k, k);
    this.sim = RC.simulate(s, { seed: 3 });
    this.end = end;
    // the run from his start to his place, and the hop above it (intro9.js: from 1.4 widths before him to 2.6 after, the hop + 2.8 above)
    const left = distance + 1.4 * w;
    const above = HOP_PX + 2.8 * w;
    const cw = left + 2.6 * w;
    const ch = above + 0.6 * w;
    this.canvas = document.createElement('canvas');
    this.canvas.width = Math.round(cw * dpr);
    this.canvas.height = Math.round(ch * dpr);
    this.canvas.style.cssText = `position:absolute;pointer-events:none;left:${-left}px;top:${
      boxHeight - above
    }px;width:${cw}px;height:${ch}px;opacity:0;transform:translateY(8px);transition:opacity ${FADE_MS}ms cubic-bezier(.22,.9,.24,1),transform ${FADE_MS}ms cubic-bezier(.22,.9,.24,1);`;
    this.ctx = this.canvas.getContext('2d')!;
    const scale = (w * dpr) / BODY_WIDTH;
    this.view = { scale, ox: left * dpr + ROOT_X * scale, oy: above * dpr };
  }

  /** One frame; true once he's settled at rest (his idle takes him from there). */
  tick(now: number): boolean {
    if (!this.t0) {
      this.t0 = now;
      requestAnimationFrame(() => {
        this.canvas.style.opacity = '1';
        this.canvas.style.transform = 'none';
      });
    }
    const t = now - this.t0;
    const f = RC.frameAt(this.sim, Math.min(t, this.end));
    // drawn at his own origin, the view carried along instead (far from it, his blue would come from a buffer that isn't there: intro9.js)
    const P = f.pose ?? {};
    const view = {
      ...this.view,
      ox: this.view.ox + (P.x ?? 0) * RC.FIG * this.view.scale,
      oy: this.view.oy - (P.y ?? 0) * RC.FIG * this.view.scale,
    };
    RC.draw(this.ctx, { ...f, pose: { ...P, x: 0, y: 0 } }, view, {
      mode: this.mode,
      clear: true,
      shadow: false,
    });
    return t >= this.end;
  }

  dispose(): void {
    this.canvas.remove();
  }
}

export { RayEntrance };
