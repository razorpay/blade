/**
 * Types for the Fresh RazorSense engine (freshEngine.ts, generated from Razorsensation).
 * The engine itself is plain generated code; these are the parts the components touch.
 */

/** A Razorsensation comp: shapes, keys, bands and Colorama, as the studio saves it. Read only by the engine. */
export type FreshDoc = {
  comp: { w: number; h: number };
  tl: { dur: number; range?: [number, number] | null; rangeN?: number; [key: string]: unknown };
  ui?: Record<string, unknown> & {
    /** the loading splash's clock (FreshLoaderSplash) */
    freshSplash?: {
      /** the glyph's loop starts here (s) */
      a: number;
      /** the loop ends and piece 2 (the growth, then the fade) starts here (s) */
      b: number;
      /** the loop's speed */
      r1: number;
      /** piece 2's speed */
      r2: number;
      /** everything has faded to the ground (s) */
      end: number;
    };
  };
  [key: string]: unknown;
};

/** What the engine plays and how it fits the box. */
export type FreshExport = {
  doc: FreshDoc;
  opts: {
    /** 'cover' fills the box (cropping the comp's edges), 'contain' shows all of it, 'fixed' draws it at `scale` from the top-left */
    fit?: 'cover' | 'contain' | 'fixed';
    /** comp px to CSS px for 'fixed' */
    scale?: number;
    /** a clear background (the page shows through) instead of the comp's ground colour */
    alpha?: boolean;
    /** wait at the start: the component drives the time with seek() */
    paused?: boolean;
    /** the shapes' pass at most this many comp pixels (big screens stop paying for detail the blurs remove) */
    srcBudget?: number;
    /** the canvas's sharpness, at most the device's (default 1.6) */
    dpr?: number;
    /** only this part of the comp [x, y, w, h] (comp px from its top-left), cover-fitted to the box: a zoom */
    region?: [number, number, number, number];
    /** 'once': play the timeline once and hold its last frame (default: as the timeline says) */
    loop?: 'once' | 'timeline';
  };
};

/** The GPU speed-ups (see ray/ds/gpu_raster.js); all on unless a component turns one off. */
export type FreshSwitches = {
  gpuRaster?: boolean;
  accTrim?: boolean;
  scissor?: boolean;
  stableSizes?: boolean;
  box?: boolean;
  spec?: boolean;
};

export type FreshEngineHost = {
  /** the canvas the engine draws into */
  canvas: HTMLCanvasElement;
  /** the element whose size the canvas follows */
  box: HTMLElement;
  /** where the engine writes a message if the GPU context can't come back */
  msg: HTMLElement;
  /** called when the engine can't start (no WebGL2) */
  onError?: (reason: 'webgl2') => void;
};

export type FreshPlayer = {
  play(): void;
  pause(): void;
  restart(): void;
  /** draws that moment at once; alive: the breathing clock too */
  seek(seconds: number, alive?: number): void;
  readonly time: number;
  readonly duration: number;
  readonly playing: boolean;
  /** keep looping the loop range for as long as the component needs */
  holdLoop(on: boolean): void;
  /** a stacked comp's opacity and clocks (the components' states) */
  comp(
    id: string,
    o: {
      op?: number | null;
      t?: number | null;
      al?: number | null;
      pt?: number | null;
      pu?: number | null;
    },
  ): void;
  /** a comp group's opacity and blend ('add' = plus-lighter) */
  group(name: string, o: { op?: number | null; blend?: string; dx?: number; dy?: number }): void;
  /** page values nudged live: { key: added } or { 'key*': multiplied } */
  adjust(o: Record<string, number>): void;
  /** every shape scaled round (px, py) (comp px from the comp's middle), its blur with it (x kb); the bands stay as they are */
  shapes(kx: number, ky: number, px: number, py: number, kb?: number): void;
  /** every shape moved by (x, y) comp px, after shapes()' scaling; the bands stay where they are */
  offset(x: number, y: number): void;
  /** the path shift on this clock instead of the breathing one (null: back to it) */
  pathTime(seconds: number | null): void;
  /** the path shift's upward part x k (0-1) */
  pathUp(k: number): void;
  alive: number;
};

export type FreshEngine = {
  player: FreshPlayer;
  /** false when WebGL2 isn't there (onError has been called) */
  ok: boolean;
  /** stops (false) or resumes (true) the engine's frame loop: off-screen, hidden, reduced motion */
  setRunning(on: boolean): void;
  /** stops it for good and frees its GPU memory */
  destroy(): void;
  /** how often the speed-ups were used (for checks) */
  stats: Record<string, unknown>;
};
