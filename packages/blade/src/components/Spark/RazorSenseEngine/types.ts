/**
 * Types for the RazorSense 2.0 engine (freshEngine.ts, built by scripts/razorsenseEngine from the RazorSense system's engine).
 * The engine itself is plain generated code; these are the parts the components touch.
 */

/** A Razorsensation comp: shapes, keys, bands and Colorama, as the studio saves it. Read only by the engine. */
export type FreshDoc = {
  comp: { w: number; h: number };
  /** its look: bands, Colorama and the rest (cBgCol: the ground it's drawn on, #rrggbb) */
  p: { cBgCol?: string; [key: string]: unknown };
  tl: { dur: number; range?: [number, number] | null; rangeN?: number; [key: string]: unknown };
  ui?: Record<string, unknown> & {
    /** the loading splash's clock (RazorSenseLoader) */
    /** Default Paused 2.0's play (RazorSenseBackground): the login mirror's values for what only the page runs */
    freshBackground?: FreshBackgroundPlay;
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

/**
 * Default Paused 2.0's play (RazorSenseBackground, generated: comps.ts ui.freshBackground): the login mirror's values for what only
 * the page runs. Its alive adds, drift and band size are on the comps already.
 */
export type FreshBackgroundPlay = {
  /** the timeline loops a -> b (s) at speed, its last `fade` s crossfading into a (the comps again on the 'fade' page, ids f_<id>) */
  loop: { a: number; b: number; fade: number; speed: number };
  /** the alive clock (breath, drift) x this */
  alive: number;
  /** the Colorama keys (each comp's own `stops`, by comp id) read on a clock of their own: a -> b looped at speed, `fade` s blended over the wrap */
  colour: {
    on: boolean;
    a: number;
    b: number;
    speed: number;
    fade: number;
    stops: Record<string, FreshKey[]>;
  };
  /** Base's and the 'SUb Bands' comps' opacity drifting by up to `depth`, two slow waves (`period` s), each comp its own phase */
  opacity: { depth: number; period: number; ids: string[] };
};

/** Default Paused 2.0's place in its box (RazorSenseBackground, generated: place.ts), as the login page has it */
export type FreshBackgroundPlace = {
  /** its comp (comp px) */
  comp: { w: number; h: number };
  /** the tab the login page cover-fits (comp px), and this comp's middle in it (comp px from the tab's middle) */
  ref: { w: number; h: number };
  centre: [number, number];
  /** the whole piece moved (CSS px), scaled and turned (deg) round the box's middle */
  piece: { x: number; y: number; scale: number; rotate: number };
};

/**
 * Rzp Glass Success Animation 2.0's badge and tick (RazorSenseSuccess, generated: piece.ts), success-blob's overlay.js values: the orb is
 * the comp; these are what the component draws over it. Sizes in comp px unless they say CSS px; times in the timeline's seconds.
 */
export type FreshSuccessPiece = {
  comp: { w: number; h: number };
  /** where the badge goes: the orb's middle as step 2 starts (comp px from the comp's top-left) */
  anchor: { x: number; y: number };
  /** comp px -> CSS px (the badge is its true CSS size at this) */
  cssPerComp: number;
  /** the beats: the tick drawn (tick -> land), step 2 (B), the orb gone, the badge's pop, the tick into the check (hand), the end */
  moments: Record<
    'tick' | 'land' | 'B' | 'gone' | 'badge' | 'badgeEnd' | 'hand' | 'handEnd' | 'end',
    number
  > &
    Record<string, number>;
  /** the orb's rise: Comp 3's sDrop y keys (comp px from the comp's middle) */
  y: FreshKey[];
  /** the orb's white tick (comp px): drawn in over `dur` s from `from` of its size */
  tick: {
    on: boolean;
    size: number;
    stroke: number;
    color: string;
    caps: string;
    dur: number;
    from: number;
    ease: number[];
  };
  /** the badge (CSS px): popping in from `from` over `dur` s */
  badge: { size: number; dur: number; from: number; ease: number[] };
  /** the tick turning into the badge's check (CSS px) */
  hand: { dur: number; size: number; stroke: number; ease: number[] };
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
  /**
   * made ahead of its comp (FreshStage.prepareStep, while the page is idle): it draws nothing and runs no frames till `load` gives
   * it its comp
   */
  isHeld?: boolean;
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
  /**
   * a comp group's opacity and blend ('add' = plus-lighter); ground: put together on the page's ground (opaque), so laid over at
   * opacity w it's a crossfade into it
   */
  group(
    name: string,
    o: { op?: number | null; blend?: string; dx?: number; dy?: number; ground?: boolean },
  ): void;
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
  /**
   * a component's own look on every shape and the page values of the comp being drawn (null: none): its voice look. Runs before
   * shapes() and offset(); carries over a load()
   */
  look(hook: FreshLook | null): void;
  /** every shape's opacity x k (0-1), the bands and the Colorama untouched: it fades away under the Colorama. Carries over a load() */
  fade(k: number): void;
  /** the part of the comp the canvas shows ([x, y, w, h] comp px from its top-left; null: as its fit says), its box just resized */
  region(r: [number, number, number, number] | null): void;
  /** the fade's k now */
  readonly faded: number;
  /** the engine's own key evaluation and Colorama blend, for a look */
  readonly tools: FreshTools;
  alive: number;
};

/** A Colorama line: its stops (place 0-1, colour #rrggbb, alpha) */
export type FreshStops = { p: number; c: string; a?: number }[];

/** A key on a track: its time (s), its value, its ease to the next ('hold', or a cubic-bezier) */
export type FreshKey = { t: number; v: unknown; e?: 'hold' | number[] };

export type FreshTools = {
  /** a track's value at time t */
  evalTrack(keys: FreshKey[], t: number): unknown;
  /** Colorama line a blended into b by w (0-1) */
  lerpStops(a: FreshStops, b: FreshStops, w: number): FreshStops;
};

/** A shape as the engine evaluates it for one frame: its numbers can be changed in place by a look */
export type FreshShapeFrame = {
  id: string;
  x: number;
  y: number;
  sx: number;
  sy: number;
  s: number;
  op: number;
  bh: number;
  bv: number;
  prm?: { w: number; h: number; [key: string]: unknown };
  pts?: { x: number; y: number; ix?: number; iy?: number; ox?: number; oy?: number }[];
  [key: string]: unknown;
};

/** A component's look (FreshPlayer.look): `comp` is the comp being drawn ('root' or a stack id), `t` its time (s) */
export type FreshLook = {
  shape?(o: FreshShapeFrame, comp: string, t: number): void;
  params?(
    p: { stops?: FreshStops; cInGam?: number; [key: string]: unknown },
    comp: string,
    t: number,
  ): { stops?: FreshStops; cInGam?: number; [key: string]: unknown };
};

/** How the voice look takes the page's voice (speechtest's Voice group): each light and dark's own */
export type FreshVoiceTune = {
  /** the input: x sens, under gate counts as nothing; a spring per blob (attack / release s, bounce); the level / bands split; a new share each syllable (live) */
  voice: {
    sens: number;
    gate: number;
    attack: number;
    release: number;
    bounce: number;
    split: number;
    live: number;
    [key: string]: unknown;
  };
  /** the row of blobs and the strip (speechtest's Look group) */
  look: Record<string, number>;
  /** rest <-> voice: its seconds in and out, and its ease (a cubic-bezier) */
  morph: { in: number; out: number; ease: [number, number, number, number] };
};

/**
 * The voice dashboard (RazorSenseChatBackground, generated: voiceComps.ts): the voice tab, its tuned Colorama and its row of blobs
 * in it, drawn in the chat background's place while the page listens, morphed from the background's own comp by m
 */
export type FreshVoiceDashboard = {
  values: FreshVoiceTune;
  /** colour strength: the voice look's levels further along its line */
  cstr: number;
  doc: FreshDoc;
  /** the line the row sits on: its id, the shape it masks, its points' middle, its middle (comp px from the comp's middle), its half length */
  line: { id: string; fill: string | null; c: number; x: number; y: number; hl: number };
  /** blobs in the row (vx0, vx1, ...) */
  blobs: number;
};

/**
 * The voice bottom (RazorSenseChat and RazorSenseBottomWave, generated: voiceComps.ts): the strip page itself with a row of the
 * voice tab's blob on its strip's top edge and the voice look's Colorama on its Comp 3, made on the chat's own comp
 */
export type FreshVoiceBottom = {
  values: FreshVoiceTune;
  cstr: number;
  /** the voice look's Colorama keys */
  colours: FreshKey[];
  /** the voice tab's blob: each blob in the row is a copy */
  tpl: Record<string, unknown> & { prm?: { w: number; h: number } };
};

/**
 * Success or error on the chat's bottom strip (generated: outcomeComps.ts): Comp 3's effect shapes (behind the strip, and over it)
 * and their keys from the piece's 0, spliced onto the strip after its own end; its Colorama keys (`rest`: the strip's own colour)
 */
export type FreshOutcome = {
  dur: number;
  before: Record<string, unknown>[];
  after: Record<string, unknown>[];
  K: Record<string, FreshKey[]>;
  stops: (FreshKey & { rest?: boolean })[];
};

export type FreshEngine = {
  player: FreshPlayer;
  /** false when WebGL2 isn't there (onError has been called) */
  ok: boolean;
  /** stops (false) or resumes (true) the engine's frame loop: off-screen, hidden, reduced motion */
  setRunning(on: boolean): void;
  /**
   * stops it for good and frees its GPU memory. soft: its context isn't lost by hand (that waits for the GPU process, which may
   * be stuck compiling): it goes with its canvas
   */
  destroy(soft?: boolean): void;
  /**
   * plays another comp on the same canvas, its GPU context and compiled programs kept (a new colour scheme or scale): false when
   * it can't (a different clear-background setting), and a new engine is needed
   */
  load?(exp: FreshExport): boolean;
  /** its GPU memory given back (its context let go on purpose, everything else kept): false when it can't */
  sleep?(): boolean;
  /** after sleep: its GPU context made again, and the frame it had drawn again */
  wake?(): void;
  /** its canvas's pixel ratio capped (0: as its comp and the device say): the weak-device tier's lower sharpness */
  sharpness?(cap: number): void;
  /** frames it has drawn: 0 till its first (its programs still compiling, or a GPU that isn't drawing) */
  drawn?(): number;
  /** whether its last frame was dropped only for the GPU (a shader still compiling in the background): its own work is done */
  waitsOnGpu?(): boolean;
  /** how often the speed-ups were used (for checks) */
  stats: Record<string, unknown>;
};
